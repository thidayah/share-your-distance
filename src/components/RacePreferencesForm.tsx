interface RacePreferencesData {
  tshirtSize: string;
  runningExperience: string;
}

interface RacePreferencesFormProps {
  data: RacePreferencesData;
  onChange: (data: Partial<RacePreferencesData>) => void;
}

const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const experienceLevels = [
  'First Time',
  'Beginner (1-5 races)',
  'Intermediate (6-15 races)',
  'Advanced (16+ races)',
  'Professional'
];

export default function RacePreferencesForm({ data, onChange }: RacePreferencesFormProps) {

  const baseClasses = "w-full bg-zinc-800 border border-zinc-600 px-4 py-3 text-white focus:border-zinc-100 focus:outline-none transition-colors"

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Race Preferences</h2>

      <div className="space-y-6">
        {/* T-shirt Size */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">
            T-shirt Size *
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {tshirtSizes.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => onChange({ tshirtSize: size })}
                className={`py-3 rounded-lg border-2 text-center transition-all cursor-pointer ${data.tshirtSize === size
                    ? 'border-zinc-100 bg-zinc-500 text-zinc-100'
                    : 'border-zinc-600 bg-zinc-800 text-zinc-300 hover:border-zinc-500'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Running Experience */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Running Experience
          </label>
          <div className={baseClasses}>
            <select
              value={data.runningExperience}
              onChange={(e) => onChange({ runningExperience: e.target.value })}
              className=" focus:outline-none w-full bg-zinc-800"
            >
              <option value="">Select your experience level</option>
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}