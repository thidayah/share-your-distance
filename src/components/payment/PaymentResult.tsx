'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

export type PaymentTone = 'success' | 'pending' | 'failed';

interface PaymentAction {
  label: string;
  href: string;
  variant?: 'primary' | 'ghost';
}

interface PaymentResultProps {
  tone: PaymentTone;
  eyebrow: string;
  title: string;
  description: ReactNode;
  actions: PaymentAction[];
  children?: ReactNode;
  footnote?: ReactNode;
}

const badgeIcon: Record<PaymentTone, ReactNode> = {
  success: (
    <path d="M4 12.5l5 5 11-11" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  ),
  pending: (
    <>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth={2.2} />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  failed: <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />,
};

export function PaymentResult({ tone, eyebrow, title, description, actions, children, footnote }: PaymentResultProps) {
  return (
    <>
      <section className="payment-hero">
        <div className="track dots payment-hero-deco" aria-hidden="true" />
        <div className="wrap">
          <div className="payment-head">
            <span className={`payment-badge is-${tone}`}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {badgeIcon[tone]}
              </svg>
            </span>
            <p className="eyebrow payment-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="payment-lede">{description}</p>
          </div>
        </div>
      </section>

      <section className="payment-page">
        <div className="wrap">
          <div className="payment-body">
            {children}

            <div className="payment-actions">
              {actions.map((action) => (
                <Link
                  key={`${action.href}-${action.label}`}
                  href={action.href}
                  className={`btn ${action.variant === 'ghost' ? 'ghost' : 'dark'}`}
                >
                  {action.label}
                </Link>
              ))}
            </div>

            {footnote ? <p className="payment-foot">{footnote}</p> : null}
          </div>
        </div>
      </section>
    </>
  );
}

export function PaymentSteps({ title, items }: { title: string; items: ReactNode[] }) {
  return (
    <div className="payment-card">
      <h2>{title}</h2>
      <ol className="payment-steps">
        {items.map((item, index) => (
          <li key={index}>
            <b>{String(index + 1).padStart(2, '0')}</b>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function PaymentNote({ title, items, tint }: { title: string; items: ReactNode[]; tint?: boolean }) {
  return (
    <div className={`payment-note${tint ? ' is-tint' : ''}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
