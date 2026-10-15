import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, queryString } from "@/lib/api";
import { carName, dateTime, money } from "@/lib/format";
import { Badge, Empty, Field, Loading, Notice, PageHeading, Pager, Panel } from "@/components/app/Ui";

const statuses = ["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED", "REJECTED"];
export default function Bookings() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); api(`/bookings/my${queryString({ status, page })}`).then((result) => { if (active) { setRows(result.data); setMeta(result.meta); } }).catch((failure) => { if (active) setError(failure); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [status, page]);
  return <><PageHeading title="My bookings" description="Review reservations, payments, and completed rentals." action={<Link className="portal-button" to="/app">Find a car</Link>} /><Panel title="Reservations" action={<div style={{ width: 180 }}><Field label="Filter status" name="status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} options={statuses} /></div>}><Notice error={error} />{loading ? <Loading /> : rows.length ? <><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Booking</th><th>Vehicle</th><th>Pickup</th><th>Return</th><th>Status</th><th>Total</th><th></th></tr></thead><tbody>{rows.map((booking) => <tr key={booking.id}><td>{booking.bookingNo}</td><td>{carName(booking.vehicle)}</td><td>{dateTime(booking.startAt)}</td><td>{dateTime(booking.endAt)}</td><td><Badge value={booking.status} /></td><td>{money(booking.totalAmount)}</td><td><Link to={`/app/bookings/${booking.id}`}>Open</Link></td></tr>)}</tbody></table></div><Pager meta={meta} onPage={setPage} /></> : <Empty title="No bookings yet" to="/app" action="Browse vehicles" />}</Panel></>;
}
