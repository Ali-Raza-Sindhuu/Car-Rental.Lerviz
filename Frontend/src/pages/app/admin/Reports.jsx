import { useState } from "react";
import { api, queryString } from "@/lib/api";
import { dateOnly, money, toIso } from "@/lib/format";
import { Button, Empty, Field, Notice, PageHeading, Panel } from "@/components/app/Ui";

const now = new Date();
const beginning = new Date(now.getFullYear(), now.getMonth(), 1);
const localDate = (date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

export default function Reports() {
  const [form, setForm] = useState({ from: localDate(beginning), to: localDate(now), groupBy: "day" });
  const [revenue, setRevenue] = useState(null);
  const [utilization, setUtilization] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function load(event) {
    event.preventDefault(); setBusy(true); setError("");
    try { const range = { from: toIso(form.from), to: toIso(form.to) }; const [revenueResult, utilizationResult] = await Promise.all([api(`/admin/reports/revenue${queryString({ ...range, groupBy: form.groupBy })}`), api(`/admin/reports/utilization${queryString(range)}`)]); setRevenue(revenueResult.data); setUtilization(utilizationResult.data); }
    catch (failure) { setError(failure); } finally { setBusy(false); }
  }
  return <><PageHeading title="Reports" description="Settled revenue and booked fleet time for a selected period." /><Panel title="Report period"><form className="portal-form three" onSubmit={load}><Field label="From" name="from" type="datetime-local" value={form.from} onChange={(event) => setForm((current) => ({ ...current, from: event.target.value }))} required /><Field label="To" name="to" type="datetime-local" value={form.to} onChange={(event) => setForm((current) => ({ ...current, to: event.target.value }))} required /><Field label="Revenue grouping" name="groupBy" value={form.groupBy} onChange={(event) => setForm((current) => ({ ...current, groupBy: event.target.value }))} options={["day", "month"]} /><div className="full"><Button disabled={busy} type="submit">{busy ? "Loading…" : "Run reports"}</Button></div></form></Panel><Notice error={error} />{revenue && <Panel title="Net revenue">{revenue.length ? <div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Period</th><th>Revenue</th></tr></thead><tbody>{revenue.map((row) => <tr key={row.period}><td>{dateOnly(row.period)}</td><td>{money(row.revenue)}</td></tr>)}</tbody></table></div> : <Empty title="No settled payments in this period" />}</Panel>}{utilization && <><Panel title="By category"><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Category</th><th>Vehicles</th><th>Booked days</th><th>Utilization</th></tr></thead><tbody>{utilization.byCategory?.map((row) => <tr key={row.categoryId}><td>{row.category}</td><td>{row.vehicles}</td><td>{row.bookedDays}</td><td>{row.utilizationPercent}%</td></tr>)}</tbody></table></div></Panel><Panel title="By vehicle"><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Vehicle</th><th>Category</th><th>Booked days</th><th>Utilization</th></tr></thead><tbody>{utilization.perVehicle?.map((row) => <tr key={row.vehicleId}><td>{row.make} {row.model}</td><td>{row.category}</td><td>{row.bookedDays}</td><td>{row.utilizationPercent}%</td></tr>)}</tbody></table></div></Panel></>}</>;
}
