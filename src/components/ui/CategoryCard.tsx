import Link from 'next/link';
import { TypesCategory } from '@/types/database';

interface CategoryCardProps {
  item: TypesCategory;
  index: number;
  className?: string;
}

export default function CategoryCard({ item }: CategoryCardProps) {
  const isClosed = item.max_participants
    ? (item.current_participants ?? 0) >= item.max_participants
    : false;

  return (
    <div
      key={item.id}
      className={`relative w-full max-w-[360px] rounded-2xl border bg-white p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 ${
        item.recommended ? 'border-[var(--blue)] shadow-blue-500/10' : 'border-[var(--line)]'
      }`}
    >
      {/* Recommended Badge */}
      {item.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-[var(--lime)] px-4 py-1 text-xs font-black uppercase tracking-wider text-[var(--ink)] shadow-md">
            Paling Populer
          </span>
        </div>
      )}

      {/* Category Header */}
      <div className="mb-6 text-center">
        <h3 className="mb-2 text-xl md:text-2xl font-black text-[var(--ink)]">
          {item.name}
        </h3>
        <div className="mb-2 text-2xl md:text-3xl font-black text-[var(--blue)]">
          Rp{item.price.toLocaleString('id-ID')}
          <span className="block text-xs font-semibold text-[var(--muted)] mt-1">
            {item.id === 'estafet-200m' ? 'per tim' : 'per orang'}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mb-6 text-center text-sm text-[var(--muted)] leading-relaxed">
        {item.description}
      </p>

      {/* Features List */}
      <ul className="mb-8 space-y-3 text-sm text-[var(--ink)]">
        {item.features?.map((feature, fIndex) => (
          <li key={fIndex} className="flex items-center">
            <span className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--paper)] text-[var(--blue)] font-bold text-xs">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <div className="text-center">
        {isClosed ? (
          <button
            disabled
            className="btn w-full bg-neutral-200 text-neutral-500 cursor-not-allowed font-bold"
          >
            Pendaftaran Ditutup
          </button>
        ) : (
          <Link
            href={`/register/${item.id}`}
            className={`btn w-full font-extrabold ${
              item.recommended ? 'lime' : 'dark'
            }`}
          >
            Daftar Sekarang ↗
          </Link>
        )}
      </div>
    </div>
  );
}
