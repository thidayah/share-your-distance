'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled 
        ? ' backdrop-blur-md shadow-lg py-3' 
        : 'bg-transparent py-6'
      }
    `}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center ">
            {/* <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SYD</span>
            </div> */}
            <span className="ml-3 text-3xl font-bold text-white tracking-[-3px] hover:text-zinc-400 transition-colors duration-300 cursor-pointer">
              {/* Share&nbsp;&nbsp;&nbsp;Your&nbsp;&nbsp;&nbsp;Distance */}
              Syd
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#home" className="text-white hover:text-zinc-400 transition-colors">
              Home
            </Link>
            <Link href="#about" className="text-white hover:text-zinc-400 transition-colors">
              About
            </Link>
            <Link href="#category" className="text-white hover:text-zinc-400 transition-colors">
              Category
            </Link>
            <Link href="#contact" className="text-white hover:text-zinc-400 transition-colors">
              Contact
            </Link>
            <button className="bg-zinc-900 text-white px-6 py-2 rounded-full hover:bg-zinc-800 duration-300 transition-colors font-semibold cursor-pointer">
              Registration
            </button>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-neutral-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}