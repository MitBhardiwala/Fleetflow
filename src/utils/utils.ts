import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

const JWT_SECRET = process.env.JWT_SECRET as string;

interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (user: UserPayload): string => {
  const options: jwt.SignOptions = {
    expiresIn: "1h", // Token automatically becomes invalid after 1 hour
  };

  // Sign and return the completed string token
  return jwt.sign(user, JWT_SECRET, options);
};

export const generateOTP = () =>
  String(Math.floor(Math.random() * 10000)).padStart(4, "0");
