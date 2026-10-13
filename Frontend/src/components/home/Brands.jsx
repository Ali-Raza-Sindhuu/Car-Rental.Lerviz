import Heading from "@/components/common/Heading";
import { brands } from "@/data/home";

const marks = {
  Ferrari: "font-display text-[0.7rem] tracking-widest text-[#b30000]",
  BMW: "font-logo text-lg font-bold",
  Lamborghini: "font-display text-[0.55rem] tracking-wider text-amber-600",
  Audi: "font-logo text-lg font-bold",
  Ford: "font-logo text-xl font-bold text-blue-800 italic",
};

export default function Brands() {
  return (
    <section className="text-center">
      <Heading className="mx-auto text-[clamp(1rem,1.9vw,1.5rem)] font-normal">{brands.title}</Heading>
      <ul className="mt-12 flex flex-wrap items-center justify-center">
        {brands.items.map((b) => (
          <li key={b} className="-ml-1 grid size-24 place-items-center rounded-full bg-mist shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8)] first:ml-0 sm:size-28">
            <span className={marks[b]}>{b}</span>
          </li>
        ))}
        <li className="-ml-1 grid size-24 place-items-center rounded-full bg-mist sm:size-28">
          <span>
            <span className="block font-display text-base">{brands.more.value}</span>
            <span className="block text-[0.6rem] text-muted-foreground uppercase">{brands.more.label}</span>
          </span>
        </li>
      </ul>
    </section>
  );
}
