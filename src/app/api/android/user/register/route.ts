import { dbConnect } from "@/app/database/db";
import { User } from "@/app/models";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { username, password, name, email, phone, club, role } = body;

    // === Validation ===
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Normalize username & email
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email?.trim().toLowerCase();

    // === Check for duplicates ===
    const existingUser = await User.findOne({
      $or: [
        { username: normalizedUsername },
        { email: normalizedEmail },
      ],
    }).lean();

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: existingUser?.username === normalizedUsername
            ? "Username already taken"
            : "Email already registered",
        },
        { status: 409 }
      );
    }

    // === Hash password ===
    const hashedPassword = await bcrypt.hash(password, 13);

    // === Validate role against schema enum ===
    const validRoles = ["coach", "admin", "player"];
    const userRole = role && validRoles.includes(role) ? role : "coach"; // default to coach

    // === Create user ===
    const newUser = await User.create({
      username: normalizedUsername,
      password: hashedPassword,
      name: name?.trim() || username,
      email: normalizedEmail || null,
      phone: phone?.trim() || null,
      club: club || null,
      role: userRole,
      isActive: true,
    });

    // === Return clean response (no password, no sensitive data) ===
    return NextResponse.json(
      {
        success: true,
        message: "Registration successful!",
        data: {
          user: {
            id: newUser._id.toString(),
            username: newUser.username,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            club: newUser.club,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {console.log(error),
    console.error( error);
    return NextResponse.json(console.log(error),
      {
        success: false,
        error: error.message.includes("duplicate")
          ? "User already exists"
          : "Registration failed. Please try again.",
      },
      { status: 500 }
    );
  }
}