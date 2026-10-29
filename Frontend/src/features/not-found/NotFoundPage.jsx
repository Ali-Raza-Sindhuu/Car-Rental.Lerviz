import { Link } from "react-router-dom";
import SectionHeading from "@/shared/SectionHeading";
import { btn } from "@/shared/styles";

const NotFoundPage = () => (
  <section aria-labelledby="not-found-title" className="bg-neutral-50 px-4 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40">
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading id="not-found-title" eyebrow="404" lead={["Page not found"]} body="The page you're looking for doesn't exist or has moved." />
      <Link to="/" className={btn.primary}>Back to home</Link>
    </div>
  </section>
);

export default NotFoundPage;

