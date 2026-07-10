import { z } from "zod";
import {
  DriverStatus,
  LicenseCategory,
  Role,
  TripStatus,
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
  safetyScore: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Safety score is required"
          : "Safety score must be a number",
    })
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
  maxLoadCapacityKg: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Max load capacity is required"
          : "Max load capacity must be a number",
    })
    .positive("Max load capacity must be positive")
    .multipleOf(0.01, "Max load capacity can have at most 2 decimal places"),
  currentOdometerKm: z
    .number("Odometer reading should be a number")
    .min(0, "Odometer reading cannot be negative")
    .multipleOf(0.01, "Odometer can have at most 2 decimal places")
    .optional(),
  status: z.enum(VehicleStatus).optional(),
  acquisitionCost: z
    .number("Acquisiiton cost should be a number")
    .positive("Acquisition cost must be positive")
    .multipleOf(0.01, "Acquisition cost can have at most 2 decimal places")
    .optional(),
});

export type CreateVehicleSchemaType = z.infer<typeof createVehicleSchema>;

export const listVehicleSchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  sortOn: z
    .enum(["name", "model", "licensePlate", "createdAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  status: z.enum(VehicleStatus).optional(),
  type: z.enum(VehicleType).optional(),
});

export type ListVehicleSchemaType = z.infer<typeof listVehicleSchema>;

export const getVehicleSchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
});

export type GetVehicleSchemaType = z.infer<typeof getVehicleSchema>;

export const createTripSchema = z
  .object({
    vehicleId: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "VehicleId is required"
            : "VehicleId should be string",
      })
      .uuid("Invalid vehicle ID"),
    driverId: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "DriverId is required"
            : "DriverId should be string",
      })
      .uuid("Invalid driver ID"),
    cargoDescription: z
      .string()
      .trim()
      .min(1)
      .max(1000, "Cargo description must be at most 1000 characters")
      .optional(),
    cargoWeightKg: z
      .number({
        //This is how we handle undefined and invalid
        error: (iss) =>
          iss.input === undefined
            ? "Cargo wight is required"
            : "Cargo weight should be a number",
      })
      .positive("Cargo weight must be greater than 0")
      .multipleOf(0.01, "Cargo weight can have at most 2 decimal places"),
    origin: z
      .string("Origin is required")
      .trim()
      .min(1)
      .max(255, "Origin must be at most 255 characters"),
    destination: z
      .string("Destination is required")
      .trim()
      .min(1)
      .max(255, "Destination must be at most 255 characters"),
    plannedDeparture: z.coerce
      .date({ error: "Invalid planned departure date" })
      .optional(),
    actualStart: z.coerce
      .date({ error: "Invalid actual start date" })
      .optional(),
    actualEnd: z.coerce.date({ error: "Invalid actual end date" }).optional(),
    startOdometerKm: z
      .number()
      .nonnegative("Start odometer must be 0 or greater")
      .multipleOf(0.01, "Start odometer can have at most 2 decimal places")
      .optional(),
    endOdometerKm: z
      .number()
      .nonnegative("End odometer must be 0 or greater")
      .multipleOf(0.01, "End odometer can have at most 2 decimal places")
      .optional(),
    revenue: z
      .number()
      .nonnegative("Revenue must be 0 or greater")
      .multipleOf(0.01, "Revenue can have at most 2 decimal places")
      .default(0)
      .optional(),
    createdBy: z.string().uuid("Invalid user ID").optional(),
  })
  .refine(
    (data) => {
      if (data.actualStart && data.actualEnd) {
        return data.actualEnd > data.actualStart;
      }
      return true;
    },
    {
      message: "Actual end must be after actual start",
      path: ["actualEnd"],
    },
  )
  .refine(
    (data) => {
      if (data.startOdometerKm && data.endOdometerKm) {
        return data.endOdometerKm >= data.startOdometerKm;
      }
      return true;
    },
    {
      message: "End odometer must be greater than or equal to start odometer",
      path: ["endOdometerKm"],
    },
  );
export type CreateTripSchemaType = z.infer<typeof createTripSchema>;

export const listTripSchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  sortOn: z.enum(["createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  status: z.enum(TripStatus).optional(),
});

export type ListTripSchemaType = z.infer<typeof listTripSchema>;
