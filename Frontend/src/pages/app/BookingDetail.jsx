import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { carName, dateTime, money, titleCase } from "@/lib/format";
import { Badge, Button, Field, Loading, Notice, PageHeading, Panel } from "@/components/app/Ui";

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [payments, setPayments] = useState([]);
  const [method, setMethod] = useState("CARD");
  const [reason, setReason] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { const [details, history] = await Promise.all([api(`/bookings/${id}`), api(`/bookings/${id}/payments`)]); setBooking(details.data); setPayments(history.data); }, [id]);
  useEffect(() => { load().catch(setError); }, [load]);
  async function action(path, body, message) { setBusy(true); setError(""); setSuccess(""); try { await api(`/bookings/${id}${path}`, { method: "POST", body }); await load(); setSuccess(message); } catch (failure) { setError(failure); } finally { setBusy(false); } }
  if (!booking && !error) return <Loading />;
  if (!booking) return <Notice error={error} />;
  const paidRental = payments.some((payment) => payment.type === "RENTAL" && payment.status === "PAID");
  const outstandingLate = payments.some((payment) => payment.type === "LATE_FEE" && payment.status === "PENDING");
  const canPay = (!paidRental && ["PENDING", "CONFIRMED", "ACTIVE"].includes(booking.status)) || outstandingLate;
  return <><PageHeading title={`Booking ${booking.bookingNo}`} description={`${carName(booking.vehicle)} · ${dateTime(booking.startAt)} to ${dateTime(booking.endAt)}`} action={<Link className="portal-button secondary" to="/app/bookings">All bookings</Link>} /><Notice error={error} success={success} /><div className="portal-grid two"><div><Panel title="Reservation"><div className="portal-actions"><Badge value={booking.status} /><Link to={`/app/vehicles/${booking.vehicleId}`}>View vehicle</Link></div><dl className="portal-kv"><div><dt>Pickup</dt><dd>{booking.pickupLocation?.name}</dd></div><div><dt>Drop-off</dt><dd>{booking.dropoffLocation?.name}</dd></div><div><dt>Start</dt><dd>{dateTime(booking.startAt)}</dd></div><div><dt>End</dt><dd>{dateTime(booking.endAt)}</dd></div><div><dt>Rental days</dt><dd>{booking.totalDays}</dd></div><div><dt>Daily rate</dt><dd>{money(booking.dailyRateSnapshot)}</dd></div><div><dt>Subtotal</dt><dd>{money(booking.subtotal)}</dd></div><div><dt>Discount</dt><dd>−{money(booking.discountAmount)}</dd></div><div><dt>Tax</dt><dd>{money(booking.taxAmount)}</dd></div><div><dt>Refundable deposit</dt><dd>{money(booking.depositAmount)}</dd></div><div><dt>Late fee</dt><dd>{money(booking.lateFee)}</dd></div><div><dt>Rental total</dt><dd>{money(booking.totalAmount)}</dd></div></dl>{booking.cancelReason && <p className="portal-muted">Reason: {booking.cancelReason}</p>}</Panel>
      <Panel title="Payment history">{payments.length ? <div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id}><td>{titleCase(payment.type)}</td><td>{money(payment.amount)}</td><td>{payment.method}</td><td><Badge value={payment.status} /></td><td>{dateTime(payment.paidAt || payment.createdAt)}</td></tr>)}</tbody></table></div> : <p className="portal-muted">No payments recorded.</p>}</Panel></div><div>
      {canPay && <Panel title={outstandingLate && paidRental ? "Pay late fee" : "Pay rental and deposit"}><p className="portal-muted" style={{ marginBottom: 14 }}>This demo uses a mock payment gateway. No real card details are collected.</p><Field label="Payment method" name="method" value={method} onChange={(event) => setMethod(event.target.value)} options={["CARD", "CASH", "ONLINE"]} /><div style={{ marginTop: 14 }}><Button disabled={busy} onClick={() => action("/payments", { method }, "Payment recorded.")}>Pay now</Button></div></Panel>}
      {["PENDING", "CONFIRMED"].includes(booking.status) && new Date(booking.startAt) > new Date() && <Panel title="Cancel booking"><p className="portal-muted" style={{ marginBottom: 14 }}>Refund: full 48+ hours before pickup, half between 24 and 48 hours, none under 24 hours. Paid deposits are returned.</p><Field label="Cancellation reason" name="reason" value={reason} onChange={(event) => setReason(event.target.value)} /><div style={{ marginTop: 14 }}><Button variant="danger" disabled={busy || reason.trim().length < 3} onClick={() => action("/cancel", { reason }, "Booking cancelled.")}>Cancel booking</Button></div></Panel>}
      {booking.status === "COMPLETED" && !booking.review && <Panel title="Review your rental"><div className="portal-form" style={{ gridTemplateColumns: "1fr" }}><Field label="Rating" name="rating" value={rating} onChange={(event) => setRating(Number(event.target.value))} options={[1, 2, 3, 4, 5].map((value) => ({ value, label: `${value} star${value > 1 ? "s" : ""}` }))} /><Field label="Comment" name="comment" type="textarea" value={comment} onChange={(event) => setComment(event.target.value)} /><Button disabled={busy || comment.trim().length < 5} onClick={() => action("/review", { rating, comment }, "Review posted.")}>Post review</Button></div></Panel>}
      {booking.review && <Panel title="Your review"><strong>{"★".repeat(booking.review.rating)}</strong><p>{booking.review.comment}</p></Panel>}
    </div></div></>;
}
