import { dbConnect } from "@/app/database/db";
import { User } from "@/app/models";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Login user
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
      throw new Error("SECRET_KEY variable is not defined");
    }

    // Handle request body parsing
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { msg: "Both username and Password are required!" },
        { status: 400 }
      );
    }

    // Check if the user exists in the database
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ msg: "Invalid username" }, { status: 401 });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { msg: "Incorrect credentials" },
        { status: 401 }
      );
    }

    // Update last login timestamp
    user.last_login = new Date();
    await user.save();

    // Generate JWT tokens
    const newAccessToken = jwt.sign(
      {
        username: user.username,
        _id: user._id,
        role: user.role,
        // courses: user.courses,
      },
      SECRET_KEY,
      {
        expiresIn: "9m",
      }
    );
    const newRefreshToken = jwt.sign(
      {
        username: user.username,
        _id: user._id,
        role: user.role,
        // courses: user.courses,
      },
      SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    // Set security headers
    const securityHeaders = {
      "Content-Security-Policy": "default-src 'self'",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    };

    // Set the new tokens in the response cookies
    const headers = new Headers({
      "Content-Type": "application/json",
      ...securityHeaders,
      "Set-Cookie": [
        `accessToken=${newAccessToken};path=/;Max-Age=${60 * 9};httpOnly;${
          process.env.NODE_ENV === "production" ? "Secure;" : ""
        }`,
        `refreshToken=${newRefreshToken};path=/;httpOnly;Max-Age=${
          60 * 60 * 24 * 7
        };${process.env.NODE_ENV === "production" ? "Secure;" : ""}`,
      ].join(","),
    });

    // Return user info and tokens using NextResponse
    return NextResponse.json(
      {
        _id: user._id,
        username: user.username,
        role: user.role,
        // courses: user.courses,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      { headers }
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred";
    console.error(errorMessage);
    return NextResponse.json({ msg: errorMessage }, { status: 500 });
  }
}
