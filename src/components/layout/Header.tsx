'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [isFloating, setIsFloating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFloating(window.scrollY > 36);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith('#')) {
      if (pathname === '/') {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        router.push(`/${href}`);
      }
    }
  };

  return (
    <header className={`site-header absolute inset-x-0 top-0 z-40 text-white ${isFloating ? 'is-floating' : ''}`}>
      <div className={`wrap site-header-inner relative flex items-center justify-between py-4 ${isMenuOpen ? 'menu-open' : ''}`}>
        <Link href="/" className="flex items-center gap-3" aria-label="Share Your Distance — beranda" onClick={() => setIsMenuOpen(false)}>
          <Image
            src="/assets/Logo Putih.png"
            alt="Sobat Sabtu"
            width={92}
            height={37}
            className="w-[92px] h-auto"
            priority
          />
          <span className="hidden text-xs font-bold tracking-[.14em] sm:inline">PRESENTS</span>
        </Link>

        <button
          className="mobile-menu-toggle"
          id="mobile-menu-toggle"
          type="button"
          aria-controls="header-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            )}
          </svg>
        </button>

        <div className="header-menu" id="header-menu">
          <nav className="navlinks flex gap-7 text-sm font-semibold" aria-label="Navigasi utama">
            <button
              type="button"
              onClick={() => handleNavClick('#format')}
              className="hover:text-[var(--lime)] transition-colors cursor-pointer text-left"
            >
              Format
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#alur')}
              className="hover:text-[var(--lime)] transition-colors cursor-pointer text-left"
            >
              Alur
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#faq')}
              className="hover:text-[var(--lime)] transition-colors cursor-pointer text-left"
            >
              FAQ
            </button>
          </nav>

          <div className="header-actions">
            <Link
              href={pathname === '/' ? '#daftar' : '/category'}
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  handleNavClick('#daftar');
                } else {
                  setIsMenuOpen(false);
                }
              }}
              className="btn lime !min-h-11 !px-5 !py-2"
            >
              Daftar ↗
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
