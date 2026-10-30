import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const PageHeader = ({ title, eyebrow, description, breadcrumb = title, breadcrumbs, children }) => (
  <header className="bg-neutral-900 pt-32 pb-8 md:pt-36 md:pb-10">
    <div className="mx-auto max-w-[1400px] px-4 md:px-12">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-[11px] text-white/60">
          {(breadcrumbs ?? [{ label: "Home", to: "/" }, { label: breadcrumb }]).map((item, index, items) => (
            <li key={index} className="flex min-w-0 items-center gap-1.5" aria-current={index === items.length - 1 ? "page" : undefined}>
              {index > 0 && <ChevronRight aria-hidden="true" className="size-3 shrink-0" />}
              {item.to && index < items.length - 1 ? <Link to={item.to} className="rounded hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a]">{item.label}</Link> : <span className="font-medium text-white">{item.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-8 max-w-xl">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60"><span aria-hidden="true" className="size-1.5 rounded-full bg-[#f05a1a]" />{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/60">{description}</p>
        {children}
      </div>
    </div>
  </header>
);
export default PageHeader;

