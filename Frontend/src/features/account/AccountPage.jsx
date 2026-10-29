import SectionHeading from "@/shared/SectionHeading";
import ProfileSection from "./components/ProfileSection";
import SavedCarsSection from "./components/SavedCarsSection";

const AccountPage = () => (
  <section
    aria-labelledby="account-title"
    className="bg-neutral-50 px-4 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40"
  >
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading
        id="account-title"
        eyebrow="Account"
        lead={["Your"]}
        muted={["Revex account"]}
      />
      <ProfileSection />
      <SavedCarsSection />
    </div>
  </section>
);

export default AccountPage;

