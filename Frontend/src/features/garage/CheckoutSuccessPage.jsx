import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/api";

const ORDERS_ENABLED = false;

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("confirming");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!ORDERS_ENABLED) {
      setStatus("error");
      setMessage("Order confirmation is not connected yet. No payment or order status could be verified.");
      return undefined;
    }
    if (!sessionId) {
      setStatus("error");
      setMessage("The order session identifier is missing.");
      return undefined;
    }
    const controller = new AbortController();
    let active = true;
    let timeout;
    const deadline = Date.now() + 30000;
    const poll = async () => {
      try {
        const result = await apiRequest(`/api/orders/by-session?session_id=${encodeURIComponent(sessionId)}`, { signal: controller.signal });
        if (!active) return;
        const orderStatus = result.status ?? result.order?.status;
        if (["paid", "complete", "completed", "confirmed"].includes(String(orderStatus).toLowerCase())) {
          setStatus("received");
          return;
        }
        if (Date.now() >= deadline) {
          setStatus("timeout");
          return;
        }
        timeout = window.setTimeout(poll, 2000);
      } catch (error) {
        if (!active || error.name === "AbortError") return;
        setStatus("error");
        setMessage(`Order confirmation is unavailable: ${error.message}`);
      }
    };
    poll();
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [sessionId]);

  return (
    <section className="min-h-[65vh] bg-neutral-50 px-4 pb-20 pt-32 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[680px] rounded-2xl border border-neutral-200 bg-white p-7 text-center md:p-10">
        {status === "received" ? <CheckCircle2 aria-hidden="true" className="mx-auto size-10 text-[#f05a1a]" /> : status === "error" ? <p aria-hidden="true" className="mx-auto size-10 rounded-full border border-red-200 bg-red-50" /> : <p aria-hidden="true" className="mx-auto size-10 rounded-full border-2 border-neutral-200 border-t-[#f05a1a] motion-safe:animate-spin" />}
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-neutral-950">{status === "received" ? "Payment received" : status === "error" ? "Order confirmation unavailable" : "Confirming your order"}</h1>
        {status === "error" && <p role="alert" className="mt-4 text-sm text-red-700">{message}</p>}
        {status === "timeout" && <p role="status" className="mt-4 text-sm text-neutral-600">We could not confirm the order yet. Please check your account or contact support.</p>}
        {(status === "error" || status === "timeout" || status === "received") && <Link to="/cart" className="mt-6 inline-flex rounded-lg bg-neutral-900 px-5 py-3 text-xs font-semibold uppercase text-white">Return to Garage</Link>}
      </div>
    </section>
  );
};

export default CheckoutSuccessPage;
