import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import CategorySection from '@/components/sections/CategorySection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import PartnersSection from '@/components/sections/PartnersSection';
import CountDownSection from "@/components/sections/CountDownSection";
import Template from "@/components/layout/Template";

export default function Home() {
  return (
    <Template>
      <HeroSection />
      <CountDownSection />
      <AboutSection />
      <CategorySection />
      <BenefitsSection />
      <PartnersSection />
    </Template>
  );
}