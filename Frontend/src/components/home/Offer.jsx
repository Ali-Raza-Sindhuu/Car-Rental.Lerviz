import { CreditCard, Headset, ReceiptText, ShieldCheck } from "lucide-react";
import SectionTag from "@/components/common/SectionTag";
import Heading from "@/components/common/Heading";
import { img, offer } from "@/data/home";
import { cn } from "@/lib/utils";

const icons = { receipt: ReceiptText, shield: ShieldCheck, headset: Headset, card: CreditCard };

function FeatureCard({ feature, className }) {
  const Icon = icons[feature.icon];
  return (
    <article className={cn("relative flex min-h-56 flex-col justify-between rounded-2xl bg-white p-5 pt-6", className)}>
      <span className="absolute -top-2 -left-2 grid size-16 place-items-center rounded-full bg-ink text-white ring-[10px] ring-[#f6f6f6]">
        <Icon className="size-5" strokeWidth={1.5} />
      </span>
      <h3 className="ml-auto max-w-[8.5rem] font-display text-xs leading-snug">{feature.title}</h3>
      <p className="max-w-[12rem] text-[0.65rem]/relaxed uppercase">{feature.text}</p>
    </article>
  );
}

export default function Offer() {
  const [a, b, c, d] = offer.features;
  return (
    <section className="grid gap-12 lg:grid-cols-[repeat(100,minmax(0,1fr))] lg:gap-0">
      {/* Feature cards: two staggered columns on a soft panel */}
      <div className="lg:col-span-52">
        <div className="grid gap-4 rounded-[2rem] bg-[#f6f6f6] p-4 pt-6 sm:grid-cols-2 sm:gap-x-4 sm:p-5 sm:pt-8">
          <div className="space-y-4 sm:space-y-6">
            <FeatureCard feature={a} />
            <FeatureCard feature={c} />
          </div>
          <div className="space-y-4 sm:mt-24 sm:space-y-6">
            <FeatureCard feature={b} />
            <FeatureCard feature={d} />
          </div>
        </div>
      </div>

      {/* Copy and car with call-outs */}
      <div className="lg:col-span-40 lg:col-start-61">
        <SectionTag>{offer.tag}</SectionTag>
        <Heading className="mt-5 text-[clamp(1.4rem,2.8vw,2.3rem)]">{offer.title}</Heading>
        <p className="mt-4 max-w-sm text-xs/relaxed text-muted-foreground uppercase">{offer.text}</p>

        <div className="relative mx-auto mt-10 aspect-[3/4] max-w-[22rem] lg:max-w-none">
          <div className="absolute inset-x-[16%] inset-y-0 overflow-hidden rounded-[2rem]">
            <img src={img.offerCar} alt="White supercar" className="size-full object-cover object-[60%_85%]" />
          </div>
          {offer.callouts.map((c) => (
            <div key={c.label} className={cn("absolute z-10 rounded-xl bg-white px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.1)]", c.pos)}>
              <p className={cn("font-display text-sm", c.red && "text-brand")}>{c.value}</p>
              <p className="text-[0.65rem] text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
