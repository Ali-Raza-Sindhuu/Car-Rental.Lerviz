import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/shared/motion";
import SectionHeading from "@/shared/SectionHeading";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: connect to your newsletter endpoint
    setEmail("");
    setSent(true);
  };

  return (
    <section
      aria-labelledby="newsletter-title"
      className="bg-neutral-900 px-4 pb-4 pt-16 md:px-12 md:pb-8 md:pt-24"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          id="newsletter-title"
          tone="dark"
          align="center"
          eyebrow="Newsletter"
          lead={["Stay ahead"]}
          muted={["of the drive."]}
          body="Every new generation of automotive design, intelligent technology, and performance built around the way you travel."
          className="max-w-xl"
        />

        <Reveal delay={0.7} className="mx-auto max-w-sm text-center">
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex items-center rounded-full bg-white/10 p-1.5 pl-5"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSent(false);
              }}
              placeholder="Your email address"
              className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f05a1a] text-white transition-colors duration-300 hover:bg-[#d94e14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
              <ArrowRight className="size-4" />
            </button>
          </form>
          <p role="status" className="mt-3 h-4 text-xs text-white/60">
            {sent ? "Thanks! You're on the list." : ""}
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default NewsletterSection;
