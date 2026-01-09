import { dbConnect } from "@/app/database/db";
import { Club, Player } from "@/app/models";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// PATCH → Update player 
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No update data provided" },
        { status: 400 }
      );
    }

    await dbConnect();

    const player = await Player.findById(id);
    if (!player) {
      return NextResponse.json(
        { success: false, error: "Player not found" },
        { status: 404 }
      );
    }

    const oldClub = player.club?.toString();
    const newClub = updates.club;

    // Handle club transfer
    if (newClub && newClub !== oldClub) {
      if (oldClub) {
        await Club.findByIdAndUpdate(oldClub, { $pull: { players: id } });
      }
      if (newClub) {
        await Club.findByIdAndUpdate(newClub, { $push: { players: id } });
      }
    }

    // Apply updates
    Object.assign(player, updates);
    await player.save();

    // Return fresh populated data with full fields
    const updated = await Player.findById(id)
      .populate("club", "name shortName logo country level")
      .populate("position", "name shortName")
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Player updated successfully",
        data: {
          ...updated,
          id: updated?._id.toString(),
          _id: undefined,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to update player" },
      { status: 500 }
    );
  }
}

// GET → Fetch single player by ID with full data
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || id.length < 12) {
      return NextResponse.json(
        { success: false, error: "Invalid player ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    const player = await Player.findById(id)
      .populate("club", "name shortName logo country level") // Full club details
      .populate("position", "name shortName")
      .lean()
      .exec();

    if (!player) {
      return NextResponse.json(
        { success: false, error: "Player not found" },
        { status: 404 }
      );
    }

    // Mobile-friendly format
    const mobilePlayer = {
      ...player,
      id: player._id.toString(),
      _id: undefined,
    };

    return NextResponse.json(
      {
        success: true,
        data: mobilePlayer,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch player" },
      { status: 500 }
    );
  }
}

// DELETE → Remove player + clean up club reference
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    await dbConnect();

    const player = await Player.findByIdAndDelete(id);
    if (!player) {
      return NextResponse.json(
        { success: false, error: "Player not found" },
        { status: 404 }
      );
    }

    // Remove from club's players array
    if (player.club) {
      await Club.findByIdAndUpdate(player.club, {
        $pull: { players: id },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Player deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to delete player" },
      { status: 500 }
    );
  }
}

// import { dbConnect } from "@/app/database/db";
// import { Club, Player } from "@/app/models";
// import { NextResponse } from "next/server";

// export const dynamic = "force-dynamic"; 
// export const revalidate = 0;


// // PATCH → Update player 
// export async function PATCH(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = await params;
//     const updates = await request.json();
//     console.log("UPDATES FROM FRONTEND ", updates)

//     if (!updates || Object.keys(updates).length === 0) {
//       return NextResponse.json(
//         { success: false, error: "No update data provided" },
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     const player = await Player.findById(id);
//     if (!player) {
//       return NextResponse.json(
//         { success: false, error: "Player not found" },
//         { status: 404 }
//       );
//     }

//     const oldClub = player.club?.toString();
//     const newClub = updates.club;

//     // Handle club transfer
//     if (newClub && newClub !== oldClub) {
//       if (oldClub) {
//         await Club.findByIdAndUpdate(oldClub, { $pull: { players: id } });
//       }
//       if (newClub) {
//         await Club.findByIdAndUpdate(newClub, { $push: { players: id } });
//       }
//     }

//     // Apply updates
//     Object.assign(player, updates);
//     await player.save();

//     // Return fresh populated data
//     const updated = await Player.findById(id)
//       .populate("club", "name shortName logo age")
//       .populate("position", "name shortName")
//       .lean();

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Player updated successfully",
//         data: {
//           ...updated,
//           id: updated?._id.toString(),
//           _id: undefined,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, error: "Failed to update player" },
//       { status: 500 }
//     );
//   }
// }



// // GET → Fetch single player by ID
// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;

//     if (!id || id.length < 12) {
//       return NextResponse.json(
//         { success: false, error: "Invalid player ID" },
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     const player = await Player.findById(id)
//       .populate("club", "name shortName logo country level age")
//       .populate("position", "name shortName")
//       .lean()
//       .exec();

//     if (!player) {
//       return NextResponse.json(
//         { success: false, error: "Player not found" },
//         { status: 404 }
//       );
//     }

//     // Mobile-friendly format: _id → id
//     const mobilePlayer = {
//       ...player,
//       id: player._id.toString(),
//       _id: undefined,
//     };

//     return NextResponse.json(
//       {
//         success: true,
//         data: mobilePlayer,
//       },
//       {
//         status: 200,
//         headers: { "Cache-Control": "no-store" },
//       }
//     );
//   } catch (error) {
//     console.error( error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch player" },
//       { status: 500 }
//     );
//   }
// }


// // DELETE → Remove player + clean up club reference
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = await params;

//     await dbConnect();

//     const player = await Player.findByIdAndDelete(id);
//     if (!player) {
//       return NextResponse.json(
//         { success: false, error: "Player not found" },
//         { status: 404 }
//       );
//     }

//     // Remove from club's players array
//     if (player.club) {
//       await Club.findByIdAndUpdate(player.club, {
//         $pull: { players: id },
//       });
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Player deleted successfully",
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error( error);
//     return NextResponse.json(
//       { success: false, error: "Failed to delete player" },
//       { status: 500 }
//     );
//   }
// }