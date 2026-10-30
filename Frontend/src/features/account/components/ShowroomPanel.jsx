import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import Gauge from "@/features/account/components/Gauge";
import carImage from "@/assets/Hero_image.png";

const ShowroomPanel = ({ word, eyebrow, headline }) => (
  <aside className="relative h-64 overflow-hidden bg-neutral-950 sm:h-80 lg:h-auto lg:min-h-svh">
    <style>{`@keyframes roadMove{from{background-position:0 0}to{background-position:-80px 0}}`}</style>

    {/* Lighting */}
    <div className="absolute inset-0 bg-linear-to-b from-white/40 via-white/10 to-transparent blur-2xl [clip-path:polygon(8%_0,26%_0,16%_60%,-8%_60%)]" />
    <div className="absolute inset-0 bg-linear-to-b from-[#f05a1a]/70 via-[#f05a1a]/25 to-transparent blur-2xl [clip-path:polygon(70%_0,92%_0,80%_75%,45%_75%)]" />
    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_100%,rgba(240,90,26,0.45),transparent_70%)]" />

    {/* Logo */}
    <Link
      to="/"
      aria-label="REVEX home"
      className="absolute top-5 left-5 z-30 text-lg font-extrabold tracking-tight text-white lg:top-10 lg:left-12"
    >
      REVEX
    </Link>

    {/* Headline (desktop) */}
    <div className="absolute top-28 left-12 z-30 hidden max-w-xs lg:block">
      <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-white/70 uppercase">
        <span className="size-1.5 rounded-full bg-[#f05a1a]" />
        {eyebrow}
      </p>
      <p className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight text-white">
        {headline}
      </p>
    </div>

    {/* Outlined word behind the car */}
    <p
      aria-hidden="true"
      className="absolute inset-x-0 top-[22%] z-10 text-center text-[22vw] leading-none font-extrabold tracking-tighter text-transparent uppercase select-none [-webkit-text-stroke:1.5px_rgba(255,255,255,0.35)] sm:text-[18vw] lg:top-[36%] lg:text-[9.5vw]"
    >
      {word}
    </p>

    {/* Car */}
    <img
      src={carImage}
      alt=""
      className="absolute bottom-0 left-1/2 z-20 w-[78%] max-w-[440px] -translate-x-1/2 lg:bottom-[9%] lg:left-[-4%] lg:w-[108%] lg:max-w-none lg:translate-x-0"
    />

    {/* Road */}
    <div className="absolute inset-x-0 bottom-0 z-10 hidden h-[9%] bg-neutral-900 lg:block">
      <div
        className="absolute inset-x-0 top-1/2 h-[3px] animate-[roadMove_1.2s_linear_infinite] motion-reduce:animate-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.55) 0 40px, transparent 40px 80px)",
        }}
      />
    </div>

    {/* HUD (desktop) */}
    <div className="absolute top-10 right-10 z-30 hidden flex-col items-end gap-3 lg:flex">
      <Gauge />
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/80 backdrop-blur-md">
        <Star className="size-3 fill-[#f05a1a] text-[#f05a1a]" />
        4.9 verified reviews
      </div>
    </div>
  </aside>
);

export default ShowroomPanel;
