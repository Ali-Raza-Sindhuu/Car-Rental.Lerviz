import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "@/features/account/components/AuthShell";
import GoogleButton, { OrDivider } from "@/features/account/components/GoogleButton";
import { PrimaryButton } from "@/features/account/components/FormButtons";
import { emailPattern } from "@/features/account/validation";
import { authRequest, googleAuthRequest } from "@/features/account/authApi";
import { setCredentials } from "@/features/account/authSlice";
import { persistAuth } from "@/features/account/authStorage";
import { mergeGuestGarageSafely } from "@/features/garage/garageApi";

const LoginPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    const nextErrors = {};
    if (!emailPattern.test(values.email)) nextErrors.email = "Enter a valid email address";
    if (!values.password) nextErrors.password = "Enter your password";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus("");
    setIsSubmitting(true);
    try {
      const session = await authRequest("login", values);
      const token = session.token || session.accessToken;
      if (!session.user || !token) {
        throw new Error("The server did not return a user and access token.");
      }
      persistAuth(session.user, token);
      dispatch(setCredentials({ user: session.user, token }));
      await mergeGuestGarageSafely(token, dispatch);
      const destination = location.state?.from;
      navigate(
        destination?.pathname
          ? `${destination.pathname}${destination.search || ""}${destination.hash || ""}`
          : "/profile",
        { replace: true },
      );
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setStatus("");
    try {
      const session = await googleAuthRequest(credential);
      if (!session.user || !session.token) {
        throw new Error("The server did not return a user and access token.");
      }
      persistAuth(session.user, session.token);
      dispatch(setCredentials({ user: session.user, token: session.token }));
      await mergeGuestGarageSafely(session.token, dispatch);
      const destination = location.state?.from;
      navigate(
        destination?.pathname
          ? `${destination.pathname}${destination.search || ""}${destination.hash || ""}`
          : "/profile",
        { replace: true },
      );
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <AuthShell
      word="Welcome"
      eyebrow="Your driver account"
      headline={<>Good to <br />have you <span className="text-[#f05a1a]">back.</span></>}
      title="Log in to your account"
      subtitle="Pick up where you left off and get back to the cars you love."
      footer={<>New to REVEX? <Link to="/signup" state={location.state} className="font-semibold text-[#f05a1a] hover:underline">Create an account</Link></>}
    >
      {status && <p role="status" className="mb-4 rounded-lg bg-neutral-100 px-3 py-2.5 text-xs text-neutral-700">{status}</p>}
      <GoogleButton
        onCredential={handleGoogleSuccess}
        onError={setStatus}
      />
      <OrDivider />
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4" aria-busy={isSubmitting}>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-neutral-700">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={handleChange} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#f05a1a] focus:ring-2 focus:ring-[#f05a1a]/15" />
          {errors.email && <p id="email-error" className="mt-1.5 text-[11px] text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-neutral-700">Password</label>
          <div className="flex h-11 items-center rounded-xl border border-neutral-200 bg-white transition focus-within:border-[#f05a1a] focus-within:ring-2 focus-within:ring-[#f05a1a]/15">
            <input id="password" name="password" type={isVisible ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={values.password} onChange={handleChange} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined} className="h-full min-w-0 flex-1 rounded-xl bg-transparent px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400" />
            <button type="button" aria-label={isVisible ? "Hide password" : "Show password"} aria-pressed={isVisible} onClick={() => setIsVisible((previous) => !previous)} className="px-3 text-neutral-500 hover:text-neutral-900">{isVisible ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
          {errors.password && <p id="password-error" className="mt-1.5 text-[11px] text-red-600">{errors.password}</p>}
        </div>
        <div className="flex items-center justify-between gap-3 text-xs text-neutral-600">
          <label className="flex items-center gap-2"><input type="checkbox" name="remember" className="size-3.5 accent-[#f05a1a]" /> Keep me logged in</label>
          <Link to="/forgot-password" className="font-medium text-neutral-800 hover:text-[#f05a1a]">Forgot password?</Link>
        </div>
        <PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? "LOGGING IN…" : "LOG IN"}</PrimaryButton>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
