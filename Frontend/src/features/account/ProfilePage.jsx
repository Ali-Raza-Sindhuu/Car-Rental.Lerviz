import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { clearCredentials } from "./authSlice";
import { clearPersistedAuth } from "./authStorage";
import { authRequest } from "./authApi";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  useEffect(() => {
    document.title = "Profile | REVEX";
  }, []);

  const handleLogout = () => {
    clearPersistedAuth();
    dispatch(clearCredentials());
    navigate("/", { replace: true });
  };

  const handleResendVerification = async () => {
    setIsSendingVerification(true);
    setVerificationStatus("");
    try {
      const response = await authRequest("resend-verification", {}, token);
      setVerificationStatus(response.message);
    } catch (error) {
      setVerificationStatus(error.message || "Unable to resend the verification email. Please try again.");
    } finally {
      setIsSendingVerification(false);
    }
  };

  return (
    <section className="bg-neutral-50 px-4 pb-16 pt-32 md:px-12 md:pb-24 md:pt-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="max-w-xl rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Your account
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
            Profile
          </h1>
          <dl className="mt-8 space-y-5">
            <div>
              <dt className="text-xs font-medium text-neutral-500">Name</dt>
              <dd className="mt-1 text-sm font-semibold text-neutral-900">
                {user.name || user.fullName}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-neutral-500">Email</dt>
              <dd className="mt-1 text-sm font-semibold text-neutral-900">
                {user.email}
              </dd>
            </div>
          </dl>
          <nav aria-label="Your REVEX links" className="mt-8 grid gap-2 border-t border-neutral-200 pt-5 sm:grid-cols-2">
            <Link to="/saved" className="rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Saved cars</Link>
            <Link to="/cart" className="rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Garage</Link>
          </nav>
          {!user.emailVerifiedAt && (
            <div className="mt-8">
              <p className="text-xs text-neutral-600">Your email address is not verified.</p>
              <Button
                type="button"
                disabled={isSendingVerification}
                onClick={handleResendVerification}
                className="mt-3 h-10 rounded-lg border border-neutral-200 bg-white px-5 text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
              >
                {isSendingVerification ? "Sending…" : "Resend verification email"}
              </Button>
              {verificationStatus && (
                <p role="status" className="mt-3 text-xs text-neutral-600">
                  {verificationStatus}
                </p>
              )}
            </div>
          )}
          <Button
            type="button"
            onClick={handleLogout}
            className="mt-8 h-10 rounded-lg bg-neutral-900 px-5 text-xs font-semibold text-white hover:bg-neutral-800"
          >
            Log out
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
