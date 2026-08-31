export default function Contact() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-4xl text-brand-white">Contact</h2>

      <form className="mt-8 max-w-md space-y-4">
        <input
          type="email"
          placeholder="Email address"
          className="w-full rounded-md border border-border-subtle bg-card px-4 py-3 font-sans text-brand-white placeholder:text-brand-gray focus:border-brand-red-bright focus:outline-none"
        />
        <textarea
          placeholder="Message"
          rows={4}
          className="w-full rounded-md border border-border-subtle bg-card px-4 py-3 font-sans text-brand-white placeholder:text-brand-gray focus:border-brand-red-bright focus:outline-none"
        />
        <button className="rounded-md bg-brand-red px-6 py-3 font-sans font-semibold text-brand-white transition-colors hover:bg-brand-red-bright">
          Send message
        </button>
      </form>
    </section>
  );
}
