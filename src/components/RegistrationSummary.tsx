// src/app/register/components/RegistrationSummary.tsx
// import { RaceCategory } from '@/data/raceCategories';
// import Button from '@/components/ui/Button';
import { Icon } from '@iconify/react';
import Link from "next/link";
import { TypesCategory } from "@/types/database";

interface FormData {
  personal: any;
  emergency: any;
}

interface RegistrationSummaryProps {
  data: FormData;
  // category: RaceCategory;
  category?: TypesCategory;
  isCheck: boolean;  
  onCheck: () => void;
  onSubmit: () => void;
}

export default function RegistrationSummary({ data, category, isCheck, onCheck, onSubmit }: RegistrationSummaryProps) {
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    return today.getFullYear() - birth.getFullYear();
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Registration Summary</h2>

      <div className="space-y-6">
        {/* Race Category Summary */}
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">Race Category</h3>
          <div className="flex flex-col md:flex-row space-y-4 justify-between items-start">
            <div>
              <h4 className="text-white font-bold md:text-xl">{category?.name}</h4>
              <p className="text-blue-200 mt-2">{category?.distance}</p>
              <ul className="text-blue-200 text-xs md:text-sm mt-2 space-y-1">
                {category?.category_features?.map((f, index) => (
                  <li key={index}>• {f.feature}</li>
                ))}
              </ul>
            </div>
            <div className="text-right">
              <div className="text-xl md:text-2xl font-bold text-white">
                IDR {category?.price.toLocaleString()}
              </div>
              {/* <button
                onClick={() => window.history.back()}
                className="text-primary-400 hover:text-primary-300 text-sm underline mt-2 cursor-pointer"
              >
                Change category
              </button> */}
            </div>
          </div>
        </div>

        {/* Personal Information Summary */}
        <div className="border border-zinc-700 p-4 md:p-6">
          <h3 className="md:text-lg font-semibold text-white mb-4 flex items-center">
            <Icon icon="mdi:account-outline" className="w-5 h-5 mr-2" />
            Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-zinc-300">Full Name:</span>
              <p className="text-white font-medium">{data.personal.fullName}</p>
            </div>
            <div>
              <span className="text-zinc-300">Email:</span>
              <p className="text-white font-medium">{data.personal.email}</p>
            </div>
            <div>
              <span className="text-zinc-300">Phone:</span>
              <p className="text-white font-medium">{data.personal.phone}</p>
            </div>
            <div>
              <span className="text-zinc-300">Age:</span>
              <p className="text-white font-medium">
                {data.personal.dateOfBirth ? `${calculateAge(data.personal.dateOfBirth)} years` : '-'}
              </p>
            </div>
            <div>
              <span className="text-zinc-300">Gender:</span>
              <p className="text-white font-medium capitalize">{data.personal.gender || '-'}</p>
            </div>
            <div>
              <span className="text-zinc-300">Instagram:</span>
              <p className="text-white font-medium">{data.personal.instagram || '-'}</p>
            </div>
          </div>
        </div>

        {/* Emergency Contact Summary */}
        <div className="border border-zinc-700 p-4 md:p-6">
          <h3 className="md:text-lg font-semibold text-white mb-4 flex items-center">
            <Icon icon="mdi:card-account-phone" className="w-5 h-5 mr-2" />
            Emergency Contact
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-zinc-300">Contact Person:</span>
              <p className="text-white font-medium">{data.emergency.contactName}</p>
            </div>
            <div>
              <span className="text-zinc-300">Phone:</span>
              <p className="text-white font-medium">{data.emergency.contactPhone}</p>
            </div>
            <div>
              <span className="text-zinc-300">Relationship:</span>
              <p className="text-white font-medium">{data.emergency.contactRelationship}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-zinc-300">Medical Conditions:</span>
              <p className="text-white font-medium">
                {data.emergency.medicalConditions || 'None declared'}
              </p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-zinc-800 p-4 md:p-6">
          <h3 className="md:text-lg font-semibold text-white mb-4">Terms & Conditions</h3>

          {/* <div className="space-y-3 text-sm text-zinc-300 max-h-40 overflow-y-auto mb-4 p-3 bg-zinc-900 rounded">
            <p><strong>1. Registration & Payment:</strong> Registration is confirmed only after full payment is received.</p>
            <p><strong>2. Cancellation Policy:</strong> No refunds will be provided for cancellations.</p>
            <p><strong>3. Event Changes:</strong> Organizers reserve the right to modify the event schedule or cancel due to unforeseen circumstances.</p>
            <p><strong>4. Health & Safety:</strong> Participants must ensure they are physically fit to participate.</p>
            <p><strong>5. Liability:</strong> Participants participate at their own risk and must follow all safety instructions.</p>
            <p><strong>6. Photo Release:</strong> Participants grant permission for use of photos/videos for promotional purposes.</p>
            <p><strong>7. Bib Numbers:</strong> Bib numbers are non-transferable and must be visible during the race.</p>
          </div> */}

          {/* Simplified Key Points */}
          <div className="space-y-2 text-xs md:text-sm text-neutral-300 mb-4 p-3 bg-zinc-900 rounded">
            <p>• <span className=" font-bold">Registration</span> is confirmed only after full payment</p>
            <p>• <span className=" font-bold">No refunds</span> for cancellations under any circumstances</p>
            <p>• <span className=" font-bold">Participants</span> must follow all safety instructions</p>
            <p>• <span className=" font-bold">Event</span> may be modified due to unforeseen circumstances</p>
            <p>• <span className=" font-bold">Photo</span> release for promotional purposes</p>
          </div>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              required
              className="mt-1 w-4 h-4 text-primary-500 bg-zinc-800 border-zinc-600 rounded focus:ring-blue-500 focus:ring-offset-zinc-800 cursor-pointer"
              checked={isCheck}
              onChange={onCheck}
            />
            {/* <span className="text-white text-sm">
              I have read and agree to the Terms & Conditions, and confirm that all information provided is accurate.
            </span> */}
            <span className="text-white text-xs md:text-sm cursor-pointer">
              I understand and agree to these terms and the full{' '}
              <Link href="/terms-of-service" className="text-primary-400 hover:text-primary-300 underline font-medium" target="_blank">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy-policy" className="text-primary-400 hover:text-primary-300 underline font-medium" target="_blank">
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>

        {/* Final CTA */}
        {/* <div className="text-center p-6 border-2 border-dashed border-green-500/30 rounded-lg bg-green-500/10">
          <h3 className="text-green-400 font-semibold text-lg mb-2">Ready to Complete Registration!</h3>
          <p className="text-green-300 text-sm mb-4">
            You're almost there! Click the button below to proceed to payment.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={onSubmit}
            // className="bg-green-500 hover:bg-green-600 px-8"
            className=" text-zinc-900 border-white"
          >
            <Icon icon="mdi:lock-check" className="w-5 h-5 mr-2" />
            Proceed to Secure Payment
          </Button>
        </div> */}
      </div>
    </div>
  );
}