import { dbConnect } from "@/app/database/db";
import { Player } from "@/app/models";
import { NextRequest, NextResponse } from "next/server";

// Get all players
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const players = await Player.find().populate("club").populate("position");
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json(
      error instanceof Error ? error.message : "Error creating player"
    );
  }
}
