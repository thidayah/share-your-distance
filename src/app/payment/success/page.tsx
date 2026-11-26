// src/app/payment/success/page.tsx
'use client';

import { Suspense, use, useEffect, useState } from 'react';
import Template from "@/components/layout/Template";
import Loading from "@/components/ui/Loading";
import { PaymentNote, PaymentResult, PaymentSteps } from '@/components/payment/PaymentResult';
import { WHATSAPP_URL } from '@/data/siteLinks';
import { useLanguage } from '@/lib/i18n';
import { useRouter } from "next/navigation";

interface ParamsTypes {
  order_id: string;
  status_code: string;
  transaction_status: string;
  action?: string;
}

export default function PaymentSuccessPage({ searchParams }: { searchParams: Promise<ParamsTypes> }) {
  const { t } = useLanguage();
  const params = use(searchParams);
  const router = useRouter();

  const isPending = params?.status_code !== '200' && params?.transaction_status === 'pending';
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => setCountdown((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = '/';
    }
  }, [countdown]);

  useEffect(() => {
    if (!isPending) return;
    const timer = setTimeout(() => router.push('/payment/pending'), 1000);
    return () => clearTimeout(timer);
  }, [isPending, router]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Template>
        {isPending && <Loading />}

        {!isPending && (
          <PaymentResult
            tone="success"
            eyebrow={t('Pembayaran berhasil', 'Payment received')}
            title={t('Terima kasih!', 'You are in!')}
            description={t(
              'Pembayaranmu sudah kami terima. Kamu resmi terdaftar di Share Your Distance Vol 4.0.',
              'We have received your payment. You are officially registered for Share Your Distance Vol 4.0.'
            )}
            actions={[
              {
                label: `${t('Kembali ke beranda', 'Back to home')} (${countdown})`,
                href: '/',
              },
              {
                label: t('Butuh bantuan?', 'Need help?'),
                href: WHATSAPP_URL,
                variant: 'ghost',
              },
            ]}
            footnote={
              <>
                {t('Belum menerima email konfirmasi? Cek folder spam atau hubungi kami lewat ', 'No confirmation email yet? Check your spam folder or reach us on ')}
                <a href={WHATSAPP_URL}>WhatsApp</a>.
              </>
            }
          >
            <PaymentSteps
              title={t('Selanjutnya', 'What happens next')}
              items={[
                t('Email konfirmasi berisi detail pendaftaran dikirim sebentar lagi.', 'A confirmation email with your registration details is on its way.'),
                t('Informasi pra-acara dikirim 3 hari sebelum hari lomba.', 'Pre-event information is emailed 3 days before race day.'),
                t('Informasi akhir acara dikirim 1 hari sebelum hari lomba.', 'Final event information arrives 1 day before race day.'),
              ]}
            />
            <PaymentNote
              title={t('Simpan bukti pembayaran', 'Keep your receipt')}
              items={[
                t('Simpan email dan bukti transaksi sampai hari acara.', 'Keep the email and your transaction receipt until race day.'),
                t('Tunjukkan bukti pembayaran saat pengambilan race pack.', 'Show the payment proof when collecting your race pack.'),
              ]}
              tint
            />
          </PaymentResult>
        )}
      </Template>
    </Suspense>
  );
}
