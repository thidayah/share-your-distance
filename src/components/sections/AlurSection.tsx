'use client';

import { useState } from 'react';

const handoffData = [
  {
    step: 'Langkah 01 / Pendaftaran',
    title: 'Daftar & bayar',
    copy: 'Selesaikan pembayaran pendaftaran untuk mengamankan tempatmu.',
    icon: (
      <svg viewBox="0 0 32 32">
        <circle cx="12" cy="10" r="4" />
        <path d="M4 27c.5-5 3.5-8 8-8 2.4 0 4.4.8 5.7 2.3M23 13v9m-4.5-4.5h9" />
      </svg>
    ),
  },
  {
    step: 'Langkah 02 / Informasi',
    title: 'Masuk grup WhatsApp',
    copy: 'Info acara dan peserta ada di sana.',
    icon: (
      <svg viewBox="0 0 32 32">
        <path d="M5 7h22v16H16l-7 5v-5H5z" />
        <path d="M10 13h12M10 17h8" />
      </svg>
    ),
  },
  {
    step: 'Langkah 03 / Tim',
    title: 'Kenali timmu',
    copy: 'Tim berempat diumumkan sehari sebelum lomba.',
    icon: (
      <svg viewBox="0 0 32 32">
        <circle cx="12" cy="11" r="4" />
        <circle cx="23" cy="12" r="3" />
        <path d="M4 26c0-5 3-8 8-8s8 3 8 8M20 19c4-.5 7 2 8 6" />
      </svg>
    ),
  },
  {
    step: 'Langkah 04 / Garis start',
    title: 'Lari bareng',
    copy: 'Bagi giliran, oper tongkat, dan tuntaskan jarak bersama.',
    icon: (
      <svg viewBox="0 0 32 32">
        <path d="M8 27V5M9 6h15l-4 5 4 5H9" />
        <path d="M14 22h13" />
      </svg>
    ),
  },
];

const raceBenefits = [
  {
    name: 'BIB Number',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M10 4h12l3 5 2 19H6L8 9z" />
        <circle cx="11" cy="8" r="1" />
        <circle cx="21" cy="8" r="1" />
        <path d="M12 15h4v7h-4zM19 16l2-1v7" />
      </svg>
    ),
  },
  {
    name: 'Refreshment',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M8 11h16l-2 16H10zM7 7h18v4H7zM16 7l4-4" />
        <path d="M16 15c-2 2-3 3-3 4.5a3 3 0 0 0 6 0c0-1.5-1-2.5-3-4.5Z" />
      </svg>
    ),
  },
  {
    name: 'Medical',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 12h22v15H5zM11 12V8h10v4" />
        <path d="M16 16v7m-3.5-3.5h7" />
      </svg>
    ),
  },
  {
    name: 'Doorprize',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M4 14h24v14H4zM3 9h26v5H3zM16 9v19M16 9c-7 0-8-7-4-7 3 0 4 4 4 7Zm0 0c7 0 8-7 4-7-3 0-4 4-4 7Z" />
      </svg>
    ),
  },
  {
    name: 'Digital Certificate',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M7 4h18v18H7zM11 9h10M11 13h10M12 22l-2 7 6-3 6 3-2-7" />
      </svg>
    ),
  },
];

const rules = [
  'Pergantian tongkat hanya di exchange zone.',
  'Setiap pelari menempuh satu giliran sejauh 600 meter.',
  'Dilarang memotong lintasan.',
  'Waktu dihitung sampai pelari keempat melewati garis finis.',
  'Keputusan juri bersifat final.',
];

