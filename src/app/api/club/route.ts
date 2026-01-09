import { dbConnect } from "@/app/database/db";
import { Club, User } from "@/app/models";
import { NextRequest, NextResponse } from "next/server";

// CREATE a club (POST /api/club)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    // Basic validation (expand based on your schema)
    if (!data.name || !data.country || !data.level) {
      return NextResponse.json(
        { msg: "Missing required fields" },
        { status: 400 }
      );
    }
    const newClub = new Club(data);
    await newClub.save();
    return NextResponse.json(
      { success: "Club created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { msg: error instanceof Error ? error.message : "Error creating a club" },
      { status: 500 }
    );
  }
}

// GET all clubs (GET /api/club)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    // await Club.collection.drop();
    // await User.deleteMany({ username: { $ne: "ptare" } }); //Deletes all users except one with "ptare" username
    const clubs = await Club.find();
    return NextResponse.json(clubs);
  } catch (error) {
    return NextResponse.json(
      { msg: error instanceof Error ? error.message : "Error getting clubs" },
      { status: 500 }
    );
  }
}
