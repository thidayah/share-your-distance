// import { raceCategories } from "@/data/raceCategories";
import { categoryService } from "@/lib/supabase/service/categories/services";
import CategoryCard from "../ui/CategoryCard";

export default async function CategorySection() {
  const categories = await categoryService.getActive();
  return (
    <section id="category" className="py-24 bg-gradient bg-gradient-to-b from-zinc-950 to-zinc-800">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Choose Your Challenge
          </h2>
          <p className="text-xs md:text-lg text-zinc-200">
            Select the race category that matches your spirit and ability.
            From sprints to endurance challenges, there's something for every runner.
          </p>
        </div>

        {/* Categories Grid */}
        {/* <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto"> */}
        <div className="flex justify-center gap-8 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <CategoryCard key={index} item={category} index={index} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 max-w-2xl mx-auto">
          <p className="text-xs md:text-sm text-zinc-200">
            Early bird discounts available until December 13, 2025
          </p>
        </div>
      </div>
    </section>
  );
}