import { dbConnect } from "@/app/database/db";
import { Player } from "@/app/models";
import { NextResponse, NextRequest } from "next/server";

// Delete player
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ _id: string }> }
) {
  try {
    const { _id } = await params;
    console.log(_id);
    await dbConnect();
    const player = await Player.findById(_id);
    if (!player) {
      return NextResponse.json({ msg: "Player not found" });
    }
    await player.deleteOne();
    return NextResponse.json(
      { success: "Player deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({
      msg: error instanceof Error ? error.message : "Error geting details",
    });
  }
}

// Update player
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ _id: string }> }
) {
  try {
    const updates = await request.json();
    const { _id } = await params;

    // Parse request body for updates
    if (!updates || Object.keys(updates).length === 0) {
      return new NextResponse(
        JSON.stringify({ msg: "No data provided for update" }),
        { status: 400 }
      );
    }
    await dbConnect();
    const player = await Player.findById(_id);
    if (!player)
      return new NextResponse(JSON.stringify({ msg: "Item does not exist" }), {
        status: 404,
      });

    // Apply updates and save
    Object.assign(player, updates);
    await player.save();

    return NextResponse.json(
      { success: "Player data updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({
      msg: error instanceof Error ? error.message : "Error geting details",
    });
  }
}

// Get player
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ _id: string }> }
) {
  try {
    const { _id } = await params;
    console.log(_id);
    await dbConnect();
    const player = await Player.findById(_id)
      .populate("club")
      .populate("position");
    console.log(player);
    if (!player) {
      return NextResponse.json({ msg: "Player not found" });
    }
    return NextResponse.json(player, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      msg: error instanceof Error ? error.message : "Error geting details",
    });
  }
}
