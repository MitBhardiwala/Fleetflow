import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "../../generated/prisma/client";

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


export function extractUniqueFields(err: Prisma.PrismaClientKnownRequestError): string[] {
  const meta = err.meta as any;

  // Newer driver-adapter shape (Prisma 7.x with adapters)
  const adapterFields = meta?.driverAdapterError?.cause?.constraint?.fields;
  if (Array.isArray(adapterFields)) {
    return adapterFields;
  }

  // Classic shape
  const target = meta?.target;
  if (Array.isArray(target)) {
    return target;
  }
  if (typeof target === "string") {
    return [target];
  }

  return [];
}