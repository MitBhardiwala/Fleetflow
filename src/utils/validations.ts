import { z } from "zod";
import {
  DriverStatus,
  LicenseCategory,
  Role,
  ServiceType,
  TripStatus,
  VehicleStatus,
  VehicleType,
  IncidentType,
  Severity,
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

export const updateUserSchema = createUserSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;


export const listUserQuerySchema = paginationSchema.extend({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  sortOn: z.enum(["firstName", "email", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  status: z.enum(["active", "inactive", "all"]).default('all')
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

export const updateDriverSchema = createDriverSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
  );

export type UpdateDriverSchemaType = z.infer<typeof updateDriverSchema>;


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

export const updateVehicleSchema = createVehicleSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
  );

export type UpdateVehicleSchemaType = z.infer<typeof updateVehicleSchema>;

const tripObjectSchema = z.object({
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
  cargoDescription: z.string("").trim().min(1).max(1000).optional(),
  cargoWeightKg: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Cargo weight is required"
          : "Cargo weight should be a number",
    })
    .positive("Cargo weight must be greater than 0")
    .multipleOf(0.01),
  origin: z.string("Origin is required").trim().min(1).max(255),
  destination: z.string("Destination is required").trim().min(1).max(255),
  plannedDeparture: z.coerce.date().optional(),
  actualStart: z.coerce.date().optional(),
  actualEnd: z.coerce.date().optional(),
  startOdometerKm: z.number().nonnegative().multipleOf(0.01).optional(),
  endOdometerKm: z.number().nonnegative().multipleOf(0.01).optional(),
  revenue: z.number().nonnegative().multipleOf(0.01).default(0).optional(),
  createdBy: z.string().uuid("Invalid user ID").optional(),
});

// ── Draft ──
export const createTripSchema = tripObjectSchema
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
  sortOn: z.enum(["vehicle", "driver", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  status: z.enum(TripStatus).optional(),
});

export type ListTripSchemaType = z.infer<typeof listTripSchema>;

export const getTripSchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
});

export type GetTripSchemaType = z.infer<typeof getTripSchema>;

export const completeTripSchema = z.object({
  endOdometerKm: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "End odometer km is required"
          : "End odometer km should be number",
    })
    .nonnegative()
    .multipleOf(0.01),
  actualEnd: z.coerce.date().optional(),
  revenue: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Revenue is required"
          : "Revenue should be number",
    })
    .nonnegative()
    .multipleOf(0.01)
    .optional(),
});

export type CompleteTripSchemaType = z.infer<typeof completeTripSchema>;

export const cancelTripSchema = z.object({
  cancellationReason: z.string().trim().min(1).max(1000).optional(),
});

export type CancelTripSchemaType = z.infer<typeof cancelTripSchema>;

export const dispatchTripSchema = tripObjectSchema
  .required({
    cargoDescription: true,
    plannedDeparture: true,
    actualStart: true,
    startOdometerKm: true,
  })
  .extend({
    // now override cargoDescription specifically
    cargoDescription: z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "cardo description is required"
            : "cargo description should be string",
      })
      .trim()
      .min(1, "Cargo description is required")
      .max(1000, "Cargo description must be at most 1000 characters"),
    plannedDeparture: z.coerce.date(
      "Planed Departure Dates required in valid format",
    ),
    actualStart: z.coerce.date("Actual Start Date required in valid format"),
    startOdometerKm: z
      .number({
        error: (iss) =>
          iss.input === undefined
            ? "Start Odometer km is required"
            : "Start Odometer km should be number",
      })
      .nonnegative()
      .multipleOf(0.01),
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
export type DispatchTripSchemaType = z.infer<typeof dispatchTripSchema>;

export type GetVehicleSchemaType = z.infer<typeof getVehicleSchema>;

export const createMaintenanceSchema = z.object({
  vehicleId: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Vehicle Id is required"
          : "vehicle Id must be in valid format",
    })
    .uuid("Invalid UUID format"),
  serviceType: z.enum(ServiceType),
  description: z.string().trim().min(1).max(1000).optional(),
  cost: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Cost is required"
          : "Cost should be a number",
    })
    .nonnegative()
    .multipleOf(0.01),
  serviceDate: z.coerce.date("Valid service date is required"),
  vendor: z.string().trim().min(1).max(255).optional(),
});

export type CreateMaintenanceSchemaType = z.infer<
  typeof createMaintenanceSchema
>;

