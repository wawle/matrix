import { NextRequest, NextResponse } from "next/server";

// @desc    Logs request to console
export const logger = (req: NextRequest, res: NextResponse, next: any) => {
  console.log({
    log: {
      method: req.method,
      url: req.url,
      status: res.status,
      user: JSON.parse(req.headers.get("user") || "{}").id,
    },
  });
};
