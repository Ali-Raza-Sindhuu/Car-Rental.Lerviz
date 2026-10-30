import { Accordion02 } from "@/components/ui/accordion-04";

const DemoOne = () => (
  <div className="w-full max-w-xl">
    <Accordion02 defaultValue="02" items={[
      { id: "01", question: "Can I arrange a test drive?", answer: "Contact the team to confirm the vehicle, your preferred time and appointment requirements." },
      { id: "02", question: "Where should I start?", answer: "Browse the inventory or tell us what you need through the contact page." },
    ]} />
  </div>
);
export default DemoOne;

