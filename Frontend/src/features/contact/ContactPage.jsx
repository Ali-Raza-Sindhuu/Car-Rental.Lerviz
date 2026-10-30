import PageHeader from "@/components/shared/PageHeader";
import CtaBanner from "@/components/shared/CtaBanner";
import ContactSection from "./components/ContactSection";
import DealershipsSection from "./components/DealershipsSection";
import ContactFaqSection from "./components/ContactFaqSection";

const ContactPage = () => (
  <>
    <PageHeader title="Contact us" breadcrumb="Contact" eyebrow="The conversation starts here" description="A question about a car, a plan for your next drive, or a little advice. Let’s find your next step together." />
    <ContactSection />
    <DealershipsSection />
    <ContactFaqSection />
    <CtaBanner heading="Something catch your eye?" text="Explore the collection, build your shortlist and find the car you’d like to see up close." buttonLabel="Browse inventory" href="/inventory" />
  </>
);
export default ContactPage;
