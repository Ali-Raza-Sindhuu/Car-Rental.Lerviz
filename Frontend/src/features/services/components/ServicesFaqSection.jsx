import SectionHeading from "@/shared/SectionHeading";
import FaqAccordion from "@/components/shared/FaqAccordion";

const questions = [
  { question: "Can I arrange a test drive before deciding?", answer: "Contact the team with the vehicle you are interested in and your preferred time. They can confirm availability, the documents you will need and any appointment requirements before you travel." },
  { question: "What do I need for a trade-in valuation?", answer: "Have the registration details, mileage, service history and an honest description of the car’s condition ready. Photos can help with an initial conversation; a final valuation may require an in-person inspection." },
  { question: "How do financing options work?", answer: "Ask for a written breakdown of the deposit, repayment term, interest, fees and total amount payable. Any finance arrangement is subject to the provider’s eligibility and approval requirements; an enquiry does not guarantee acceptance." },
  { question: "Is every vehicle covered by the certified programme?", answer: "Do not assume a vehicle is certified based on its listing alone. Ask the team to confirm its status and provide the inspection report and applicable terms. The programme figures shown here are draft placeholders awaiting confirmation." },
  { question: "Can you deliver a car to my home?", answer: "Share your location and preferred timing when you enquire. The team can confirm whether delivery is available, any charges and how the vehicle, documents and keys will be handed over." },
];
const ServicesFaqSection = () => (
  <section aria-labelledby="services-faq-title" className="bg-white px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <SectionHeading id="services-faq-title" eyebrow="A little clarity" lead={["Before you"]} muted={["take the next step."]} body="The questions worth asking, answered without the small-print feeling." />
      <FaqAccordion items={questions} />
    </div>
  </section>
);
export default ServicesFaqSection;

