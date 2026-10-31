import { getUserById, login, loginWithGoogle, signup, updateProfile } from "../services/auth.service.js";
import { AppError } from "../lib/errors.js";
import {
  forgotPassword,
  resendVerification,
  resetPassword,
  verifyEmail,
} from "../services/account-token.service.js";

export const signupController = async (req, res) => {
  const result = await signup(req.validatedBody);
  res.status(201).json(result);
};

export const forgotPasswordController = async (req, res) => {
  const result = await forgotPassword(req.validatedBody.email);
  res.status(200).json(result);
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.validatedBody.token, req.validatedBody.password);
  res.status(200).json({ message: "Password has been reset. You can now log in." });
};

export const verifyEmailController = async (req, res) => {
  await verifyEmail(req.validatedBody.token);
  res.status(200).json({ message: "Email verified successfully." });
};

export const resendVerificationController = async (req, res) => {
  const result = await resendVerification(req.userId);
  res.status(200).json(result);
};

export const loginController = async (req, res) => {
  const result = await login(req.validatedBody);
  res.status(200).json(result);
};

export const googleLoginController = async (req, res) => {
  const result = await loginWithGoogle(req.validatedBody.credential);
  res.status(200).json(result);
};

export const logoutController = (req, res) => {
  // Logout is stateless: the client discards its bearer token.
  res.status(200).json({ message: "Logged out successfully" });
};

export const meController = async (req, res) => {
  const user = await getUserById(req.userId);
  if (!user) throw new AppError(404, "User not found");
  res.status(200).json({ user });
};

export const updateProfileController = async (req, res) => {
  const user = await updateProfile(req.userId, req.validatedBody);
  res.status(200).json({ user });
};
