import { useCallback, useEffect, useState } from "react";
import { api, queryString } from "@/lib/api";
import { dateTime, money } from "@/lib/format";
import { Badge, Button, Empty, Field, Loading, Notice, PageHeading, Pager, Panel } from "@/components/app/Ui";

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState("");
  const [rows, setRows] = useState([]);
  const [detail, setDetail] = useState(null);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [version, setVersion] = useState(0);
  const load = useCallback(() => { setLoading(true); api(`/admin/customers${queryString({ search: applied, page, limit: 10 })}`).then((result) => { setRows(result.data); setMeta(result.meta); }).catch(setError).finally(() => setLoading(false)); }, [applied, page]);
  useEffect(() => { load(); }, [load, version]);
  async function open(id) { try { setDetail((await api(`/admin/customers/${id}`)).data); } catch (failure) { setError(failure); } }
  async function toggle(customer) { setError(""); setSuccess(""); try { await api(`/admin/customers/${customer.id}/status`, { method: "PATCH", body: { isActive: !customer.isActive } }); setSuccess("Customer status updated."); setVersion((value) => value + 1); if (detail?.id === customer.id) open(customer.id); } catch (failure) { setError(failure); } }
  return <><PageHeading title="Customers" description="Search accounts, inspect rental history, and control access." /><Notice error={error} success={success} /><Panel title="Find customers"><form className="portal-actions" onSubmit={(event) => { event.preventDefault(); setApplied(search); setPage(1); }}><div style={{ width: "min(100%, 320px)" }}><Field label="Name or email" name="search" value={search} onChange={(event) => setSearch(event.target.value)} /></div><Button type="submit">Search</Button></form></Panel>
    {detail && <Panel title={detail.fullName} action={<Button variant="secondary" onClick={() => setDetail(null)}>Close details</Button>}><p className="portal-muted">{detail.email} · {detail.phone || "No phone"} · <Badge value={detail.isActive ? "ACTIVE" : "INACTIVE"} /></p><dl className="portal-kv"><div><dt>Date of birth</dt><dd>{detail.profile?.dateOfBirth?.slice(0, 10) || "—"}</dd></div><div><dt>License</dt><dd>{detail.profile?.drivingLicenseNo || "—"}</dd></div><div><dt>License expiry</dt><dd>{detail.profile?.licenseExpiry?.slice(0, 10) || "—"}</dd></div><div><dt>City</dt><dd>{detail.profile?.city || "—"}</dd></div></dl><h3>Rental history</h3>{detail.bookings?.length ? <div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Booking</th><th>Vehicle</th><th>Start</th><th>Status</th><th>Total</th></tr></thead><tbody>{detail.bookings.map((booking) => <tr key={booking.id}><td>{booking.bookingNo}</td><td>{booking.vehicle?.make} {booking.vehicle?.model}</td><td>{dateTime(booking.startAt)}</td><td><Badge value={booking.status} /></td><td>{money(booking.totalAmount)}</td></tr>)}</tbody></table></div> : <p className="portal-muted">No rentals yet.</p>}</Panel>}
    <Panel title="Accounts">{loading ? <Loading /> : rows.length ? <><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead><tbody>{rows.map((customer) => <tr key={customer.id}><td>{customer.fullName}</td><td>{customer.email}</td><td>{customer.phone || "—"}</td><td><Badge value={customer.isActive ? "ACTIVE" : "INACTIVE"} /></td><td>{dateTime(customer.createdAt)}</td><td><div className="portal-actions"><Button variant="secondary" onClick={() => open(customer.id)}>Details</Button><Button variant={customer.isActive ? "danger" : "secondary"} onClick={() => toggle(customer)}>{customer.isActive ? "Deactivate" : "Activate"}</Button></div></td></tr>)}</tbody></table></div><Pager meta={meta} onPage={setPage} /></> : <Empty title="No customers found" />}</Panel></>;
}
