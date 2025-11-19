// src/app/payment/pending/page.tsx
'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import Template from "@/components/layout/Template";

export default function PaymentPendingPage() {
  return (
    <Template>
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-950 flex items-center justify-center py-24">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          {/* Pending Icon */}
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon icon="mdi:clock-outline" className="w-12 h-12 text-yellow-400" />
          </div>

          {/* Pending Message */}
          <h1 className="text-4xl font-bold text-white mb-4">Payment Pending</h1>
          <p className="text-lg text-neutral-400 mb-6">
            Your bank transfer has been initiated. Please complete the payment within 24 hours.
          </p>

          {/* Instructions */}
          <div className="border border-zinc-700 p-6 mb-8 text-left">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              {/* <Icon icon="mdi:bank-transfer" className="w-6 h-6 mr-3 text-green-400" /> */}
              Next Steps
            </h2>
            <ul className="space-y-3 text-neutral-300">
              <li className="flex items-start">
                <Icon icon="mdi:numeric-1-circle" className="w-5 h-5 text-zinc-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>Complete the bank transfer using the virtual account provided</span>
              </li>
              <li className="flex items-start">
                <Icon icon="mdi:numeric-2-circle" className="w-5 h-5 text-zinc-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>Payment will be verified automatically within 1-2 hours</span>
              </li>
              <li className="flex items-start">
                <Icon icon="mdi:numeric-3-circle" className="w-5 h-5 text-zinc-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>Confirmation email will be sent once payment is confirmed</span>
              </li>
            </ul>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-300 mb-3">Important</h3>
            <div className="space-y-2 text-yellow-200 text-sm text-left">
              <p>• Complete payment within 24 hours to secure your registration</p>
              <p>• Use the exact amount shown during payment</p>
              <p>• Keep your transaction receipt for reference</p>
              <p>• Contact your bank if transfer issues occur</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-zinc-500 text-white px-8 py-3 rounded-full hover:bg-zinc-600 transition-colors font-semibold inline-flex items-center justify-center"
            >
              <Icon icon="mdi:home" className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="border-2 border-zinc-500 text-zinc-500 px-8 py-3 rounded-full hover:bg-zinc-500 hover:text-white transition-colors font-semibold inline-flex items-center justify-center"
            >
              <Icon icon="mdi:help-circle" className="w-5 h-5 mr-2" />
              Need Help?
            </Link>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-neutral-800/50 rounded-lg">
            <p className="text-neutral-400 text-sm">
              Kindly check your email inbox to complete the payment process before it expires.
            </p>
          </div>
        </div>
      </div>
    </Template>
  );
}