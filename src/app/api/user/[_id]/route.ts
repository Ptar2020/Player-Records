import { dbConnect } from "@/app/database/db";
import { User } from "@/app/models";
import { NextRequest, NextResponse } from "next/server";

// Update a user
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
    const user = await User.findById(_id);
    if (!user)
      return new NextResponse(JSON.stringify({ msg: "Item does not exist" }), {
        status: 404,
      });

    // Apply updates and save
    Object.assign(user, updates);
    await user.save();

    return NextResponse.json({ success: "User data updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      msg: error instanceof Error ? error.message : "Error geting details",
    });
  }
}

// DELETE a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ _id: string }> }
) {
  try {
    const { _id } = await params;
    await dbConnect();
    const user = await User.findById(_id);
    console.log(user);
    if (!user) {
      return NextResponse.json({ msg: "No such user exists" });
    }
    await user.deleteOne();
    // await User.findByIdAndDelete(_id);
    return NextResponse.json({ success: "User deleted" });
  } catch (error) {
    return NextResponse.json(
      error instanceof Error ? error.message : "Error deleting user"
    );
  }
}
