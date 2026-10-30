import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { focusRing } from "@/shared/styles";

const enquiryTypes = [
  ["general", "General enquiry"], ["buying", "Buying a car"], ["rental", "Renting a car"],
  ["selling", "Selling or trading in"], ["financing", "Financing"], ["inspection", "Vehicle inspection"],
  ["maintenance", "Maintenance and service"], ["insurance", "Insurance"], ["delivery", "Home delivery"],
];
const inputClass = "mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a] aria-invalid:border-red-600";
const emptyValues = { fullName: "", email: "", phone: "", enquiry: "general", message: "", consent: false };

const ContactForm = () => {
  const [searchParams] = useSearchParams();
  const requestedEnquiry = searchParams.get("enquiry");
  const initialEnquiry = enquiryTypes.some(([value]) => value === requestedEnquiry) ? requestedEnquiry : "general";
  const [values, setValues] = useState({ ...emptyValues, enquiry: initialEnquiry });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const successRef = useRef(null);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setValues((previous) => ({ ...previous, [name]: type === "checkbox" ? checked : value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  // DEMO SUBMISSION STUB: validates locally only. No request is sent or stored.
  // Replace this branch with the approved enquiry endpoint when one is available.
  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (values.fullName.trim().length < 2) nextErrors.fullName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (values.phone.trim() && (!/^[+()\d\s.-]+$/.test(values.phone) || values.phone.replace(/\D/g, "").length < 7 || values.phone.replace(/\D/g, "").length > 15)) nextErrors.phone = "Enter a phone number with 7–15 digits, or leave this optional field blank.";
    if (!enquiryTypes.some(([value]) => value === values.enquiry)) nextErrors.enquiry = "Choose an enquiry type.";
    if (values.message.trim().length < 10) nextErrors.message = "Tell us a little more using at least 10 characters.";
    if (!values.consent) nextErrors.consent = "Please agree to being contacted about your enquiry.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      formRef.current?.elements.namedItem(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    setSubmitted(true);
    requestAnimationFrame(() => successRef.current?.focus());
  };

  const fieldProps = (name) => ({
    id: `contact-${name}`, name, value: values[name], onChange: handleChange,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });
  const errorMessage = (name) => errors[name] && <p id={`contact-${name}-error`} className="mt-2 text-xs text-red-600">{errors[name]}</p>;

  return (
    <section aria-labelledby="enquiry-title" className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
      <h2 id="enquiry-title" className="text-2xl font-bold tracking-tight text-neutral-950">Let’s start a conversation.</h2>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">Tell us what you have in mind. A car, a question, or simply a place to start.</p>
      {submitted ? (
        <div ref={successRef} tabIndex={-1} className={`mt-8 rounded-xl bg-neutral-50 p-6 ${focusRing}`}>
          <Check aria-hidden="true" className="size-6 text-[#f05a1a]" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900">Your enquiry is ready.</h3>
          <p role="status" className="mt-3 text-sm leading-relaxed text-neutral-600">The form passed validation. This is a demo: your message has not been sent or saved, and no reply will be issued.</p>
          <Button type="button" onClick={() => setSubmitted(false)} className="mt-6 h-10 rounded-lg bg-neutral-900 text-xs font-semibold text-white hover:bg-neutral-800 focus-visible:ring-[#f05a1a]">Edit enquiry</Button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-8">
          <p className="mb-6 text-[11px] text-neutral-500">All fields are required except phone. Demo form — nothing is sent.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><label htmlFor="contact-fullName" className="text-xs font-semibold text-neutral-900">Full name</label><input {...fieldProps("fullName")} required autoComplete="name" maxLength={120} placeholder="Your full name" className={inputClass} />{errorMessage("fullName")}</div>
            <div><label htmlFor="contact-email" className="text-xs font-semibold text-neutral-900">Email</label><input {...fieldProps("email")} required type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" className={inputClass} />{errorMessage("email")}</div>
            <div><label htmlFor="contact-phone" className="text-xs font-semibold text-neutral-900">Phone <span className="font-normal text-neutral-500">(optional)</span></label><input {...fieldProps("phone")} type="tel" autoComplete="tel" maxLength={30} placeholder="+1 202 555 0100" className={inputClass} />{errorMessage("phone")}</div>
            <div className="sm:col-span-2"><label htmlFor="contact-enquiry" className="text-xs font-semibold text-neutral-900">Enquiry type</label><select {...fieldProps("enquiry")} required className={inputClass}>{enquiryTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{errorMessage("enquiry")}</div>
            <div className="sm:col-span-2"><label htmlFor="contact-message" className="text-xs font-semibold text-neutral-900">Message</label><textarea {...fieldProps("message")} required rows={5} minLength={10} maxLength={3000} placeholder="Which vehicle or service are you interested in? Share any timing or questions here." className={`${inputClass} resize-y`} />{errorMessage("message")}</div>
          </div>
          <div className="mt-5">
            <label htmlFor="contact-consent" className="flex items-start gap-3 text-xs leading-relaxed text-neutral-600"><input id="contact-consent" name="consent" type="checkbox" required checked={values.consent} onChange={handleChange} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "contact-consent-error" : undefined} className={`mt-0.5 size-4 shrink-0 accent-[#f05a1a] ${focusRing}`} />I agree to REVEX contacting me about this enquiry using the details provided.</label>
            {errorMessage("consent")}
          </div>
          <Button type="submit" className="mt-7 h-10 rounded-lg bg-[#f05a1a] px-5 text-xs font-semibold uppercase text-white hover:bg-[#d94e14] focus-visible:ring-[#f05a1a]">Submit enquiry<ArrowRight aria-hidden="true" className="size-3.5" /></Button>
        </form>
      )}
    </section>
  );
};
export default ContactForm;

