'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    // Target: 19 Desember 2026 06:00 WIB (UTC+7) -> 18 Desember 23:00 UTC
    const targetDate = Date.UTC(2026, 11, 18, 23, 0, 0);

    const updateCountdown = () => {
      const now = Date.now();
      const difference = Math.max(0, targetDate - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScrollToDaftar = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('daftar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="top" className="relative overflow-hidden bg-[var(--ink)] text-white">
      <div className="track dots pointer-events-none absolute inset-0 opacity-40"></div>

      <div className="wrap hero-grid relative grid min-h-[740px] grid-cols-1 items-center gap-12 pb-16 pt-32 lg:grid-cols-[1.04fr_.96fr]">
        {/* Left Column: Heading & Countdown */}
        <div className="relative z-10 max-w-[640px]">
          <h1 className="hero-title mb-5 text-[4rem] sm:text-[5rem] lg:text-[5.6rem] font-black leading-[.88] tracking-[-.075em]">
            SHARE
            <br />
            <span className="text-[var(--lime)]">YOUR</span>
            <br />
            DISTANCE
            <span className="text-[var(--sky)]">.</span>
          </h1>

          <div className="mb-8 flex flex-wrap items-center gap-4 text-sm font-semibold text-white/85">
            <span className="flex items-center gap-2">
              <span className="text-[var(--lime)] text-xs">●</span> Sabtu, 19 Desember 2026
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[var(--sky)] text-xs">●</span> Departmen Sports Lab, Bandung
            </span>
          </div>

          <div>
            <a
              href="#daftar"
              onClick={handleScrollToDaftar}
              className="btn lime !px-7 !py-4 text-base font-extrabold shadow-lg shadow-black/20"
            >
              Daftar sekarang ↗
            </a>
          </div>

          <div className="mt-10 max-w-[470px] border-t border-white/25 pt-5">
            <p className="eyebrow mb-4 text-white/60">Hitung mundur ke garis start</p>
            <div className="grid grid-cols-4 gap-2">
              <div className="countcell text-center">
                <strong key={`days-${timeLeft.days}`} className="countval block text-4xl sm:text-6xl font-black tabular-nums tick-up">
                  {timeLeft.days}
                </strong>
                <span className="text-[10px] uppercase tracking-widest text-white/65">Hari</span>
              </div>
              <div className="countcell text-center">
                <strong key={`hours-${timeLeft.hours}`} className="countval block text-4xl sm:text-6xl font-black tabular-nums tick-up">
                  {timeLeft.hours}
                </strong>
                <span className="text-[10px] uppercase tracking-widest text-white/65">Jam</span>
              </div>
              <div className="countcell text-center">
                <strong key={`minutes-${timeLeft.minutes}`} className="countval block text-4xl sm:text-6xl font-black tabular-nums tick-up">
                  {timeLeft.minutes}
                </strong>
                <span className="text-[10px] uppercase tracking-widest text-white/65">Menit</span>
              </div>
              <div className="countcell text-center">
                <strong key={`seconds-${timeLeft.seconds}`} className="countval block text-4xl sm:text-6xl font-black tabular-nums tick-up">
                  {timeLeft.seconds}
                </strong>
                <span className="text-[10px] uppercase tracking-widest text-white/65">Detik</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Collage */}
        <div className="collage relative mx-auto min-h-[380px] sm:min-h-[520px] w-full max-w-[590px]">
          {/* Main Photo */}
          <div className="absolute right-0 top-0 h-[73%] w-[84%] rotate-2 border-[7px] border-white/10 bg-white/10 p-2 shadow-2xl">
            <div className="photo relative h-full w-full rounded">
              <Image
                src="/assets/syd-banner-1.jpeg"
                alt="Pelari melewati tim yang memberi dukungan di sisi lintasan"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Secondary Photo */}
          <div className="absolute bottom-4 left-0 h-[47%] w-[55%] -rotate-3 border-[7px] border-[var(--ink)] bg-[var(--ink)] p-2 shadow-2xl">
            <div className="photo relative h-full w-full rounded">
              {/* Fallback image */}
              <img
                src="https://images.pexels.com/photos/12585936/pexels-photo-12585936.jpeg?auto=compress&cs=tinysrgb&w=700"
                alt="Dua pelari menyerahkan tongkat estafet"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Format Badge */}
          <div className="absolute bottom-0 right-0 rotate-3 bg-[var(--lime)] px-5 py-4 text-[var(--ink)] shadow-xl">
            <span className="eyebrow block">Format lomba</span>
            <strong className="text-2xl font-black">4 × 600 M</strong>
          </div>
        </div>
      </div>

      {/* Bottom Values Ribbon */}
      <div className="hero-values border-t border-white/15">
        <div className="wrap flex flex-wrap justify-between gap-3 py-4 text-xs font-bold uppercase tracking-wider text-white/70">
          <span>One Team.</span>
          <span>Four Runners.</span>
          <span>One Shared Distance.</span>
        </div>
      </div>
    </section>
  );
}
