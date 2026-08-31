import { Link } from "react-router-dom";
import video from "../assets/videos/hero.mp4";
import poster from "../assets/images/poster.avif";

function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black flex items-end">
      {/* BG */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <video
            src={video}
            poster={poster}
            loop
            autoPlay
            muted
            playsInline
            preload="none"
            className="w-full h-full object-cover block"
          />
        </div>

        {/* Overlay Color - blurred/dark everywhere except a soft spotlight over the watermark */}
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-md mix-blend-multiply"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 55% 50% at 50% 40%, transparent 0%, transparent 30%, black 90%, black 100%)",
            maskImage:
              "radial-gradient(ellipse 55% 50% at 50% 40%, transparent 0%, transparent 30%, black 90%, black 100%)",
          }}
        />
      </div>

      {/* Container */}
      <div className="absolute bottom-0 left-0 right-0 z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-6 lg:px-16 pb-18 sm:pb-16 md:pb-16">
        <div className="flex flex-col md:flex-row md:items-stretch md:justify-between gap-6 sm:gap-8 md:gap-16 lg:gap-4">
          <h2 className="text-white text-left text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold leading-tight max-w-xl md:max-w-2xl">
            <span className="block whitespace-nowrap">Find Your Dream</span>
            <span className="block whitespace-nowrap">Car Today</span>
          </h2>

          <div className="flex flex-col justify-between gap-5 sm:gap-6 w-full md:max-w-sm">
            <p className="text-[#d9d9d9] text-lg sm:text-xl md:text-xl">
              Beyond the showroom. Levrix provides a seamless acquisition
              experience for the most discerning automotive enthusiasts.
            </p>

            {/* CTA Button */}
            <Link
              to="/contact"
              className="group relative inline-flex w-fit items-center justify-center overflow-hidden rounded-md bg-[#db0404] px-6 sm:px-8 py-3.5 sm:py-[18px] text-white shadow-[0_0.6px_0.6px_rgba(0,0,0,0.13),0_2.3px_2.3px_rgba(0,0,0,0.13),0_10px_10px_rgba(0,0,0,0.13)] transition-colors hover:bg-[#c00303]"
            >
              <span className="font-manrope text-sm sm:text-[18px] font-normal uppercase tracking-[0.02em] leading-[1.2em]">
                Book a Test Drive
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute left-1/2 -translate-x-1/2 top-32 sm:top-32 md:top-38 z-0 w-full flex justify-center pointer-events-none select-none px-4">
        <h1 className="font-['Orbitron',_sans-serif] font-bold bg-gradient-to-b from-white from-0% via-[#d9d9d9] via-35% via-[#8a8a8a]/50 via-65% to-transparent to-85% bg-clip-text text-transparent text-center leading-none tracking-[-0.02em] text-[20vw] sm:text-[18vw] md:text-[20vw] lg:text-[18vw] xl:text-[16vw]">
          Levrix
        </h1>
      </div>
    </section>
  );
}

export default Hero;