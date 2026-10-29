import SectionHeading from "@/shared/SectionHeading";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import ContactMap from "./components/ContactMap";

const ContactPage = () => (
  <section
    aria-labelledby="contact-title"
    className="bg-neutral-50 px-4 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40"
  >
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading
        id="contact-title"
        eyebrow="Contact"
        lead={["Let's talk"]}
        muted={["about your next car"]}
      />
      <ContactForm />
      <ContactInfo />
      <ContactMap />
    </div>
  </section>
);

export default ContactPage;

