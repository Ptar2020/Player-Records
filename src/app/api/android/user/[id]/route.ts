import { dbConnect } from "@/app/database/db";
import { User } from "@/app/models";
import { verifyAndroidToken } from "@/app/api/android/user/authVerify";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Helper: only admins or the user themselves can modify/delete
async function canModifyUser(requestingUserId: string, targetUserId: string, role?: string) {
  if (requestingUserId === targetUserId) return true;
  if (role === "admin") return true;
  return false;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {console.log("At user edit");
    const { id } = await params;
    const updates = await request.json();

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No update data provided" },
        { status: 400 }
      );
    }

    // === AUTHENTICATION ===
    const authHeader = request.headers.get("authorization");
    const tokenUser = verifyAndroidToken(authHeader || "");

    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findById(id).populate("club");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // === AUTHORIZATION ===
    const canEdit = await canModifyUser(tokenUser.userId, id, tokenUser.role);
    if (!canEdit) {
      return NextResponse.json(
        { success: false, error: "Forbidden: insufficient permissions" },
        { status: 403 }
      );
    }

    // Allow admin to change more fields
    const allowedFields = ["username", "email", "isActive", "role", "club"];

    const safeUpdates: any = {};

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        // Extra: only admin can change role, isActive, club
        if ((key === "role" || key === "isActive" || key === "club") && tokenUser.role !== "admin") {
          continue;
        }

        safeUpdates[key] = updates[key];
      }
    }

    Object.assign(user, safeUpdates);

    await user.save();
    await user.populate("club");

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        data: {
          _id: user._id.toString(),
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          club: user.club ? { _id: user.club._id, name: user.club.name } : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {    console.log( error);

    console.error( error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// export async function PATCH(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const { id } = params;
//     const updates = await request.json();

//     if (!updates || Object.keys(updates).length === 0) {
//       return NextResponse.json(
//         { success: false, error: "No update data provided" },
//         { status: 400 }
//       );
//     }

//     // === AUTHENTICATION ===
//     const authHeader = request.headers.get("authorization");
//     const tokenUser = verifyAndroidToken(authHeader || "");
//     if (!tokenUser) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     await dbConnect();

//     const user = await User.findById(id);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "User not found" },
//         { status: 404 }
//       );
//     }

//     // === AUTHORIZATION ===
//     const canEdit = await canModifyUser(tokenUser.userId, id, tokenUser.role);
//     if (!canEdit) {
//       return NextResponse.json(
//         { success: false, error: "Forbidden: insufficient permissions" },
//         { status: 403 }
//       );
//     }

//     // Prevent role escalation or sensitive field tampering
//     const allowedFields = ["username", "email", "isActive", "role"];
//     const safeUpdates: any = {};
//     for (const key of allowedFields) {
//       if (updates[key] !== undefined) {
//         // Extra: only admin can change role or isActive
//         if ((key === "role" || key === "isActive") && tokenUser.role !== "admin") {
//           continue;
//         }
//         safeUpdates[key] = updates[key];
//       }
//     }

//     Object.assign(user, safeUpdates);
//     await user.save();

//     return NextResponse.json(
//       {
//         success: true,
//         message: "User updated successfully",
//         data: {
//           id: user._id.toString(),
//           username: user.username,
//           email: user.email,
//           role: user.role,
//           isActive: user.isActive,
//           club: user.club?.name ?? null,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("ERROR UPDATING", error);
//     console.error("[Android API] PATCH /users/android/[id] →", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to update user" },
//       { status: 500 }
//     );
//   }
// }

// DELETE → Remove user (admin only or self-delete)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // === AUTHENTICATION ===
    const authHeader = request.headers.get("authorization");
    const tokenUser = verifyAndroidToken(authHeader || "");
    if (!tokenUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // === AUTHORIZATION ===
    const canDelete = await canModifyUser(tokenUser.userId, id, tokenUser.role);
    if (!canDelete) {
      return NextResponse.json(
        { success: false, error: "Forbidden: you cannot delete this user" },
        { status: 403 }
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Android API] DELETE /users/android/[id] →", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}