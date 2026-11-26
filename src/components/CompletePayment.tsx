'use client';

import { useEffect } from 'react';

interface OrderData {
  registration_number: string;
  full_name: string;
  total_amount: number;
  redirect_url: string;
}

interface CompletePaymentProps {
  data: OrderData;
}

export default function CompletePayment({ data }: CompletePaymentProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.replace(data.redirect_url);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [data.redirect_url]);

  const amount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(data.total_amount);

  return (
    <div className="mx-auto max-w-xl py-10 text-center">
      <p className="eyebrow mb-3 text-[var(--blue)]">Midtrans Secure Checkout</p>
      <h2 className="text-2xl font-black text-[var(--ink)]">Pendaftaran tersimpan</h2>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Mengarahkan {data.full_name} ke halaman pembayaran aman untuk menyelesaikan pendaftaran.
      </p>
      <dl className="my-6 rounded-2xl border border-[var(--line)] p-4 text-left">
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-sm text-[var(--muted)]">Nomor pendaftaran</dt>
          <dd className="text-sm font-bold text-[var(--ink)]">{data.registration_number}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-sm text-[var(--muted)]">Total pembayaran</dt>
          <dd className="text-sm font-bold text-[var(--ink)]">{amount}</dd>
        </div>
      </dl>
      <a
        href={data.redirect_url}
        className="btn lime inline-flex font-extrabold"
      >
        Lanjutkan pembayaran
      </a>
    </div>
  );
}
