import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "./error";

export const asyncHandler =
  (fn: any) => (req: NextRequest, res: NextResponse, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(errorHandler);
