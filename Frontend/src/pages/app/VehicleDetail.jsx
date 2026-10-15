import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { carName, dateTime, money, toIso } from "@/lib/format";
import { Badge, Button, Empty, Field, Loading, Notice, PageHeading, Panel } from "@/components/app/Ui";

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [locations, setLocations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [form, setForm] = useState({ startAt: "", endAt: "", dropoffLocationId: "", couponCode: "", notes: "" });
  const [quote, setQuote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([api(`/vehicles/${id}`, { auth: false }), api("/locations?limit=100", { auth: false }), api(`/vehicles/${id}/reviews`, { auth: false }), api(`/vehicles/${id}/availability`, { auth: false })])
      .then(([details, branches, feedback, booked]) => { setVehicle(details.data); setLocations(branches.data); setReviews(feedback.data); setAvailability(booked.data); setForm((current) => ({ ...current, dropoffLocationId: details.data.locationId })); })
      .catch(setError);
  }, [id]);
  const change = (event) => { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); setQuote(null); };
  const body = () => ({ vehicleId: id, pickupLocationId: vehicle.locationId, dropoffLocationId: form.dropoffLocationId || vehicle.locationId, startAt: toIso(form.startAt), endAt: toIso(form.endAt), ...(form.couponCode && { couponCode: form.couponCode }), ...(form.notes && { notes: form.notes }) });
  async function preview(event) { event.preventDefault(); setBusy(true); setError(""); try { setQuote((await api("/bookings/quote", { method: "POST", body: body(), auth: false })).data); } catch (failure) { setError(failure); } finally { setBusy(false); } }
  async function book() { if (!user) { navigate("/app/login", { state: { from: `/app/vehicles/${id}` } }); return; } setBusy(true); setError(""); try { const result = await api("/bookings", { method: "POST", body: body() }); navigate(`/app/bookings/${result.data.id}`); } catch (failure) { setError(failure); } finally { setBusy(false); } }
  if (!vehicle && !error) return <Loading />;
  if (!vehicle) return <Notice error={error} />;
  return <>
    <PageHeading title={carName(vehicle)} description={`${vehicle.category?.name} · ${vehicle.location?.name}, ${vehicle.location?.city}`} action={<Link className="portal-button secondary" to="/app">Back to fleet</Link>} />
    <div className="portal-detail"><div>
      <Panel title="Vehicle details"><img className="portal-hero-image" src={vehicle.images?.find((image) => image.isPrimary)?.url || vehicle.images?.[0]?.url || "/images/showroom-red.webp"} alt={carName(vehicle)} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/showroom-red.webp"; }} /><dl className="portal-kv"><div><dt>Daily rate</dt><dd>{money(vehicle.dailyRate)}</dd></div><div><dt>Deposit</dt><dd>{money(vehicle.category?.depositAmount)}</dd></div><div><dt>Year</dt><dd>{vehicle.year}</dd></div><div><dt>Transmission</dt><dd>{vehicle.transmission}</dd></div><div><dt>Fuel</dt><dd>{vehicle.fuelType}</dd></div><div><dt>Seats / doors</dt><dd>{vehicle.seats} / {vehicle.doors}</dd></div><div><dt>Mileage</dt><dd>{vehicle.mileageKm?.toLocaleString()} km</dd></div><div><dt>Average rating</dt><dd>{vehicle.averageRating ? `${vehicle.averageRating.toFixed(1)} / 5` : "New"}</dd></div></dl></Panel>
      <Panel title="Booked dates">{availability.length ? <ul>{availability.map((range, index) => <li className="portal-muted" key={index}>{dateTime(range.startAt)} → {dateTime(range.endAt)}</li>)}</ul> : <p className="portal-muted">No upcoming reservations.</p>}</Panel>
      <Panel title="Customer reviews">{reviews.length ? reviews.map((review) => <div className="portal-review" key={review.id}><strong>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</strong><p>{review.comment}</p><small className="portal-muted">{review.customer?.fullName}</small></div>) : <Empty title="No reviews yet" />}</Panel>
    </div><div><Panel title="Plan your rental"><form onSubmit={preview} className="portal-form" style={{ gridTemplateColumns: "1fr" }}><Field label="Pickup date and time" name="startAt" type="datetime-local" value={form.startAt} onChange={change} required /><Field label="Return date and time" name="endAt" type="datetime-local" value={form.endAt} onChange={change} required /><Field label="Drop-off location" name="dropoffLocationId" value={form.dropoffLocationId} onChange={change} options={locations.map((location) => ({ value: location.id, label: `${location.name}, ${location.city}` }))} required /><Field label="Coupon code" name="couponCode" value={form.couponCode} onChange={change} /><Field label="Notes" name="notes" type="textarea" value={form.notes} onChange={change} /><Button disabled={busy} type="submit">{busy ? "Checking…" : "Get quote"}</Button></form><Notice error={error} />{quote && <div style={{ marginTop: 20 }}><dl className="portal-kv"><div><dt>Days</dt><dd>{quote.totalDays}</dd></div><div><dt>Subtotal</dt><dd>{money(quote.subtotal)}</dd></div><div><dt>Discount</dt><dd>−{money(quote.discountAmount)}</dd></div><div><dt>Tax</dt><dd>{money(quote.taxAmount)}</dd></div><div><dt>Refundable deposit</dt><dd>{money(quote.depositAmount)}</dd></div><div><dt>Rental total</dt><dd>{money(quote.totalAmount)}</dd></div></dl>{user?.role === "ADMIN" ? <p className="portal-muted">Sign in as a customer to book.</p> : <Button disabled={busy} onClick={book}>{user ? "Confirm booking" : "Sign in to book"}</Button>}</div>}</Panel></div></div>
  </>;
}
