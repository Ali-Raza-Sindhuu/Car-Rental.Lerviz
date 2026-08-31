import { useEffect, useRef, useState } from "react";


/** Counts up from 0 to a target number once the element scrolls into view. */
function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return [count, ref];
}

function StatCounter({ prefix = "", value, suffix, label }) {
  const [count, ref] = useCountUp(value);

  return (
    <div ref={ref} className="flex flex-col items-center gap-3 text-center">
      <div className="flex items-center justify-center gap-1 font-['Orbitron',_sans-serif] font-medium text-4xl md:text-5xl text-white">
        {prefix && <span>{prefix}</span>}
        <span>{count}</span>
        <span className="text-[#db0404]">{suffix}</span>
      </div>
      <p className="text-[#d9d9d9] text-sm md:text-base">{label}</p>
    </div>
  );
}

function Intro() {
  return (
    <section className="relative w-full bg-black px-6 py-20 md:py-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 md:gap-14">
        {/* Rotating icon/graphic */}
        <div className="h-24 w-24 md:h-32 md:w-32 ">
          <img
            src="https://framerusercontent.com/images/b2xkpGrYvkjqvkVsb2OlLXIKebg.png"
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover rounded-full"
          />
        </div>

        {/* Heading + paragraph */}
        <div className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-3xl">
            we don&rsquo;t just sell cars we craft experiences
          </h2>
          <p className="text-[#d9d9d9] text-base md:text-lg max-w-xl">
            At Levrix, we believe a car is more than just a way to get from
            one place to another—it&rsquo;s a reflection of who you are.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 md:gap-10 w-full pt-4">
          <StatCounter prefix="$" value={120} suffix="M+" label="Luxury Cars Sales" />
          <StatCounter value={10} suffix="+" label="Years of Experience" />
          <StatCounter value={95} suffix="%" label="Client Satisfaction" />
        </div>
      </div>
    </section>
  );
}

export default Intro;