import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error.ts";
import { STATUS_CODES } from "../utils/constants.ts";
import jwt from "jsonwebtoken";
import { userRepository } from "../repository/user.repository.ts";

export const authenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // 1. Get the Authorization header from the request
  const authHeader = req.headers["authorization"];

  // 2. Parse the token (Format: "Bearer <TOKEN>")
  const token = authHeader && authHeader.split(" ")[1];

  // 3. Return 401 if no token is supplied
  if (!token) {
    throw new AppError(
      STATUS_CODES.UNAUTHORIZED,
      "Access denied. No token provided.",
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    req.user = decoded;

    //verify if user exists in db
    const existingUser = await userRepository.findUnique({
      id: req.user.userId,
    });

    if (!existingUser) {
      throw new AppError(STATUS_CODES.UNAUTHORIZED, "Unauthorised");
    }

    next();
  } catch (error) {
    throw new AppError(STATUS_CODES.UNAUTHORIZED, "Invalid or expired token");
  }
};
