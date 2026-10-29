import img1 from "@/assets/category_01.png";
import img2 from "@/assets/category_02.png";
import img3 from "@/assets/category_03.png";
import img4 from "@/assets/category_04.png";
import CarouselArrows from "@/shared/CarouselArrows";
import { Reveal } from "@/shared/motion";
import SectionHeading from "@/shared/SectionHeading";
import { focusRing } from "@/shared/styles";
import { useCarousel } from "@/shared/useCarousel";

const categories = [
  { name: "SUV", count: 824, image: img1 },
  { name: "Wagon", count: 624, image: img2 },
  { name: "Coupe", count: 324, image: img3 },
  { name: "Convertible", count: 124, image: img4 },
];

const CategorySection = () => {
  const carousel = useCarousel({ gap: 16 });

  return (
    <section
      id="models"
      aria-labelledby="category-title"
      className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="category-title"
            eyebrow="Browse by category"
            lead={["Perfect for"]}
            muted={["any adventure!"]}
          />

          <Reveal
            as="p"
            delay={0.3}
            className="max-w-xs text-sm leading-relaxed text-neutral-600 md:ml-16 md:pb-1 lg:ml-24"
          >
            Discover a new era of cars designed for performance, technology,
            and unique mobility.
          </Reveal>

          <Reveal delay={0.4} className="md:ml-auto">
            <CarouselArrows carousel={carousel} label="categories" />
          </Reveal>
        </div>

        <div
          {...carousel.trackProps}
          role="region"
          aria-label="Car categories"
          className={`mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${focusRing}`}
        >
          {categories.map(({ name, count, image }, index) => (
            <Reveal
              as="article"
              key={name}
              y={32}
              delay={(index % 4) * 0.1}
              className="group relative aspect-[5/8] w-[72%] shrink-0 snap-start overflow-hidden rounded-2xl bg-neutral-200 sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
            >
              <img
                src={image}
                alt={`${name} category`}
                loading="lazy"
                draggable={false}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent via-35% to-transparent" />
              <div className="absolute left-6 top-6 text-white">
                <h3 className="text-xl font-bold uppercase tracking-tight">
                  {name}
                </h3>
                <p className="mt-1 text-xs text-white/85">
                  {count} Available in stock
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
