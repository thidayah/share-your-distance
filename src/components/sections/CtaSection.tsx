'use client';

import Link from 'next/link';

export default function CtaSection() {
  return (
    <section id="daftar" className="bg-[var(--lime)] py-16">
      <div className="wrap flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[var(--ink)] leading-tight tracking-tight">
          Ayo berbagi
          <br />
          jarak.
        </h2>
        <div>
          <Link
            href="/category"
            className="btn dark !px-8 !py-4 text-base font-extrabold shadow-xl hover:scale-105 transition-all"
          >
            Daftar sekarang ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
