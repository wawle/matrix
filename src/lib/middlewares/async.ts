import { NextRequest, NextResponse } from "next/server";
import { errorHandler, ErrorResponse } from "./error";

export const asyncHandler =
  (fn: any) => (req: NextRequest, res: NextResponse, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(errorHandler);

export const asyncFn =
  (fn: any) =>
  async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await fn(req);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

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
