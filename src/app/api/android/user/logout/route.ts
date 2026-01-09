import { NextResponse } from "next/server";
import { verifyAndroidToken } from "../authVerify";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/android/logout
 * 
 * Since we use stateless JWTs (no server-side sessions),
 * logout is handled 100% on the client:
 *   → just delete the tokens from secure storage
 * 
 * This endpoint exists only to:
 *   • Confirm the user was authenticated
 *   • Return a nice success message
 *   • Allow future server-side token blacklist (optional)
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const user = verifyAndroidToken(authHeader || "");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Already logged out or invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
        data: {
          userId: user.userId,
          username: user.email || "User",
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[Android API] Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}