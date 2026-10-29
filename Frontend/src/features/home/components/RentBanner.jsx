import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import image from "@/assets/rent_car.png";
import { Reveal } from "@/shared/motion";
import SectionHeading from "@/shared/SectionHeading";
import { btn } from "@/shared/styles";

// Rating squares: three solid, then fading out
const RATING_SQUARES = ["bg-white", "bg-white", "bg-white", "bg-white/60", "bg-white/30"];

const RentBanner = ({ ctaHref = "/contact" }) => (
  <section
    aria-labelledby="rent-title"
    className="bg-white px-4 pb-16 md:px-12 md:pb-24"
  >
    <Reveal
      y={32}
      className="relative mx-auto flex max-w-[1400px] flex-col overflow-hidden rounded-3xl bg-[#f05a1a] md:min-h-[360px]"
    >
      <div className="relative z-10 max-w-md p-6 md:p-12">
        <div className="flex items-center gap-2 text-xs text-white/80">
          <span className="flex items-center gap-0.5" aria-hidden="true">
            {RATING_SQUARES.map((color, index) => (
              <span key={index} className={`size-2 ${color}`} />
            ))}
          </span>
          <span className="font-semibold text-white">4.7/5</span>
          Verified Reviews
        </div>

        <SectionHeading
          id="rent-title"
          tone="dark"
          lead={["Looking for", "rent a car?"]}
          body="Choose from thousands of vehicles from multiple brands & buy online with Click & Drive, or visit us at one of our dealerships today."
          bodyClassName="text-white/90"
          className="mt-4"
        />

        <Link to={ctaHref} className={`group mt-8 ${btn.light}`}>
          Add listing
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Stacked under the text on mobile, full-width background from md up */}
      <img
        src={image}
        alt="Off-road SUV with a roof rack"
        className="h-56 w-full object-cover object-right sm:h-72 md:absolute md:inset-0 md:h-full"
      />
    </Reveal>
  </section>
);

export default RentBanner;
