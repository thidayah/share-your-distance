// src/app/payment/failed/page.tsx
'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import Template from "@/components/layout/Template";

export default function PaymentFailedPage() {
  return (
    <Template>
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-950 flex items-center justify-center py-24">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          {/* Failed Icon */}
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon icon="mdi:close-circle" className="w-12 h-12 text-red-400" />
          </div>

          {/* Failed Message */}
          <h1 className="text-4xl font-bold text-white mb-4">Payment Failed</h1>
          <p className="text-lg text-zinc-400 mb-6">
            {/* We couldn't process your payment. Don't worry, your registration is still saved. */}
            We couldn't process your payment. Unfortunately, your registration could not be saved. Please register again to proceed.
          </p>

          {/* Possible Reasons */}
          <div className="border border-zinc-700 p-6 mb-8 text-left">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              {/* <Icon icon="mdi:alert-circle" className="w-6 h-6 mr-3 text-orange-400" /> */}
              Common Reasons
            </h2>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start">
                <Icon icon="mdi:credit-card-off" className="w-5 h-5 text-zinc-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>Insufficient funds or card declined</span>
              </li>
              <li className="flex items-start">
                <Icon icon="mdi:clock-alert" className="w-5 h-5 text-zinc-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>Payment timeout or session expired</span>
              </li>
              <li className="flex items-start">
                <Icon icon="mdi:connection" className="w-5 h-5 text-zinc-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>Technical issues with payment gateway</span>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="bg-blue-500/10 border border-blue-500/30 p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">Try These Solutions</h3>
            <div className="space-y-2 text-blue-200 text-sm text-left">
              <p>• Use a different payment method (bank transfer, e-wallet)</p>
              <p>• Ensure your card has sufficient funds</p>
              <p>• Check if your card supports online transactions</p>
              <p>• Wait a few minutes and try again</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/category"
              className="bg-zinc-500 text-white px-8 py-3 rounded-full hover:bg-zinc-600 transition-colors font-semibold inline-flex items-center justify-center"
            >
              <Icon icon="mdi:refresh" className="w-5 h-5 mr-2" />
              Register Again
            </Link>
            <Link
              href="/contact"
              className="border-2 border-zinc-500 text-zinc-500 px-8 py-3 rounded-full hover:bg-zinc-500 hover:text-white transition-colors font-semibold inline-flex items-center justify-center"
            >
              <Icon icon="mdi:help-circle" className="w-5 h-5 mr-2" />
              Contact Support
            </Link>
          </div>

          {/* Registration Safety */}
          {/* <div className="mt-8 p-4 bg-neutral-800/50 rounded-lg">
            <p className="text-neutral-400 text-sm">
              Your registration details are saved. You have 24 hours to complete payment.
            </p>
          </div> */}
        </div>
      </div>
    </Template>
  );
}