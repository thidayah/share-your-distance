// src/app/api/webhooks/midtrans/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from "@/lib/supabase/client";
import { supabaseServer } from "@/lib/supabase/server-client";
import { registrationService } from "@/lib/email/registration-service";

// Verify Midtrans signature (optional but recommended)
// function verifySignature(signature: string, orderId: string, statusCode: string, grossAmount: string, serverKey: string): boolean {
//   const hash = crypto.createHash('sha512')
//     .update(orderId + statusCode + grossAmount + serverKey)
//     .digest('hex');
//   // return hash === signature;
//   return true;
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const {
//       order_id,           // registration_number (REG-SYD25-0001-timestamp)
//       transaction_status, // 'capture', 'settlement', 'pending', 'deny', 'cancel', 'expire'
//       fraud_status,       // 'accept', 'challenge', 'deny'
//       status_code,        // '200' untuk sukses
//       gross_amount,       // total pembayaran
//       payment_type,       // 'bank_transfer', 'credit_card', 'gopay', dll
//       transaction_time,   // timestamp
//     } = body;

//     // Verify signature (optional - comment out if causing issues during testing)
//     const signature = request.headers.get('x-signature');
//     // if (signature && !verifySignature(signature, order_id, status_code, gross_amount, process.env.MIDTRANS_SERVER_KEY!)) {
//     //   console.error('Invalid webhook signature');
//     //   return NextResponse.json({ status: false, message: 'Invalid signature' }, { status: 401 });
//     // }

//     // Extract registration ID from order_id (format: REG-{registrationNumber}-{timestamp})
//     const registrationNumber = order_id.split('-')[1] + '-' + order_id.split('-')[2];

//     if (!registrationNumber) {
//       console.error('Invalid order_id format:', order_id);
//       return NextResponse.json({ status: false, message: 'Invalid order_id', data: order_id }, { status: 400 });
//     }

//     let payment_status = 'pending';
//     let payment_date = null;

//     if (transaction_status === 'capture' || transaction_status === 'settlement') {
//       if (fraud_status === 'accept') {
//         payment_status = 'paid';
//         payment_date = new Date(transaction_time).toISOString();
//       }
//     }
//     else if (transaction_status === 'pending') {
//       payment_status = 'pending';
//     }
//     else if (['deny', 'cancel', 'expire'].includes(transaction_status)) {
//       payment_status = 'failed';
//     }

//     const { data: dataRegistration } = await supabase
//       .from('registrations')
//       .select(`*, category:categories (*)`)
//       .eq('registration_number', registrationNumber)
//       .single();

//     if (!dataRegistration) {
//       return NextResponse.json({ status: false, message: 'Registration not found' }, { status: 404 });
//     }

//     let categoryBib = 'BIB';
//     let sequenceBib = 1;
//     if (dataRegistration) {
//       categoryBib = dataRegistration.category.name.split(' ')[0].toUpperCase();
//       sequenceBib = parseInt(dataRegistration.category.current_participants) + 1;
//     }
//     let bibNumber = `${categoryBib}-${sequenceBib.toString().padStart(4, '0')}`;

//     // Update registration status
//     const { data: updateStatusData, error: updateStatusError } = await supabaseServer
//       .from('registrations')
//       .update({
//         external_payment_id: order_id,
//         payment_status: payment_status,
//         payment_method: payment_status === 'paid' ? payment_type : null,
//         payment_date: payment_status === 'paid' ? payment_date : null,
//         // Generate bib number
//         bib_number: payment_status === 'paid' ? bibNumber : null,
//         bib_assigned_at: payment_status === 'paid' ? new Date().toISOString() : null,
//         // midtrans_response: body, // simpan full response untuk debugging
//       })
//       .eq('registration_number', registrationNumber)
//       .select('*')
//       .single();

//     if (updateStatusError) {
//       // console.error('Database update error:', updateStatusError);
//       return NextResponse.json({ status: false, message: 'Failed to update registration status', error: updateStatusError }, { status: 500 });
//     }

//     // Update current participants
//     if (payment_status === 'paid') {
//       const { error: updateParticipantError } = await supabaseServer
//         .from('categories')
//         .update({ current_participants: sequenceBib })
//         .eq('id', dataRegistration.category_id);

//       if (updateParticipantError) {
//         return NextResponse.json({ status: false, message: 'Failed to update participants', error: updateParticipantError }, { status: 500 });
//       }

//       // // Send email payment successfully
//       // const emailForm = {
//       //   email: dataRegistration.email,
//       //   name: dataRegistration.full_name,
//       //   category: dataRegistration.category?.name || 'Unknown Category',
//       //   registration_number: registrationNumber,
//       //   bib_number: bibNumber,
//       //   amount: parseFloat(gross_amount),
//       //   payment_date: payment_date!,
//       //   payment_method: payment_type,
//       // };

//       // const sendEmail = await registrationService.sendPaymentSuccess(emailForm);

//       // if (!sendEmail.status) {
//       //   console.error('Failed to send payment success email:', sendEmail.error);
//       //   // Jangan return error, log saja karena pembayaran sudah sukses
//       // }
//     }

//     return NextResponse.json({ status: true, message: 'Webhook processed', body, data: updateStatusData }, { status: 200 });
//   } catch (error) {
//     console.error('Webhook processing error:', error);
//     return NextResponse.json({ status: false, message: 'Webhook processing failed', error }, { status: 500 });
//   }
// }

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("MIDTRANS NOTIF:", body);

    return NextResponse.json({ status: true, message: 'Ok', data: body });
  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ status: true, message: 'Ok' });
}
