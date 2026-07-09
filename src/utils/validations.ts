import { z } from "zod";
import {
  DriverStatus,
  LicenseCategory,
  Role,
  VehicleStatus,
  VehicleType,
} from "../../generated/prisma/enums";
import { paginationSchema } from "./constants";

export const createUserSchema = z.object({
  firstName: z.string("First Name is required").trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100).optional(),
  email: z.email("Valid email is required").max(100),
  role: z.enum(Role),
  isActive: z.boolean().optional(),
});

export type CreateUserSchemaType = z.infer<typeof createUserSchema>;

export const listUserQuerySchema = paginationSchema.extend({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  sortOn: z.enum(["firstName", "email", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type ListUserQuerySchemaType = z.infer<typeof listUserQuerySchema>;

export const getUserSchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
});

export type GetUserSchemaType = z.infer<typeof getUserSchema>;

export const loginUserSchema = z.object({
  email: z.email("Valid email is required").max(100),
  password: z.string("Password is required").min(8).max(100),
});

export type LoginUserSchemaType = z.infer<typeof loginUserSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("Valid email is required").max(100),
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

export const createDriverSchema = z.object({
  firstName: z.string("First Name is required").trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100).optional(),
  phone: z
    .string("Phone number is required")
    .trim()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  licenseNumber: z.string("License number is required").trim().min(1).max(50),
  licenseExpiryDate: z.coerce.date("Valid license expiry date is required"),
  licenseCategory: z.enum(LicenseCategory),
  status: z.enum(DriverStatus).optional(),
  safetyScore: z.coerce
    .number("Score should be a number")
    .min(0, "Safety score cannot be negative")
    .max(100, "Safety score cannot exceed 100")
    .multipleOf(0.01, "Safety score can have at most 2 decimal places")
    .optional(),
});
export type CreateDriverSchemaType = z.infer<typeof createDriverSchema>;

export const listDriverSchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  sortOn: z
    .enum(["firstName", "licenseExpiryDate", "createdAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  status: z.enum(DriverStatus).optional(),
});

export type listDriverSchemaType = z.infer<typeof listDriverSchema>;

export const getDriverSchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
});

export type GetDriverSchemaType = z.infer<typeof getDriverSchema>;

export const createVehicleSchema = z.object({
  name: z.string("Name is required").trim().min(1).max(100),
  model: z.string().trim().min(1).max(100).optional(),
  licensePlate: z
    .string("License plate is required")
    .trim()
    .min(1)
    .max(20)
    .toUpperCase(),
  type: z.enum(VehicleType),
  maxLoadCapacityKg: z.coerce
    .number("Max load capacity is required and it should be a number")
    .positive("Max load capacity must be positive")
    .multipleOf(0.01, "Max load capacity can have at most 2 decimal places"),
  currentOdometerKm: z.coerce
    .number()
    .min(0, "Odometer reading cannot be negative")
    .multipleOf(0.01, "Odometer can have at most 2 decimal places")
    .optional(),
  status: z.enum(VehicleStatus).optional(),
  acquisitionCost: z.coerce
    .number()
    .positive("Acquisition cost must be positive")
    .multipleOf(0.01, "Acquisition cost can have at most 2 decimal places")
    .optional(),
});

export type CreateVehicleSchemaType = z.infer<typeof createVehicleSchema>;
