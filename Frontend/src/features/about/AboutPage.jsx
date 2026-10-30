import PageHeader from "@/components/shared/PageHeader";
import CtaBanner from "@/components/shared/CtaBanner";
import StorySection from "./components/StorySection";
import ValuesSection from "./components/ValuesSection";
import NumbersSection from "./components/NumbersSection";
import JourneySection from "./components/JourneySection";
import TeamSection from "./components/TeamSection";

const AboutPage = () => (
  <>
    <PageHeader title="About REVEX" breadcrumb="About" eyebrow="Built around the drive" description="A more considered way to find your next car, with people who care about the journey." />
    <StorySection />
    <ValuesSection />
    <NumbersSection />
    <JourneySection />
    <TeamSection />
    <CtaBanner heading="Your next chapter starts here." text="A daily companion or a weekend escape. Tell us what moves you and let’s find the right car together." buttonLabel="Start a conversation" href="/contact" />
  </>
);
export default AboutPage;

