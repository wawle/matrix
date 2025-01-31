
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

const PUBLIC_PATHS = ["/login", "/register", "/api/login", "/api/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  // 3. Decrypt the session from the cookie

  // get token from request headers or cookies
  const token =
    request.headers.get("Authorization")?.split(" ")[1] ||
    request.cookies.get("token")?.value;
  const user = await decrypt(token);
  const isAuth = Boolean(user?.id);

  // API rotaları için özel işlem
  if (pathname.startsWith("/api/")) {
    if (isPublicPath) {
      return NextResponse.next();
    }

    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("user", JSON.stringify(user));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Web sayfaları için yönlendirmeler
  if (isAuth && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (!isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("user", JSON.stringify(user));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
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
    