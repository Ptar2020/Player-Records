import { dbConnect } from "@/app/database/db";
import { Club, Player } from "@/app/models";
import { NextRequest, NextResponse } from "next/server";

// POST /api/player/new - Create a new player
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    const { club, name, age } = data;

    // Validate required fields
    if (!club || !name || !age || age <= 0) {
      return NextResponse.json(
        { msg: "Missing or invalid required fields (club, name, age)" },
        { status: 400 }
      );
    }

    // Check for duplicate player by name and age
    const existingPlayer = await Player.findOne({ name, age });
    if (existingPlayer) {
      return NextResponse.json(
        { msg: "Player with the same name and age already exists" },
        { status: 409 }
      );
    }

    const player = new Player(data);
    await player.save();

    // Add player to club's players array
    await Club.findByIdAndUpdate(club, {
      $push: { players: player._id },
    });

    return NextResponse.json(
      { success: "Player added successfully", player },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating player:", error);
    return NextResponse.json(
      { msg: error instanceof Error ? error.message : "Error creating player" },
      { status: 500 }
    );
  }
}
// import { dbConnect } from "@/app/database/db";
// import { Club, Player } from "@/app/models";
// import { NextRequest, NextResponse } from "next/server";

// // Create player
// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect();
//     const data = await request.json();
//     const club = data.club;
//     console.log("Player data ", data);

//     // Check if player exists with same name AND age
//     const existingPlayer = await Player.findOne({
//       name: data.name,
//       age: data.age,
//     });

//     if (existingPlayer) {
//       return NextResponse.json(
//         {
//           msg: "Player with same name and age already exists",
//         },
//         { status: 400 }
//       );
//     }

//     const player = await new Player(data).save();
//     await Club.findByIdAndUpdate(club, {
//       $push: { players: player._id },
//     });
//     // await Club.updateOne({ club }, { $push: { players: player._id } });

//     return NextResponse.json(
//       {
//         success: "Player added successfully",
//         player,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       {
//         error: error instanceof Error ? error.message : "Error creating player",
//       },
//       { status: 500 }
//     );
//   }
// }
