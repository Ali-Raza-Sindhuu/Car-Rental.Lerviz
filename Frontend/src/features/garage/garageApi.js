import { apiRequest } from "@/lib/api";
import { setGarageMessage, setGuestItems } from "./garageSlice";
import { clearGuestGarage, readGuestGarage } from "./garageStorage";

export const mergeGuestGarage = async (token, dispatch) => {
  const items = readGuestGarage();
  if (!items.length) return { added: 0, skipped: [] };
  const result = await apiRequest("/api/cart/merge", { method: "POST", token, body: { items } });
  clearGuestGarage();
  dispatch(setGuestItems([]));
  dispatch(setGarageMessage(
    result.skipped?.length
      ? `${result.added} item${result.added === 1 ? "" : "s"} added. ${result.skipped.length} item${result.skipped.length === 1 ? "" : "s"} could not be added: ${result.skipped.map((item) => `${item.carId}: ${item.reason}`).join("; ")}`
      : result.added
        ? "Your guest garage has been merged."
        : "",
  ));
  return result;
};

export const addToGarage = async ({ car, token, dispatch, startDate, endDate }) => {
  const item = {
    carId: car.id,
    listingType: car.listingType,
    ...(car.listingType === "rent" ? { startDate, endDate } : {}),
  };
  if (token) {
    await apiRequest("/api/cart/items", { method: "POST", token, body: item });
    window.dispatchEvent(new Event("revex:garage-changed"));
    return;
  }
  const current = readGuestGarage();
  if (current.some((entry) => entry.carId === car.id)) {
    throw new Error("Already in your garage");
  }
  const next = [...current, item];
  writeGuestGarage(next);
  dispatch(setGuestItems(next));
};

export const mergeGuestGarageSafely = async (token, dispatch) => {
  try {
    return await mergeGuestGarage(token, dispatch);
  } catch (error) {
    dispatch(setGarageMessage(`You are signed in, but your guest garage could not be merged: ${error.message}`));
    return { added: 0, skipped: [], error: error.message };
  }
};
