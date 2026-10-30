import { Plus, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const Accordion02 = ({ items, defaultValue, className }) => (
  <Accordion type="single" defaultValue={defaultValue} collapsible className={cn("w-full min-w-0 space-y-2", className)}>
    {items.map((item, index) => (
      <AccordionItem key={item.id ?? item.question} value={item.id ?? String(index + 1).padStart(2, "0")} className="overflow-hidden rounded-xl border border-neutral-200 bg-white last:border-b">
        <AccordionTrigger className="m-1 bg-neutral-50 px-4 hover:bg-neutral-100 hover:no-underline data-[state=open]:rounded-b-none data-[state=open]:bg-[#f05a1a]/10 [&>svg]:hidden sm:px-6">
          <span className="min-w-0 flex-1 text-lg font-semibold leading-snug tracking-tight sm:text-2xl">{item.question}</span>
          <span aria-hidden="true" className="relative size-6 shrink-0 text-neutral-900">
            <Plus strokeWidth={2} className="absolute inset-0 size-6 transition-all duration-200 group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-0 motion-reduce:transition-none" />
            <X strokeWidth={2} className="absolute inset-0 size-6 rotate-90 opacity-0 transition-all duration-200 group-data-[state=open]:rotate-0 group-data-[state=open]:opacity-100 motion-reduce:transition-none" />
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-5 py-6 text-sm leading-relaxed text-neutral-600 sm:px-7">{item.answer}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

