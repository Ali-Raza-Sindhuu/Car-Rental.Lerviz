import { Link } from "react-router-dom";
import {  ScanHeart, CarTaxiFront, HeartHandshake } from "lucide-react";

/** Reusable rolling/swap-up text for the outline button, matching Hero's CTA style */
function RollingText({ text }) {
  return (
    <span className="relative inline-block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full">
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0"
      >
        {text}
      </span>
    </span>
  );
}

const FEATURES = [
  {
    icon: ScanHeart,
    title: "Precision Selection",
    description:
      "Every car is handpicked to meet high standards of quality, performance, and design.",
  },
  {
    icon: CarTaxiFront,
    title: "Seamless Experience",
    description:
      "From browsing to purchase, every step is smooth, clear, and stress-free.",
  },
  {
    icon: HeartHandshake,
    title: "Trusted Process",
    description:
      "We prioritize honesty, transparency, and long-term customer satisfaction.",
  },
];

function About() {
  return (
    <section className="relative w-full bg-black px-6 md:px-12 lg:px-16 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Text + CTA */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-left">
              More Than a Showroom— A Destination for True Driving
              Enthusiasts
            </h3>
            <p className="text-[#d9d9d9] text-base md:text-lg text-left max-w-lg">
              Levrix redefines the car buying experience through curated
              vehicles, refined presentation, and a commitment to excellence.
            </p>

            <Link
              to="/inventory"
              className="group relative inline-flex w-fit items-center justify-center overflow-hidden rounded-md border border-white/80 px-8 py-[18px] text-white shadow-[0_0.6px_0.6px_rgba(0,0,0,0.13),0_2.3px_2.3px_rgba(0,0,0,0.13),0_10px_10px_rgba(0,0,0,0.13)] backdrop-blur-sm transition-colors hover:bg-white/5"
            >
              <span className="font-sans text-[18px] font-normal uppercase tracking-[0.02em] leading-[1.2em]">
                <RollingText text="Browse Inventory" />
              </span>
            </Link>
          </div>

          {/* Right: Image */}
          <div className="relative w-full aspect-[3/2] overflow-hidden rounded-md border border-white/10">
            <img
              src="https://framerusercontent.com/images/2NMueIpDVmXjmCiTJmY2fCC5FY.png"
              alt="Red McLaren in luxury showroom"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
              style={{ objectPosition: "50.6% 100%" }}
            />
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-14 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-md border border-white/10 p-6 md:p-7"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-600">
                <Icon className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-white text-base font-medium">{title}</p>
                <p className="text-[#d9d9d9] text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;