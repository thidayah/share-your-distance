import { createHash, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { registrationService } from '@/lib/supabase/service/registrations/services';
import { supabaseServer } from '@/lib/supabase/server-client';
import { registrationService as emailService } from '@/lib/email/registration-service';
import { PaymentStatus } from '@/lib/supabase/service/registrations/types';

interface MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  transaction_id?: string;
  transaction_time?: string;
  settlement_time?: string;
  payment_type?: string;
  currency?: string;
  fraud_status?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function verifySignature(notification: MidtransNotification, serverKey: string): boolean {
  const expected = createHash('sha512')
    .update(
      notification.order_id
      + notification.status_code
      + notification.gross_amount
      + serverKey,
    )
    .digest();

  if (!/^[a-f\d]{128}$/i.test(notification.signature_key)) return false;
  const actual = Buffer.from(notification.signature_key, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function toPaymentStatus(notification: MidtransNotification): PaymentStatus | null {
  switch (notification.transaction_status) {
    case 'settlement':
      return 'paid';
    case 'capture':
      return notification.fraud_status === 'accept' ? 'paid' : 'pending';
    case 'pending':
    case 'authorize':
      return 'pending';
    case 'deny':
      return 'failed';
    case 'cancel':
      return 'cancelled';
    case 'expire':
      return 'expired';
    case 'refund':
    case 'partial_refund':
      return 'refunded';
    default:
      return null;
  }
}

function preserveFinalPayment(current: PaymentStatus, incoming: PaymentStatus): PaymentStatus {
  if (current === 'refunded' || incoming === 'refunded') return 'refunded';
  if (current === 'paid') return 'paid';
  if (current !== 'pending' && incoming === 'pending') return current;
  return incoming;
}

function parseNotification(value: Record<string, unknown>): MidtransNotification | null {
  const { order_id, status_code, gross_amount, signature_key, transaction_status } = value;
  if (
    typeof order_id !== 'string' || !order_id
    || typeof status_code !== 'string' || !status_code
    || typeof gross_amount !== 'string' || !gross_amount
    || typeof signature_key !== 'string' || !signature_key
    || typeof transaction_status !== 'string' || !transaction_status
  ) return null;
  if (
    (value.transaction_id !== undefined && typeof value.transaction_id !== 'string')
    || (value.transaction_time !== undefined && typeof value.transaction_time !== 'string')
    || (value.settlement_time !== undefined && typeof value.settlement_time !== 'string')
    || (value.payment_type !== undefined && typeof value.payment_type !== 'string')
    || (value.currency !== undefined && typeof value.currency !== 'string')
    || (value.fraud_status !== undefined && typeof value.fraud_status !== 'string')
  ) return null;

  return {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    transaction_id: typeof value.transaction_id === 'string' ? value.transaction_id : undefined,
    transaction_time: typeof value.transaction_time === 'string' ? value.transaction_time : undefined,
    settlement_time: typeof value.settlement_time === 'string' ? value.settlement_time : undefined,
    payment_type: typeof value.payment_type === 'string' ? value.payment_type : undefined,
    currency: typeof value.currency === 'string' ? value.currency : undefined,
    fraud_status: typeof value.fraud_status === 'string' ? value.fraud_status : undefined,
  };
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ status: false, message: 'Invalid JSON payload' }, { status: 400 });
  }

  if (!isRecord(payload)) {
    return NextResponse.json({ status: false, message: 'Invalid notification payload' }, { status: 400 });
  }

  const notification = parseNotification(payload);
  if (!notification) {
    return NextResponse.json({ status: false, message: 'Missing or invalid notification fields' }, { status: 400 });
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    console.error('MIDTRANS_SERVER_KEY is not configured');
    return NextResponse.json({ status: false, message: 'Payment notification is not configured' }, { status: 500 });
  }

  if (!verifySignature(notification, serverKey)) {
    console.error('Rejected Midtrans notification with invalid signature');
    return NextResponse.json({ status: false, message: 'Invalid signature' }, { status: 401 });
  }

  const incomingStatus = toPaymentStatus(notification);
  if (!incomingStatus) {
    return NextResponse.json({ status: false, message: 'Unsupported Midtrans transaction status' }, { status: 400 });
  }

  const amount = Number(notification.gross_amount);
  if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount < 0) {
    return NextResponse.json({ status: false, message: 'Invalid transaction amount' }, { status: 400 });
  }

  if (notification.currency && notification.currency !== 'IDR') {
    return NextResponse.json({ status: false, message: 'Unsupported transaction currency' }, { status: 400 });
  }

  try {
    const registration = await registrationService.getByExternalOrderId(notification.order_id);
    if (!registration) {
      return NextResponse.json({ status: false, message: 'Registration not found' }, { status: 404 });
    }

    if (registration.total_amount !== amount) {
      console.error('Midtrans amount does not match registration amount', {
        orderId: notification.order_id,
        expectedAmount: registration.total_amount,
        receivedAmount: amount,
      });
      return NextResponse.json({ status: false, message: 'Transaction amount mismatch' }, { status: 400 });
    }

    const effectiveStatus = preserveFinalPayment(registration.payment_status, incomingStatus);
    const paymentDateValue = notification.settlement_time || notification.transaction_time;
    const paymentDate = paymentDateValue ? new Date(paymentDateValue) : null;
    if (paymentDate && Number.isNaN(paymentDate.getTime())) {
      return NextResponse.json({ status: false, message: 'Invalid transaction time' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      payment_status: effectiveStatus,
      payment_method: notification.payment_type || registration.payment_method,
      external_transaction_id: notification.transaction_id || registration.external_transaction_id,
      updated_at: new Date().toISOString(),
    };
    if (effectiveStatus === 'paid') {
      if (registration.payment_status === 'paid') {
        updateData.payment_date = registration.payment_date;
      } else if (incomingStatus === 'paid' && paymentDate) {
        updateData.payment_date = paymentDate.toISOString();
      }
    }

    const { data: updatedRegistration, error: updateError } = await supabaseServer
      .from('syd_registrations')
      .update(updateData)
      .eq('id', registration.id)
      .eq('payment_status', registration.payment_status)
      .select('*')
      .maybeSingle();

    if (updateError) throw updateError;

    const { error: transactionError } = await supabaseServer
      .from('syd_transactions')
      .upsert({
        registration_id: registration.id,
        external_order_id: notification.order_id,
        external_transaction_id: notification.transaction_id || null,
        status: notification.transaction_status,
        status_code: notification.status_code,
        payment_type: notification.payment_type || null,
        fraud_status: notification.fraud_status || null,
        amount,
        currency: notification.currency || 'IDR',
        signature_verified: true,
        gateway_response: payload,
        time: paymentDate?.toISOString() || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'external_order_id' });

    if (transactionError) throw transactionError;

    const finalRegistration = updatedRegistration || await registrationService.getByExternalOrderId(notification.order_id);
    if (!finalRegistration) throw new Error('Registration disappeared while processing notification');

    if (
      registration.payment_status !== effectiveStatus
      || (registration.payment_status === 'paid' && incomingStatus === 'refunded')
    ) {
      await registrationService.syncCategoryPaidCount(registration.category_id);
    }

    const newlyPaid = Boolean(updatedRegistration)
      && registration.payment_status !== 'paid'
      && effectiveStatus === 'paid';

    if (newlyPaid) {
      const emailResult = await emailService.sendPaymentSuccessV2({
        email: finalRegistration.email,
        name: finalRegistration.full_name,
        category: finalRegistration.category?.name || 'Unknown Category',
        registration_number: finalRegistration.registration_number,
        amount: finalRegistration.total_amount,
        payment_date: finalRegistration.payment_date || new Date().toISOString(),
        payment_method: finalRegistration.payment_method || 'Midtrans',
      });

      if (!emailResult.status) {
        console.error('Payment success email failed:', emailResult.error);
      }
    }

    return NextResponse.json({ status: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Midtrans webhook processing failed:', error);
    return NextResponse.json(
      { status: false, message: 'Failed to process payment notification' },
      { status: 500 },
    );
  }
}
