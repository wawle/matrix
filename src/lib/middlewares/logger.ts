import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "./async";

// @desc    Logs request to console
export const logger = asyncHandler(
  (req: NextRequest, res: NextResponse, next: any) => {
    console.log({
      log: {
        method: req.method,
        url: req.url,
        status: res.status,
        user: JSON.parse(req.headers.get("user") || "{}").id,
      },
    });

    return next(req);
  }
);
