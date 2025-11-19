// src/app/register/components/EmergencyContactForm.tsx
interface EmergencyContactData {
  contactName: string;
  contactPhone: string;
  contactRelationship: string;
  medicalConditions: string;
  allergies: string;
}

interface EmergencyContactFormProps {
  data: EmergencyContactData;
  onChange: (data: Partial<EmergencyContactData>) => void;
}

const relationships = [
  'Parent',
  'Spouse',
  'Sibling',
  'Friend',
  'Colleague',
  'Other'
];

export default function EmergencyContactForm({ data, onChange }: EmergencyContactFormProps) {
  const baseClasses = "w-full bg-zinc-800 border border-zinc-600 px-4 py-3 text-white focus:border-zinc-100 focus:outline-none transition-colors"
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Emergency Contact & Medical Information</h2>

      <div className="space-y-6">
        {/* Emergency Contact Section */}
        <div className="bg-zinc-900 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Emergency Contact Person</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                required
                value={data.contactName}
                onChange={(e) => onChange({ contactName: e.target.value })}
                className={baseClasses}
                placeholder="Full name of emergency contact"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={data.contactPhone}
                onChange={(e) => onChange({ contactPhone: e.target.value })}
                className={baseClasses}
                placeholder="+62 812 3456 7890"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-white text-sm font-medium mb-2">
                Relationship *
              </label>
              <div className={baseClasses}>
                <select
                  required
                  value={data.contactRelationship}
                  onChange={(e) => onChange({ contactRelationship: e.target.value })}
                  className=" focus:outline-none w-full bg-zinc-800"
                >
                  <option value="">Select relationship</option>
                  {relationships.map(relationship => (
                    <option key={relationship} value={relationship}>
                      {relationship}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Information Section */}
        <div className="bg-zinc-900 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Medical Information</h3>
          <p className="text-neutral-400 text-sm mb-4">
            This information is crucial for your safety during the event. All information will be kept confidential.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Known Medical Conditions
              </label>
              <textarea
                value={data.medicalConditions}
                onChange={(e) => onChange({ medicalConditions: e.target.value })}
                rows={3}
                className={baseClasses}
                placeholder="E.g., asthma, heart condition, diabetes, hypertension, etc."
              />
              <p className="text-neutral-400 text-xs mt-1">
                Please disclose any medical conditions that might affect your participation
              </p>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Allergies
              </label>
              <textarea
                value={data.allergies}
                onChange={(e) => onChange({ allergies: e.target.value })}
                rows={2}
                className={baseClasses}
                placeholder="E.g., food allergies, medication allergies, etc."
              />
              <p className="text-neutral-400 text-xs mt-1">
                List any allergies that medical staff should be aware of
              </p>
            </div>
          </div>
        </div>

        {/* Health Declaration */}
        <div className="bg-orange-500/10 border border-orange-500/30 p-4">
          <div className="flex items-start">
            <span className="text-orange-400 mr-3 text-xl">⚠️</span>
            <div>
              <h4 className="text-orange-300 font-semibold mb-2">Health Declaration</h4>
              <p className="text-orange-200 text-sm">
                I declare that I am in good physical condition and have sufficiently trained for this event.
                I understand the risks involved in participating and assume full responsibility for my health and safety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}