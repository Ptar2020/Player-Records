import { dbConnect } from "@/app/database/db";
import { Position } from "@/app/models";
import { NextRequest, NextResponse } from "next/server";

// Create a position
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    await dbConnect();
    await new Position(data).save();
    return NextResponse.json({ success: "Position created" });
  } catch (error) {
    return NextResponse.json(
      error instanceof Error ? error.message : "Error creating position"
    );
  }
}

// Get available positions
export async function GET() {
  try {
    await dbConnect();
    const positions = await Position.find();
    console.log(positions);
    return NextResponse.json(positions);
  } catch (error) {
    return NextResponse.json(
      error instanceof Error ? error.message : "Error getting positions"
    );
  }
}
