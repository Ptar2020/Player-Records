import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

// NEVER throw at module level — we fixed this pattern already
const SECRET_KEY = process.env.SECRET_KEY?.trim();
if (!SECRET_KEY) {
  console.error("SECRET_KEY missing — refresh token route disabled");
}

export async function POST(request: Request) {
  if (!SECRET_KEY) {
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const { refreshToken } = await request.json();

    if (!refreshToken || typeof refreshToken !== "string") {
      return NextResponse.json(
        { success: false, error: "Refresh token required" },
        { status: 400 }
      );
    }

    // Verify the old refresh token
    const payload = jwt.verify(refreshToken, SECRET_KEY) as { userId: string };

    if (!payload.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Generate NEW access token
    const newAccessToken = jwt.sign(
      { userId: payload.userId },
      SECRET_KEY,
      { expiresIn: "30m" }
    );

    // Generate NEW refresh token (recommended: token rotation)
    const newRefreshToken = jwt.sign(
      { userId: payload.userId },
      SECRET_KEY,
      { expiresIn: "30d" }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken, // always return new one!
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[REFRESH TOKEN] Failed:", error.message);

    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { success: false, error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Token refresh failed" },
      { status: 500 }
    );
  }
}
// // app/api/auth/android/refresh/route.ts
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { verifyAndroidToken, DecodedToken } from "@/lib/auth/androidVerify";

// export const dynamic = "force-dynamic";

// const SECRET_KEY = process.env.SECRET_KEY!;
// if (!SECRET_KEY) {
//   throw new Error("SECRET_KEY is not defined in environment variables");
// }

// // POST → /api/auth/android/refresh
// // Flutter sends: Authorization: Bearer <long-lived-refresh-or-access-token>
// export async function POST(request: Request) {
//   try {
//     const authHeader = request.headers.get("authorization");

//     const oldTokenData = verifyAndroidToken(authHeader || "");
//     if (!oldTokenData || !oldTokenData.userId) {
//       return NextResponse.json(
//         { success: false, error: "Invalid or expired token" },
//         { status: 401 }
//       );
//     }

//     // Generate a **fresh access token** (short-lived: 15–60 min)
//     const newAccessToken = jwt.sign(
//       {
//         userId: oldTokenData.userId,
//         email: oldTokenData.email,
//         role: oldTokenData.role || "user",
//       },
//       SECRET_KEY,
//       { expiresIn: "30m" } // adjust as needed: 15m, 30m, 1h
//     );

//     // Optional: generate new long-lived refresh token (e.g. 30 days)
//     const newRefreshToken = jwt.sign(
//       { userId: oldTokenData.userId },
//       SECRET_KEY,
//       { expiresIn: "30d" }
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Token refreshed",
//         data: {
//           accessToken: newAccessToken,
//           refreshToken: newRefreshToken, // send new one (rotate!)
//           expiresIn: 30 * 60, // 30 minutes in seconds
//           user: {
//             id: oldTokenData.userId,
//             email: oldTokenData.email,
//             role: oldTokenData.role || "user",
//           },
//         },
//       },
//       {
//         status: 200,
//         headers: {
//           "Cache-Control": "no-store",
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   } catch (error) {
//     console.error("[Android API] Token refresh failed:", error);
//     return NextResponse.json(
//       { success: false, error: "Token refresh failed" },
//       { status: 500 }
//     );
//   }
// }