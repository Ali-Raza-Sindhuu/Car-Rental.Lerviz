import { Phone, Mail, MapPin, Clock, Headset, ArrowUpRight } from "lucide-react";
import { focusRing } from "@/shared/styles";

const details = [
  { title: "Call the showroom", Icon: Phone, text: "+1 202 555 0142", href: "tel:+12025550142", note: "Discuss a vehicle or arrange a visit." },
  { title: "Write to us", Icon: Mail, text: "hello@revex.example.com", href: "mailto:hello@revex.example.com", note: "A place for every question." },
  { title: "Visit the flagship", Icon: MapPin, text: "100 Example Avenue, Example City", note: "Arrange a viewing before you travel." },
  { title: "Opening hours", Icon: Clock, text: "Mon–Sat, 9am–6pm", note: "Sunday by appointment." },
];
const ContactInfo = () => (
  <aside aria-labelledby="contact-info-title" className="min-w-0">
    <h2 id="contact-info-title" className="text-2xl font-bold tracking-tight text-neutral-950">A more personal connection.</h2>
    <p className="mt-3 text-sm leading-relaxed text-neutral-600">Prefer a conversation? Find the right way to reach the team.</p>
    <p className="mt-3 text-[11px] text-neutral-500">Demo contact details, addresses and hours — replace before publication.</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {details.map(({ title, Icon, text, href, note }) => (
        <div key={title} className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-5">
          <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 text-[#f05a1a]" />
          <h3 className="mt-5 text-sm font-semibold text-neutral-900">{title}</h3>
          <p className="mt-2 break-words text-sm text-neutral-900">{href ? <a href={href} className={`rounded underline-offset-4 hover:underline ${focusRing}`}>{text}</a> : text}</p>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">{note}</p>
        </div>
      ))}
    </div>
    <div className="mt-4 rounded-2xl bg-neutral-900 p-6 text-white md:p-8">
      <Headset aria-hidden="true" strokeWidth={1.5} className="size-6 text-[#f05a1a]" />
      <p className="mt-6 text-[11px] font-bold uppercase tracking-wide text-white/60">// Here for the unexpected</p>
      <h3 className="mt-3 text-2xl font-bold tracking-tight">24/7 roadside support</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/60">For help on the road, use the assistance number in your vehicle’s cover documents. Eligibility and coverage depend on your provider.</p>
      <a href="tel:+12025550199" className={`mt-6 inline-flex items-center gap-2 rounded text-sm font-semibold ${focusRing}`}>+1 202 555 0199<ArrowUpRight aria-hidden="true" className="size-4" /></a>
      <p className="mt-3 text-[11px] text-white/60">Placeholder support line — not an active assistance service.</p>
    </div>
  </aside>
);
export default ContactInfo;

