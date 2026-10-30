import SectionHeading from "@/shared/SectionHeading";
import FaqAccordion from "@/components/shared/FaqAccordion";

const questions = [
  { question: "Do I need an appointment to visit?", answer: "An appointment helps the team prepare the vehicle and set aside time for you. Confirm your preferred location and viewing time before travelling, especially if you would like a test drive." },
  { question: "What should I include in my enquiry?", answer: "Share the vehicle or service you are interested in, your preferred timing and any questions. For a listing, include its make, model or reference. Please leave payment details and identity documents out of your message." },
  { question: "Will I receive a reply after submitting this form?", answer: "This is a demonstration form. It checks your entries locally but does not send or save them, so no reply is generated. Contact details on this page are also placeholders awaiting replacement before launch." },
];
const ContactFaqSection = () => (
  <section aria-labelledby="contact-faq-title" className="bg-white px-4 pb-16 md:px-12 md:pb-24">
    <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <SectionHeading id="contact-faq-title" eyebrow="Before you reach out" lead={["A few useful"]} muted={["things to know."]} />
      <FaqAccordion items={questions} />
    </div>
  </section>
);
export default ContactFaqSection;

