import { dbConnect } from "@/app/database/db";
import { Position } from "@/app/models";
import { NextRequest, NextResponse } from "next/server";

// Create a position (POST /api/position)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    if (!data.name) {
      return NextResponse.json({ msg: "Name is required" }, { status: 400 });
    }
    const newPosition = new Position(data);
    await newPosition.save();
    return NextResponse.json({ success: "Position created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        msg: error instanceof Error ? error.message : "Error creating position",
      },
      { status: 500 }
    );
  }
}

// Get available positions (GET /api/position)
export async function GET() {
  try {
    await dbConnect();
    const positions = await Position.find();
    return NextResponse.json(positions);
  } catch (error) {
    return NextResponse.json(
      {
        msg: error instanceof Error ? error.message : "Error getting positions",
      },
      { status: 500 }
    );
  }
}
