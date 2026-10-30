
const Field = ({ id, label, icon: Icon, error, endAdornment, ...inputProps }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-neutral-700">
      {label}
    </label>
    <div
      className={`group flex h-12 items-center gap-3 rounded-xl border bg-neutral-50 px-4 transition focus-within:border-[#f05a1a] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#f05a1a]/10 ${
        error ? "border-red-400" : "border-neutral-200"
      }`}
    >
      {Icon && (
        <Icon className="size-4 shrink-0 text-neutral-400 transition-colors group-focus-within:text-[#f05a1a]" />
      )}
      <input
        id={id}
        aria-invalid={Boolean(error)}
        className="h-full min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
        {...inputProps}
      />
      {endAdornment}
    </div>
    {error && <p className="mt-1.5 text-[11px] text-red-500">{error}</p>}
  </div>
);

export default Field;
