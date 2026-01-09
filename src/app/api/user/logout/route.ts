import { NextRequest, NextResponse } from "next/server";
import { DecodedToken, middleware } from "../authVerify";

// Logout an authenticated user
export async function DELETE(req: NextRequest) {
  try {
    const data: DecodedToken | null = await middleware(req);
    if (!data) {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    // Set security headers
    const securityHeaders: Record<string, string> = {
      "Content-Security-Policy": "default-src 'self'",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    };

    // Prepare cookie headers
    const isProduction = process.env.NODE_ENV === "production";
    const cookieHeaders = [
      `accessToken=; Path=/; Max-Age=0; HttpOnly;${
        isProduction ? " Secure;" : ""
      }`,
      `refreshToken=; Path=/; Max-Age=0; HttpOnly;${
        isProduction ? " Secure;" : ""
      }`,
    ];

    // Create response and append cookies
    const response = NextResponse.json(
      { success: "Logged Out Successfully" },
      {
        headers: {
          "Content-Type": "application/json",
          ...securityHeaders,
        },
      }
    );

    // Append each Set-Cookie header
    cookieHeaders.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    return response;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    console.error(errorMessage);
    return NextResponse.json({ msg: errorMessage }, { status: 500 });
  }
}
