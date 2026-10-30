import { useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { focusRing } from "@/shared/styles";

const contactTimes = ["Any time during opening hours", "Morning (9am–12pm)", "Afternoon (12pm–3pm)", "Late afternoon (3pm–6pm)"];
const inputClass = "mt-2 w-full min-w-0 rounded-lg border border-neutral-200 bg-white px-3 py-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a] aria-invalid:border-red-600";

const VehicleEnquiryForm = ({ car, details }) => {
  const name = `${car.make} ${car.model} [${car.yearRange}]`;
  const [values, setValues] = useState({
    name: "", email: "", phone: "", contactTime: contactTimes[0],
    message: `I'm interested in the ${name}. Please share more information and availability${car.listingType === "rent" ? " for a rental" : " for a test drive"}.`,
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const successRef = useRef(null);
  const handleChange = (event) => {
    const { name: field, value, type, checked } = event.target;
    setValues((previous) => ({ ...previous, [field]: type === "checkbox" ? checked : value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };
  // DEMO handleSubmit stub: validate locally only. Nothing is sent or persisted.
  // Integrate an approved enquiry endpoint here when backend work is authorised.
  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (values.name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = "Enter a valid email address.";
    const phoneDigits = values.phone.replace(/\D/g, "");
    if (values.phone.trim() && (!/^[+()\d\s.-]+$/.test(values.phone) || phoneDigits.length < 7 || phoneDigits.length > 15)) nextErrors.phone = "Enter 7–15 digits, or leave the optional phone blank.";
    if (!contactTimes.includes(values.contactTime)) nextErrors.contactTime = "Choose a preferred contact time.";
    if (values.message.trim().length < 10) nextErrors.message = "Use at least 10 characters to describe your enquiry.";
    if (!values.consent) nextErrors.consent = "Please agree to being contacted about this enquiry.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      formRef.current?.elements.namedItem(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    setSubmitted(true);
    requestAnimationFrame(() => successRef.current?.focus());
  };
  const fieldProps = (field) => ({
    id: `vehicle-enquiry-${field}`, name: field, value: values[field], onChange: handleChange,
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `vehicle-enquiry-${field}-error` : undefined,
  });
  const fieldError = (field) => errors[field] && <p id={`vehicle-enquiry-${field}-error`} className="mt-2 text-xs text-red-600">{errors[field]}</p>;

  return (
    <section id="vehicle-enquiry" aria-labelledby="enquiry-title" className="scroll-mt-28 bg-white px-4 py-16 md:px-12 md:py-24">
      <div className="mx-auto grid max-w-[1400px] items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500"><span aria-hidden="true" className="size-1.5 rounded-full bg-[#f05a1a]" />Make it personal</p>
          <h2 id="enquiry-title" tabIndex={-1} className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 outline-none md:text-5xl">Ask about this car.</h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-500">A closer look, a question about the specification, or a plan for your next drive. Start with what matters to you.</p>
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <h3 className="text-base font-semibold text-neutral-900">{name}</h3>
            <p className="mt-2 text-xs text-neutral-500">{details.dealer.name} · {details.dealer.city}</p>
            <p className="mt-4 text-[11px] leading-relaxed text-neutral-500">Sample listing and dealer details. This demo form does not send messages or reserve vehicles.</p>
          </div>
        </div>
        <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
          {submitted ? (
            <div ref={successRef} tabIndex={-1} className={`rounded-xl bg-neutral-50 p-6 ${focusRing}`}>
              <Check aria-hidden="true" className="size-6 text-[#f05a1a]" />
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-neutral-900">Your enquiry is ready.</h3>
              <p role="status" className="mt-3 text-sm leading-relaxed text-neutral-500">Your details passed validation. This is a demo: nothing was sent or saved, and no booking or reservation was made.</p>
              <Button type="button" onClick={() => { setSubmitted(false); requestAnimationFrame(() => formRef.current?.elements.namedItem("name")?.focus()); }} className="mt-6 h-10 rounded-lg bg-neutral-900 text-xs font-semibold text-white hover:bg-neutral-800 focus-visible:ring-[#f05a1a]">Edit enquiry</Button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label={`Enquire about ${name}`}>
              <p className="mb-6 text-[11px] text-neutral-500">All fields required except phone. Preferred times refer to the dealership's local time.</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2"><label htmlFor="vehicle-enquiry-name" className="text-xs font-semibold text-neutral-900">Full name</label><input {...fieldProps("name")} autoComplete="name" required maxLength={120} placeholder="Your full name" className={inputClass} />{fieldError("name")}</div>
                <div><label htmlFor="vehicle-enquiry-email" className="text-xs font-semibold text-neutral-900">Email</label><input {...fieldProps("email")} type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" className={inputClass} />{fieldError("email")}</div>
                <div><label htmlFor="vehicle-enquiry-phone" className="text-xs font-semibold text-neutral-900">Phone (optional)</label><input {...fieldProps("phone")} type="tel" autoComplete="tel" maxLength={30} placeholder="+1 202 555 0100" className={inputClass} />{fieldError("phone")}</div>
                <div className="sm:col-span-2"><label htmlFor="vehicle-enquiry-contactTime" className="text-xs font-semibold text-neutral-900">Preferred contact time</label><select {...fieldProps("contactTime")} required className={inputClass}>{contactTimes.map((time) => <option key={time}>{time}</option>)}</select>{fieldError("contactTime")}</div>
                <div className="sm:col-span-2"><label htmlFor="vehicle-enquiry-message" className="text-xs font-semibold text-neutral-900">Message</label><textarea {...fieldProps("message")} rows={5} required minLength={10} maxLength={3000} className={`${inputClass} resize-y`} />{fieldError("message")}</div>
              </div>
              <div className="mt-5"><label className="flex items-start gap-3 text-xs leading-relaxed text-neutral-600" htmlFor="vehicle-enquiry-consent"><input id="vehicle-enquiry-consent" name="consent" type="checkbox" required checked={values.consent} onChange={handleChange} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "vehicle-enquiry-consent-error" : undefined} className={`mt-0.5 size-4 shrink-0 accent-[#f05a1a] ${focusRing}`} />I agree to being contacted about this vehicle using the details provided.</label>{fieldError("consent")}</div>
              <Button type="submit" className="mt-7 h-10 rounded-lg bg-[#f05a1a] px-5 text-xs font-semibold uppercase text-white hover:bg-[#d94e14] focus-visible:ring-[#f05a1a]">Submit enquiry<ArrowRight aria-hidden="true" className="size-3.5" /></Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
export default VehicleEnquiryForm;

