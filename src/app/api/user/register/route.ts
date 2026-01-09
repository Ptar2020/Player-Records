import { dbConnect } from "@/app/database/db";
import { User } from "@/app/models";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// REGISTER  a user
export async function POST(request: NextRequest) {
  try {
    // await User.collection.drop();
    // console.log(await User.find());
    const { username, password, name, email, phone, club } =
      await request.json();
    await dbConnect();
    const checkUser = await User.findOne({ username: username });
    if (checkUser) {
      return NextResponse.json({ msg: "User already available" });
    }
    const hashedPassword = await bcryptjs.hash(password, 13);
    await new User({
      username,
      password: hashedPassword,
      name,
      email,
      phone,
      club,
    }).save();
    console.log(await User.find());
    return NextResponse.json({ success: "User added successfully" });
  } catch (error) {
    return NextResponse.json(
      error instanceof Error ? error.message : "Error registering"
    );
  }
}
