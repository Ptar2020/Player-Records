import { dbConnect } from "@/app/database/db";
import { Club } from "@/app/models";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// PATCH → Update club by _id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { _id: string } }
) {
  try {
    const { _id } = await params;
    const updates = await request.json();

    if (!_id || _id.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Club ID is required" },
        { status: 400 }
      );
    }

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No update data provided" },
        { status: 400 }
      );
    }

    await dbConnect();

    const club = await Club.findById(_id);

    if (!club) {
      return NextResponse.json(
        { success: false, error: "Club not found" },
        { status: 404 }
      );
    }

    // Apply updates
    if (updates.name !== undefined) club.name = updates.name.trim();
    if (updates.country !== undefined) club.country = updates.country.trim();
    if (updates.level !== undefined) club.level = updates.level?.trim() || null;
    if (updates.logo !== undefined) club.logo = updates.logo?.trim() || null;
    if (updates.badge !== undefined) club.badge = updates.badge?.trim() || null;
    if (updates.city !== undefined) club.city = updates.city?.trim() || null;
    if (updates.foundedYear !== undefined) club.foundedYear = updates.foundedYear || null;

    await club.save();

    const updatedClub = {
      id: club._id.toString(),
      name: club.name,
      shortName: club.shortName || club.name,
      country: club.country,
      level: club.level,
      logo: club.logo || null,
      badge: club.badge || null,
      city: club.city || null,
      foundedYear: club.foundedYear || null,
      playersCount: club.players?.length || 0,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Club updated",
        data: updatedClub,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to update club" },
      { status: 500 }
    );
  }
}

