export const GUEST_GARAGE_KEY = "revexGarage";

const isValidItem = (item) =>
  item && typeof item.carId === "string" &&
  ["buy", "rent"].includes(item.listingType) &&
  (item.startDate === undefined || typeof item.startDate === "string") &&
  (item.endDate === undefined || typeof item.endDate === "string");

export const readGuestGarage = () => {
  try {
    const items = JSON.parse(localStorage.getItem(GUEST_GARAGE_KEY) || "[]");
    return Array.isArray(items) ? items.filter(isValidItem) : [];
  } catch {
    return [];
  }
};

export const writeGuestGarage = (items) => {
  const safeItems = items.filter(isValidItem).map(({ carId, listingType, startDate, endDate }) => ({
    carId,
    listingType,
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  }));
  localStorage.setItem(GUEST_GARAGE_KEY, JSON.stringify(safeItems));
  window.dispatchEvent(new Event("revex:garage-changed"));
};

export const clearGuestGarage = () => {
  localStorage.removeItem(GUEST_GARAGE_KEY);
  window.dispatchEvent(new Event("revex:garage-changed"));
};
