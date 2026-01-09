import { dbConnect } from "@/app/database/db";
import { Club } from "@/app/models";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;


// POST → Create new club 
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const required = ["name", "country", "level"];
    const missing = required.filter((field) => !body[field]);

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Prevent duplicate club name in same country (optional but recommended)
    const exists = await Club.findOne({
      name: { $regex: `^${body.name.trim()}$`, $options: "i" },
      country: body.country,
    }).lean();

    if (exists) {
      return NextResponse.json(
        { success: false, error: "Club already exists in this country" },
        { status: 409 }
      );
    }

    const newClub = new Club({
      name: body.name.trim(),
      shortName: body.shortName?.trim() || body.name.trim().split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 4),
      country: body.country,
      level: body.level,
      logo: body.logo || null,
      badge: body.badge || null,
      city: body.city || null,
      foundedYear: body.foundedYear || null,
      players: [],
    });

    const createdClub = await newClub.save();
    console.log("CREATED CLUB  ", createdClub);

    return NextResponse.json(
      {
        success: true,
        message: "Club create successful",
        data: {
          _id: newClub._id.toString(),
          name: newClub.name,
          shortName: newClub.shortName,
          country: newClub.country,
          level: newClub.level,
          logo: newClub.logo,
          badge: newClub.badge,
          foundedYear: newClub.foundedYear,
          city: newClub.city,

        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error( error);
    return NextResponse.json(
      { success: false, error: "Failed to create club" },
      { status: 500 }
    );
  }
}

// CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}