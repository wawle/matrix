export const authMiddleware = {
  template: (name: string, props: any) => {
    return `
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authorize, protect } from "@/lib/middlewares/protect";

export async function middleware(request: NextRequest) {
  return await protect(
    request,
    NextResponse.next(),
    authorize("admin", "user")
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

    `;
  },
};
