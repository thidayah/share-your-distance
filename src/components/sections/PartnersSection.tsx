'use client';

import { useLanguage } from '@/lib/i18n';
import { WHATSAPP_URL } from '@/data/siteLinks';

export default function PartnersSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-16">
      <div className="wrap">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="eyebrow text-[var(--blue)]">{t('Mitra acara', 'Event partners')}</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn dark !min-h-11 !px-5 !py-2"
          >
            {t('Jadi sponsor ↗', 'Become a sponsor ↗')}
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="sponsor">{t('Slot sponsor', 'Sponsor slot')}</div>
          <div className="sponsor">{t('Slot sponsor', 'Sponsor slot')}</div>
          <div className="sponsor">{t('Slot sponsor', 'Sponsor slot')}</div>
          <div className="sponsor">{t('Slot sponsor', 'Sponsor slot')}</div>
        </div>
      </div>
    </section>
  );
}
