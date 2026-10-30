
const strengthLevels = [
  { label: "Idling", bar: "bg-red-500", text: "text-red-500" },
  { label: "Cruising", bar: "bg-amber-500", text: "text-amber-600" },
  { label: "Sport mode", bar: "bg-lime-500", text: "text-lime-600" },
  { label: "Overdrive", bar: "bg-emerald-500", text: "text-emerald-600" },
];

const getStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;
  return score;
};

const PasswordMeter = ({ password }) => {
  if (!password) return null;
  const filled = Math.max(getStrength(password), 1);
  const level = strengthLevels[filled - 1];

  return (
    <div className="-mt-1" aria-live="polite">
      <div className="flex gap-1.5">
        {strengthLevels.map(({ label }, index) => (
          <span
            key={label}
            className={`h-1 flex-1 rounded-full transition-colors ${
              index < filled ? level.bar : "bg-neutral-200"
            }`}
          />
        ))}
      </div>
      <p className={`mt-1.5 text-[11px] font-medium ${level.text}`}>{level.label}</p>
    </div>
  );
};

export { PasswordMeter, getStrength };
