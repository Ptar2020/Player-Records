import { dbConnect } from "@/app/database/db";
import { Club } from "@/app/models";
import { NextRequest, NextResponse } from "next/server";

// Get club data based on the supplied id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ _id: string }> }
) {
  try {
    await dbConnect();
    const { _id } = await params;
    const clubData = await Club.findById({ _id    }).populate({
      path: "players",
      populate: { path: "position" },
    });
    if (!clubData) {
      return NextResponse.json({ msg: "Club not found" }, { status: 404 });
    }
    return NextResponse.json(clubData);
  } catch (error) {
    return NextResponse.json(
      {
        msg: error instanceof Error ? error.message : "Error getting club data",
      },
      { status: 500 }
    );
  }
}
