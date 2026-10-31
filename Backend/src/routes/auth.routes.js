import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  loginController,
  googleLoginController,
  forgotPasswordController,
  resetPasswordController,
  verifyEmailController,
  resendVerificationController,
  logoutController,
  meController,
  signupController,
  updateProfileController,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  updateProfileSchema,
  verifyEmailSchema,
} from "../validators/auth.validators.js";

const router = Router();
const makeAccountRateLimit = () => rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    message: "Too many requests. Please try again later.",
    error: { message: "Too many requests. Please try again later." },
  }),
});
const signupRateLimit = makeAccountRateLimit();
const loginRateLimit = makeAccountRateLimit();
const googleRateLimit = makeAccountRateLimit();
const makeSensitiveEmailRateLimit = () => rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    message: "Too many requests. Please try again later.",
    error: { message: "Too many requests. Please try again later." },
  }),
});
const forgotPasswordRateLimit = makeSensitiveEmailRateLimit();
const resendVerificationRateLimit = makeSensitiveEmailRateLimit();

router.post("/auth/signup", signupRateLimit, validate(signupSchema), signupController);
router.post("/auth/register", signupRateLimit, validate(signupSchema), signupController);
router.post("/auth/login", loginRateLimit, validate(loginSchema), loginController);
router.post("/auth/google", googleRateLimit, validate(googleLoginSchema), googleLoginController);
router.post("/auth/forgot-password", forgotPasswordRateLimit, validate(forgotPasswordSchema), forgotPasswordController);
router.post("/auth/reset-password", validate(resetPasswordSchema), resetPasswordController);
router.post("/auth/verify-email", validate(verifyEmailSchema), verifyEmailController);
router.post("/auth/resend-verification", authenticate, resendVerificationRateLimit, resendVerificationController);
router.post("/auth/logout", logoutController);
router.get("/auth/me", authenticate, meController);
router.patch("/users/me", authenticate, validate(updateProfileSchema), updateProfileController);

export default router;
