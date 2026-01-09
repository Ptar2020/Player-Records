import { dbConnect } from "@/app/database/db";
import { User } from "@/app/models";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET → Clean output matching Flutter UserModel
export async function GET() {
  try {
    await dbConnect();

    const users = await User.find({})
      .select("username email club name role isActive createdAt")
      .populate("club", "name") // ← populate club name
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    const formatted = users.map((user: any) => ({
      id: user._id.toString(),
      username: user.username,
      name: user.name,
      email: user.email ?? null,
      club: user.club?.name ?? null, // ← send club name
      role: user.role ?? "coach",
      isActive: user.isActive ?? true,
      createdAt: user.createdAt.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        count: formatted.length,
        data: formatted,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("[Android API] GET /users/android →", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load users",
      },
      { status: 500 }
    );
  }
}


// import { dbConnect } from "@/app/database/db";
// import { User } from "@/app/models";
// import { NextResponse } from "next/server";

// export const dynamic = "force-dynamic";

// // GET → List all users (safe + minimal data for mobile)
// export async function GET() {
//   try {
//     await dbConnect();

//     const users = await User.find({})
//       .select("username email phone club name role isActive createdAt") 
//       .lean()
//       .sort({ createdAt: -1 })
//       .exec();

//     const mobileUsers = users.map((user: any) => ({
//       id: user._id.toString(),
//       username: user.username,
//       name: user.name ,
//       club: user.club || null,
//       email: user.email || null,
//       role: user.role || "user",
//       isActive: user.isActive ?? true,
//       createdAt: user.createdAt,
//     }));

//     return NextResponse.json(
//       {
//         success: true,
//         count: mobileUsers.length,
//         data: mobileUsers,
//       },
//       {
//         status: 200,
//         headers: {
//           "Cache-Control": "no-store",
//           "Access-Control-Allow-Origin": "*",
//         },
//       }
//     );
//   } catch (error) {
//     console.error("[Android API] GET /users/android →", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Failed to load users",
//       },
//       { status: 500 }
//     );
//   }
// }