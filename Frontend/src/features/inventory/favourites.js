import { useEffect, useState } from "react";

export const WISHLIST_ENABLED = false;
export const FAVOURITES_KEY = "revexSavedCars";
const CHANGE_EVENT = "revex:favourites-changed";

const readIds = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(FAVOURITES_KEY) || "[]");
    return Array.isArray(stored) ? stored.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
};

const notify = () => window.dispatchEvent(new Event(CHANGE_EVENT));
export const getFavouriteIds = () => readIds();

export const setFavourite = (id, saved) => {
  const ids = readIds().filter((savedId) => savedId !== id);
  if (saved) ids.push(id);
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(ids));
  notify();
  return ids;
};

export const useFavourites = () => {
  const [ids, setIds] = useState(readIds);
  useEffect(() => {
    const refresh = () => setIds(readIds());
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return ids;
};
