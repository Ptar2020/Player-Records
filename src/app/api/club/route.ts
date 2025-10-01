import { dbConnect } from "@/app/database/db";
import { Club } from "@/app/models";
import { NextRequest, NextResponse } from "next/server";

// CREATE a club
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    await new Club(data).save();
    return NextResponse.json({ success: "Club created successfully" });
  } catch (error) {
    return NextResponse.json({
      msg: error instanceof Error ? error.message : "Error creating a club",
    });
  }
}

// GET all clubs
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const clubs = await Club.find();
    return NextResponse.json(clubs);
  } catch (error) {
    return NextResponse.json({
      msg: error instanceof Error ? error.message : "Error getting clubs",
    });
  }
}
