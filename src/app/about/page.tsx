// src/app/about/page.tsx
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Template from "@/components/layout/Template";

export default function AboutPage() {
  return (
    <Template>
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-950 py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className=" text-2xl md:text-4xl font-bold text-white mb-4">
              About Share Your Distance
            </h1>
            <p className="text-neutral-400 text-md md:text-lg">
              More than a race. A celebration of every step you take.
            </p>
          </div>

          <div className="space-y-12">
            {/* Main Story */}
            <section className="grid md:grid-cols-2 gap-y-65 md:gap-y-0 gap-x-0 md:gap-x-4">
              <div className="relative">
                <div 
                  className=" size-3/4 absolute top-0 hover:z-10 transform hover:scale-115 transition-transform duration-500 animate-slide-up"
                  style={{ animationDelay: `${1 * 100}ms` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=1920&auto=format&fit=crop"
                    className=" object-cover aspect-video rounded-xs"
                  />
                </div>
                <div 
                  // className=" size-3/4 absolute top-[20%] left-[10%] hover:z-10 transform hover:scale-115 transition-transform duration-500 animate-slide-up"
                  className=" size-3/4 absolute top-[25px] md:top-[20%] left-[10%] hover:z-10 transform hover:scale-115 transition-transform duration-500 animate-slide-up"
                  style={{ animationDelay: `${2 * 100}ms` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1590764258299-0f91fa7f95e8?q=80&w=1920&auto=format&fit=crop"
                    className=" object-cover aspect-video rounded-xs"
                  />
                </div>
                <div 
                  // className=" size-3/4 absolute top-[40%] left-[20%] hover:z-10 transform hover:scale-115 transition-transform duration-500 animate-slide-up"
                  className=" size-3/4 absolute top-[50] md:top-[40%] left-[20%] hover:z-10 transform hover:scale-115 transition-transform duration-500 animate-slide-up"
                  style={{ animationDelay: `${3 * 100}ms` }}
                >
                  <img
                    src="https://plus.unsplash.com/premium_photo-1661868906940-5d8443acf49e?q=80&w=1920&auto=format&fit=crop"
                    className=" object-cover aspect-video rounded-xs"
                  />
                </div>
              </div>
              <div className="flex items-start md:space-x-6  md:mt-0">
                {/* <div className="w-16 h-16 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon icon="mdi:heart" className="w-8 h-8 text-primary-400" />
                </div> */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
                  <div className="text-neutral-300 space-y-4 leading-relaxed text-justify">
                    <p>
                      <strong>Share Your Distance</strong> was born from a simple belief: every runner's journey matters.
                      In a world obsessed with speed and podiums, we wanted to create something different.
                    </p>
                    <p>
                      We're not just about who finishes first. We're about celebrating <strong>every finish</strong>.
                      The first-time runner conquering 5K. The relay team supporting each other. The endurance seeker pushing their limits.
                    </p>
                    <p>
                      This isn't just another race. It's your year-end celebration. Your story of perseverance.
                      Your chance to say, "I showed up, and I finished."
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* What Makes Us Different */}
            <section className="border border-zinc-700 p-4 md:p-8 ">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Why We're Different
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: 'mdi:account-group',
                    title: 'Community First',
                    description: 'We prioritize connection over competition. Every participant is part of our running family.'
                  },
                  {
                    icon: 'mdi:calendar-heart',
                    title: 'Year-End Celebration',
                    description: 'Timed as your year-end achievement. Close your year with accomplishment and positivity.'
                  },
                  {
                    icon: 'mdi:medal',
                    title: 'Every Finish Matters',
                    description: 'We celebrate personal achievements, not just podium positions. Your PB is our victory.'
                  },
                  {
                    icon: 'mdi:map-marker-path',
                    title: 'Memorable Experience',
                    description: 'Beautiful venue, great atmosphere, and moments you will remember long after you finish.'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-zinc-800 rounded-lg">
                    <div className="w-12 h-12 bg-zinc-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon icon={item.icon} className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Simple Stats */}
            <section className="text-center">
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div>
                  <div className="text-3xl font-bold text-zinc-100 mb-2">500+</div>
                  <div className="text-zinc-400 text-sm">Expected Runners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-zinc-100 mb-2">3</div>
                  <div className="text-zinc-400 text-sm">Race Categories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-zinc-100 mb-2">1</div>
                  <div className="text-zinc-400 text-sm">Unforgettable Day</div>
                </div>
              </div>
            </section>

            {/* Why Join */}
            <section className=" rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-6">
                Ready to Share Your Distance?
              </h2>
              <p className="text-zinc-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Join hundreds of runners on December 20, 2025 at Gedung Sate.
                Whether you're chasing a personal best or simply want to be part of something special,
                there's a place for you here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#category"
                  className="bg-zinc-500 text-white px-8 py-3 rounded-full hover:bg-zinc-600 transition-colors font-semibold inline-flex items-center justify-center"
                >
                  <Icon icon="mdi:run-fast" className="w-5 h-5 mr-2" />
                  Choose Your Category
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-zinc-500 text-zinc-500 px-8 py-3 rounded-full hover:bg-zinc-500 hover:text-white transition-colors font-semibold inline-flex items-center justify-center"
                >
                  <Icon icon="mdi:chat-question" className="w-5 h-5 mr-2" />
                  Ask Questions
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Template>
  );
}