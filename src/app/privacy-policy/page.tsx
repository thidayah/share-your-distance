// src/app/privacy/page.tsx
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Template from "@/components/layout/Template";

export default function PrivacyPolicy() {
  return (
    <Template>
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-950 py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-zinc-400 text-lg">
              Last updated: December 1, 2025
            </p>
          </div>

          <div className="border border-zinc-700 p-8">
            {/* Introduction */}
            <div className="mb-8">
              <p className="text-zinc-300 leading-relaxed">
                At Share Your Distance, we are committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use our
                service and participate in our events.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {/* Information We Collect */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:information" className="w-6 h-6 mr-3 text-zinc-400" />
                  1. Information We Collect
                </h2>
                <div className="text-zinc-300 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">1.1 Personal Information</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Full name, email address, and phone number</li>
                      <li>Date of birth and gender</li>
                      <li>Identification numbers (KTP for Indonesian citizens)</li>
                      <li>Emergency contact information</li>
                      <li>Medical conditions and allergies (for safety purposes)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">1.2 Payment Information</h3>
                    <p>
                      We collect payment details through secure third-party payment processors (Xendit/Midtrans).
                      We do not store your credit card or bank account information on our servers.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">1.3 Technical Information</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>IP address and browser type</li>
                      <li>Device information and operating system</li>
                      <li>Usage data and website interaction patterns</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:chart-box" className="w-6 h-6 mr-3 text-zinc-400" />
                  2. How We Use Your Information
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    <strong>2.1.</strong> To process your event registration and manage your participation
                  </p>
                  <p>
                    <strong>2.2.</strong> To communicate important event information, updates, and safety notices
                  </p>
                  <p>
                    <strong>2.3.</strong> To provide emergency medical services if needed during events
                  </p>
                  <p>
                    <strong>2.4.</strong> To improve our services and user experience
                  </p>
                  <p>
                    <strong>2.5.</strong> To comply with legal obligations and prevent fraud
                  </p>
                </div>
              </section>

              {/* Data Sharing */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:share" className="w-6 h-6 mr-3 text-zinc-400" />
                  3. Data Sharing and Disclosure
                </h2>
                <div className="text-zinc-300 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">3.1 Service Providers</h3>
                    <p>
                      We share information with trusted third parties who assist us in operating our website,
                      conducting our business, or servicing you, such as:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Payment processors (Xendit, Midtrans)</li>
                      <li>Email service providers</li>
                      <li>Event timing and result services</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">3.2 Legal Requirements</h3>
                    <p>
                      We may disclose your information where required by law or to protect our rights,
                      property, or safety, or that of others.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">3.3 Medical Emergencies</h3>
                    <p>
                      In case of medical emergencies during events, we may share relevant medical information
                      with emergency services and medical personnel.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:lock" className="w-6 h-6 mr-3 text-zinc-400" />
                  4. Data Security
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    We implement appropriate technical and organizational security measures to protect your
                    personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <p>
                    However, no method of transmission over the Internet or electronic storage is 100% secure,
                    and we cannot guarantee absolute security.
                  </p>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:account-cog" className="w-6 h-6 mr-3 text-zinc-400" />
                  5. Your Rights
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    <strong>5.1 Access:</strong> You have the right to request access to the personal information we hold about you.
                  </p>
                  <p>
                    <strong>5.2 Correction:</strong> You may update or correct your information by contacting us.
                  </p>
                  <p>
                    <strong>5.3 Deletion:</strong> You can request deletion of your personal information, subject to legal obligations.
                  </p>
                  <p>
                    <strong>5.4 Objection:</strong> You may object to certain processing of your personal information.
                  </p>
                  <p>
                    To exercise these rights, please contact us at hello@shareyourdistance.online.
                  </p>
                </div>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:database" className="w-6 h-6 mr-3 text-zinc-400" />
                  6. Data Retention
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    We retain your personal information for as long as necessary to fulfill the purposes
                    outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                  </p>
                  <p>
                    Event registration data is typically retained for 3 years for legal and administrative purposes.
                  </p>
                </div>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:cookie" className="w-6 h-6 mr-3 text-zinc-400" />
                  7. Cookies and Tracking
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    We use cookies and similar tracking technologies to track activity on our Service and
                    hold certain information to improve user experience.
                  </p>
                  <p>
                    You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                  </p>
                </div>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:baby" className="w-6 h-6 mr-3 text-zinc-400" />
                  8. Children's Privacy
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    Our Service is not intended for children under 12 years of age. We do not knowingly
                    collect personal information from children under 12.
                  </p>
                  <p>
                    For race categories with minimum age requirements, parental consent is required for
                    participants under 18 years of age.
                  </p>
                </div>
              </section>

              {/* Changes to Policy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:update" className="w-6 h-6 mr-3 text-zinc-400" />
                  9. Changes to This Privacy Policy
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes
                    by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                  <p>
                    You are advised to review this Privacy Policy periodically for any changes.
                  </p>
                </div>
              </section>

              {/* Contact Us */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Icon icon="mdi:email" className="w-6 h-6 mr-3 text-zinc-400" />
                  10. Contact Us
                </h2>
                <div className="text-zinc-300 space-y-3">
                  <p>
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-zinc-400">Email: hello@shareyourdistance.online</p>
                    <p className="text-zinc-400 mt-2">Phone: +62 123 4567 890</p>
                    <p className="text-zinc-400 text-sm mt-2">
                      For privacy-specific concerns, please include "Privacy Policy" in the subject line.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-zinc-700 text-center">
              <p className="text-zinc-400 text-sm">
                By using our Service, you consent to the terms of this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Template>
  );
}