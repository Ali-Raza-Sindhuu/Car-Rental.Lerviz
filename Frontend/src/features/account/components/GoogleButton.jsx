
import { GoogleLogin } from "@react-oauth/google";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.4a12 12 0 0 0 0 10.8l4-3.1z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
  </svg>
);

const GoogleButton = ({ onCredential, onError, label = "Continue with Google" }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return (
      <div>
        <button
          type="button"
          disabled
          className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-400"
        >
          <GoogleIcon />
          {label}
        </button>
        <p role="status" className="mt-2 text-center text-[11px] text-neutral-500">
          Google sign-in is not configured.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-12 w-full justify-center">
      <GoogleLogin
        onSuccess={(response) => {
          if (!response.credential) {
            onError("Google did not provide a sign-in credential. Please try again.");
            return;
          }
          onCredential(response.credential);
        }}
        onError={() => onError("Google sign-in failed. Please try again.")}
        onNonOAuthError={(error) => {
          onError(
            error.type === "popup_closed"
              ? "Google sign-in was cancelled."
              : "Google sign-in could not be completed. Please try again.",
          );
        }}
        theme="outline"
        size="large"
        shape="rectangular"
        text={label === "Sign up with Google" ? "signup_with" : "continue_with"}
        width="360"
      />
    </div>
  );
};

const OrDivider = () => (
  <div className="my-5 flex items-center gap-3 text-[11px] text-neutral-400">
    <span className="h-px flex-1 bg-neutral-200" />
    or use email
    <span className="h-px flex-1 bg-neutral-200" />
  </div>
);

export { OrDivider };
export default GoogleButton;
