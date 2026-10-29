import SectionHeading from "@/shared/SectionHeading";
import CarGallery from "./components/CarGallery";
import CarSummary from "./components/CarSummary";
import CarSpecs from "./components/CarSpecs";
import CarFeatures from "./components/CarFeatures";
import TestDriveForm from "./components/TestDriveForm";
import SimilarCars from "./components/SimilarCars";

const CarDetailsPage = () => (
  <section
    aria-labelledby="car-details-title"
    className="bg-neutral-50 px-4 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40"
  >
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading
        id="car-details-title"
        eyebrow="Car details"
        // TODO: Replace with the car name loaded from the :id param.
        lead={["Car details"]}
      />
      <CarGallery />
      <CarSummary />
      <CarSpecs />
      <CarFeatures />
      <TestDriveForm />
      <SimilarCars />
    </div>
  </section>
);

export default CarDetailsPage;