// GET → Fetch full club details by _id with full player data
export async function GET(
  request: Request,
  { params }: { params: Promise<{ _id: string }> }
) {
  try {
    const { _id } = await params;

    if (!_id || _id.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Club _id is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const club = await Club.findById(_id)
      .populate({
        path: "players",
        // Removed select restriction → get ALL player fields
        populate: { path: "position", select: "name shortName" },
      })
      .lean()
      .exec();

    if (!club) {
      return NextResponse.json(
        { success: false, error: "Club not found" },
        { status: 404 }
      );
    }

    // Mobile-friendly format
    const mobileClub = {
      id: club._id.toString(),
      name: club.name,
      shortName: club.shortName || club.name,
      country: club.country,
      level: club.level,
      logo: club.logo || null,
      badge: club.badge || null,
      city: club.city || null,
      foundedYear: club.foundedYear || null,
      players: (club.players || []).map((p: any) => ({
        id: p._id.toString(),
        name: p.name,
        age: p.age,
        jerseyNumber: p.jerseyNumber,
        photo: p.photo || null,
        country: p.country || p.nationality || null, // Use country or fallback
        phone: p.phone || null,
        email: p.email || null,
        gender: p.gender || null,
        position: p.position
          ? {
              id: p.position._id.toString(),
              name: p.position.name,
              shortName: p.position.shortName || p.position.name,
            }
          : null,
        club: club ? { id: club._id.toString(), name: club.name } : null,
      })),
      playersCount: (club.players || []).length,
    };

    return NextResponse.json(
      { success: true, data: mobileClub },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("[GET Club API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load club details" },
      { status: 500 }
    );
  }
}

// DELETE club by ID
export async function DELETE(
  request: Request,
  { params }: { params: { _id: string } }
) {
  try {
    const { _id } = params;

    if (!_id || _id.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Club ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const club = await Club.findById(_id);

    if (!club) {
      return NextResponse.json(
        { success: false, error: "Club not found" },
        { status: 404 }
      );
    }

    // Check if club has players
    if (club.players && club.players.length > 0) {
      return NextResponse.json(
        { success: false, error: "Club has players. Remove or transfer them first." },
        { status: 400 }
      );
    }

    // Delete the club
    await Club.deleteOne({ _id: _id });

    return NextResponse.json(
      {
        success: true,
        message: "Club deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Club delete failed" },
      { status: 500 }
    );
  }
}







// import { dbConnect } from "@/app/database/db";
// import { Club } from "@/app/models";
// import { NextResponse, NextRequest } from "next/server";


// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// // PATCH → Update club by _id
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { _id: string } }
// ) {
//   try {
//     console.log("AT PATCH");
//     const { _id } = await params;
//     const updates = await request.json();
//     console.log("UPDATES");
//     if (!_id || _id.trim() === "") {
//       return NextResponse.json(
//         { success: false, error: "Club ID is required" },
//         { status: 400 }
//       );
//     }

//     if (!updates || Object.keys(updates).length === 0) {
//       return NextResponse.json(
//         { success: false, error: "No update data provided" },
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     const club = await Club.findById(_id);

//     if (!club) {
//       return NextResponse.json(
//         { success: false, error: "Club not found" },
//         { status: 404 }
//       );
//     }

//     // Apply updates
//     if (updates.name !== undefined) club.name = updates.name.trim();
//     if (updates.country !== undefined) club.country = updates.country.trim();
//     if (updates.level !== undefined) club.level = updates.level?.trim() || null;
//     if (updates.logo !== undefined) club.logo = updates.logo?.trim() || null;
//     if (updates.badge !== undefined) club.badge = updates.badge?.trim() || null;
//     if (updates.city !== undefined) club.city = updates.city?.trim() || null;
//     if (updates.foundedYear !== undefined) club.foundedYear = updates.foundedYear || null;

//     await club.save();
//     console.log("CLUB ,", club);
//     const updatedClub = {
//       _id: club._id.toString(),
//       name: club.name,
//       shortName: club.shortName || club.name,
//       country: club.country,
//       level: club.level,
//       logo: club.logo || null,
//       badge: club.badge || null,
//       city: club.city || null,
//       foundedYear: club.foundedYear || null,
//       playersCount: club.players?.length || 0,
//     };
// // console.log("UPDATED CLUB ,", updatedClub);
//     return NextResponse.json(
//       {
//         success: true,
//         message: "Club updated ",
//         data: updatedClub,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error( error);
//     return NextResponse.json(
//       { success: false, error: "Failed to update club" },
//       { status: 500 }
//     );
//   }
// }


// // GET → Fetch full club details by _id
// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ _id: string }> }
// ) {
//   try {
//     const { _id } = await params;

//     if (!_id || _id.trim() === "") {
//       return NextResponse.json(
//         { success: false, error: "Club _id is required" },
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     const club = await Club.findById(_id)
//       .populate({
//         path: "players",
//         populate: { path: "position", select: "name shortName" },
//         // select: "name age jerseyNumber photo position nationality",
//       })
//       .lean()
//       .exec();
// console.log(club)
//     if (!club) {
//       return NextResponse.json(
//         { success: false, error: "Club not found" },
//         { status: 404 }
//       );
//     }

//     const mobileClub = {
//       _id: club._id.toString(),
//       name: club.name,
//       shortName: club.shortName || club.name,
//       country: club.country,
//       level: club.level,
//       logo: club.logo || null,
//       badge: club.badge || null,
//       city: club.city || null,
//       foundedYear: club.foundedYear || null,
//       players: (club.players || []).map((p: any) => ({
//         _id: p._id.toString(),
//         name: p.name,
//         age: p.age,
//         jerseyNumber: p.jerseyNumber,
//         photo: p.photo || null,
//         nationality: p.nationality || "Unknown",
//         position: p.position
//           ? {
//               _id: p.position._id.toString(),
//               name: p.position.name,
//               shortName: p.position.shortName || p.position.name,
//             }
//           : null,
//       })),
//       playersCount: (club.players || []).length,
//     };

//     return NextResponse.json(
//       { success: true, data: mobileClub },
//       {
//         status: 200,
//         headers: {
//           "Cache-Control": "no-store",
//           "Access-Control-Allow-Origin": "*",
//         },
//       }
//     );
//   } catch (error) {
//     console.error("[GET Club API] Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to load club details" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE  club by ID
// export async function DELETE(
//   request: Request,
//   { params }: { params: { _id: string } }
// ) {
//   try {
//     const { _id } = params;
//     // console.log("THE ID , ",_id);
//     if (!_id || _id.trim() === "") {
//       return NextResponse.json(
//         { success: false, error: "Club ID is required" },
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     const club = await Club.findById(_id);

//     if (!club) {
//       return NextResponse.json(
//         { success: false, error: "Club not found" },
//         { status: 404 }
//       );
//     }

//     // Check if club has players
//     if (club.players && club.players.length > 0) {
//       return NextResponse.json(
//         { success: false, error: "Club has players. Remove or transfer them first." },
//         { status: 400 }
//       );
//     }

//     // Delete the club
//     await Club.deleteOne({ _id: _id });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Club delete successful",
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, error: "Club delete failed" },
//       { status: 500 }
//     );
//   }
// }