export const listMaintainanceSchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  vehicleId: z.string().uuid("Invalid UUid format").optional(),
  sortOn: z.enum(["vehicle", "cost", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  serviceType: z.enum(ServiceType).optional(),
});

export type ListMaintenanceSchemaType = z.infer<typeof listMaintainanceSchema>;

export const completeMaintenanceSchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
});

export type CompleteMaintenanceSchemaType = z.infer<
  typeof completeMaintenanceSchema
>;

// vehicleId and isCompleted are intentionally excluded:
//   - vehicleId   → cannot reassign a record to a different vehicle after creation
//   - isCompleted → controlled exclusively by the PATCH /:id/complete endpoint
export const updateMaintenanceSchema = createMaintenanceSchema
  .omit({ vehicleId: true })
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" },
  );

export type UpdateMaintenanceSchemaType = z.infer<
  typeof updateMaintenanceSchema
>;

export const createFuelLogSchema = z.object({
  vehicleId: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Vehicle Id is required"
          : "Vehicle Id must be a valid string",
    })
    .uuid("Invalid vehicle UUID"),
  tripId: z.string().uuid("Invalid trip UUID").optional(),
  liters: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Liters is required"
          : "Liters must be a number",
    })
    .positive("Liters must be greater than 0")
    .multipleOf(0.001, "Liters can have at most 3 decimal places"),
  costPerLiter: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Cost per liter is required"
          : "Cost per liter must be a number",
    })
    .positive("Cost per liter must be greater than 0")
    .multipleOf(0.0001, "Cost per liter can have at most 4 decimal places"),
  odometerAtFillKm: z
    .number("Odometer reading must be a number")
    .nonnegative("Odometer reading cannot be negative")
    .multipleOf(0.01, "Odometer can have at most 2 decimal places")
    .optional(),
  fuelDate: z.coerce.date("Valid fuel date is required"),
});

export type CreateFuelLogSchemaType = z.infer<typeof createFuelLogSchema>;

export const getFuelLogSchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
});

export type GetFuelLogSchemaType = z.infer<typeof getFuelLogSchema>;

// vehicleId and tripId are intentionally excluded — they cannot be changed after creation
export const updateFuelLogSchema = createFuelLogSchema
  .omit({ vehicleId: true, tripId: true })
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" },
  )
  .refine(
    (data) => {
      const hasLiters = data.liters !== undefined;
      const hasCost = data.costPerLiter !== undefined;
      return hasLiters === hasCost; // both present or both absent
    },
    {
      message: "Both liters and costPerLiter are required when updating pricing",
      path: ["liters", "costPerLiter"],
    },
  );

export type UpdateFuelLogSchemaType = z.infer<typeof updateFuelLogSchema>;

export const listFuelLogSchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  vehicleId: z.string().uuid("Invalid UUID format").optional(),
  tripId: z.string().uuid("Invalid UUID format").optional(),
  sortOn: z
    .enum(["vehicle", "totalCost", "fuelDate", "createdAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type ListFuelLogSchemaType = z.infer<typeof listFuelLogSchema>;

export const createIncidentSchema = z.object({
  driverId: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Driver Id is required"
          : "Driver Id must be a valid string",
    })
    .uuid("Invalid driver UUID"),
  tripId: z.string().uuid("Invalid trip UUID").optional(),
  incidentType: z.enum(IncidentType),
  severity: z.enum(Severity),
  incidentDate: z.coerce.date("Valid incident date is required"),
});

export type CreateIncidentSchemaType = z.infer<typeof createIncidentSchema>;

export const listIncidentSchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  driverId: z.string().uuid("Invalid UUID format").optional(),
  tripId: z.string().uuid("Invalid UUID format").optional(),
  sortOn: z
    .enum(["driver", "incidentDate", "severity", "createdAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  incidentType: z.enum(IncidentType).optional()
});

export type ListIncidentSchemaType = z.infer<typeof listIncidentSchema>;

export const getIncidentSchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
});

export type GetIncidentSchemaType = z.infer<typeof getIncidentSchema>;

// driverId, tripId, and severity are intentionally excluded:
//   - driverId  → cannot reassign an incident to a different driver
//   - tripId    → cannot change the associated trip after creation
//   - severity  → changing severity would silently alter the stored scoreDeduction
//                 and require reversing the driver's safety score; excluded by design
export const updateIncidentSchema = createIncidentSchema
  .omit({ driverId: true, tripId: true, severity: true })
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" },
  );

export type UpdateIncidentSchemaType = z.infer<typeof updateIncidentSchema>;
