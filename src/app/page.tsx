import Template from "@/components/layout/Template";
import HeroSection from "@/components/sections/HeroSection";
import FormatSection from "@/components/sections/FormatSection";
import AlurSection from "@/components/sections/AlurSection";
import FaqSection from "@/components/sections/FaqSection";
import PartnersSection from "@/components/sections/PartnersSection";
import CtaSection from "@/components/sections/CtaSection";

export default function Home() {
  return (
    <Template>
      <HeroSection />
      <FormatSection />
      <AlurSection />
      <FaqSection />
      <PartnersSection />
      <CtaSection />
    </Template>
  );
}
