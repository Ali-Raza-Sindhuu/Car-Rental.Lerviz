import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, queryString } from "@/lib/api";
import { dateTime, money, toInputDateTime, toIso } from "@/lib/format";
import { Badge, Button, Empty, Field, Loading, Notice, PageHeading, Pager, Panel } from "@/components/app/Ui";
import { resources } from "./resourceConfig";

function initialValues(fields) { return Object.fromEntries(fields.map((field) => [field.name, field.name === "isActive" ? "true" : field.name === "status" ? field.options?.includes("AVAILABLE") ? "AVAILABLE" : "OPEN" : field.name === "minDays" ? "1" : ""])); }
function fromRecord(fields, record) { return Object.fromEntries(fields.map((field) => [field.name, field.type === "datetime-local" ? toInputDateTime(record[field.name]) : String(record[field.name] ?? "")])); }
function toBody(fields, form, editing) {
  return Object.fromEntries(fields.filter((field) => !(editing && field.createOnly)).filter((field) => form[field.name] !== "" && form[field.name] !== undefined).map((field) => {
    const value = form[field.name];
    return [field.name, field.type === "number" ? Number(value) : field.type === "datetime-local" ? toIso(value) : field.name === "isActive" ? value === "true" : value];
  }));
}

export default function ResourcePage() {
  const { resource } = useParams();
  const config = resources[resource];
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(config ? initialValues(config.fields) : {});
  const [options, setOptions] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [version, setVersion] = useState(0);
  const [filters, setFilters] = useState({});

  const load = useCallback(() => { if (!config) return; setLoading(true); api(`/admin/${resource}${queryString({ page, limit: 10, ...filters })}`).then((result) => { setRows(result.data); setMeta(result.meta); }).catch(setError).finally(() => setLoading(false)); }, [resource, config, page, filters]);
  useEffect(() => { load(); }, [load, version]);
  useEffect(() => {
    if (!config) return;
    setEditId(null); setForm(initialValues(config.fields)); setFilters({}); setPage(1);
    const dependencies = [...new Set([...config.fields, ...(config.filters || [])].filter((field) => typeof field.options === "string").map((field) => field.options))];
    Promise.all(dependencies.map(async (dependency) => [dependency, (await api(`/admin/${dependency}?limit=100`)).data]))
      .then((pairs) => setOptions(Object.fromEntries(pairs))).catch(setError);
  }, [resource, config]);

  if (!config) return <Empty title="Unknown admin section" />;
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  function choices(field) {
    if (typeof field.options !== "string") return field.options;
    return (options[field.options] || []).map((item) => ({ value: item.id, label: field.options === "vehicles" ? `${item.make} ${item.model} · ${item.plateNo}` : item.name }));
  }
  async function edit(row) {
    setError(""); setSuccess("");
    try { const { data } = await api(`/admin/${resource}/${row.id}`); setEditId(row.id); setForm(fromRecord(config.fields, data)); window.scrollTo({ top: 0, behavior: "smooth" }); }
    catch (failure) { setError(failure); }
  }
  async function save(event) {
    event.preventDefault(); setBusy(true); setError(""); setSuccess("");
    try { await api(editId ? `/admin/${resource}/${editId}` : `/admin/${resource}`, { method: editId ? "PATCH" : "POST", body: toBody(config.fields, form, Boolean(editId)) }); setSuccess(`${config.singular} ${editId ? "updated" : "created"}.`); setEditId(null); setForm(initialValues(config.fields)); setVersion((value) => value + 1); }
    catch (failure) { setError(failure); } finally { setBusy(false); }
  }
  async function remove(row) {
    if (!window.confirm(`Delete ${config.summary(row)}?`)) return;
    setBusy(true); setError(""); setSuccess("");
    try { await api(`/admin/${resource}/${row.id}`, { method: "DELETE" }); setSuccess(`${config.singular} deleted.`); if (editId === row.id) { setEditId(null); setForm(initialValues(config.fields)); } setVersion((value) => value + 1); }
    catch (failure) { setError(failure); } finally { setBusy(false); }
  }
  async function addImage(event) {
    event.preventDefault(); setBusy(true); setError("");
    try { await api(`/admin/vehicles/${editId}/images`, { method: "POST", body: { url: imageUrl, isPrimary } }); setImageUrl(""); setSuccess("Image added."); setVersion((value) => value + 1); }
    catch (failure) { setError(failure); } finally { setBusy(false); }
  }
  return <><PageHeading title={config.title} description={`Manage ${config.title.toLowerCase()} in the live database.`} /><Notice error={error} success={success} />
    {config.filters?.length > 0 && <Panel title="Filter and sort"><div className="portal-form three">{config.filters.map((field) => <Field key={field.name} {...field} value={filters[field.name] || ""} onChange={(event) => { setFilters((current) => ({ ...current, [event.target.name]: event.target.value })); setPage(1); }} options={field.options ? choices(field) : undefined} />)}<div style={{ alignSelf: "end" }}><Button variant="secondary" onClick={() => { setFilters({}); setPage(1); }}>Clear filters</Button></div></div></Panel>}
    <Panel title={editId ? `Edit ${config.singular.toLowerCase()}` : `Add ${config.singular.toLowerCase()}`} action={editId && <Button variant="secondary" onClick={() => { setEditId(null); setForm(initialValues(config.fields)); }}>New record</Button>}><form className="portal-form three" onSubmit={save}>{config.fields.filter((field) => !(editId && field.createOnly)).map((field) => <Field key={field.name} {...field} value={form[field.name]} onChange={change} options={field.options ? choices(field) : undefined} />)}<div className="full portal-actions"><Button type="submit" disabled={busy}>{editId ? "Save changes" : `Create ${config.singular.toLowerCase()}`}</Button></div></form>
      {resource === "vehicles" && editId && <form className="portal-form" style={{ marginTop: 24 }} onSubmit={addImage}><Field label="Image URL" name="imageUrl" type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} required /><Field label="Primary image" name="isPrimary" value={String(isPrimary)} onChange={(event) => setIsPrimary(event.target.value === "true")} options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]} /><div className="full"><Button disabled={busy} type="submit">Add image</Button></div></form>}
    </Panel>
    <Panel title={`Existing ${config.title.toLowerCase()}`}>
      {loading ? <Loading /> : rows.length ? <><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>{config.singular}</th><th>Details</th><th>State</th><th>Updated</th><th>Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{config.summary(row)}</strong></td><td>{resource === "vehicles" ? `${row.year} · ${money(row.dailyRate)} / day` : resource === "coupons" ? `${row.usedCount} / ${row.maxUses} uses` : resource === "categories" ? `${money(row.baseDailyRate)} / day` : resource === "maintenance" ? `${money(row.cost)} · ${row.description}` : row.address}</td><td>{row.status ? <Badge value={row.status} /> : row.isActive !== undefined ? <Badge value={row.isActive ? "ACTIVE" : "INACTIVE"} /> : "—"}</td><td>{dateTime(row.updatedAt)}</td><td><div className="portal-actions"><Button variant="secondary" disabled={busy} onClick={() => edit(row)}>Edit</Button><Button variant="danger" disabled={busy} onClick={() => remove(row)}>Delete</Button></div></td></tr>)}</tbody></table></div><Pager meta={meta} onPage={setPage} /></> : <Empty title={`No ${config.title.toLowerCase()} yet`} />}
    </Panel></>;
}