export default function AlurSection() {
  const [activeHandoff, setActiveHandoff] = useState(0);
  const [activeBenefit, setActiveBenefit] = useState<number | null>(null);
  const [activeRule, setActiveRule] = useState(0);

  return (
    <section id="alur" className="relative" aria-label="Alur acara">
      {/* PANEL 1: Handoff Pendaftaran */}
      <div id="signup-panel" className="section bg-[var(--paper)]">
        <div className="wrap handoff-layout">
          <div className="handoff-intro">
            <p className="eyebrow mb-3 text-[var(--blue)]">Dari daftar sampai start</p>
            <h2 className="text-4xl font-black md:text-5xl text-[var(--ink)]">
              Timnya? Biar kami yang urus.
            </h2>
            <p className="mt-4 text-[var(--muted)] leading-relaxed">
              Kamu bisa mendaftar secara individu. Panitia akan mengelompokkan peserta ke dalam tim berempat yang seimbang dan suportif.
            </p>
          </div>

          <div className="handoff-widget">
            <div className="handoff-stage">
              <article className="handoff-card">
                <div>
                  <span className="handoff-card-index">{handoffData[activeHandoff].step}</span>
                  <div className="handoff-icon mt-4 mb-2" aria-hidden="true">
                    {handoffData[activeHandoff].icon}
                  </div>
                  <h3 className="handoff-card-title">{handoffData[activeHandoff].title}</h3>
                  <p className="handoff-card-copy">{handoffData[activeHandoff].copy}</p>
                </div>
              </article>
            </div>

            <div className="handoff-nav" role="group" aria-label="Tahap pendaftaran">
              {['Daftar', 'Grup', 'Tim', 'Lari'].map((label, index) => (
                <button
                  key={index}
                  type="button"
                  className="handoff-select"
                  aria-pressed={activeHandoff === index}
                  onClick={() => setActiveHandoff(index)}
                >
                  <b>{String(index + 1).padStart(2, '0')}</b>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PANEL 2: Runner Video Banner */}
      <div id="runner-panel" className="relative py-20 text-white overflow-hidden">
        <div className="runner-video-frame">
          <video
            className="runner-video"
            autoPlay
            muted
            playsInline
            loop
            aria-label="Video pelari berlari bersama"
          >
            <source src="/assets/Moving together.mp4" type="video/mp4" />
          </video>
          <div className="runner-shade"></div>
        </div>

        <div className="wrap relative z-10 py-16">
          <div className="runner-copy">
            <p className="eyebrow mb-4 text-[var(--lime)]">Lari santai juga boleh</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              600 meter. Satu giliran. Teman satu tim yang baru.
            </h2>
            <p className="mt-6 text-white/80 text-base sm:text-lg max-w-xl leading-relaxed">
              Tak perlu khawatir tentang kecepatan. Fokus pada langkahmu, selesaikan putaranmu, dan serahkan tongkat estafet pada rekan setimmu.
            </p>
          </div>
        </div>
      </div>

      {/* PANEL 3: Racepass Info */}
      <div id="info" className="section bg-[var(--paper)]">
        <div className="wrap racepass-layout">
          <div className="racepass-intro">
            <p className="eyebrow mb-3 text-[var(--blue)]">Catat detailnya</p>
            <h2 className="text-4xl font-black md:text-5xl text-[var(--ink)]">
              Siap untuk hari lomba.
            </h2>
            <p className="mt-4 text-[var(--muted)] leading-relaxed">
              Semua perlengkapan dasar dan fasilitas race day sudah disiapkan oleh panitia agar kamu bisa berlari dengan tenang dan nyaman.
            </p>
          </div>

          <div className="racepass-ticket">
            <div className="racepass-head">
              <div>
                <span className="racepass-brand">Share Your Distance</span>
                <strong className="racepass-volume">VOL 4.0</strong>
              </div>
              <span className="racepass-tag">KARTU LOMBA</span>
            </div>

            <div className="racepass-facts">
              <div className="racepass-fact">
                <b>Pendaftaran</b>
                <span>Dibuka hingga kuota habis</span>
              </div>
              <div className="racepass-fact">
                <b>Usia</b>
                <span>Minimal 17 tahun</span>
              </div>
            </div>

            <div className="racepass-benefits-head">
              <b className="eyebrow">Termasuk dalam pendaftaran</b>
            </div>

            <ul className="racepass-benefits">
              {raceBenefits.map((item, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className="racepass-benefit w-full"
                    aria-pressed={activeBenefit === index}
                    onClick={() => setActiveBenefit(activeBenefit === index ? null : index)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* PANEL 4: Aturan Inti */}
      <div id="aturan" className="bg-[var(--ink)] py-20 text-white">
        <div className="wrap rules-layout">
          <div className="rules-feature">
            <p className="eyebrow mb-3 text-[var(--sky)]">Main adil, jaga aman</p>
            <h2 className="text-4xl font-black mb-2">Aturan inti.</h2>
            <span id="rules-current-number" className="rules-current-number block" aria-hidden="true">
              {String(activeRule + 1).padStart(2, '0')}
            </span>
            <p id="rules-current-copy" className="rules-current-copy" aria-live="polite">
              {rules[activeRule]}
            </p>
          </div>

          <ol className="rules-list">
            {rules.map((ruleText, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="rules-choice"
                  aria-pressed={activeRule === index}
                  onClick={() => setActiveRule(index)}
                >
                  <b className="rules-choice-number">{String(index + 1).padStart(2, '0')}</b>
                  <span className="rules-choice-text">{ruleText}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
