import { dbConnect } from "@/app/database/db";
import { Club, Player } from "@/app/models";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/player/[id] - Delete a player by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ _id: string }> }
) {
  try {
    const { _id } = await params;
    await dbConnect();

    // Find and delete the player (returns the document before deletion)
    const player = await Player.findByIdAndDelete(_id);
    if (!player) {
      return NextResponse.json({ msg: "Player not found" }, { status: 404 });
    }

    // Remove player from the club's players array if club exists
    if (player.club) {
      await Club.findByIdAndUpdate(player.club, {
        $pull: { players: _id },
      });
    }

    return NextResponse.json(
      { success: "Player deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting player:", error);
    return NextResponse.json(
      { msg: error instanceof Error ? error.message : "Error deleting player" },
      { status: 500 }
    );
  }
}

// Update player
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ _id: string }> }
) {
  try {
    const { _id } = await params;
    const updates = await request.json();

    // Validate input
    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { msg: "No data provided for update" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Fetch the current player to check old club
    const player = await Player.findById(_id);
    if (!player) {
      return NextResponse.json({ msg: "Player not found" }, { status: 404 });
    }

    // Handle club change if provided and different
    const newClub = updates.club;
    if (newClub && newClub !== player.club?.toString()) {
      // Remove from old club (if exists)
      if (player.club) {
        await Club.findByIdAndUpdate(player.club, {
          $pull: { players: _id },
        });
      }

      // Add to new club (if provided)
      if (newClub) {
        await Club.findByIdAndUpdate(newClub, {
          $push: { players: _id },
        });
      }
    }

    // Apply other updates and save
    Object.assign(player, updates);
    await player.save();

    // Optionally repopulate for full response (e.g., with club/position details)
    const updatedPlayer = await Player.findById(_id).populate("club position");

    return NextResponse.json(
      { success: "Player data updated successfully", player: updatedPlayer },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating player:", error);
    return NextResponse.json(
      { msg: error instanceof Error ? error.message : "Error updating player" },
      { status: 500 }
    );
  }
}

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: Promise<{ _id: string }> }
// ) {
//   try {
//     const updates = await request.json();
//     const { _id } = await params;

//     // Parse request body for updates
//     if (!updates || Object.keys(updates).length === 0) {
//       return new NextResponse(
//         JSON.stringify({ msg: "No data provided for update" }),
//         { status: 400 }
//       );
//     }
//     await dbConnect();
//     const player = await Player.findById(_id);
//     if (!player)
//       return new NextResponse(JSON.stringify({ msg: "Item does not exist" }), {
//         status: 404,
//       });

//     // Apply updates and save
//     Object.assign(player, updates);
//     await player.save();

//     return NextResponse.json(
//       { success: "Player data updated" },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json({
//       msg: error instanceof Error ? error.message : "Error geting details",
//     });
//   }
// }

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
