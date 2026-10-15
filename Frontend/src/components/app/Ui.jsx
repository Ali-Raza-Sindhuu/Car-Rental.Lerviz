import { Link } from "react-router-dom";
import { titleCase } from "@/lib/format";

export function PageHeading({ title, description, action }) {
  return <div className="portal-heading"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}
export function Panel({ title, children, action, className = "" }) {
  return <section className={`portal-panel ${className}`}><div className="portal-panel-head"><h2>{title}</h2>{action}</div>{children}</section>;
}
export function Notice({ error, success }) {
  if (!error && !success) return null;
  return <div role={error ? "alert" : "status"} className={`portal-notice ${error ? "is-error" : "is-success"}`}>{error?.message || error || success}</div>;
}
export function Loading() { return <div className="portal-loading" role="status">Loading…</div>; }
export function Empty({ title = "Nothing here yet", description, to, action }) {
  return <div className="portal-empty"><strong>{title}</strong>{description && <p>{description}</p>}{to && <Link className="portal-button" to={to}>{action || "Explore vehicles"}</Link>}</div>;
}
export function Badge({ value }) { return <span className={`portal-badge badge-${String(value).toLowerCase()}`}>{titleCase(value)}</span>; }
export function Button({ children, variant = "primary", ...props }) { return <button className={`portal-button ${variant === "secondary" ? "secondary" : variant === "danger" ? "danger" : ""}`} {...props}>{children}</button>; }
export function Field({ label, name, value, onChange, type = "text", options, placeholder, required, min, max, step, disabled, rows, ...props }) {
  const common = { id: name, name, value: value ?? "", onChange, required, disabled, ...props };
  return <label className="portal-field" htmlFor={name}><span>{label}</span>
    {options ? <select {...common}><option value="">Select {label.toLowerCase()}</option>{options.map((option) => typeof option === "string" ? <option key={option} value={option}>{titleCase(option)}</option> : <option key={option.value} value={option.value}>{option.label}</option>)}</select>
      : type === "textarea" ? <textarea {...common} rows={rows || 3} placeholder={placeholder} />
      : <input {...common} type={type} placeholder={placeholder} min={min} max={max} step={step} />}
  </label>;
}
export function Pager({ meta, onPage }) {
  if (!meta || meta.total <= meta.limit) return null;
  return <div className="portal-pager"><span>{meta.total} results · Page {meta.page} of {Math.ceil(meta.total / meta.limit)}</span><div><Button variant="secondary" disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)}>Previous</Button><Button variant="secondary" disabled={meta.page * meta.limit >= meta.total} onClick={() => onPage(meta.page + 1)}>Next</Button></div></div>;
}
