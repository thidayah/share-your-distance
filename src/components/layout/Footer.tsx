'use client';

import Image from 'next/image';
import { useLanguage } from '@/lib/i18n';
import { DEVELOPER_URL, EMAIL_ADDRESS, EMAIL_URL, INSTAGRAM_URL, WHATSAPP_URL } from '@/data/siteLinks';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t-4 border-[var(--lime)] bg-[var(--ink)] py-12 text-white">
      <div className="track dots pointer-events-none absolute inset-0 opacity-40"></div>
      <div className="wrap relative">
        <div className="grid gap-10 pb-10 sm:grid-cols-2 sm:items-center">
          <div>
            <Image
              src="/assets/SYD.png"
              alt="Share Your Distance"
              width={164}
              height={52}
              className="w-[164px] h-auto"
            />
            <p className="mt-4 text-base leading-relaxed text-white/80 max-w-md">
              Share Your Distance is more than just a race. It is about sharing the effort, trusting your teammates, and pushing the distance together.
            </p>
          </div>
          <div className="sm:justify-self-end">
            <p className="eyebrow mb-4 text-white/55 sm:text-right">{t('Kontak', 'Contact')}</p>
            <div className="flex flex-row gap-3 sm:justify-end">
              <a
                className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-[var(--lime)] hover:bg-white/10 hover:text-[var(--lime)]"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M12 2a9.8 9.8 0 0 0-8.4 14.8L2.4 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.5l.4-.4.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.5.5.2.9.4 1.2.4.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1 0-.1-.2-.2-.4-.3Z" />
                </svg>
              </a>
              <a
                className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-[var(--lime)] hover:bg-white/10 hover:text-[var(--lime)]"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @sobatsabtu"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r=".8" className="fill-current stroke-none" />
                </svg>
              </a>
              <a
                className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-[var(--lime)] hover:bg-white/10 hover:text-[var(--lime)]"
                href={EMAIL_URL}
                aria-label={`Email ${EMAIL_ADDRESS}`}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </a>
              <a
                className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-[var(--lime)] hover:bg-white/10 hover:text-[var(--lime)]"
                href={DEVELOPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('Situs pengembang', 'Developer site')}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <p className="border-t border-white/15 pt-5 text-center text-xs tracking-wide text-white/50">
          Copyright © {currentYear} Sobat Sabtu · All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
