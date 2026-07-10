import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: unknown;
      validatedParams?: unknown;
      validatedBody?: unknown;
      user?: any;
    }
  }
}

export {};
