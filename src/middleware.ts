import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Enforce admin-only access to /admin routes
    if (path.startsWith("/admin") && token?.role !== "admin") {
      // Redirect customers/staff attempting to access admin routes to their user dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true if authorized (token exists)
      authorized: ({ token }) => !!token,
    },
  }
);

// Define which routes to match for middleware protection
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/checkout/payment", // protect payment flow
  ],
};
