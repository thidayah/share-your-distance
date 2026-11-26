'use client';

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '@/lib/i18n';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const handoffData = [
  {
    step: { id: 'Langkah 01 / Pendaftaran', en: 'Step 01 / Registration' },
    title: { id: 'Daftar & bayar', en: 'Register & pay' },
    copy: { id: 'Selesaikan pembayaran pendaftaran untuk mengamankan tempatmu.', en: 'Complete your registration payment to secure your place.' },
    icon: (
      <svg viewBox="0 0 32 32">
        <circle cx="12" cy="10" r="4" />
        <path d="M4 27c.5-5 3.5-8 8-8 2.4 0 4.4.8 5.7 2.3M23 13v9m-4.5-4.5h9" />
      </svg>
    ),
  },
  {
    step: { id: 'Langkah 02 / Informasi', en: 'Step 02 / Updates' },
    title: { id: 'Masuk grup WhatsApp', en: 'Join the WhatsApp group' },
    copy: { id: 'Info acara dan peserta ada di sana.', en: 'Event updates and fellow participants will be there.' },
    icon: (
      <svg viewBox="0 0 32 32">
        <path d="M5 7h22v16H16l-7 5v-5H5z" />
        <path d="M10 13h12M10 17h8" />
      </svg>
    ),
  },
  {
    step: { id: 'Langkah 03 / Tim', en: 'Step 03 / Team' },
    title: { id: 'Kenali timmu', en: 'Meet your team' },
    copy: { id: 'Tim berempat diumumkan sehari sebelum lomba.', en: 'Teams of four are announced one day before race day.' },
    icon: (
      <svg viewBox="0 0 32 32">
        <circle cx="12" cy="11" r="4" />
        <circle cx="23" cy="12" r="3" />
        <path d="M4 26c0-5 3-8 8-8s8 3 8 8M20 19c4-.5 7 2 8 6" />
      </svg>
    ),
  },
  {
    step: { id: 'Langkah 04 / Garis start', en: 'Step 04 / Starting line' },
    title: { id: 'Lari bareng', en: 'Run together' },
    copy: { id: 'Bagi giliran, oper tongkat, dan tuntaskan jarak bersama.', en: 'Share the turns, pass the baton, and cover the distance together.' },
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
  { id: 'Pergantian tongkat hanya di exchange zone.', en: 'Baton exchanges must take place in the exchange zone.' },
  { id: 'Setiap pelari menempuh satu giliran sejauh 600 meter.', en: 'Each runner completes one 600-metre leg.' },
  { id: 'Dilarang memotong lintasan.', en: 'Cutting the course is prohibited.' },
  { id: 'Waktu dihitung sampai pelari keempat melewati garis finis.', en: 'Time stops when the fourth runner crosses the finish line.' },
  { id: 'Keputusan juri bersifat final.', en: 'The judges’ decision is final.' },
];

// Racepass benefit particle burst (module-level so Math.random isn't in render scope)
function playRaceBenefitParticles(ticket: HTMLElement | null, button: HTMLButtonElement) {
  if (!ticket) return;
  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const icon = button.querySelector('svg');
  if (!icon) return;

  // Each burst gets its own layer so a new hover never cuts a running animation.
  const layer = document.createElement('div');
  layer.className = 'racepass-particles';
  layer.setAttribute('aria-hidden', 'true');
  ticket.appendChild(layer);

  const count = 14;
  const width = layer.clientWidth;
  const height = layer.clientHeight;
  const centerX = width / 2 - 15;
  const centerY = height / 2 - 15;
  const particles: SVGSVGElement[] = [];
  const targets: { scatterX: number; scatterY: number; scatterRotation: number; pileX: number; pileY: number; rotation: number }[] = [];

  for (let i = 0; i < count; i++) {
    const particle = icon.cloneNode(true) as SVGSVGElement;
    particle.classList.add('racepass-particle');
    particle.removeAttribute('style');
    particle.setAttribute('aria-hidden', 'true');
    particle.style.color = i % 2 ? '#101b35' : '#d8fa65';
    layer.appendChild(particle);
    particles.push(particle);
    const column = i % 7;
    const row = Math.floor(i / 7);
    targets.push({
      scatterX: centerX + (Math.random() - 0.5) * width * 0.72,
      scatterY: centerY + (Math.random() - 0.5) * height * 0.4,
      scatterRotation: (Math.random() - 0.5) * 150,
      pileX: 18 + column * Math.max(1, (width - 56) / 6) + (row ? 5 : 0),
      pileY: height - 34 - row * 8,
      rotation: (Math.random() - 0.5) * 32,
    });
  }

  gsap.set(particles, { x: centerX, y: centerY, scale: 0.42, autoAlpha: 0.12, transformOrigin: '50% 50%' });
  const timeline = gsap.timeline({
    onComplete: () => {
      layer.remove();
      timeline.kill();
    },
  });
  timeline
    .to(particles, { x: (i: number) => targets[i].scatterX, y: (i: number) => targets[i].scatterY, rotation: (i: number) => targets[i].scatterRotation, scale: 1, autoAlpha: 1, duration: 0.82, stagger: 0.03, ease: 'power2.out' }, 0)
    .to(particles, { x: (i: number) => targets[i].pileX, y: (i: number) => targets[i].pileY, rotation: (i: number) => targets[i].rotation, scale: 0.72, duration: 0.72, stagger: 0.024, ease: 'power3.inOut' }, 0.82)
    .to(particles, { autoAlpha: 0.12, duration: 0.46, stagger: 0.02, ease: 'power1.out' }, 1.65);
}

export default function AlurSection() {
  const { t } = useLanguage();
  const [activeHandoff, setActiveHandoff] = useState(0);
  const [activeBenefit, setActiveBenefit] = useState<number | null>(null);
  const [activeRule, setActiveRule] = useState(0);
  const lastActivePanel = useRef(0);
  const raceTicketRef = useRef<HTMLDivElement>(null);
  const handoffCardsRef = useRef<Array<HTMLElement | null>>([]);
  const handoffMounted = useRef(false);
  const rulesNumberRef = useRef<HTMLSpanElement>(null);
  const rulesCopyRef = useRef<HTMLParagraphElement>(null);
  const rulesMounted = useRef(false);
  const runnerPanelRef = useRef<HTMLElement>(null);
  const runnerVideoRef = useRef<HTMLVideoElement>(null);
  const runnerVideoFocused = useRef(false);

  const runnerHeading = t('600 meter. Satu giliran. Teman satu tim yang baru.', '600 metres. One turn. Three new teammates.');
  const runnerWords = runnerHeading.trim().split(/\s+/);

  const selectHandoff = (index: number) => {
    setActiveHandoff((prev) => (prev === index ? prev : index));
  };

  // Animate the incoming handoff card (before paint so there is no flash)
  useIsomorphicLayoutEffect(() => {
    if (!handoffMounted.current) {
      handoffMounted.current = true;
      return;
    }
    if (typeof gsap === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    handoffCardsRef.current.forEach((card, index) => {
      if (card && index !== activeHandoff) gsap.set(card, { clearProps: 'all' });
    });

    const incoming = handoffCardsRef.current[activeHandoff];
    if (!incoming) return;

    gsap.set(incoming, { clearProps: 'all' });
    const tween = gsap.fromTo(
      incoming,
      { y: 18, autoAlpha: 0, rotationY: -3 },
      { y: 0, autoAlpha: 1, rotationY: 0, duration: 0.4, ease: 'power3.out', overwrite: true }
    );

    return () => {
      tween.kill();
    };
  }, [activeHandoff]);

  // Story-scroll sticky 3D flip + entrance animations (GSAP)
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('story-enabled');

    const track = document.querySelector('.story-scroll') as HTMLElement | null;
    const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-story-panel]'));
    const mobile = window.matchMedia('(max-width: 760px)');

    if (!track || panels.length === 0) return;

    let pending = false;

    const animatePanel = (index: number) => {
      if (!reducedMotion && typeof gsap !== 'undefined') {
        if (index === 1) {
          gsap.from('#runner-panel .runner-copy', {
            y: 24,
            autoAlpha: 0,
            duration: 0.65,
            ease: 'power3.out',
            overwrite: true,
            clearProps: 'transform,opacity,visibility',
          });
        } else if (index === 2) {
          gsap.timeline({ defaults: { ease: 'power3.out' } })
            .from('.racepass-intro', { x: -32, autoAlpha: 0, duration: 0.6 }, 0)
            .from('.racepass-ticket', { y: 28, rotation: 1.5, autoAlpha: 0, duration: 0.68 }, 0.08)
            .from('.racepass-benefit', { y: 14, autoAlpha: 0, duration: 0.35, stagger: 0.08 }, 0.4);
        } else if (index === 3) {
          gsap.timeline({ defaults: { ease: 'power3.out' } })
            .from('.rules-feature', { x: -32, autoAlpha: 0, duration: 0.6 }, 0)
            .from('.rules-choice', { x: 24, autoAlpha: 0, duration: 0.42, stagger: 0.06 }, 0.15);
        }
      }
    };

    const syncRunnerVideo = () => {
      const video = runnerVideoRef.current;
      const panelEl = runnerPanelRef.current;
      if (!video || !panelEl) return;

      const isMobile = mobile.matches;
      const bounds = panelEl.getBoundingClientRect();
      const focused = isMobile
        ? bounds.top < window.innerHeight * 0.78 && bounds.bottom > window.innerHeight * 0.22
        : panelEl.getAttribute('aria-hidden') === 'false';

      if (focused === runnerVideoFocused.current) return;
      runnerVideoFocused.current = focused;

      if (focused) {
        video.play().catch(() => {
          runnerVideoFocused.current = false;
        });
      } else {
        video.pause();
      }
    };

    const update = () => {
      const isMobile = mobile.matches;
      const rect = track.getBoundingClientRect();
      const travel = track.offsetHeight - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      const active = isMobile ? 0 : Math.min(panels.length - 1, Math.floor(progress * panels.length));

      panels.forEach((panel, index) => {
        const current = !isMobile && index === active;
        panel.classList.toggle('is-active', current);
        panel.classList.toggle('is-before', !isMobile && index < active);
        panel.setAttribute('aria-hidden', isMobile || current ? 'false' : 'true');
      });

      syncRunnerVideo();

      if (!isMobile && active !== lastActivePanel.current) {
        lastActivePanel.current = active;
        animatePanel(active);
      }
    };

    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        update();
        pending = false;
      });
    };

    const handleMobileChange = () => {
      if (mobile.matches && typeof gsap !== 'undefined') {
        const copy = runnerPanelRef.current?.querySelector('.runner-copy');
        if (copy) gsap.set(copy, { clearProps: 'all' });
      }
      schedule();
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    mobile.addEventListener('change', handleMobileChange);
    update();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      mobile.removeEventListener('change', handleMobileChange);
      document.documentElement.classList.remove('story-enabled');
    };
  }, []);

  const selectBenefit = (index: number, button: HTMLButtonElement) => {
    if (activeBenefit !== index) setActiveBenefit(index);
    // Replay on every hover/focus/click, including the already-selected item.
    playRaceBenefitParticles(raceTicketRef.current, button);
  };

  const selectRule = (index: number) => {
    setActiveRule((prev) => (prev === index ? prev : index));
  };

  // Animate the active rule number + copy (after React updates the text)
  useIsomorphicLayoutEffect(() => {
    if (!rulesMounted.current) {
      rulesMounted.current = true;
      return;
    }
    if (typeof gsap === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = [rulesNumberRef.current, rulesCopyRef.current].filter(Boolean) as HTMLElement[];
    if (targets.length === 0) return;

    const tween = gsap.fromTo(
      targets,
      { y: 14, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.32, stagger: 0.04, ease: 'power2.out', overwrite: true, clearProps: 'transform,opacity,visibility' }
    );

    return () => {
      tween.kill();
    };
  }, [activeRule]);

  return (
    <section id="alur" className="story-scroll" aria-label="Alur acara">
      <div className="story-stage">
      {/* PANEL 1: Handoff Pendaftaran */}
      <section id="signup-panel" className="story-panel section bg-[var(--paper)]" data-story-panel>
        <div className="wrap handoff-layout">
          <div className="handoff-intro">
            <p className="eyebrow mb-3 text-[var(--blue)]">{t('Dari daftar sampai start', 'From sign-up to starting line')}</p>
            <h2 className="text-4xl font-black md:text-5xl text-[var(--ink)]">
              {t('Timnya? Biar kami yang urus.', 'Your team? We’ll take care of it.')}
            </h2>
          </div>

          <div className="handoff-widget">
            <div className="handoff-stage" id="handoff-stage" aria-live="polite">
              {handoffData.map((item, index) => (
                <article
                  key={index}
                  className="handoff-card"
                  data-handoff-card
                  hidden={index !== activeHandoff}
                  ref={(el) => {
                    handoffCardsRef.current[index] = el;
                  }}
                >
                  <div>
                    <span className="handoff-card-index">{t(item.step.id, item.step.en)}</span>
                    <div className="handoff-icon mt-4 mb-2" aria-hidden="true">
                      {item.icon}
                    </div>
                    <h3 className="handoff-card-title">{t(item.title.id, item.title.en)}</h3>
                    <p className="handoff-card-copy">{t(item.copy.id, item.copy.en)}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="handoff-nav" role="group" aria-label={t('Tahap pendaftaran', 'Registration steps')}>
              {[
                { id: 'Daftar', en: 'Register' },
                { id: 'Grup', en: 'Group' },
                { id: 'Tim', en: 'Team' },
                { id: 'Lari', en: 'Run' },
              ].map((label, index) => (
                <button
                  key={index}
                  type="button"
                  className="handoff-select"
                  aria-pressed={activeHandoff === index}
                  onPointerEnter={() => selectHandoff(index)}
                  onFocus={() => selectHandoff(index)}
                  onClick={() => selectHandoff(index)}
                >
                  <b>{String(index + 1).padStart(2, '0')}</b>
                  <span>{t(label.id, label.en)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PANEL 2: Runner Video Banner */}
      <section ref={runnerPanelRef} id="runner-panel" className="story-panel text-white" data-story-panel>
        <div className="runner-video-frame">
          <video
            ref={runnerVideoRef}
            id="runner-video"
            className="runner-video"
            muted
            playsInline
            loop
            preload="none"
            aria-label={t('Video pelari berlari bersama', 'Video of runners running together')}
          >
            <source src="/assets/Moving together.mp4" type="video/mp4" />
          </video>
          <div className="runner-shade"></div>
          <div className="runner-copy">
            <p className="eyebrow mb-4 text-[var(--lime)]">{t('Lari santai juga boleh', 'Casual runners welcome')}</p>
            <h2 className="font-black">
              {runnerWords.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  {index > 0 && <br />}
                  {word}
                </Fragment>
              ))}
            </h2>
          </div>
        </div>
      </section>

      {/* PANEL 3: Racepass Info */}
      <section id="info" className="story-panel section bg-[var(--paper)]" data-story-panel>
        <div className="wrap racepass-layout">
          <div className="racepass-intro">
            <p className="eyebrow mb-3 text-[var(--blue)]">{t('Catat detailnya', 'Mark the details')}</p>
            <h2 className="text-4xl font-black md:text-5xl text-[var(--ink)]">
              {t('Siap untuk hari lomba.', 'Ready for race day.')}
            </h2>
          </div>

          <div className="racepass-ticket" ref={raceTicketRef}>
            <div className="racepass-head">
              <div>
                <span className="racepass-brand">Share Your Distance</span>
                <strong className="racepass-volume">VOL 4.0</strong>
              </div>
              <span className="racepass-tag">{t('KARTU LOMBA', 'RACE PASS')}</span>
            </div>

            <div className="racepass-facts">
              <div className="racepass-fact">
                <b>{t('Pendaftaran', 'Registration')}</b>
                <span>{t('Dibuka hingga kuota habis', 'Open until places run out')}</span>
              </div>
              <div className="racepass-fact">
                <b>{t('Usia', 'Age')}</b>
                <span>{t('Minimal 17 tahun', 'Minimum age: 17')}</span>
              </div>
            </div>

            <div className="racepass-benefits-head">
              <b className="eyebrow">{t('Termasuk', 'Included')}</b>
            </div>

            <ul className="racepass-benefits">
              {raceBenefits.map((item, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className="racepass-benefit w-full"
                    aria-pressed={activeBenefit === index}
                    onPointerEnter={(e) => selectBenefit(index, e.currentTarget)}
                    onFocus={(e) => selectBenefit(index, e.currentTarget)}
                    onClick={(e) => selectBenefit(index, e.currentTarget)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PANEL 4: Aturan Inti */}
      <section id="aturan" className="story-panel bg-[var(--ink)] py-16 text-white" data-story-panel>
        <div className="wrap rules-layout">
          <div className="rules-feature">
            <p className="eyebrow mb-3 text-[var(--sky)]">{t('Main adil, jaga aman', 'Race fair, stay safe')}</p>
            <h2 className="text-4xl font-black mb-2">{t('Aturan inti.', 'Core rules.')}</h2>
            <span ref={rulesNumberRef} id="rules-current-number" className="rules-current-number block" aria-hidden="true">
              {String(activeRule + 1).padStart(2, '0')}
            </span>
            <p ref={rulesCopyRef} id="rules-current-copy" className="rules-current-copy" aria-live="polite">
              {t(rules[activeRule].id, rules[activeRule].en)}
            </p>
          </div>

          <ol className="rules-list">
            {rules.map((rule, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="rules-choice"
                  aria-pressed={activeRule === index}
                  onPointerEnter={() => selectRule(index)}
                  onFocus={() => selectRule(index)}
                  onClick={() => selectRule(index)}
                >
                  <b className="rules-choice-number">{String(index + 1).padStart(2, '0')}</b>
                  <span className="rules-choice-text">{t(rule.id, rule.en)}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>
      </div>
    </section>
  );
}
