export default function VideoShowcase() {
  return (
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
      {/* Swap this <img> for a real <video autoPlay muted loop playsInline> */}
      <img
        src="https://placehold.co/1600x900/0a0a0a/1a1a1a?text=Showcase+Video"
        alt="Levrix showcase"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/40" />
    </section>
  )
}
