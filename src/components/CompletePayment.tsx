'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n';

const REDIRECT_DELAY_SECONDS = 30;

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
  const { t } = useLanguage();
  const [secondsRemaining, setSecondsRemaining] = useState(REDIRECT_DELAY_SECONDS);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.replace(data.redirect_url);
    }, REDIRECT_DELAY_SECONDS * 1000);
    const deadline = Date.now() + REDIRECT_DELAY_SECONDS * 1000;
    const countdown = window.setInterval(() => {
      setSecondsRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    }, 1000);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(countdown);
    };
  }, [data.redirect_url]);

  const amount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(data.total_amount);

  return (
    <div className="mx-auto max-w-xl py-10 text-center">
      <p className="eyebrow mb-3 text-[var(--blue)]">{t('Pembayaran Aman Midtrans', 'Midtrans Secure Checkout')}</p>
      <h2 className="text-2xl font-black text-[var(--ink)]">{t('Pendaftaran Tersimpan', 'Registration Saved')}</h2>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {t('Pendaftaran', 'Registration for')}{' '}
        <span className="font-extrabold">{data.full_name}</span>{' '}
        {t(
          'berhasil disimpan. Anda akan diarahkan ke halaman pembayaran aman.',
          'has been saved. You will be redirected to the secure payment page.',
        )}
      </p>
      <dl className="my-6 rounded-2xl border border-[var(--line)] p-4 text-left">
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-sm text-[var(--muted)]">{t('Nomor Pendaftaran', 'Registration Number')}</dt>
          <dd className="text-sm font-bold text-[var(--ink)]">{data.registration_number}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-sm text-[var(--muted)]">{t('Total Pembayaran', 'Total Payment')}</dt>
          <dd className="text-sm font-bold text-[var(--ink)]">{amount}</dd>
        </div>
      </dl>
      <a
        href={data.redirect_url}
        className="btn lime inline-flex font-extrabold"
      >
        {t('Lanjutkan Pembayaran', 'Continue to Payment')} ({secondsRemaining}{' '}
        {t('detik', 'seconds')})
      </a>
    </div>
  );
}
