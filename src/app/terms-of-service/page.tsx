import Link from 'next/link';
import { Icon } from '@iconify/react';
import Template from "@/components/layout/Template";

export default function TermsOfService() {
  return (
    <Template>
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-950 py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-zinc-400 text-lg">
              Last updated: December 1, 2025
            </p>
          </div>

          <div className="border border-zinc-700 p-8">
            {/* Introduction */}
            <div className="mb-8">
              <p className="text-zinc-300 leading-relaxed">
                Welcome to Share Your Distance. By accessing our website and registering for our events,
                you agree to be bound by these Terms of Service. Please read them carefully.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {/* Acceptance of Terms */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:check-circle" className="w-6 h-6 mr-3 text-primary-400" />
                  1. Acceptance of Terms
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    By accessing and using the Share Your Distance website (the "Service"), you accept and
                    agree to be bound by the terms and provision of this agreement.
                  </p>
                  <p>
                    If you do not agree to abide by the above, please do not use this Service.
                  </p>
                </div>
              </section>

              {/* Registration and Accounts */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:account-plus" className="w-6 h-6 mr-3 text-primary-400" />
                  2. Registration and Accounts
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    <strong>2.1.</strong> You may be required to register with us to access certain features of the Service.
                  </p>
                  <p>
                    <strong>2.2.</strong> You must provide accurate, complete, and current registration information.
                  </p>
                  <p>
                    <strong>2.3.</strong> You are responsible for maintaining the confidentiality of your account information.
                  </p>
                </div>
              </section>

              {/* Event Participation */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:run-fast" className="w-6 h-6 mr-3 text-primary-400" />
                  3. Event Participation
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    <strong>3.1. Health and Fitness:</strong> You confirm that you are in good physical condition
                    and have no known medical reasons that would prevent your safe participation in the event.
                  </p>
                  <p>
                    <strong>3.2. Age Requirements:</strong> Participants must meet the minimum age requirements
                    specified for each race category.
                  </p>
                  <p>
                    <strong>3.3. Safety Rules:</strong> You agree to follow all safety instructions and event rules
                    provided by organizers and staff.
                  </p>
                </div>
              </section>

              {/* Payments and Refunds */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:cash" className="w-6 h-6 mr-3 text-primary-400" />
                  4. Payments and Refunds
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    <strong>4.1. Payment:</strong> All registration fees must be paid in full to secure your participation.
                  </p>
                  <p>
                    <strong>4.2. No Refunds:</strong> Registration fees are non-refundable under any circumstances,
                    including but not limited to personal injury, illness, or event cancellation due to force majeure.
                  </p>
                  <p>
                    <strong>4.3. Event Changes:</strong> We reserve the right to modify event dates, venues, or formats
                    due to unforeseen circumstances.
                  </p>
                </div>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:copyright" className="w-6 h-6 mr-3 text-primary-400" />
                  5. Intellectual Property
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    <strong>5.1. Content:</strong> All content on this website, including text, graphics, logos, and
                    images, is our property and protected by copyright laws.
                  </p>
                  <p>
                    <strong>5.2. Photo Release:</strong> By participating in our events, you grant us permission to use
                    photographs, videos, and other media containing your likeness for promotional purposes.
                  </p>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:shield-alert" className="w-6 h-6 mr-3 text-primary-400" />
                  6. Limitation of Liability
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    <strong>6.1.</strong> Participation in running events involves inherent risks including but not
                    limited to personal injury, property damage, and death.
                  </p>
                  <p>
                    <strong>6.2.</strong> You voluntarily assume all risks associated with event participation and
                    release Share Your Distance, its organizers, and sponsors from any liability.
                  </p>
                  <p>
                    <strong>6.3.</strong> Our total liability to you for any claim shall not exceed the registration
                    fee paid.
                  </p>
                </div>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:cancel" className="w-6 h-6 mr-3 text-primary-400" />
                  7. Termination
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    We may terminate or suspend your access to the Service immediately, without prior notice,
                    for conduct that we believe violates these Terms or is harmful to other users.
                  </p>
                </div>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:scale-balance" className="w-6 h-6 mr-3 text-primary-400" />
                  8. Governing Law
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of Indonesia,
                    without regard to its conflict of law provisions.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:email" className="w-6 h-6 mr-3 text-primary-400" />
                  9. Contact Information
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-primary-400">hello@shareyourdistance.id</p>
                    <p className="text-primary-400 mt-2">+62 123 4567 890</p>
                    <p className="text-zinc-400 text-sm mt-2">We typically respond within 24 hours.</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-zinc-700 text-center">
              <p className="text-zinc-400 text-sm">
                By using our Service, you acknowledge that you have read and understood these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Template>
  );
}