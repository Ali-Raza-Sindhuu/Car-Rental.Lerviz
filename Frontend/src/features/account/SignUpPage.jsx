import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, User } from "lucide-react";
import AuthShell from "@/features/account/components/AuthShell";
import Field from "@/features/account/components/Field";
import PasswordField from "@/features/account/components/PasswordField";
import { PasswordMeter } from "@/features/account/components/PasswordMeter";
import GoogleButton, { OrDivider } from "@/features/account/components/GoogleButton";
import { PrimaryButton, SecondaryButton } from "@/features/account/components/FormButtons";
import { emailPattern } from "@/features/account/validation";
import { authRequest, googleAuthRequest } from "@/features/account/authApi";
import { setCredentials } from "@/features/account/authSlice";
import { persistAuth } from "@/features/account/authStorage";
import { mergeGuestGarageSafely } from "@/features/garage/garageApi";

const bodyTypes = ["SUV", "Sedan", "Coupe", "Convertible", "Wagon", "Electric"];
const intents = ["Buy", "Rent", "Both"];

const pillClass = (isActive) =>
  `rounded-full px-4 py-2 text-xs font-medium transition ${
    isActive
      ? "bg-[#f05a1a] text-white shadow-md shadow-[#f05a1a]/25"
      : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
  }`;

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [interests, setInterests] = useState([]);
  const [intent, setIntent] = useState("Buy");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleInterest = (type) =>
    setInterests((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type],
    );

  const validateStepOne = () => {
    const nextErrors = {};
    if (values.fullName.trim().length < 2) nextErrors.fullName = "Enter your full name";
    if (!emailPattern.test(values.email)) nextErrors.email = "Enter a valid email address";
    if (values.password.length < 8 || !/[A-Za-z]/.test(values.password) || !/[0-9]/.test(values.password))
      nextErrors.password = "Use at least 8 characters with a letter and a number";
    if (values.confirmPassword !== values.password)
      nextErrors.confirmPassword = "Passwords do not match";
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (step === 1) {
      const nextErrors = validateStepOne();
      setErrors(nextErrors);
      if (!Object.keys(nextErrors).length) setStep(2);
      return;
    }

    if (!values.acceptTerms) {
      setErrors({ acceptTerms: "Please accept the terms to continue" });
      return;
    }
    setErrors({});
    try {
      const result = await authRequest('register', {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      const token = result.token || result.accessToken;
      if (!result.user || !token) {
        throw new Error("The server did not return a user and access token.");
      }
      persistAuth(result.user, token);
      dispatch(setCredentials({ user: result.user, token }));
      await mergeGuestGarageSafely(token, dispatch);
      const destination = location.state?.from;
      navigate(destination?.pathname ? `${destination.pathname}${destination.search || ""}${destination.hash || ""}` : "/", { replace: true });
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleGoogle = async (credential) => {
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
      navigate(destination?.pathname ? `${destination.pathname}${destination.search || ""}${destination.hash || ""}` : "/profile", { replace: true });
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <AuthShell
      word="Join"
      eyebrow="Join the garage"
      headline="Start your journey with REVEX."
      title={step === 1 ? "Create your account" : "What do you drive?"}
      subtitle={
        step === 1
          ? "Save favourites, book test drives and list your own car."
          : "Pick what you love and we'll tune your feed."
      }
      footer={
        <>
          Already a member?{" "}
          <Link to="/login" className="font-semibold text-[#f05a1a] hover:underline">
            Log in
          </Link>
        </>
      }
    >
      {/* Progress */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {[1, 2].map((item) => (
            <span
              key={item}
              className={`h-1 flex-1 rounded-full transition-colors ${
                item <= step ? "bg-[#f05a1a]" : "bg-neutral-200"
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] text-neutral-500">Step {step} of 2</span>
      </div>
      {status && <p role="status" className="mb-4 text-xs text-neutral-700">{status}</p>}

      {step === 1 && (
        <>
          <GoogleButton
            label="Sign up with Google"
            onCredential={handleGoogle}
            onError={setStatus}
          />
          <OrDivider />
        </>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {step === 1 ? (
          <>
            <Field
              id="fullName"
              name="fullName"
              label="Full name"
              icon={User}
              placeholder="Your full name"
              autoComplete="name"
              value={values.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            <Field
              id="email"
              name="email"
              type="email"
              label="Email"
              icon={Mail}
              placeholder="you@example.com"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
            />
            <PasswordField
              id="password"
              name="password"
              label="Password"
              placeholder="At least 8 characters, one letter and one number"
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
            />
            <PasswordMeter password={values.password} />
            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
            <PrimaryButton type="submit">CONTINUE</PrimaryButton>
          </>
        ) : (
          <>
            <div>
              <p className="mb-2 text-xs font-medium text-neutral-700">Body types</p>
              <div className="flex flex-wrap gap-2">
                {bodyTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={interests.includes(type)}
                    onClick={() => toggleInterest(type)}
                    className={pillClass(interests.includes(type))}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-neutral-700">I want to</p>
              <div className="flex gap-2">
                {intents.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={intent === item}
                    onClick={() => setIntent(item)}
                    className={`flex-1 ${pillClass(intent === item)}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-2 text-xs leading-relaxed text-neutral-600">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={values.acceptTerms}
                  onChange={handleChange}
                  className="mt-0.5 size-3.5 accent-[#f05a1a]"
                />
                <span>
                  I agree to the{" "}
                  <Link to="/terms" className="font-medium text-neutral-900 hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="font-medium text-neutral-900 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1.5 text-[11px] text-red-500">{errors.acceptTerms}</p>
              )}
            </div>

            <div className="flex gap-3">
              <div className="w-28 shrink-0">
                <SecondaryButton type="button" onClick={() => setStep(1)}>
                  <ArrowLeft className="size-4" />
                  BACK
                </SecondaryButton>
              </div>
              <PrimaryButton type="submit">CREATE ACCOUNT</PrimaryButton>
            </div>
          </>
        )}
      </form>
    </AuthShell>
  );
};

export default SignUpPage;
