'use client';

const faqs = [
  {
    question: 'Apa saja yang termasuk dalam biaya pendaftaran?',
    answer: 'Pendaftaran mencakup BIB Number, Refreshment, Medical, Doorprize, dan Digital Certificate.',
  },
  {
    question: 'Bagaimana kebijakan pengembalian biaya?',
    answer: 'Biaya pendaftaran tidak dapat dikembalikan atau dialihkan. Kebijakan ini berlaku untuk semua kondisi, termasuk cedera, sakit, atau keadaan darurat pribadi.',
  },
  {
    question: 'Apa yang perlu saya bawa saat hari lomba?',
    answer: 'Bawa BIB Number, pakaian olahraga yang nyaman, sepatu lari, air minum, dan kartu identitas. Sunscreen, topi, pakaian ganti, dan obat pribadi juga disarankan.',
  },
  {
    question: 'Dukungan medis apa yang tersedia selama acara?',
    answer: 'Tim medis tersedia selama acara. Mohon cantumkan kondisi medis yang perlu diketahui pada formulir pendaftaran.',
  },
  {
    question: 'Bagaimana cara mendapatkan sertifikat digital?',
    answer: 'Sertifikat digital termasuk dalam pendaftaran. Informasi pengiriman sertifikat akan disampaikan oleh penyelenggara setelah acara.',
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="section bg-[var(--paper)]">
      <div className="wrap grid gap-8 lg:grid-cols-[.65fr_1.35fr]">
        <div>
          <p className="eyebrow mb-3 text-[var(--blue)]">FAQ</p>
          <h2 className="text-4xl font-black text-[var(--ink)]">
            Masih ada yang ingin kamu tahu?
          </h2>
          <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">
            Berikut jawaban untuk pertanyaan yang paling sering diajukan seputar pelaksanaan Share Your Distance Vol 4.0.
          </p>
        </div>

        <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {faqs.map((faq, index) => (
            <details key={index} className="group py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-bold text-[var(--ink)] hover:text-[var(--blue)] transition-colors">
                <span>{faq.question}</span>
                <span className="ml-4 text-xl transition-transform duration-200 group-open:rotate-45 text-[var(--blue)]">
                  +
                </span>
              </summary>
              <p className="pt-2 text-sm text-[var(--muted)] leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
