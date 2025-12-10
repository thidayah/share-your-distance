'use client';

import { useState, useEffect } from 'react';
// import CountdownTimer from '@/components/ui/CountDownTimer';

const heroSlides = [
  {
    id: 1,
    image: 'https://i.ibb.co.com/S1xGfDn/syd-banner-1.jpg',
    // image: 'https://images.unsplash.com/photo-1528720208104-3d9bd03cc9d4?q=80&w=1920&auto=format&fit=crop',
    alt: 'Runners at sunrise'
  },
  {
    id: 2,
    image: 'https://i.ibb.co.com/6Jt3CgBs/syd-banner-2.jpg',
    // image: 'https://images.unsplash.com/photo-1727094141271-9bea5bc8c757?q=80&w=1920&auto=format&fit=crop',
    alt: 'Group of runners'
  },
  {
    id: 3,
    image: 'https://i.ibb.co.com/WThddLP/syd-banner-3.jpg',
    // image: 'https://images.unsplash.com/photo-1574288763758-a17ce17c4088?q=80&w=1920&auto=format&fit=crop',
    alt: 'Finish line celebration'
  },
  {
    id: 4,
    image: 'https://i.ibb.co.com/Mkc3rfMB/syd-banner-4.jpg',
    // image: 'https://images.unsplash.com/photo-1574288763758-a17ce17c4088?q=80&w=1920&auto=format&fit=crop',
    alt: 'To be continue'
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSmoothScroll = (href: string) => {
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      const headerHeight = 30
      const targetPosition = targetElement.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slides */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center justify-center text-white max-w-4xl mx-auto px-6">
        <div className=" flex justify-center mb-2">
          <img src={'https://i.ibb.co.com/dJM7FSPF/syd-logo.png'} className="object-cover w-[150px] md:w-[250px]" alt="SYD logo" />
        </div>
        <h1 className="text-5xl md:text-8xl font-bold mb-4 animate-slide-up tracking-[-6px] md:tracking-[-10px] ">
          Share&nbsp;&nbsp;Your&nbsp;&nbsp;Happiness
        </h1>
        {/* <p className="text-lg md:text-3xl mb-4 opacity-90 animate-fade-in italic">
          End Your Year with Meaningful Steps
        </p> */}
        <div className="mb-4 animate-fade-in">
          {/* <p className="text-xs md:text-base mb-2">December 20, 2025 at Arei Flagship Store, Bandung</p> */}
          <p className="text-xs md:text-2xl mb-2 italic">December 20, 2025 at Arei Flagship Store, Bandung</p>
        </div>
        <div className="mb-2 animate-fade-in">
          <p className="text-xs md:text-base mb-4">Registration Periode 11-18 December</p>
        </div>

        {/* Countdown Timer */}
        {/* <div className="mb-8 animate-slide-up">
          <CountdownTimer targetDate="2025-12-27T06:00:00" />
        </div> */}
        
      </div>
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => handleSmoothScroll('#category')}
          className="flex flex-col items-center cursor-pointer"
        >
          <span className="text-sm mb-2 opacity-80">Scroll for explorer</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
}