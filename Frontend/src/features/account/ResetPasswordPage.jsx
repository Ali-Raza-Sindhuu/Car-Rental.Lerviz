import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, CircleCheck, KeyRound } from "lucide-react";
import AuthShell from "@/features/account/components/AuthShell";
import PasswordField from "@/features/account/components/PasswordField";
import { PasswordMeter } from "@/features/account/components/PasswordMeter";
import RecoverySteps from "@/features/account/components/RecoverySteps";
import { IconBadge, PrimaryButton, PrimaryLink } from "@/features/account/components/FormButtons";
import { authRequest } from "@/features/account/authApi";

const BackToLogin = () => (
  <Link to="/login" className="font-semibold text-neutral-900 hover:underline">Back to log in</Link>
);

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [values, setValues] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isDone, setIsDone] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (values.password.length < 12 || !/[a-z]/.test(values.password) || !/[A-Z]/.test(values.password) || !/\d/.test(values.password) || !/[^A-Za-z0-9]/.test(values.password))
      nextErrors.password = "Use 12+ characters with upper and lowercase letters, a number, and a symbol";
    if (values.confirmPassword !== values.password)
      nextErrors.confirmPassword = "Passwords do not match";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      await authRequest('reset-password', { token, newPassword: values.password, confirmPassword: values.confirmPassword });
      setIsDone(true);
    } catch (error) {
      setStatus(error.message);
    }
  };

  if (!token) {
    return (
      <AuthShell
        word="Recover"
        eyebrow="Roadside recovery"
        headline="Locked out? We'll get you moving."
        title="This link isn't valid"
        subtitle="The reset link is missing or has expired. Request a new one to continue."
        footer={<BackToLogin />}
      >
        <IconBadge icon={KeyRound} />
        <PrimaryLink to="/forgot-password">REQUEST NEW LINK</PrimaryLink>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      word="Recover"
      eyebrow="Roadside recovery"
      headline="Almost there. Pick a new password."
      title={isDone ? "Password updated" : "Set a new password"}
      subtitle={
        isDone
          ? "You're back on the road. Log in with your new password."
          : "Choose a strong password you haven't used before."
      }
      footer={isDone ? null : <BackToLogin />}
    >
      <RecoverySteps current={isDone ? 3 : 2} />
      {status && <p role="alert" className="mb-4 text-xs text-red-600">{status}</p>}

      {isDone ? (
        <div className="flex flex-col">
          <IconBadge icon={CircleCheck} />
          <PrimaryLink to="/login">GO TO LOG IN</PrimaryLink>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <PasswordField
            id="password"
            name="password"
            label="New password"
            placeholder="At least 12 characters"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
          />
          <PasswordMeter password={values.password} />
          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm new password"
            placeholder="Repeat your new password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          <PrimaryButton type="submit">UPDATE PASSWORD</PrimaryButton>
        </form>
      )}
    </AuthShell>
  );
};

export default ResetPasswordPage;
