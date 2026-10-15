import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, queryString } from "@/lib/api";
import { carName, money, toIso } from "@/lib/format";
import { Button, Empty, Field, Loading, Notice, PageHeading, Pager, Panel } from "@/components/app/Ui";

const initial = { category: "", location: "", transmission: "", fuel: "", seats: "", minPrice: "", maxPrice: "", startDate: "", endDate: "", sort: "price_asc" };

export default function Catalog() {
  const [filters, setFilters] = useState(initial);
  const [applied, setApplied] = useState(initial);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api("/categories?limit=100", { auth: false }), api("/locations?limit=100", { auth: false })])
      .then(([categoryResult, locationResult]) => { setCategories(categoryResult.data); setLocations(locationResult.data); })
      .catch(setError);
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    const params = { ...applied, startDate: toIso(applied.startDate), endDate: toIso(applied.endDate), page, limit: 9 };
    api(`/vehicles${queryString(params)}`, { auth: false }).then((result) => { if (active) { setVehicles(result.data); setMeta(result.meta); } })
      .catch((failure) => { if (active) setError(failure); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [applied, page]);

  const change = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  const options = (items, label) => items.map((item) => ({ value: item.id, label: item.name || `${item.city} · ${item.name}` }));
  function apply(event) {
    event.preventDefault();
    if (Boolean(filters.startDate) !== Boolean(filters.endDate)) { setError("Enter both pickup and return dates."); return; }
    setPage(1); setApplied({ ...filters });
  }
  return <>
    <PageHeading title="Find your drive" description="Search the live fleet and choose dates to see available cars." />
    <Panel title="Search and filter"><form className="portal-form three" onSubmit={apply}>
      <Field label="Pickup" name="startDate" type="datetime-local" value={filters.startDate} onChange={change} />
      <Field label="Return" name="endDate" type="datetime-local" value={filters.endDate} onChange={change} />
      <Field label="Location" name="location" value={filters.location} onChange={change} options={locations.map((item) => ({ value: item.id, label: `${item.name}, ${item.city}` }))} />
      <Field label="Category" name="category" value={filters.category} onChange={change} options={options(categories)} />
      <Field label="Transmission" name="transmission" value={filters.transmission} onChange={change} options={["AUTOMATIC", "MANUAL"]} />
      <Field label="Fuel" name="fuel" value={filters.fuel} onChange={change} options={["PETROL", "DIESEL", "HYBRID", "ELECTRIC"]} />
      <Field label="Minimum seats" name="seats" type="number" min="1" value={filters.seats} onChange={change} />
      <Field label="Minimum daily rate" name="minPrice" type="number" min="0" value={filters.minPrice} onChange={change} />
      <Field label="Maximum daily rate" name="maxPrice" type="number" min="0" value={filters.maxPrice} onChange={change} />
      <Field label="Sort" name="sort" value={filters.sort} onChange={change} options={[{ value: "price_asc", label: "Price: low to high" }, { value: "price_desc", label: "Price: high to low" }, { value: "year_desc", label: "Newest first" }, { value: "year_asc", label: "Oldest first" }]} />
      <div className="portal-actions" style={{ alignSelf: "end" }}><Button type="submit">Search vehicles</Button><Button type="button" variant="secondary" onClick={() => { setFilters(initial); setApplied(initial); setPage(1); }}>Clear</Button></div>
    </form></Panel>
    <Notice error={error} />
    {loading ? <Loading /> : vehicles.length ? <><div className="portal-grid">{vehicles.map((vehicle) => <article className="portal-car" key={vehicle.id}>
      <img className="portal-car-image" src={vehicle.images?.find((image) => image.isPrimary)?.url || vehicle.images?.[0]?.url || "/images/showroom-red.webp"} alt={carName(vehicle)} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/showroom-red.webp"; }} />
      <div className="portal-car-body"><div><h2>{carName(vehicle)}</h2><p>{vehicle.category?.name} · {vehicle.location?.name}, {vehicle.location?.city}</p></div><p>{vehicle.year} · {vehicle.transmission?.toLowerCase()} · {vehicle.seats} seats</p><div className="portal-car-foot"><span><strong>{money(vehicle.dailyRate)}</strong> / day</span><Link className="portal-button" to={`/app/vehicles/${vehicle.id}`}>View car</Link></div></div>
    </article>)}</div><Pager meta={meta} onPage={setPage} /></> : <Empty title="No vehicles match your search" description="Try other dates or clear some filters." />}
  </>;
}
