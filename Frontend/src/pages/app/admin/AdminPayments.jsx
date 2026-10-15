import { useEffect, useState } from "react";
import { api, queryString } from "@/lib/api";
import { dateTime, money, toIso } from "@/lib/format";
import { Badge, Button, Empty, Field, Loading, Notice, PageHeading, Pager, Panel } from "@/components/app/Ui";

export default function AdminPayments() {
  const [filters, setFilters] = useState({ status: "", from: "", to: "" });
  const [applied, setApplied] = useState({});
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); api(`/admin/payments${queryString({ ...applied, page, limit: 10 })}`).then((result) => { if (active) { setRows(result.data); setMeta(result.meta); } }).catch((failure) => { if (active) setError(failure); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [applied, page]);
  const change = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  return <><PageHeading title="Payments" description="Inspect rental charges, deposits, refunds, and late fees." /><Panel title="Filter payments"><form className="portal-form three" onSubmit={(event) => { event.preventDefault(); setApplied({ ...filters, from: toIso(filters.from), to: toIso(filters.to) }); setPage(1); }}><Field label="Status" name="status" value={filters.status} onChange={change} options={["PENDING", "PAID", "FAILED", "REFUNDED"]} /><Field label="From" name="from" type="datetime-local" value={filters.from} onChange={change} /><Field label="To" name="to" type="datetime-local" value={filters.to} onChange={change} /><div className="full"><Button type="submit">Apply filters</Button></div></form></Panel><Panel title="Payment records"><Notice error={error} />{loading ? <Loading /> : rows.length ? <><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Booking</th><th>Customer</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Reference</th></tr></thead><tbody>{rows.map((payment) => <tr key={payment.id}><td>{payment.booking?.bookingNo}</td><td>{payment.booking?.customer?.fullName}</td><td>{payment.type}</td><td>{money(payment.amount)}</td><td>{payment.method}</td><td><Badge value={payment.status} /></td><td>{dateTime(payment.paidAt || payment.createdAt)}</td><td>{payment.transactionRef || "—"}</td></tr>)}</tbody></table></div><Pager meta={meta} onPage={setPage} /></> : <Empty title="No payments found" />}</Panel></>;
}
