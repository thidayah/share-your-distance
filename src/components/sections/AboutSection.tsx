export default function AboutSection() {

  interface FeatureCard {
  id: number;
  title: string;
  description: string;
  image: string;
}

const aboutFeatures: FeatureCard[] = [
  {
    id: 1,
    title: "Community",
    description: "Run together, grow together in our supportive community",
    image: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Achievement",
    description: "Celebrate personal milestones and push your limits further",
    image: "https://images.unsplash.com/photo-1508730328641-47c1616341b7?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Experience",
    description: "Create lasting memories in an unforgettable running journey",
    image: "https://images.unsplash.com/photo-1590764258299-0f91fa7f95e8?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Purpose",
    description: "Run with make every step count towards something greater",
    image: "https://plus.unsplash.com/premium_photo-1661868906940-5d8443acf49e?q=80&w=1920&auto=format&fit=crop",
  },
];


  return (
    <section id="about" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-16">
            What is <i>"Share Your Distance"?</i>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <p className="text-lg text-zinc-100 mb-6">
                Share Your Distance is not just another running event. It's a celebration of community,
                personal achievement, and the power of shared experiences.
              </p>
              <p className="text-lg text-zinc-100 mb-6">
                As we approach the end of 2025, we invite you to join hundreds of fellow runners
                in creating meaningful memories and celebrating the journey together.
              </p>
              <div className="bg-zinc-50 border-l-4 border-zinc-500 p-4">
                <p className="text-zinc-900 font-semibold">
                  "Every step you take tells a story. Every kilometer you share creates a connection."
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {aboutFeatures.map((feature) => (
                <div key={feature.id} className={`group relative h-48  overflow-hidden cursor-pointer `}>
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${feature.image})` }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/40 group-hover:from-black/80 group-hover:via-black/60 group-hover:to-black/40 transition-all duration-500" />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">

                    {/* Text Content */}
                    <div className="mt-12 transform transition-all duration-500 group-hover:-translate-y-2">
                      {/* Title - Visible by default, hides on hover */}
                      <h3 className="text-white font-bold text-lg mb-1 opacity-100 group-hover:opacity-0 group-hover:translate-y-2 transition-all duration-300">
                        {feature.title}
                      </h3>

                      {/* Description - Hidden by default, shows on hover */}
                      <p className="text-white/90 text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}