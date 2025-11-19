// src/app/payment/success/page.tsx
'use client';

import { Suspense, use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Template from "@/components/layout/Template";
import Loading from "@/components/ui/Loading";
import { useRouter } from "next/navigation";

interface ParamsTypes {
  order_id: string;
  status_code: string;
  transaction_status: string;
  action?: string;
}

export default function PaymentSuccessPage({ searchParams }: { searchParams: Promise<ParamsTypes> }) {
  const [countdown, setCountdown] = useState(10);
  const [isLoading, setLoading] = useState(true);
  const params = use(searchParams)

  // const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Countdown untuk auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // window.location.href = '/';
          router.push('/')
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading]);

  useEffect(() => {
    // let orderId = searchParams.get('order_id');
    // let statusCode = searchParams.get('status_code');
    // let transactionStatus = searchParams.get('transaction_status');
    // let orderId = params?.order_id    
    let statusCode = params?.status_code
    let transactionStatus = params?.transaction_status

    if (statusCode !== '200' && transactionStatus == 'pending') {
      setTimeout(() => {
        router.push('/payment/pending')
      }, 1000);
    } else {
      setLoading(false)
    }
  }, [router])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Template>
        {isLoading && <Loading />}

        {!isLoading &&
          <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-950 flex items-center justify-center py-24">
            <div className="container mx-auto px-6 max-w-3xl text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="mdi:check-circle" className="w-12 h-12 text-green-400" />
              </div>

              {/* Success Message */}
              <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
              <p className="text-lg text-zinc-400 mb-8">
                Thank you for your payment. You're officially registered for <span className=" text-zinc-200 font-semibold">Share Your Distance!</span>
              </p>

              {/* Next Steps */}
              <div className="border border-zinc-700 p-6 mb-8 text-left">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  {/* <Icon icon="mdi:email-fast" className="w-6 h-6 mr-3 text-primary-400" /> */}
                  What's Next?
                </h2>
                <ul className="space-y-3 text-zinc-300">
                  <li className="flex items-start">
                    <Icon icon="mdi:check" className="w-5 h-5 text-zinc-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Confirmation email with registration details will be sent shortly</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="mdi:calendar" className="w-5 h-5 text-zinc-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Pre-event information will be emailed 3 days before the race</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="mdi:run-fast" className="w-5 h-5 text-zinc-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Final instructions and bib number will be sent 1 day before the event</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="bg-zinc-500 text-white px-8 py-3 rounded-full hover:bg-zinc-600 transition-colors font-semibold inline-flex items-center justify-center"
                >
                  <Icon icon="mdi:run-fast" className="w-5 h-5 mr-2" />
                  Back to Home ({countdown})
                </Link>
                <Link
                  href="/faq"
                  className="border-2 border-zinc-500 text-zinc-500 px-8 py-3 rounded-full hover:bg-zinc-500 hover:text-white transition-colors font-semibold inline-flex items-center justify-center"
                >
                  {/* <Icon icon="mdi:chat-question" className="w-5 h-5 mr-2" /> */}
                  <Icon icon="mdi:help-circle" className="w-5 h-5 mr-2" />
                  View FAQ
                </Link>
              </div>

              {/* Support Info */}
              <div className="mt-8 p-4 bg-zinc-800/50 rounded-lg">
                <p className="text-zinc-400 text-sm">
                  Didn't receive confirmation email? Check spam folder or{' '}
                  <Link href="/contact" className="text-primary-400 hover:text-primary-300 underline">
                    contact support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        }
      </Template>
    </Suspense>
  );
}