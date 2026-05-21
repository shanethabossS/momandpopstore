import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if ((isDashboardRoute || isAdminRoute) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.nextUrl));
  }
  return NextResponse.next();
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
