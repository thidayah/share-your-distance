import { TypesCategory } from "@/types/database";

interface PersonalInfoData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  idNumber: string;
}

interface PersonalInfoFormProps {
  data: PersonalInfoData;
  onChange: (data: Partial<PersonalInfoData>) => void;
  category?: TypesCategory;
}

export default function PersonalInfoFormV1({ data, onChange }: PersonalInfoFormProps) {
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleDateChange = (date: string) => {
    onChange({ dateOfBirth: date });
  };

  const baseClasses = "w-full bg-zinc-800 border border-zinc-600 px-4 py-3 text-white focus:border-zinc-100 focus:outline-none transition-colors"

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={data.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            className={baseClasses}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className={baseClasses}
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            className={baseClasses}
            placeholder="+62 812 3456 7890"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            required
            value={data.dateOfBirth}
            onChange={(e) => handleDateChange(e.target.value)}
            className={baseClasses}
          />
          {data.dateOfBirth && (
            <p className="text-neutral-400 text-xs mt-1">
              Age: {calculateAge(data.dateOfBirth)} years
            </p>
          )}
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Gender *
          </label>
          <div className={baseClasses}>
            <select
              required
              value={data.gender}
              onChange={(e) => onChange({ gender: e.target.value })}
              className=" focus:outline-none w-full bg-zinc-800"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              {/* <option value="other">Prefer not to say</option> */}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Nationality *
          </label>
          <div className={baseClasses}>
          <select
            required
            value={data.nationality}
            onChange={(e) => onChange({ nationality: e.target.value })}
            className=" focus:outline-none w-full bg-zinc-800"
          >
            <option value="Indonesian">Indonesian</option>
            <option value="Other">Other</option>
          </select>
        </div>
        </div>
      </div>

      {data.nationality === 'Indonesian' && (
        <div className="mt-6">
          <label className="block text-white text-sm font-medium mb-2">
            ID Number (KTP) *
          </label>
          <input
            type="text"
            required
            value={data.idNumber}
            onChange={(e) => onChange({ idNumber: e.target.value })}
            className={baseClasses}
            placeholder="16-digit ID number"
            maxLength={16}
          />
        </div>
      )}
    </div>
  );
}