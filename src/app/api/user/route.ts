import { dbConnect } from "@/app/database/db";
import { User } from "@/app/models";
import { NextResponse } from "next/server";

// Retrieve all users
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      error instanceof Error ? error.message : "Error retrieving users"
    );
  }
}
