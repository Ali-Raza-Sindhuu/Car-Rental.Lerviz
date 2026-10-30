import ShowroomPanel from "@/features/account/components/ShowroomPanel";

const AuthShell = ({ word, eyebrow, headline, title, subtitle, children, footer }) => (
  <main className="grid min-h-svh bg-neutral-50 lg:grid-cols-[1.05fr_1fr]">
    <ShowroomPanel word={word} eyebrow={eyebrow} headline={headline} />

    <section className="relative z-30 -mt-8 flex items-center justify-center rounded-t-3xl bg-neutral-50 px-4 pt-8 pb-10 lg:mt-0 lg:rounded-none lg:p-12">
      <div className="w-full max-w-md rounded-3xl border border-neutral-100 bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
        <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-neutral-500 uppercase">
          <span className="size-1.5 rounded-full bg-[#f05a1a]" />
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">{subtitle}</p>
        )}
        <div className="mt-6">{children}</div>
        {footer && <p className="mt-6 text-center text-xs text-neutral-500">{footer}</p>}
      </div>
    </section>
  </main>
);

export default AuthShell;
