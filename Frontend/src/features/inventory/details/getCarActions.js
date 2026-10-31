export const getCarActions = (car, { onReserve, onTestDrive } = {}) => {
  if (car.status === "sold") {
    return {
      primary: { label: "Sold", disabled: true, onClick: undefined },
      secondary: null,
    };
  }
  if (car.listingType === "rent") {
    return {
      primary: { label: "Reserve these dates", disabled: false, onClick: onReserve },
      secondary: null,
    };
  }
  return {
    primary: { label: "Reserve this car", disabled: false, onClick: onReserve },
    secondary: { label: "Book a test drive", disabled: false, onClick: onTestDrive },
  };
};
