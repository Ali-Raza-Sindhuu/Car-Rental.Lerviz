import { useCallback, useEffect, useState } from "react";
import { api, queryString } from "@/lib/api";
import { carName, dateTime, money, toIso } from "@/lib/format";
import { Badge, Button, Empty, Field, Loading, Notice, PageHeading, Pager, Panel } from "@/components/app/Ui";

const statuses = ["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED", "REJECTED"];
export default function AdminBookings() {
  const [filters, setFilters] = useState({ status: "", customerId: "", vehicleId: "", from: "", to: "" });
  const [applied, setApplied] = useState({});
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");
  const [mileageKm, setMileageKm] = useState("");
  const [actualReturnAt, setActualReturnAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [version, setVersion] = useState(0);
  const load = useCallback(() => { setLoading(true); api(`/admin/bookings${queryString({ ...applied, page, limit: 10 })}`).then((result) => { setRows(result.data); setMeta(result.meta); }).catch(setError).finally(() => setLoading(false)); }, [applied, page]);
  useEffect(() => { load(); }, [load, version]);
  const change = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  function submitFilters(event) { event.preventDefault(); setApplied({ ...filters, from: toIso(filters.from), to: toIso(filters.to) }); setPage(1); }
  async function runAction() {
    if (!action) return;
    setBusy(true); setError(""); setSuccess("");
    const body = action.type === "reject" ? { reason } : action.type === "return" ? { mileageKm: Number(mileageKm), ...(actualReturnAt && { actualReturnAt: toIso(actualReturnAt) }) } : undefined;
    try { await api(`/admin/bookings/${action.booking.id}/${action.type}`, { method: "PATCH", ...(body && { body }) }); setSuccess(`Booking ${({ confirm: "confirmed", reject: "rejected", pickup: "picked up", return: "completed" })[action.type]}.`); setAction(null); setReason(""); setMileageKm(""); setVersion((value) => value + 1); }
    catch (failure) { setError(failure); } finally { setBusy(false); }
  }
  return <><PageHeading title="All bookings" description="Review reservations and move rentals through their lifecycle." /><Notice error={error} success={success} /><Panel title="Filter bookings"><form className="portal-form three" onSubmit={submitFilters}><Field label="Status" name="status" value={filters.status} onChange={change} options={statuses} /><Field label="Customer ID" name="customerId" value={filters.customerId} onChange={change} /><Field label="Vehicle ID" name="vehicleId" value={filters.vehicleId} onChange={change} /><Field label="From" name="from" type="datetime-local" value={filters.from} onChange={change} /><Field label="To" name="to" type="datetime-local" value={filters.to} onChange={change} /><div style={{ alignSelf: "end" }}><Button type="submit">Apply filters</Button></div></form></Panel>
    {action && <Panel title={`${action.type === "return" ? "Complete" : action.type === "pickup" ? "Mark pickup for" : `${action.type[0].toUpperCase()}${action.type.slice(1)}`} ${action.booking.bookingNo}`} action={<Button variant="secondary" onClick={() => setAction(null)}>Close</Button>}><div className="portal-form">{action.type === "reject" && <Field label="Reason" name="reason" value={reason} onChange={(event) => setReason(event.target.value)} required />}{action.type === "return" && <><Field label="Return mileage (km)" name="mileageKm" type="number" min={action.booking.vehicle?.mileageKm || 0} value={mileageKm} onChange={(event) => setMileageKm(event.target.value)} required /><Field label="Actual return (optional)" name="actualReturnAt" type="datetime-local" value={actualReturnAt} onChange={(event) => setActualReturnAt(event.target.value)} /></>}<div className="full portal-actions"><Button disabled={busy || (action.type === "reject" && reason.trim().length < 3) || (action.type === "return" && !mileageKm)} onClick={runAction}>Confirm {action.type}</Button></div></div></Panel>}
    <Panel title="Reservations">{loading ? <Loading /> : rows.length ? <><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Booking</th><th>Customer</th><th>Vehicle</th><th>Dates</th><th>Status</th><th>Total</th><th>Actions</th></tr></thead><tbody>{rows.map((booking) => <tr key={booking.id}><td>{booking.bookingNo}</td><td>{booking.customer?.fullName}<br /><small>{booking.customer?.email}</small></td><td>{carName(booking.vehicle)}</td><td>{dateTime(booking.startAt)}<br />{dateTime(booking.endAt)}</td><td><Badge value={booking.status} /></td><td>{money(booking.totalAmount)}</td><td><div className="portal-actions">{booking.status === "PENDING" && <><Button variant="secondary" onClick={() => setAction({ booking, type: "confirm" })}>Confirm</Button><Button variant="danger" onClick={() => setAction({ booking, type: "reject" })}>Reject</Button></>}{booking.status === "CONFIRMED" && <Button variant="secondary" onClick={() => setAction({ booking, type: "pickup" })}>Pickup</Button>}{booking.status === "ACTIVE" && <Button onClick={() => setAction({ booking, type: "return" })}>Return</Button>}</div></td></tr>)}</tbody></table></div><Pager meta={meta} onPage={setPage} /></> : <Empty title="No matching bookings" />}</Panel></>;
}
