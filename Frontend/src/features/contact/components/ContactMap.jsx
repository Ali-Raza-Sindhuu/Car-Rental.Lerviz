import { MapPin } from "lucide-react";

const ContactMap = () => (
  <div role="img" aria-label="Map placeholder. Confirmed dealership locations will appear here." className="mt-8 flex min-h-[280px] flex-col items-center justify-center rounded-2xl bg-neutral-100 p-8 text-center md:min-h-[360px]">
    <MapPin aria-hidden="true" strokeWidth={1.5} className="size-10 text-neutral-400" />
    <p className="mt-4 text-lg font-semibold tracking-tight text-neutral-900">A place to see it for yourself.</p>
    <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500">Map placeholder. Confirmed dealership locations will be added here.</p>
  </div>
);
export default ContactMap;

