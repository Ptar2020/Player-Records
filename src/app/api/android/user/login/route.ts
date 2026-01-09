
import { dbConnect } from "@/app/database/db";
import { User } from "@/app/models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SECRET_KEY = process.env.SECRET_KEY?.trim();

export async function POST(request: Request) {console.log("DB Visited")
  console.log("Login attempt → POST /api/android/user/login");
  console.log("SECRET_KEY loaded:", !!SECRET_KEY ? "Yes" : "No ← MISSING!");

  if (!SECRET_KEY) {
    console.error("SECRET_KEY is missing → blocking all logins");
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    await dbConnect();

    const body = await request.json();
    const { username, password } = body;

    // Log 2: Show exactly what was received from Flutter
    console.log("Login payload →", { username, password: password ? "***hidden***" : undefined });

    // Validation
    if (!username || !password) {
      console.log("Validation failed: missing username or password");
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    }).lean();

    if (!user) {
      console.log(`Login failed → user "${username}" not found`);
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.password) {
      console.log(`Login failed → user "${username}" has no password set`);
      return NextResponse.json(
        { success: false, error: "Account issue. Contact support." },
        { status: 401 }
      );
    }

    // Password check
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`Login failed → wrong password for user "${username}"`);
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // SUCCESS → generate tokens
    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        username: user.username,
        email: user.email || "",
        role: user.role || "user",
      },
      SECRET_KEY,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id.toString() },
      SECRET_KEY,
      { expiresIn: "30d" }
    );

    // Update last login
    await User.updateOne(
      { _id: user._id },
      { $set: { last_login: new Date() } }
    );

    console.log(`Login SUCCESS → user: "${username}" (ID: ${user._id})`);

    return NextResponse.json(
      {
        success: true,
        message: "Welcome",
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email || null,
            role: user.role || "user",
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("LOGIN API CRASHED →", error.message || error);console.log(error)
    return NextResponse.json(
      { success: false, error: "Login failed. Please try again later." },
      { status: 500 }
    );
  }
}
