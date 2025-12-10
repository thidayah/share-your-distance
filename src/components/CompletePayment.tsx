import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Button from "./ui/Button";

interface orderData {
  unique_code: string;
  full_name: string;
  email: string;
  phone: string;
  total_amount: number | 0;
  category: { name: string }
}

interface CompletePaymentProps {
  data: orderData;
}

export default function CompletePayment({ data }: CompletePaymentProps) {
  const [timeLeft, setTimeLeft] = useState(600) // 10 menit dalam detik
  const [isExpired, setIsExpired] = useState(false)
  const qrisImage = '/images/payment-qris.jpeg' // Path public/images/qris/

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleConfirmPayment = () => {
    if (!data) return

    // Format message untuk WhatsApp
    const message = `Halo Share Your Distance! Saya sudah melakukan pembayaran untuk order ${data.unique_code}.

Data Peserta:
- Nama: ${data.full_name}
- Email: ${data.email}
- No. HP: ${data.phone}
- Event: ${data.category.name}
- Tanggal: Sabtu, 20 Desember 2025
- Jumlah: ${formatPrice(data.total_amount)}

Mohon konfirmasi pembayaran saya. Terima kasih!

(Lampirkan bukti pembayaran)`

    // Encode message URL
    const encodedMessage = encodeURIComponent(message)
    const whatsappNumber = '6285183081136'
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

  const handleRetryPayment = () => {
    // Reset timer and refresh page
    setTimeLeft(600)
    setIsExpired(false)
  }

  const formatPrice = (price: number | 0) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div>
      <div className=" flex flex-col md:flex-row space-y-2 md:justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">Complete Your Payment</h2>
        <div className=" py-2 px-5 text-xs md:text-base rounded-full text-blue-400 border border-blue-500/30 bg-blue-500/10 ">Order #{data.unique_code}</div>
      </div>
      <p className="text-neutral-400 text-xs md:text-sm mb-6">
        Scan the QRIS code below to pay for your registration. Payment must be completed before the timer expires.
      </p>

      <div className=" py-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Icon icon="heroicons:clock" className="w-5 h-5 text-zinc-500" />
            <span className="text-sm font-medium text-zinc-400">Payment Expires In</span>
          </div>

          <div className={` font-mono text-3xl md:text-5xl font-bold mb-4
            ${timeLeft <= 60 ? 'text-red-500 animate-pulse' : 'text-white'} `}
          >
            {formatTime(timeLeft)}
          </div>

          <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${timeLeft <= 60 ? 'bg-red-500' : 'bg-zinc-200'}`}
              style={{ width: `${(timeLeft / 600) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 py-8">
        <div className="text-center px-2 md:px-6">
          <div className="mb-4">
            <h3 className="font-heading text-2xl font-bold mb-2">QRIS Payment</h3>
            <p className="text-forest-300 text-xs md:text-sm">
              Scan with any Indonesian e-wallet or banking app
            </p>
          </div>

          {/* QRIS Image */}
          <div className="relative max-w-xs mx-auto mb-6">
            <div className="aspect-square bg-white rounded-2xl ">
              {qrisImage ? (
                <Image
                  src={qrisImage}
                  alt="QRIS Payment Code"
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-2xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <p className="text-forest-700">QRIS Image</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Amount */}
          <div className="mb-6">
            <p className="text-sm text-forest-400 mb-1">Payment Amount</p>
            <div className="font-heading text-3xl font-bold text-white">
              {formatPrice(data.total_amount)}
            </div>
          </div>
        </div>

        <div>
          <div className="border border-zinc-400 p-4 mb-8">
            <h3 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
              <Icon icon="heroicons:check-circle" className="h-5 w-5 text-zinc-500" />
              How to Pay
            </h3>

            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-500/20 text-zinc-500 text-xs font-bold flex-shrink-0">
                  1
                </span>
                <span className="text-zinc-200 text-xs md:text-sm">Open your mobile banking/e-wallet app</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-500/20 text-zinc-500 text-xs font-bold flex-shrink-0">
                  2
                </span>
                <span className="text-zinc-200 text-xs md:text-sm">Tap 'Scan QRIS' or 'QRIS Payment'</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-500/20 text-zinc-500 text-xs font-bold flex-shrink-0">
                  3
                </span>
                <span className="text-zinc-200 text-xs md:text-sm">Scan the QR code on the top</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-500/20 text-zinc-500 text-xs font-bold flex-shrink-0">
                  4
                </span>
                <span className="text-zinc-200 text-xs md:text-sm">Confirm payment amount matches</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-500/20 text-zinc-500 text-xs font-bold flex-shrink-0">
                  5
                </span>
                <span className="text-zinc-200 text-xs md:text-sm">Complete payment & screenshot receipt</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isExpired ? (
              <>
                <Button
                  onClick={handleConfirmPayment}
                  size="md"
                  className=" text-zinc-900 border-white w-full"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Icon icon="fa6-brands:whatsapp" className="h-5 w-5" />
                    Confirm via WhatsApp
                  </span>
                </Button>
              </>
            ) : (
              <>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-4">
                  <div className="flex items-center gap-2 justify-center text-red-400 mb-2">
                    <Icon icon="heroicons:exclamation-triangle" className="h-5 w-5" />
                    <span className="font-medium">Payment Expired</span>
                  </div>
                  <p className="text-xs md:text-sm text-forest-300">
                    The payment window has expired. Please generate a new QRIS code.
                  </p>
                </div>

                <Button
                  onClick={handleRetryPayment}
                  size="md"
                  className=" text-zinc-900 border-white w-full"
                >
                  Generate New QRIS Code
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}