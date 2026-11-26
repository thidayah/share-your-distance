'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useLanguage } from '@/lib/i18n';

const RUNNERS = 4;
const LEG_METERS = 600;
const TOTAL_METERS = RUNNERS * LEG_METERS;

function formatRelayDistance(value: number, language: string) {
  const rounded = Math.floor(value);
  return `${rounded.toLocaleString(language === 'id' ? 'id-ID' : 'en-US')} M`;
}

export default function FormatSection() {
  const { lang, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const batonRef = useRef<SVGGElement>(null);
  const runnerNumberRef = useRef<SVGTextElement>(null);
  const distanceRef = useRef<HTMLElement>(null);
  const metersRef = useRef(0);
  const langRef = useRef(lang);

  useEffect(() => {
    langRef.current = lang;
    if (distanceRef.current) {
      distanceRef.current.textContent = formatRelayDistance(metersRef.current, lang);
    }
  }, [lang]);

  useEffect(() => {
    const section = sectionRef.current;
    const route = routeRef.current;
    const baton = batonRef.current;
    const runnerNumber = runnerNumberRef.current;
    const distance = distanceRef.current;
    if (!section || !route || !baton || !runnerNumber || !distance) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const showStatic = () => {
      metersRef.current = TOTAL_METERS;
      distance.textContent = formatRelayDistance(TOTAL_METERS, langRef.current);
      runnerNumber.textContent = String(RUNNERS).padStart(2, '0');
    };

    if (typeof gsap === 'undefined' || reducedMotion) {
      showStatic();
      return;
    }

    gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, SplitText);

    let headingSplit: SplitText | null = null;
    let headingAnimated = false;
    const progress = { distance: 0 };

    const loop = gsap.timeline({ repeat: -1, paused: true });
    loop
      .to(
        baton,
        {
          duration: 10,
          repeat: RUNNERS - 1,
          ease: 'none',
          motionPath: {
            path: route,
            align: route,
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
          },
        },
        0
      )
      .to(
        progress,
        {
          distance: TOTAL_METERS,
          duration: 40,
          ease: 'none',
          onUpdate: () => {
            const meters = Math.min(TOTAL_METERS, progress.distance);
            const runner = meters >= TOTAL_METERS ? RUNNERS : Math.floor(meters / LEG_METERS) + 1;
            metersRef.current = meters;
            distance.textContent = formatRelayDistance(meters, langRef.current);
            runnerNumber.textContent = String(runner).padStart(2, '0');
          },
        },
        0
      );

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      end: 'bottom top',
      onEnter: () => {
        const heading = section.querySelector<HTMLElement>('#relay-heading');
        if (!headingAnimated && heading) {
          headingAnimated = true;
          headingSplit = SplitText.create(heading, {
            type: 'words,chars',
            wordsClass: 'relay-word',
            charsClass: 'relay-char',
            aria: 'auto',
          });
          gsap.from(headingSplit.chars, { autoAlpha: 0, duration: 0.001, stagger: 0.06, ease: 'none' });
        }
        loop.play();
      },
      onEnterBack: () => loop.play(),
      onLeave: () => loop.pause(),
      onLeaveBack: () => loop.pause(),
    });

    return () => {
      trigger.kill();
      loop.kill();
      if (headingSplit) headingSplit.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="format" className="section">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-4 text-[var(--blue)]">{t('Satu lintasan, empat peran', 'One track, four turns')}</p>
          <h2 className="mb-5 text-4xl font-black leading-tight tracking-tight md:text-5xl text-[var(--ink)]">
            <span id="relay-heading">
              {t('Bukan soal siapa paling cepat. Ini soal saling bawa sampai finis.', "It’s not about who’s fastest. It’s about carrying each other to the finish.")}
            </span>
          </h2>
        </div>

        <div className="relay-visual">
          <svg
            className="relay-svg"
            viewBox="0 0 560 440"
            role="img"
            aria-labelledby="relay-title relay-desc"
          >
            <title id="relay-title">{t('Lintasan estafet empat pelari', 'Four-runner relay track')}</title>
            <desc id="relay-desc">
              {t('Empat pelari bergantian mengelilingi lintasan. Setiap putaran berjarak 600 meter dan total jarak tim 2.400 meter.', 'Four runners take turns around the track. Each leg is 600 metres, for a team total of 2,400 metres.')}
            </desc>

            {/* Track surface */}
            <path
              className="relay-track-surface"
              d="M235 120H325A100 100 0 0 1 325 320H235A100 100 0 0 1 235 120"
              transform="rotate(-28 280 220)"
            />

            {/* Lane lines */}
            <path
              className="relay-lane-line"
              d="M235 148H325A72 72 0 0 1 325 292H235A72 72 0 0 1 235 148"
              transform="rotate(-28 280 220)"
            />
            <path
              className="relay-lane-line"
              d="M235 134H325A86 86 0 0 1 325 306H235A86 86 0 0 1 235 134"
              transform="rotate(-28 280 220)"
            />
            <path
              className="relay-lane-line"
              d="M235 120H325A100 100 0 0 1 325 320H235A100 100 0 0 1 235 120"
              transform="rotate(-28 280 220)"
            />
            <path
              className="relay-lane-line"
              d="M235 106H325A114 114 0 0 1 325 334H235A114 114 0 0 1 235 106"
              transform="rotate(-28 280 220)"
            />
            <path
              className="relay-lane-line"
              d="M235 92H325A128 128 0 0 1 325 348H235A128 128 0 0 1 235 92"
              transform="rotate(-28 280 220)"
            />

            {/* Hidden motion path */}
            <path
              ref={routeRef}
              id="relay-route"
              className="relay-motion-path"
              d="M235 127A93 93 0 0 0 235 313H325A93 93 0 0 0 325 127H235"
              transform="rotate(-28 280 220)"
            />

            {/* Baton & Runner Badge */}
            <g ref={batonRef} id="relay-baton" transform="translate(280 220)">
              <circle className="relay-runner-badge" r="24" />
              <text
                ref={runnerNumberRef}
                id="relay-runner-number"
                className="relay-runner-number"
                textAnchor="middle"
                dominantBaseline="central"
                x="0"
                y="1"
              >
                01
              </text>
            </g>
          </svg>

          {/* Center metric indicator */}
          <div className="relay-center">
            <span className="eyebrow text-[var(--blue)]">{t('Jarak tim', 'Team distance')}</span>
            <strong
              ref={distanceRef}
              id="relay-distance"
              className="mt-1 inline-block max-w-full min-w-[6ch] bg-[var(--ink)] text-center font-black text-white"
              aria-live="off"
            >
              0 M
            </strong>
            <span className="mt-1 block text-xs font-semibold text-[var(--muted)]">
              {t('4 pelari · 600 m per orang', '4 runners · 600 m each')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
