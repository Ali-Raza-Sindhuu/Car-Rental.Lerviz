import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import img1 from "@/assets/sample_01.png";
import img2 from "@/assets/sample_001.png";
import showcase from "@/assets/showcase.png";
import CarouselArrows from "@/shared/CarouselArrows";
import { Reveal } from "@/shared/motion";
import SectionHeading, { Eyebrow } from "@/shared/SectionHeading";
import { btn, focusRing } from "@/shared/styles";
import { useCarousel } from "@/shared/useCarousel";

const stats = [
  { value: "450", unit: "HP", label: "Maximum Power" },
  { value: "3.8", unit: "s", label: "0–100 km/h" },
  { value: "580", unit: "km", label: "Estimated Range" },
];

const slides = [
  { id: 1, image: img1, alt: "Grey convertible sports car, front three-quarter view" },
  { id: 2, image: img2, alt: "Close-up of the sports car headlight and bonnet" },
  { id: 3, image: "/image/showcase/car-3.jpg", alt: "Sports car side profile" },
  { id: 4, image: "/image/showcase/car-4.jpg", alt: "Sports car interior" },
];

// How far down the section the background photo reaches
const BACKGROUND_END = "bottom-56 md:bottom-72";

const ShowcaseSection = () => {
  const carousel = useCarousel({ gap: 12 });

  return (
    <section
      id="showcase"
      aria-labelledby="showcase-title"
      className="relative bg-neutral-50 px-4 pb-10 pt-16 md:px-12 md:pb-16 md:pt-24"
    >
      <div
        aria-hidden="true"
        style={{ backgroundImage: `url(${showcase})` }}
        className={`absolute inset-x-0 top-0 bg-cover bg-center ${BACKGROUND_END}`}
      />

      <div className="relative mx-auto max-w-[1400px]">
        <SectionHeading
          id="showcase-title"
          tone="dark"
          align="center"
          eyebrow="Showcase"
          eyebrowClassName="text-white/85"
          lead={["Step inside"]}
          muted={["the next generation"]}
          body="Explore every detail, from bold exterior lines to a refined interior built around you."
          className="max-w-xl"
        />

        <Reveal
          y={32}
          className="mt-12 overflow-hidden rounded-3xl bg-white p-4 md:p-6"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Eyebrow>Luxury</Eyebrow>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-neutral-950">
                Built for the road.
              </h3>
              <p className="mt-1 text-xs text-neutral-600">
                <span className="font-semibold text-neutral-950">567</span>{" "}
                vehicles available now, starting at{" "}
                <span className="font-semibold text-neutral-950">$89,900</span>
              </p>
              <Link to="/inventory" className={`group mt-5 ${btn.primary}`}>
                Discover
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <dl className="grid grid-cols-3 gap-6 lg:gap-20 lg:pr-4 lg:pt-3">
              {stats.map(({ value, unit, label }) => (
                <div key={label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-xs text-neutral-600">{label}</dt>
                  <dd className="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
                    {value}
                    {unit === "s" ? "" : " "}
                    <span className="text-[#f05a1a]">{unit}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Slider bleeds off the right edge of the card */}
          <div
            {...carousel.trackProps}
            role="region"
            aria-label="Vehicle gallery"
            className={`-mr-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth rounded-xl pr-4 [scrollbar-width:none] md:-mr-6 md:pr-6 [&::-webkit-scrollbar]:hidden ${focusRing}`}
          >
            {slides.map(({ id, image, alt }) => (
              <div
                key={id}
                className="aspect-[16/9] w-[88%] shrink-0 snap-start overflow-hidden rounded-xl bg-neutral-900 md:w-[68%]"
              >
                <img
                  src={image}
                  alt={alt}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-1">
              {slides.map(({ id }, index) => (
                <button
                  key={id}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === carousel.index}
                  onClick={() => carousel.goTo(index)}
                  className={`group rounded py-2 ${focusRing}`}
                >
                  <span
                    className={`block h-[3px] w-9 rounded-full transition-colors duration-300 ${
                      index === carousel.index
                        ? "bg-[#f05a1a]"
                        : "bg-neutral-300 group-hover:bg-neutral-400"
                    }`}
                  />
                </button>
              ))}
            </div>

            <CarouselArrows carousel={carousel} label="slide" />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ShowcaseSection;
