'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";

const navigation = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Category', href: '#category' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleSmoothScroll = (href: string) => {
    if (href.includes("#")) {
      if (pathname === '/') {
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
        setIsMenuOpen(false)
      } else {
        const targetId = href.substring(1)
        router.push(`/${targetId === 'home' ? '/' : targetId}`)
      }
    } else {
      router.push(`${href}`)
    }
    setIsMenuOpen(false);
  }

  const handleLogoClick = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push('/')
    }
    setIsMenuOpen(false);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <>
      <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled
          ? isMenuOpen ? 'bg-transparent py-6' : ' backdrop-blur-md shadow-lg py-3'
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
              <button
                onClick={handleLogoClick}
                className=" text-2xl md:text-3xl font-bold text-white tracking-[-3px] hover:text-zinc-400 transition-colors duration-300 cursor-pointer"
              >
                {/* Share&nbsp;&nbsp;&nbsp;Your&nbsp;&nbsp;&nbsp;Distance */}
                Syd&nbsp;&nbsp;<span className=" text-xl">3 . 0</span>
              </button>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleSmoothScroll(item.href)}
                  className="text-white hover:text-zinc-400 transition-colors cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
              <Link
                href={'/category'}
                className="bg-zinc-900 text-white px-6 py-3 rounded-full hover:bg-zinc-100 hover:text-zinc-950 duration-300 transition-colors font-semibold cursor-pointer"
              >
                Registration
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white z-60"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out
        ${isMenuOpen
          ? 'opacity-100 visible'
          : 'opacity-0 invisible'
        }
      `}>
        {/* Backdrop with solid color */}
        <div
          className="absolute inset-0 bg-zinc-950/80 bg-opacity-90 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Slide-in Menu */}
        <div className={`
          absolute top-0 right-0 h-full w-80 bg-gradient-to-br from-zinc-700 to-transparent shadow-xl transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex flex-col h-full pt-20 px-6">
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleSmoothScroll(item.href)}
                  className="text-white text-sm font-medium hover:text-zinc-400 transition-colors cursor-pointer text-left py-1"
                >
                  {item.name}
                </button>
              ))}

              {/* Registration Button for Mobile */}
              <Link
                href={'/category'}
                className="bg-white text-zinc-900 py-3 text-sm rounded-full hover:bg-zinc-100 duration-300 transition-colors font-semibold cursor-pointer text-center mt-6"
                onClick={() => setIsMenuOpen(false)}
              >
                Registration
              </Link>
            </nav>

            {/* Optional: Add some bottom content */}
            <div className="mt-auto pb-8">
              <div className="border-t border-zinc-700 pt-6">
                <p className="text-zinc-400 text-sm">
                  © 2024 Syd. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}