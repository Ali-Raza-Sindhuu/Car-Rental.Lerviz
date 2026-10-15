const text = (name, label, required = true) => ({ name, label, required });
const number = (name, label, required = true) => ({ name, label, type: "number", required, min: 0, step: "any" });
const choose = (name, label, options, required = true) => ({ name, label, options, required });

export const resources = {
  categories: {
    title: "Categories", singular: "Category", summary: (item) => item.name,
    filters: [choose("sort", "Sort", ["name", "createdAt"], false)],
    fields: [text("name", "Name"), { ...text("description", "Description"), type: "textarea" }, number("baseDailyRate", "Base daily rate"), number("depositAmount", "Deposit amount")],
  },
  locations: {
    title: "Locations", singular: "Location", summary: (item) => `${item.name}, ${item.city}`,
    filters: [text("city", "City", false), choose("sort", "Sort", ["city", "name", "createdAt"], false)],
    fields: [text("name", "Name"), text("city", "City"), text("address", "Address"), text("phone", "Phone"), choose("isActive", "Active", [{ value: "true", label: "Yes" }, { value: "false", label: "No" }])],
  },
  vehicles: {
    title: "Vehicles", singular: "Vehicle", summary: (item) => `${item.make} ${item.model} · ${item.plateNo}`,
    filters: [choose("category", "Category", "categories", false), choose("location", "Location", "locations", false), choose("transmission", "Transmission", ["AUTOMATIC", "MANUAL"], false), choose("fuel", "Fuel", ["PETROL", "DIESEL", "HYBRID", "ELECTRIC"], false), number("seats", "Minimum seats", false), number("minPrice", "Minimum rate", false), number("maxPrice", "Maximum rate", false), choose("sort", "Sort", ["price_asc", "price_desc", "year_asc", "year_desc"], false)],
    fields: [
      choose("categoryId", "Category", "categories"), choose("locationId", "Location", "locations"), text("make", "Make"), text("model", "Model"),
      { ...number("year", "Year"), min: 1950, step: 1 }, text("plateNo", "Plate number"), { ...text("vin", "VIN"), minLength: 17, maxLength: 17 },
      choose("transmission", "Transmission", ["AUTOMATIC", "MANUAL"]), choose("fuelType", "Fuel type", ["PETROL", "DIESEL", "HYBRID", "ELECTRIC"]),
      { ...number("seats", "Seats"), min: 1, step: 1 }, { ...number("doors", "Doors"), min: 2, step: 1 }, text("color", "Color"),
      { ...number("mileageKm", "Mileage (km)"), step: 1 }, number("dailyRate", "Daily rate"), choose("status", "Status", ["AVAILABLE", "MAINTENANCE", "RETIRED"]),
    ],
  },
  maintenance: {
    title: "Maintenance", singular: "Maintenance log", summary: (item) => `${item.vehicle?.make || "Vehicle"} ${item.vehicle?.model || ""} · ${item.type}`,
    filters: [choose("vehicleId", "Vehicle", "vehicles", false), choose("status", "Status", ["OPEN", "CLOSED"], false), choose("sort", "Sort", ["createdAt", "startDate"], false)],
    fields: [choose("vehicleId", "Vehicle", "vehicles", true), choose("type", "Type", ["SERVICE", "REPAIR", "INSPECTION"]), { ...text("description", "Description"), type: "textarea" }, number("cost", "Cost"), { ...text("startDate", "Start"), type: "datetime-local", createOnly: true }, { ...text("endDate", "End"), type: "datetime-local", required: false }, choose("status", "Status", ["OPEN", "CLOSED"])],
  },
  coupons: {
    title: "Coupons", singular: "Coupon", summary: (item) => `${item.code} · ${item.discountType === "PERCENT" ? `${item.value}%` : item.value}`,
    filters: [choose("isActive", "Active", [{ value: "true", label: "Yes" }, { value: "false", label: "No" }], false), choose("sort", "Sort", ["createdAt", "code", "validTo"], false)],
    fields: [text("code", "Code"), choose("discountType", "Discount type", ["PERCENT", "FIXED"]), number("value", "Value"), { ...number("minDays", "Minimum days"), min: 1, step: 1 }, { ...text("validFrom", "Valid from"), type: "datetime-local" }, { ...text("validTo", "Valid to"), type: "datetime-local" }, { ...number("maxUses", "Maximum uses"), min: 1, step: 1 }, choose("isActive", "Active", [{ value: "true", label: "Yes" }, { value: "false", label: "No" }])],
  },
};
