
// import { dbConnect } from "@/app/database/db";
// import { Club, Player } from "@/app/models";
// import { NextResponse } from "next/server";

// export const dynamic = "force-dynamic"; 

// export async function POST(request: Request) {
//   try {
//     await dbConnect();
//     const data = await request.json();
//     console.log("BODY DATA",data);
//     const { club, name, age, position, photo, country,gender,phone,email, jerseyNumber } = data;

//     // Required fields for mobile
//     if (!club || !name || !age || age <= 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Missing required fields: club, name, and valid age are required",
//         },
//         { status: 400 }
//       );
//     }

//     // Prevent duplicate player (same name + age in same club — adjust logic if needed)
//     const existingPlayer = await Player.findOne({
//       name: { $regex: `^${name}$`, $options: "i" }, // case-insensitive
//       age,
//       club,
//     }).lean();

//     if (existingPlayer) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Player with this name, age, and club already exists",
//         },
//         { status: 409 }
//       );
//     }

//     // Create the player
//     const player = new Player({
//       ...data,
//       club,
//       position: position || null,
//       photo: photo || null,
//       country: country,
//       email: email,
//       phone: phone,
//       gender: gender,
//       jerseyNumber: jerseyNumber || null,
//     });

//     await player.save();
// console.log("PLAYER MADE ", player)
//     // Add player reference to the club's players array
//     await Club.findByIdAndUpdate(
//       club,
//       { $push: { players: player._id } },
//       { new: true }
//     );

//     // Return clean, mobile-friendly response
//     const playerResponse = {
//       id: player._id.toString(),
//       name: player.name,
//       age: player.age,
//       email: player.email,
//       phone: player.phone,
//       club: player.club,
//       position: player.position,
//       photo: player.photo,
//       country: player.country,
//       jerseyNumber: player.jerseyNumber,
//       createdAt: player.createdAt,
//     };

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Player created successfully",
//         data: playerResponse,
//       },
//       {
//         status: 201,
//         headers: {
//           "Cache-Control": "no-store",
//           "Access-Control-Allow-Origin": "*",
//         },
//       }
//     );
//   } catch (error) {
//     console.error( error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: "Failed to create player",
//       },
//       { status: 500 }
//     );
//   }
// }

// // // Optional: Handle CORS preflight
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "POST, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type",
//     },
//   });
// }











import { dbConnect } from "@/app/database/db";
import Player from "@/app/models/Player";
import Club from "@/app/models/Club";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Helper to add CORS headers
function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    console.log("BODY", body);
    const { club, name, age, country, photo, jerseyNumber,position ,phone,email} = body;

    // Validation
    if (!club || !name || !age) {
      return withCors(
        NextResponse.json(
          { success: false, error: "club, name and age are required" },
          { status: 400 }
        )
      );
    }

    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 99) {
      return withCors(
        NextResponse.json({ success: false, error: "Invalid age" }, { status: 400 })
      );
    }

    // Check duplicate
    const existing = await Player.findOne({
      club,
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      age: age.toString(),
    }).lean();

    if (existing) {
      return withCors(
        NextResponse.json(
          { success: false, error: "Player already exists in this club" },
          { status: 409 }
        )
      );
    }

    // Create player
    const player = await Player.create({
      name: name.trim(),
      age: age.toString(),
      country: country,
      phone: phone,
      email: email,
      photo: photo || null,
      jerseyNumber: jerseyNumber ? Number(jerseyNumber) : null,
      club,position,
    });

    await Club.findByIdAndUpdate(club, { $push: { players: player._id } });

    const successResponse = NextResponse.json(
      {
        success: true,
        message: "Player created successfully",
        data: {
          id: player._id.toString(),
          name: player.name,
          age: player.age,
          country: player.country,
          photo: player.photo,
          jerseyNumber: player.jerseyNumber,
          position: player.position
        },
      },
      { status: 201 }
    );

    return withCors(successResponse);
  } catch (error: any) {
    console.error( error);
    const errorResponse = NextResponse.json(
      { success: false, error: "Failed to create player" },
      { status: 500 }
    );
    return withCors(errorResponse);
  }
}

// This single line handles preflight for ALL methods (POST, GET, etc.)
export { OPTIONS } from "next/dist/server/web/spec-extension/request";