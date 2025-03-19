// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // For middleware, use getToken to access session data
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // const role:string = token?.role as string;
  // const { pathname } = req.nextUrl;

  // if (pathname.startsWith("/admin/(editor)/")) {
  //   if (!["editor", "moderator", "admin"].includes(role)) {
  //     return NextResponse.redirect(new URL("/unauthorized", req.url));
  //   }
  // } else if (pathname.startsWith("/admin/(moderator)/")) {
  //   if (!["moderator", "admin"].includes(role)) {
  //     return NextResponse.redirect(new URL("/unauthorized", req.url));
  //   }
  // } else if (pathname.startsWith("/admin/(admin)/")) {
  //   if (role !== "admin") {
  //     return NextResponse.redirect(new URL("/unauthorized", req.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
