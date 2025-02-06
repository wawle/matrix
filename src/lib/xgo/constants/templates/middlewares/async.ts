export const asyncMiddleware = {
  template: (name: string, props: any) => {
    return `
import { NextRequest, NextResponse } from "next/server";
import { errorHandler, ErrorResponse } from "@/lib/middlewares/error";

export const asyncHandler =
  (fn: any) => (req: NextRequest, res: NextResponse, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(errorHandler);

export const asyncFn = (fn: any) => async (req: NextRequest, props: any) =>
  Promise.resolve(fn(req, props)).catch(errorHandler);

export const asyncFnService =
  <T>(fn: (...props: any) => Promise<T>) =>
  async (...props: any) => {
    try {
      return await fn(...props);
    } catch (error: any) {
      throw new ErrorResponse(
        error.message || "Server Error",
        error.statusCode || 500
      );
    }
  };

    `;
  },
};
