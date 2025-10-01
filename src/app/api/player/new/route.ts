import { dbConnect } from "@/app/database/db";
import { Player } from "@/app/models";
import { NextRequest, NextResponse } from "next/server";

// Create player
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();console.log(data)

    // Check if player exists with same name AND age
    const existingPlayer = await Player.findOne({
      name: data.name,
      age: data.age,
    });

    if (existingPlayer) {
      return NextResponse.json(
        {
          msg: "Player with same name and age already exists",
        },
        { status: 400 }
      );
    }

    const player = await new Player(data).save();
    return NextResponse.json(
      {
        success: "Player added successfully",
        player,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error creating player",
      },
      { status: 500 }
    );
  }
}
