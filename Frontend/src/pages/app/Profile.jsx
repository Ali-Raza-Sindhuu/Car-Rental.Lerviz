import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button, Field, Loading, Notice, PageHeading, Panel } from "@/components/app/Ui";

const blank = { dateOfBirth: "", drivingLicenseNo: "", licenseExpiry: "", address: "", city: "", country: "" };

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(blank);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => { api("/customers/me/profile").then(({ data }) => { if (data.profile) setProfile(Object.fromEntries(Object.keys(blank).map((key) => [key, key === "dateOfBirth" || key === "licenseExpiry" ? data.profile[key]?.slice(0, 10) || "" : data.profile[key] || ""]))); }).catch(setError).finally(() => setLoading(false)); }, []);
  const change = (event) => setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  async function save(event) { event.preventDefault(); setBusy(true); setError(""); setSuccess(""); try { await api("/customers/me/profile", { method: "PUT", body: profile }); setSuccess("Rental profile saved."); } catch (failure) { setError(failure); } finally { setBusy(false); } }
  async function changePassword(event) { event.preventDefault(); setBusy(true); setError(""); setSuccess(""); try { await api("/auth/change-password", { method: "PATCH", body: passwords }); setPasswords({ currentPassword: "", newPassword: "" }); setSuccess("Password changed. Other sessions were revoked."); } catch (failure) { setError(failure); } finally { setBusy(false); } }
  return <><PageHeading title="My profile" description={`${user?.fullName} · ${user?.email}`} /><Notice error={error} success={success} />{loading ? <Loading /> : <div className="portal-grid two"><Panel title="Rental eligibility"><p className="portal-muted" style={{ marginBottom: 16 }}>Your license must remain valid through the return date. Drivers must be at least 21.</p><form className="portal-form" onSubmit={save}>
    <Field label="Date of birth" name="dateOfBirth" type="date" value={profile.dateOfBirth} onChange={change} required /><Field label="License expiry" name="licenseExpiry" type="date" value={profile.licenseExpiry} onChange={change} required />
    <Field label="Driving license number" name="drivingLicenseNo" value={profile.drivingLicenseNo} onChange={change} required /><Field label="Country" name="country" value={profile.country} onChange={change} required />
    <Field label="Address" name="address" value={profile.address} onChange={change} required /><Field label="City" name="city" value={profile.city} onChange={change} required />
    <div className="full"><Button type="submit" disabled={busy}>Save profile</Button></div></form></Panel><Panel title="Change password"><form className="portal-form" style={{ gridTemplateColumns: "1fr" }} onSubmit={changePassword}><Field label="Current password" name="currentPassword" type="password" value={passwords.currentPassword} onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))} required /><Field label="New password" name="newPassword" type="password" minLength={10} value={passwords.newPassword} onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))} required /><Button type="submit" disabled={busy}>Update password</Button></form></Panel></div>}</>;
}
