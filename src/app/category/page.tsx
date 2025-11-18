import { categoryService } from "@/lib/supabase/service/categories/services";
import Template from "@/components/layout/Template";
import CategoryCard from "@/components/ui/CategoryCard";

export default async function CategoryPage() {
  const categories = await categoryService.getAll()
  // console.log({ categories });
  return (
    <Template>
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-950 py-24">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-6">
              Choose How You'll Share Your Distance
            </h1>
            <p className="text-md md:ext-lg text-zinc-400 max-w-3xl mx-auto">
              Each category offers a unique experience. Find the race that matches your goals and join hundreds of runners in this year-end celebration.
            </p>
          </div>

          {/* Categories Grid - Sama dengan homepage */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {categories.map((category, index) => (
              <CategoryCard key={index} item={category} index={index} />
            ))}
          </div>

          {/* Additional Info - Sama dengan homepage */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-zinc-100 mb-4">
              All participants receive exclusive event merchandise and digital memorabilia
            </p>
            <p className="text-sm text-zinc-500">
              Early bird discounts available until November 30, 2025
            </p>
          </div>

        </div>
      </div>
    </Template>
  );
}