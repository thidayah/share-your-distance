// src/app/payment/failed/page.tsx
'use client';

import Template from "@/components/layout/Template";
import { PaymentNote, PaymentResult, PaymentSteps } from '@/components/payment/PaymentResult';
import { WHATSAPP_URL } from '@/data/siteLinks';
import { useLanguage } from '@/lib/i18n';

export default function PaymentFailedPage() {
  const { t } = useLanguage();

  return (
    <Template>
      <PaymentResult
        tone="failed"
        eyebrow={t('Pembayaran gagal', 'Payment failed')}
        title={t('Pembayaran belum berhasil', 'Payment did not go through')}
        description={t(
          'Pembayaran belum berhasil dikonfirmasi. Kamu dapat mencoba lagi dengan mendaftar ulang atau menghubungi kami.',
          'The payment was not confirmed. You can try again by registering again or contact our team.'
        )}
        actions={[
          { label: t('Daftar ulang ↗', 'Register again ↗'), href: '/category' },
          { label: t('Hubungi kami', 'Contact support'), href: WHATSAPP_URL, variant: 'ghost' },
        ]}
        footnote={t(
          'Belum ada dana yang terpotong. Saldo akan kembali otomatis jika transaksi ditolak.',
          'No funds were charged. Any hold is released automatically when a transaction is declined.'
        )}
      >
        <PaymentSteps
          title={t('Penyebab umum', 'Common reasons')}
          items={[
            t('Saldo tidak cukup atau kartu ditolak.', 'Insufficient funds or card declined.'),
            t('Waktu pembayaran habis atau sesi kedaluwarsa.', 'Payment timeout or session expired.'),
            t('Gangguan teknis pada penyedia pembayaran.', 'Technical issues with the payment gateway.'),
          ]}
        />
        <PaymentNote
          title={t('Coba langkah ini', 'Try these steps')}
          items={[
            t('Pakai metode pembayaran lain (transfer bank, e-wallet).', 'Use a different payment method (bank transfer, e-wallet).'),
            t('Pastikan saldo atau limit kartu mencukupi.', 'Make sure your balance or card limit is sufficient.'),
            t('Pastikan kartu mendukung transaksi online.', 'Check that your card supports online transactions.'),
            t('Tunggu beberapa menit lalu coba lagi.', 'Wait a few minutes and try again.'),
          ]}
          tint
        />
      </PaymentResult>
    </Template>
  );
}
