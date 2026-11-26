import { redirect } from "next/navigation";
import { categoryService } from "@/lib/supabase/service/categories/services";
import Template from "@/components/layout/Template";
import CategoryCard from "@/components/ui/CategoryCard";

// Kategori bisa berubah dari admin, jadi keputusan redirect harus dicek per request.
export const dynamic = "force-dynamic";

export default async function CategoryPage() {
  const categories = await categoryService.getActive();

  // Satu kategori aktif → langsung ke form registrasi tanpa halaman pemilihan.
  if (categories.length === 1) {
    redirect(`/register/${categories[0].id}`);
  }

  return (
    <Template>
      <div className="min-h-screen bg-[var(--paper)] py-28 md:py-36">
        <div className="wrap">
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="eyebrow mb-3 text-[var(--blue)]">Kategori Lomba</p>
            <h1 className="text-3xl md:text-5xl font-black text-[var(--ink)] mb-4">
              Pilih Kategori Jarakmu
            </h1>
            <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
              Setiap kategori memberikan pengalaman estafet yang unik dan penuh energi. Pilih kategori yang sesuai dengan timmu dan raih garis finis bersama.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto mb-16">
            {categories.map((category, index) => (
              <CategoryCard key={category.id || index} item={category} index={index} />
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm text-[var(--muted)]">
              Informasi perlengkapan dan kebutuhan hari acara akan dibagikan mendekati tanggal lomba.
            </p>
          </div>
        </div>
      </div>
    </Template>
  );
}
