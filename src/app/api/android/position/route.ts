import { dbConnect } from "@/app/database/db";
import { Position } from "@/app/models";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET all positions
export async function GET() {
  try {
    await dbConnect();

    const positions = await Position.find({})
      .lean() 
      .sort({ name: 1 }) 
      .exec();

    const mobilePositions = positions.map((pos: any) => ({
      id: pos._id.toString(),
      name: pos.name,
      shortName: pos.shortName,
    }));

    return NextResponse.json(
      {
        success: true,
        count: mobilePositions.length,
        data: mobilePositions,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=60", 
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.log("ERROR at /api/android/positions/route.ts", error)
    console.error( error);
    return NextResponse.json(
      { success: false, error: "Failed to load positions" },
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