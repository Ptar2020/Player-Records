
import { dbConnect } from "@/app/database/db";
import Position from "@/app/models/Position";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function toTitleCase(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function generateShortName(name: string): string {
  const upperName = name.toUpperCase();

  const overrides: Record<string, string> = {
    GOALKEEPER: "GK",
    "CENTRE BACK": "CB",
    "CENTER BACK": "CB",
    "LEFT BACK": "LB",
    "RIGHT BACK": "RB",
    "WING BACK": "WB",
    "DEFENSIVE MIDFIELDER": "DM",
    "ATTACKING MIDFIELDER": "AM",
    "CENTRAL MIDFIELDER": "CM",
    "LEFT WINGER": "LW",
    "RIGHT WINGER": "RW",
    STRIKER: "ST",
    "CENTRE FORWARD": "CF",
    FORWARD: "FW",
    MIDFIELDER: "MF",
    DEFENDER: "DF",
  };

  if (overrides[upperName]) {
    return overrides[upperName];
  }

  const words = upperName.split(" ").filter(w => w.length > 0);
  if (words.length >= 2) {
    return words.map(w => w[0]).join("").slice(0, 3);
  }

  return upperName.slice(0, 3);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { _id: string } }
) {
  const { _id } = params;

  try {
    await dbConnect();
    8925403505
    201439765
    const body = await request.json();
    const { name }: { name: string } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Position name is required" },
        { status: 400 }
      );
    }

    const formattedName = toTitleCase(name);
    const newShortName = generateShortName(formattedName);

    const updatedPosition = await Position.findByIdAndUpdate(
      _id,
      {
        name: formattedName,
        shortName: newShortName,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPosition) {
      return NextResponse.json(
        { success: false, error: "Position not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Position updated successfully",
      data: {
        id: updatedPosition._id.toString(),
        name: updatedPosition.name,
        shortName: updatedPosition.shortName,
      },
    });
  } catch (error) {
    console.error("PATCH /position/[_id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update position" },
      { status: 500 }
    );
  }
}

// DELETE — Delete a position
export async function DELETE(
  request: NextRequest,
  { params }: { params: { _id: string } }
) {
  const { _id } = params;

  try {
    await dbConnect();

    const deletedPosition = await Position.findByIdAndDelete(_id);

    if (!deletedPosition) {
      return NextResponse.json(
        { success: false, error: "Position not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Position deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/android/position/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete position" },
      { status: 500 }
    );
  }
}

// CORS Preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

