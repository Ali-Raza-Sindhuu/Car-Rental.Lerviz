import { Check } from "lucide-react";

const recoverySteps = ["Email", "Inbox", "New password"];

const RecoverySteps = ({ current }) => (
  <ol className="mb-6 flex items-center gap-2" aria-label="Recovery progress">
    {recoverySteps.map((label, index) => {
      const isDone = index < current;
      const isActive = index === current;
      return (
        <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
          <span
            className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
              isDone
                ? "bg-[#f05a1a] text-white"
                : isActive
                  ? "border-2 border-[#f05a1a] text-[#f05a1a]"
                  : "border border-neutral-300 text-neutral-400"
            }`}
          >
            {isDone ? <Check className="size-3" /> : index + 1}
          </span>
          <span
            className={`hidden text-[11px] sm:block ${
              isDone || isActive ? "text-neutral-900" : "text-neutral-400"
            }`}
          >
            {label}
          </span>
          {index < recoverySteps.length - 1 && <span className="h-px flex-1 bg-neutral-200" />}
        </li>
      );
    })}
  </ol>
);

export default RecoverySteps;
