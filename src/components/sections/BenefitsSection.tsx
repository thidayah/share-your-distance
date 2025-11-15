import Button from "@/components/ui/Button";
import { Icon } from "@iconify/react";
import Link from "next/link";

const benefits = [
  {
    icon: <Icon icon="mdi:medal-outline" className="text-4xl text-blue-500" />,
    title: "Exclusive Finisher Medal",
    description:
      "Beautifully designed medal to commemorate your achievement and dedication.",
  },
  {
    icon: <Icon icon="mdi:tshirt-crew-outline" className="text-4xl text-blue-500" />,
    title: "Limited Edition Event T-shirt",
    description:
      "High-quality performance tee available only to Share Your Distance participants.",
  },
  {
    icon: <Icon icon="mdi:gift-outline" className="text-4xl text-blue-500" />,
    title: "Special Goodie Bag",
    description:
      "Curated package with sponsor products, nutrition samples, and race essentials.",
  },
  {
    icon: <Icon icon="mdi:file-certificate-outline" className="text-4xl text-blue-500" />,
    title: "Digital E-Certificate",
    description:
      "Personalized certificate with your name and finish time, shareable on social media.",
  },
  {
    icon: <Icon icon="mdi:account-group-outline" className="text-4xl text-blue-500" />,
    title: "Community Experience",
    description:
      "Join hundreds of fellow runners in a celebration of fitness and achievement.",
  },
  {
    icon: <Icon icon="mdi:camera-outline" className="text-4xl text-blue-500" />,
    title: "Free Finish Line Photos",
    description:
      "Professional photography capturing your triumphant moment, downloadable for free.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-zinc-800 to-zinc-950">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
            Why Join Us?
          </h2>
          <p className="text-lg text-zinc-100">
            We believe every runner deserves an exceptional experience.
            Here's what makes our event special and memorable.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className=" bg-zinc-900 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <div className=" flex items-center space-x-3 mb-4">
                {/* Icon */}
                <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-zinc-300 group-hover:text-zinc-100 transition-colors">
                  {benefit.title}
                </h3>
              </div>
              <p className="text-zinc-300 group-hover:text-zinc-100 leading-relaxed">
                {benefit.description}
              </p>

              {/* Hover Effect Line */}
              <div className="w-0 h-1 bg-gradient-to-r from-zinc-500 to-white mt-6 group-hover:w-full transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-zinc-900 rounded-bl-4xl rounded-tr-4xl p-8 shadow-lg max-w-3xl mx-auto border">
            <h3 className="text-2xl font-bold text-zinc-100 mb-4">
              Ready to Create Unforgettable Memories?
            </h3>
            <p className="text-zinc-300 mb-6">
              Join us on December 20, 2025 and be part of something extraordinary.
              Your running journey deserves to be celebrated.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={'/category'}>
                <Button variant="primary" size="md" className=" text-zinc-900">
                  Register Your Spot Now
                </Button>
              </Link>
              <Link href={'/about'}>
                <Button variant="outline" size="md">
                  Learn More About The Event
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}