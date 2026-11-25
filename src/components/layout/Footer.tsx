import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t-4 border-[var(--lime)] bg-[var(--ink)] py-12 text-white">
      <div className="track dots pointer-events-none absolute inset-0 opacity-40"></div>
      <div className="wrap relative">
        <div className="grid gap-10 pb-10 sm:grid-cols-2 sm:items-center">
          <div>
            <Image
              src="/assets/SYD.png"
              alt="Share Your Distance"
              width={164}
              height={52}
              className="w-[164px] h-auto"
            />
            <p className="mt-4 text-base leading-relaxed text-white/80 max-w-md">
              Share Your Distance is more than just a race. It is about sharing the effort, trusting your teammates, and pushing the distance together.
            </p>
          </div>
          <div className="sm:justify-self-end">
            <p className="eyebrow mb-4 text-white/55 sm:text-right">Kontak</p>
            <div className="flex flex-row gap-3 sm:justify-end">
              <a
                className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-[var(--lime)] hover:bg-white/10 hover:text-[var(--lime)]"
                href="mailto:hello@shareyourdistance.online"
                aria-label="Email hello@shareyourdistance.online"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </a>
              <a
                className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-[var(--lime)] hover:bg-white/10 hover:text-[var(--lime)]"
                href="https://wa.me/6285183081136?text=Halo%20Share%20Your%20Distance,%20saya%20mau%20bertanya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M12 2a9.8 9.8 0 0 0-8.4 14.8L2.4 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.5l.4-.4.2-.4c.1-.1 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.5.5.2.9.4 1.2.4.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1 0-.1-.2-.2-.4-.3Z" />
                </svg>
              </a>
              <a
                className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-[var(--lime)] hover:bg-white/10 hover:text-[var(--lime)]"
                href="https://instagram.com/sobatsabtu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @sobatsabtu"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r=".8" className="fill-current stroke-none" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/15 pt-5 flex flex-col sm:flex-row justify-between items-center text-xs tracking-wide text-white/50 gap-3">
          <p>Copyright © {currentYear} Sobat Sabtu · All Rights Reserved</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
