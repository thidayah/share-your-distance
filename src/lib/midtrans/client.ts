// src/lib/midtrans/client.ts
import midtransClient from 'midtrans-client';

// Types for transaction
export interface MidtransTransaction {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details?: {
    first_name: string;
    last_name?: string;
    email: string;
    phone?: string;
  };
  item_details?: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
  callbacks?: {
    finish?: string;
    error?: string;
    pending?: string;
  };
}

export async function createSnapTransaction(transaction: MidtransTransaction) {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.MIDTRANS_CLIENT_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!serverKey || !clientKey || !appUrl) {
      throw new Error('Midtrans server/client keys and NEXT_PUBLIC_APP_URL must be configured');
    }

    const parsedAppUrl = new URL(appUrl);
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey,
      clientKey,
    });

    const parameter = {
      transaction_details: transaction.transaction_details,
      customer_details: transaction.customer_details,
      item_details: transaction.item_details,
      callbacks: {
        finish: new URL('/payment/success', parsedAppUrl).toString(),
        error: new URL('/payment/failed', parsedAppUrl).toString(),
        pending: new URL('/payment/pending', parsedAppUrl).toString(),
      },
    };

    const response = await snap.createTransaction(parameter);
    return {
      token: response.token,
      redirect_url: response.redirect_url
    };
  } catch (error) {
    console.error('Midtrans transaction error:', error);
    throw error;
  }
}