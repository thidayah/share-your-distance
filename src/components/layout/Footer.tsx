// src/components/layout/Footer.tsx
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Logo from '../ui/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            {/* <Logo withText={true} size="md" className="mb-4" /> */}
            <div className=" text-3xl text-white font-bold mb-4 tracking-[-3px]">Share&nbsp;&nbsp;&nbsp;Your&nbsp;&nbsp;Distance</div>
            <p className="text-zinc-300 mb-4 max-w-md">
              Join us on December 20, 2025 for an unforgettable running experience.
              Share your distance, create memories, and celebrate achievements together.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-zinc-300 hover:text-white transition-colors">
                <Icon icon="mdi:whatsapp" className="w-6 h-6" />
              </a>
              <a href="#" className="text-zinc-300 hover:text-white transition-colors">
                <Icon icon="mdi:instagram" className="w-6 h-6" />
              </a>
              {/* <a href="#" className="text-zinc-300 hover:text-white transition-colors">
                <Icon icon="mdi:facebook" className="w-6 h-6" />
              </a> */}
              <a href="#" className="text-zinc-300 hover:text-white transition-colors">
                <Icon icon="mdi:twitter" className="w-6 h-6" />
              </a>
              {/* <a href="#" className="text-zinc-300 hover:text-white transition-colors">
                <Icon icon="mdi:youtube" className="w-6 h-6" />
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-zinc-300 hover:text-white transition-colors">
                  About Event
                </Link>
              </li>
              <li>
                <Link href="/category" className="text-zinc-300 hover:text-white transition-colors">
                  Race Categories
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-zinc-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-center">
                <Icon icon="mdi:email-outline" className="w-5 h-5 mr-3" />
                <span>hello@shareyourdistance.id</span>
              </li>
              <li className="flex items-center">
                <Icon icon="mdi:phone-outline" className="w-5 h-5 mr-3" />
                <span>+62 123 4567 890</span>
              </li>
              {/* <li className="flex items-center">
               <Icon icon="mdi:map-marker-outline" className="w-5 h-5 mr-3" />
                <span>Gedung Sate, Bandung</span>
              </li> */}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-zinc-300 text-sm">
              © {currentYear} Share Your Distance. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-zinc-300 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-zinc-300 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}