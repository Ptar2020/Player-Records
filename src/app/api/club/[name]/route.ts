import { dbConnect } from "@/app/database/db";
import { Club } from "@/app/models";
import { NextRequest, NextResponse } from "next/server";

// Get club data based on the supplied name
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    await dbConnect();
    const { name } = await params;
    const clubData = await Club.findOne({ name }).populate({
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
