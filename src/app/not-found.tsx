'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';

const COUNTDOWN_FROM = 10;

export default function NotFound() {
  const { t } = useLanguage();
  const router = useRouter();
  const [seconds, setSeconds] = useState(COUNTDOWN_FROM);

  useEffect(() => {
    if (seconds <= 0) {
      router.replace('/');
      return;
    }
    const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, router]);

  return (
    <section className="notfound-page">
      <div className="track dots notfound-deco" aria-hidden="true" />
      <div className="wrap">
        <div className="notfound-content">
          <p className="notfound-code" aria-hidden="true">
            404
          </p>
          <h1>
            {t('Sepertinya kamu salah', 'Looks like you took')}
            <br />
            {t('ambil lintasan.', 'a wrong turn.')}
          </h1>
          <p className="notfound-lede">
            {t(
              'Halaman ini sudah melewati garis finis, atau memang tidak pernah jadi. Yuk balik ke lintasan utama.',
              'This page already crossed the finish line — or never existed. Let’s head back to the main track.'
            )}
          </p>

          <Link href="/" className="btn lime notfound-btn">
            {t('Balik ke beranda', 'Back to home')} ({String(seconds).padStart(2, '0')})
          </Link>
        </div>
      </div>
    </section>
  );
}
