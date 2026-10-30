import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import AuthShell from "@/features/account/components/AuthShell";
import Field from "@/features/account/components/Field";
import RecoverySteps from "@/features/account/components/RecoverySteps";
import { IconBadge, PrimaryButton, SecondaryButton } from "@/features/account/components/FormButtons";
import { emailPattern } from "@/features/account/validation";
import { authRequest } from "@/features/account/authApi";

const BackToLogin = () => (
  <Link
    to="/login"
    className="inline-flex items-center gap-1.5 font-semibold text-neutral-900 hover:underline"
  >
    <ArrowLeft className="size-3.5" />
    Back to log in
  </Link>
);

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [status, setStatus] = useState("");

  const sendResetLink = async () => {
    try {
      await authRequest('forgot-password', { email });
      setIsSent(true);
      setStatus('Reset link requested.');
    } catch (requestError) {
      setStatus(requestError.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!emailPattern.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    sendResetLink();
  };

  return (
    <AuthShell
      word="Recover"
      eyebrow="Roadside recovery"
      headline="Locked out? We'll get you moving."
      title={isSent ? "Check your inbox" : "Forgot your password?"}
      subtitle={
        isSent
          ? `If an account exists for ${email}, a reset link is on its way. It expires in 30 minutes.`
          : "Enter the email you signed up with and we'll send you a reset link."
      }
      footer={<BackToLogin />}
    >
      <RecoverySteps current={isSent ? 1 : 0} />
      {status && <p role="status" className="mb-4 text-xs text-neutral-700">{status}</p>}

      {isSent ? (
        <div className="flex flex-col">
          <IconBadge icon={MailCheck} />
          <p className="mb-5 text-xs leading-relaxed text-neutral-500">
            Can&apos;t find it? Check your spam folder, or send the link again.
          </p>
          <SecondaryButton type="button" onClick={sendResetLink}>
            RESEND LINK
          </SecondaryButton>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Field
            id="email"
            name="email"
            type="email"
            label="Email"
            icon={Mail}
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={error}
          />
          <PrimaryButton type="submit">SEND RESET LINK</PrimaryButton>
        </form>
      )}
    </AuthShell>
  );
};

export default ForgotPasswordPage;
