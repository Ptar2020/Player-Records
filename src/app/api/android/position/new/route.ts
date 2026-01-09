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

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name }: { name: string } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Position name is required" },
        { status: 400 }
      );
    }

    const formattedName = toTitleCase(name);

    // Check for duplicate
    const exists = await Position.findOne({
      name: { $regex: `^${formattedName}$`, $options: "i" },
    }).lean();

    if (exists) {
      return NextResponse.json(
        { success: false, error: "Position already exists" },
        { status: 409 }
      );
    }

    const newPosition = new Position({
      name: formattedName,
      shortName: generateShortName(formattedName),
    });

    await newPosition.save();

    return NextResponse.json(
      {
        success: true,
        message: "Position created",
        data: {
          id: newPosition._id.toString(),
          name: newPosition.name,
          shortName: newPosition.shortName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /positions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create position" },
      { status: 500 }
    );
  }
}

// Optional: CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}