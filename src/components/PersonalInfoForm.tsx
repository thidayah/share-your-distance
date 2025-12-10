import { toast } from "react-toastify";
import { TypesCategory } from "@/types/database";

interface PersonalInfoData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  instagram: string;
}

interface PersonalInfoFormProps {
  data: PersonalInfoData;
  onChange: (data: Partial<PersonalInfoData>) => void;
  category?: TypesCategory;
}

export default function PersonalInfoForm({ data, onChange, category }: PersonalInfoFormProps) {
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

    // Validate age requirements
    if (date) {
      const age = calculateAge(date);
      if (category?.min_age && age < category.min_age) {
        toast.warning(`Minimum age for this category is ${category.min_age}`);
      }
      if (category?.max_age && age > category.max_age) {
        toast.warning(`Maximum age for this category is ${category.max_age}`);
      }
    }
  };

  const baseClasses = "text-sm w-full bg-zinc-800 border border-zinc-600 px-4 py-3 text-white focus:border-zinc-100 focus:outline-none transition-colors"

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Personal Information</h2>

      {category?.health_warning && (
        <div className="bg-orange-500/20 border border-orange-500/30 p-4 mb-6">
          <div className="flex items-start">
            <span className="text-orange-400 mr-2">⚠️</span>
            <p className="text-orange-200 text-sm">{category.health_warning}</p>
          </div>
        </div>
      )}

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
            Whatsapp Number *
          </label>
          <input
            type="tel"
            required
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            className={baseClasses}
            placeholder="0812 3456 7890"
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
          {data.dateOfBirth && category?.min_age && (
            <p className="text-neutral-400 text-xs mt-1">
              Age: {calculateAge(data.dateOfBirth)} years
              {category.min_age && (
                <span> (Minimum: {category.min_age})</span>
              )}
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
            Instagram
          </label>
          <input
            type="text"
            required
            value={data.instagram}
            onChange={(e) => onChange({ instagram: e.target.value })}
            className={baseClasses}
            placeholder="@your_username"
          />
        </div>
      </div>
      
    </div>
  );
}