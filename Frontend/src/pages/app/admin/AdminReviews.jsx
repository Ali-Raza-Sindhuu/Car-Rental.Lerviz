import { useEffect, useState } from "react";
import { api, queryString } from "@/lib/api";
import { dateTime } from "@/lib/format";
import { Button, Empty, Loading, Notice, PageHeading, Pager, Panel } from "@/components/app/Ui";

export default function AdminReviews() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => { let active = true; setLoading(true); api(`/admin/reviews${queryString({ page, limit: 10 })}`).then((result) => { if (active) { setRows(result.data); setMeta(result.meta); } }).catch((failure) => { if (active) setError(failure); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [page, version]);
  async function remove(review) { if (!window.confirm("Remove this review?")) return; setError(""); setSuccess(""); try { await api(`/admin/reviews/${review.id}`, { method: "DELETE" }); setSuccess("Review removed."); setVersion((value) => value + 1); } catch (failure) { setError(failure); } }
  return <><PageHeading title="Reviews" description="Read feedback and moderate public reviews." /><Notice error={error} success={success} /><Panel title="Customer feedback">{loading ? <Loading /> : rows.length ? <><div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Customer</th><th>Vehicle</th><th>Rating</th><th>Comment</th><th>Date</th><th></th></tr></thead><tbody>{rows.map((review) => <tr key={review.id}><td>{review.customer?.fullName}</td><td>{review.vehicle?.make} {review.vehicle?.model}</td><td>{"★".repeat(review.rating)}</td><td>{review.comment}</td><td>{dateTime(review.createdAt)}</td><td><Button variant="danger" onClick={() => remove(review)}>Remove</Button></td></tr>)}</tbody></table></div><Pager meta={meta} onPage={setPage} /></> : <Empty title="No reviews yet" />}</Panel></>;
}
