'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';

const faqs = [
  {
    question: { id: 'Apa saja yang termasuk dalam biaya pendaftaran?', en: "What's included in the registration fee?" },
    answer: { id: 'Pendaftaran mencakup BIB Number, Refreshment, Medical, Doorprize, dan Digital Certificate.', en: 'Your registration includes BIB Number, Refreshment, Medical, Doorprize, and Digital Certificate.' },
  },
  {
    question: { id: 'Bagaimana kebijakan pengembalian biaya?', en: 'What is the refund policy?' },
    answer: { id: 'Biaya pendaftaran tidak dapat dikembalikan atau dialihkan. Kebijakan ini berlaku untuk semua kondisi, termasuk cedera, sakit, atau keadaan darurat pribadi.', en: 'Registration fees are non-refundable and non-transferable. This policy applies in all circumstances, including injury, illness, or personal emergencies.' },
  },
  {
    question: { id: 'Apa yang perlu saya bawa saat hari lomba?', en: 'What should I bring on race day?' },
    answer: { id: 'Bawa BIB Number, pakaian olahraga yang nyaman, sepatu lari, air minum, dan kartu identitas. Sunscreen, topi, pakaian ganti, dan obat pribadi juga disarankan.', en: 'Bring your race bib, comfortable running attire, proper running shoes, water, and ID. Sunscreen, a hat, a change of clothes, and personal medication are also recommended.' },
  },
  {
    question: { id: 'Dukungan medis apa yang tersedia selama acara?', en: 'What medical support is available during the event?' },
    answer: { id: 'Tim medis tersedia selama acara. Mohon cantumkan kondisi medis yang perlu diketahui pada formulir pendaftaran.', en: 'A medical team will be available during the event. Please include any relevant medical conditions in your registration form.' },
  },
  {
    question: { id: 'Bagaimana cara mendapatkan sertifikat digital?', en: 'How do I get my digital certificate?' },
    answer: { id: 'Sertifikat digital termasuk dalam pendaftaran. Informasi pengiriman sertifikat akan disampaikan oleh penyelenggara setelah acara.', en: 'A digital certificate is included with your registration. The organizer will share delivery details after the event.' },
  },
];

export default function FaqSection() {
  const { t } = useLanguage();
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const handleToggle = (index: number, isOpen: boolean) => {
    setOpenItems((prev) => (isOpen ? [...prev, index] : prev.filter((item) => item !== index)));
  };

  return (
    <section id="faq" className="section bg-[var(--paper)]">
      <div className="wrap grid gap-8 lg:grid-cols-[.65fr_1.35fr]">
        <div>
          <p className="eyebrow mb-3 text-[var(--blue)]">FAQ</p>
          <h2 className="text-4xl font-black text-[var(--ink)]">
            {t('Masih ada yang ingin kamu tahu?', 'Still have questions?')}
          </h2>
        </div>

        <div className="divide-y  divide-[#e5e7eb] border-y border-[#e5e7eb]">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="py-4"
              open={openItems.includes(index)}
              onToggle={(e) => handleToggle(index, e.currentTarget.open)}
            >
              <summary className="min-h-11 cursor-pointer font-bold">
                {t(faq.question.id, faq.question.en)}
              </summary>
              <p className="pt-2 text-sm text-[var(--muted)]">
                {t(faq.answer.id, faq.answer.en)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
