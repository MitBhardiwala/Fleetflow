import { userRepository } from "../repository/user.repository.ts";
import { STATUS_CODES } from "../utils/constants.ts";
import { sendEmail } from "../utils/email.ts";
import { AppError } from "../utils/error.ts";
import { generateOTP, generateToken, verifyPassword } from "../utils/utils.ts";
import { LoginUserSchemaType } from "../utils/validations.ts";

export const loginUserService = async (data: LoginUserSchemaType) => {
  const { email, password } = data;

  // check if user exists
  const existingUser = await userRepository.findUnique({ email });

  if (!existingUser) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "User not found");
  }

  // check if password is correct
  const isMatch = await verifyPassword(password, existingUser?.passwordHash);

  if (!isMatch) {
    throw new AppError(STATUS_CODES.UNAUTHORIZED, "Invalid credentials");
  }

  // If password is correct, then sent JWT token
  const token = generateToken({
    userId: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
  });

  // remover password Hash from user data

  const { passwordHash, ...userData } = existingUser

  return { userData, token };
};

export const forgotPasswordService = async (email: string) => {
  //check if user exists
  const existingUser = await userRepository.findUnique({ email: email });

  if (!existingUser) {
    throw new AppError(STATUS_CODES.NOT_FOUND, "User not found");
  }

  const subject = "🔒 Reset your password";

  const otp = generateOTP();
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin: 0 0 16px; color: #111827;">Password reset request</h2>
      <p style="margin: 0 0 16px;">Use the one-time password below to reset your account:</p>
      <div style="display: inline-block; padding: 12px 18px; border-radius: 8px; background: #f3f4f6; font-size: 20px; font-weight: 700; letter-spacing: 4px; color: #111827;">
        ${otp}
      </div>
      <p style="margin: 16px 0 0; color: #6b7280;">This code expires soon and should never be shared with anyone.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject,
    html,
  });
};
