import { NextRequest, NextResponse } from "next/server";

// @desc    Logs request to console
export const logger = (req: NextRequest, res: NextResponse, next: any) => {
    console.log(
      `${req.method} ${req.url}`
    );
    next();
  };
  