// src/app/payment/pending/page.tsx
'use client';

import Template from "@/components/layout/Template";
import { PaymentNote, PaymentResult, PaymentSteps } from '@/components/payment/PaymentResult';
import { WHATSAPP_URL } from '@/data/siteLinks';
import { useLanguage } from '@/lib/i18n';

export default function PaymentPendingPage() {
  const { t } = useLanguage();

  return (
    <Template>
      <PaymentResult
        tone="pending"
        eyebrow={t('Menunggu pembayaran', 'Awaiting payment')}
        title={t('Selesaikan pembayaranmu', 'Complete your payment')}
        description={t(
          'Pembayaranmu sedang menunggu penyelesaian. Ikuti instruksi Midtrans sebelum masa pembayaran berakhir.',
          'Your payment is awaiting completion. Follow the Midtrans instructions before the payment expires.'
        )}
        actions={[
          { label: t('Kembali ke beranda', 'Back to home'), href: '/' },
          { label: t('Butuh bantuan?', 'Need help?'), href: WHATSAPP_URL, variant: 'ghost' },
        ]}
        footnote={t(
          'Kembali ke halaman Midtrans atau cek email untuk melanjutkan pembayaran.',
          'Return to the Midtrans page or check your email to continue payment.'
        )}
      >
        <PaymentSteps
          title={t('Langkah berikutnya', 'Next steps')}
          items={[
            t('Selesaikan pembayaran menggunakan metode yang dipilih di Midtrans.', 'Complete payment using the method selected in Midtrans.'),
            t('Status pembayaran diperbarui otomatis setelah Midtrans mengonfirmasi transaksi.', 'Payment status updates automatically after Midtrans confirms the transaction.'),
            t('Email konfirmasi dikirim setelah pembayaran terkonfirmasi.', 'A confirmation email is sent once the payment is confirmed.'),
          ]}
        />
        <PaymentNote
          title={t('Penting', 'Important')}
          items={[
            t('Selesaikan pembayaran dalam 24 jam untuk mengamankan pendaftaran.', 'Complete payment within 24 hours to secure your registration.'),
            t('Gunakan jumlah yang persis seperti yang tertera saat pembayaran.', 'Use the exact amount shown during payment.'),
            t('Simpan bukti transaksi untuk referensi.', 'Keep your transaction receipt for reference.'),
            t('Hubungi bank jika terjadi kendala transfer.', 'Contact your bank if you run into transfer issues.'),
          ]}
          tint
        />
      </PaymentResult>
    </Template>
  );
}
