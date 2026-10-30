import PageHeader from "@/components/shared/PageHeader";
import CtaBanner from "@/components/shared/CtaBanner";
import ServicesGrid from "./components/ServicesGrid";
import InspectionSection from "./components/InspectionSection";
import HowItWorksSection from "./components/HowItWorksSection";
import ServicesFaqSection from "./components/ServicesFaqSection";

const ServicesPage = () => (
  <>
    <PageHeader title="Our services" breadcrumb="Services" eyebrow="Support for every mile" description="Find your next car, plan a change or take care of the one you love. Start with a conversation." />
    <ServicesGrid />
    <InspectionSection />
    <HowItWorksSection />
    <ServicesFaqSection />
    <CtaBanner heading="What’s your next move?" text="Tell us where you want to go. We’ll help you explore the cars, services and next steps that fit." buttonLabel="Talk to our team" href="/contact" />
  </>
);

export default ServicesPage;
