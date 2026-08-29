export default function Placeholder({ title = 'Coming Soon' }) {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-5 pt-32 pb-20">
      <div className="text-center">
        <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-wide2 mb-4">
          {title}
        </h1>
        <p className="text-mist">This page hasn't been built out yet.</p>
      </div>
    </section>
  )
}
