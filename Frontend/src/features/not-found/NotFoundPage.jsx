import { Link } from "react-router-dom";
import { ArrowRight, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import heroImage from "@/assets/404_hero.png";

const NotFoundPage = ({ error = false }) => (
  <>
    <PageHeader title={error ? "Something went wrong" : "Page not found"} eyebrow={error ? "A short detour" : "404 / Wrong turn"} description={error ? "We couldn't open this page. Choose a destination below to continue." : "That route isn't on the map. Your next drive is still waiting."} heroImage={heroImage} />
    <section className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
        <SearchX aria-hidden="true" className="size-8 text-neutral-500" />
        <h2 className="mt-6 text-xl font-semibold tracking-tight text-neutral-900">Find your way forward.</h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">Explore the collection or return to the showroom.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="h-10 rounded-lg bg-[#f05a1a] px-5 text-xs font-semibold uppercase text-white hover:bg-[#d94e14]"><Link to="/inventory">Browse inventory<ArrowRight aria-hidden="true" className="size-3.5" /></Link></Button>
          <Button asChild className="h-10 rounded-lg border border-neutral-200 bg-white px-5 text-xs font-semibold uppercase text-neutral-900 hover:bg-neutral-100"><Link to="/">Back to home</Link></Button>
        </div>
      </div>
    </section>
  </>
);
export default NotFoundPage;
