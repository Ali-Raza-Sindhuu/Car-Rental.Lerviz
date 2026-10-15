export const money = (value) => value === null || value === undefined ? "—" : new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value));
export const dateTime = (value) => value ? new Date(value).toLocaleString() : "—";
export const dateOnly = (value) => value ? new Date(value).toLocaleDateString() : "—";
export const toIso = (value) => value ? new Date(value).toISOString() : undefined;
export const toInputDateTime = (value) => value ? new Date(new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";
export const titleCase = (value) => String(value || "").replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
export const carName = (vehicle) => vehicle ? `${vehicle.make} ${vehicle.model}` : "Vehicle";
