export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-brand-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-brand-gray sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans">
          &copy; {new Date().getFullYear()} Levrix. All rights reserved.
        </p>
        <p className="font-sans">
          Built with <span className="text-brand-red-bright">precision</span>.
        </p>
      </div>
    </footer>
  );
}
