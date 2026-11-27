'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

export default function CtaSection() {
  const { t } = useLanguage();

  return (
    <section id="daftar" className="bg-[var(--lime)] py-16">
      <div className="wrap flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[var(--ink)] leading-tight tracking-tight">
          {t('Ayo berbagi', 'Let’s share the')}
          <br />
          {t('jarak.', 'distance.')}
        </h2>
        <div>
          <Link
            href="/category"
            className="btn dark !px-8 !py-4 text-base font-extrabold shadow-xl hover:scale-105 transition-all"
          >
            {t('Daftar sekarang ↗', 'Register now ↗')}
          </Link>
        </div>
      </div>
    </section>
  );
}
