import { dbConnect } from "@/app/database/db";
import { Club } from "@/app/models";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET → All clubs (optimized for mobile lists/dropdowns)
export async function GET() {
  try {
    await dbConnect();

    const clubs = await Club.find({})
      .select("name shortName country level logo badge city foundedYear players")
      // .select("name shortName country level logo badge city foundedYear")
      .lean()
      .sort({ name: 1 })
      .exec();

    const mobileClubs = clubs.map((club: any) => ({
      id: club._id.toString(),
      name: club.name,
      shortName: club.shortName || club.name,
      country: club.country,
      level: club.level,
      logo: club.logo || null,
      badge: club.badge || null,
      city: club.city || null,
      foundedYear: club.foundedYear || null,
      playersCount: club.players?.length || 0, // optional: helpful in UI
    }));

    return NextResponse.json(
      {
        success: true,
        count: mobileClubs.length,
        data: mobileClubs,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=600, stale-while-revalidate=120", // 10 min cache is safe for clubs
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("[Android API] GET /clubs/android →", error);
    return NextResponse.json(
      { success: false, error: "Failed to load clubs" },
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