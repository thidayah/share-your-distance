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

  const handleSmoothScroll = (href: string) => {
    // if (href.includes("#")) {
    //   if (pathname === '/') {
    //     const targetId = href.substring(1)
    //     const targetElement = document.getElementById(targetId)

    //     if (targetElement) {
    //       const headerHeight = 30
    //       const targetPosition = targetElement.offsetTop - headerHeight

    //       window.scrollTo({
    //         top: targetPosition,
    //         behavior: 'smooth'
    //       })
    //     }
    //     setIsMenuOpen(false)
    //   } else {
    //     router.push(`/${href}`)
    //   }
    // } else {
    //   router.push(`${href}`)
    // }

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
  }

  const handleLogoClick = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push('/')
    }
  }

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
            <button
              onClick={handleLogoClick}
              className=" text-3xl font-bold text-white tracking-[-3px] hover:text-zinc-400 transition-colors duration-300 cursor-pointer"
            >
              {/* Share&nbsp;&nbsp;&nbsp;Your&nbsp;&nbsp;&nbsp;Distance */}
              Syd .
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
              // className="bg-zinc-900 text-white px-6 py-3 rounded-full hover:bg-zinc-900/50 duration-300 transition-colors font-semibold cursor-pointer"
              className="bg-zinc-900 text-white px-6 py-3 rounded-full hover:bg-zinc-100 hover:text-zinc-950 duration-300 transition-colors font-semibold cursor-pointer"
            >
              Registration
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}