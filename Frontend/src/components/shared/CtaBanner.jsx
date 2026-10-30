import { useId } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { btn } from "@/shared/styles";
import image from "@/assets/rent_car.png";

const CtaBanner = ({ heading, text, buttonLabel, href }) => {
  const id = useId();
  return (
    <section aria-labelledby={id} className="bg-white px-4 pb-16 md:px-12 md:pb-24">
      <div className="relative mx-auto flex max-w-[1400px] flex-col overflow-hidden rounded-3xl bg-[#f05a1a] md:min-h-[360px]">
        <div className="relative z-10 max-w-md p-6 md:p-12">
          <h2 id={id} className="text-4xl font-bold leading-[1.05] tracking-tighter text-white md:text-5xl">{heading}</h2>
          <p className="mt-5 text-sm leading-relaxed text-white/90">{text}</p>
          <Button asChild className={`mt-8 ${btn.light}`}><Link to={href}>{buttonLabel}<ArrowRight aria-hidden="true" className="size-4" /></Link></Button>
        </div>
        <img src={image} alt="Off-road SUV with a roof rack" loading="lazy" className="h-56 w-full object-cover object-right sm:h-72 md:absolute md:inset-0 md:h-full" />
      </div>
    </section>
  );
};
export default CtaBanner;

