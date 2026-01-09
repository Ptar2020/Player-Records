import { dbConnect } from "@/app/database/db";
import { Player } from "@/app/models";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();

    const players = await Player.find({})
      .populate("club", "name shortName logo country level")
      .populate("position", "name shortName")
      .lean()
      .exec();

    // Properly convert all _id to string id, including in populated fields
    const mobilePlayers = players.map((p: any) => {
      const plain = { ...p };

      return {
        ...plain,
        id: plain._id.toString(),
        _id: undefined,

        // Fix populated club
        club: plain.club
          ? {
              ...plain.club,
              id: plain.club._id.toString(),
              _id: undefined,
            }
          : null,

        // Fix populated position
        position: plain.position
          ? {
              ...plain.position,
              id: plain.position._id.toString(),
              _id: undefined,
            }
          : null,
      };
    });


    return NextResponse.json(
      {
        success: true,
        count: mobilePlayers.length,
        data: mobilePlayers,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load players",
      },
      { status: 500 }
    );
  }
}