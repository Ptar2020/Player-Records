export const dynamic = "force-dynamic";
import jwt from "jsonwebtoken";
import { middleware } from "../authVerify";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.SECRET_KEY;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Ensure SECRET_KEY is defined
    if (!SECRET_KEY) {
      throw new Error("SECRET_KEY variable is not defined");
    }

    const data = await middleware(req);

    if (data) {
      const userInfo = {
        username: data.username,
        _id: data._id,
        role: data.role,
      };

      const accessToken = jwt.sign(
        {
          username: data.username,
          _id: data._id,
          role: data.role,
        },
        SECRET_KEY,
        {
          expiresIn: "9m",
        }
      );

      // Set security headers
      const securityHeaders: Record<string, string> = {
        "Content-Security-Policy": "default-src 'self'",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
      };

      // Combine headers
      const headers: Record<string, string> = {
        "Set-Cookie": `accessToken=${accessToken}; Path=/; Max-Age=${
          60 * 10
        };httpOnly; ${process.env.NODE_ENV === "production" ? "Secure;" : ""} `,
        "Content-Type": "application/json",
        ...securityHeaders,
      };

      // Send the new access token back to the client
      return NextResponse.json(
        { accessToken, userInfo },
        {
          status: 200,
          headers,
        }
      );
    } else {
      console.log("No user");
      return NextResponse.json(
        { userInfo: null },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      {
        msg:
          error instanceof Error
            ? error.message
            : "Unexpected Error experienced",
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
