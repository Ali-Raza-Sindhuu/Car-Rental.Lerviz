import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

const ContactSection = () => (
  <div className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto grid max-w-[1400px] items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
      <ContactForm />
      <ContactInfo />
    </div>
  </div>
);
export default ContactSection;

