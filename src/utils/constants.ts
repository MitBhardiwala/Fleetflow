import z from "zod";

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const TEMP_PASSWORD = "Password@1";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
});

// incident serverity meta
export const SCORE_DEDUCTION = {
  'LOW': 5,
  'MEDIUM': 15,
  'HIGH': 25
}
