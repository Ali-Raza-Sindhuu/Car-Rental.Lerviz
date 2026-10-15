import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button, Field, Notice, PageHeading, Panel } from "@/components/app/Ui";

export default function Auth({ register = false }) {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={user.role === "ADMIN" ? "/app/admin" : "/app"} replace />;
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const account = register ? await signUp(form) : await signIn(form.email, form.password);
      navigate(location.state?.from || (account.role === "ADMIN" ? "/app/admin" : "/app/profile"), { replace: true });
    } catch (failure) { setError(failure); }
    finally { setBusy(false); }
  }
  return <div className="portal-auth"><PageHeading title={register ? "Create your account" : "Welcome back"} description={register ? "Set up a customer account, then complete your rental profile." : "Sign in to manage rentals or the fleet."} /><Panel title={register ? "Customer registration" : "Sign in"}><form onSubmit={submit} className="portal-form" style={{ gridTemplateColumns: "1fr" }}>
    {register && <><Field label="Full name" name="fullName" value={form.fullName} onChange={change} required /><Field label="Phone (optional)" name="phone" value={form.phone} onChange={change} /></>}
    <Field label="Email" name="email" type="email" value={form.email} onChange={change} required />
    <Field label="Password" name="password" type="password" value={form.password} onChange={change} minLength={register ? 10 : 1} required />
    <Notice error={error} /><Button disabled={busy} type="submit">{busy ? "Please wait…" : register ? "Create account" : "Sign in"}</Button>
  </form><p className="portal-muted" style={{ marginTop: 18 }}>{register ? <>Already have an account? <Link to="/app/login">Sign in</Link></> : <>New to elcarro? <Link to="/app/register">Create an account</Link></>}</p></Panel></div>;
}
