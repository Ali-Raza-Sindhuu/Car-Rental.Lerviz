const emailMode = () => process.env.EMAIL_MODE
  || (process.env.NODE_ENV === "production" ? "resend" : "console");

let mailSender;

export const setMailSender = (sender) => {
  mailSender = sender;
};

const recipientDomain = (recipient) => recipient.split("@").at(-1)?.toLowerCase() || "unknown";

export const validateMailConfiguration = () => {
  if (!process.env.FRONTEND_URL) {
    throw new Error("Missing required environment variable: FRONTEND_URL");
  }
  const mode = emailMode();
  if (!["resend", "console"].includes(mode)) {
    throw new Error('EMAIL_MODE must be either "resend" or "console"');
  }
  if (mode === "resend") {
    const missing = [
      !process.env.RESEND_API_KEY && "RESEND_API_KEY",
      !process.env.MAIL_FROM && "MAIL_FROM",
    ].filter(Boolean);
    if (missing.length) {
      throw new Error(`Missing required environment variable(s): ${missing.join(", ")}`);
    }
  }
};

export const sendEmail = async ({ to, subject, html, text }) => {
  validateMailConfiguration();
  if (mailSender) return mailSender({ to, subject, html, text });

  if (emailMode() === "console") {
    console.info(`[email:console] to=${to} subject="${subject}" ${text}`);
    return { id: "console" };
  }

  const domain = recipientDomain(to);
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: process.env.MAIL_FROM, to, subject, html, text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      console.error(`[email:resend] send failed recipient_domain=${domain} status=${response.status}`);
      throw new Error("Email delivery failed");
    }
    const result = await response.json();
    console.info(`[email:resend] sent recipient_domain=${domain} message_id=${result.id || "unknown"}`);
    return result;
  } catch (error) {
    if (error.message !== "Email delivery failed") {
      console.error(`[email:resend] send failed recipient_domain=${domain} reason=${error.name || "Error"}`);
    }
    throw new Error("Email delivery failed");
  }
};

export const emailDeliveryMode = emailMode;
