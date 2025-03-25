import { NextResponse } from "next/server";

let userProfile = {}; // This should be replaced with a database

export async function POST(req: Request) {
  try {
    const data = await req.json();
    userProfile = data; // Store in DB instead of memory
    return NextResponse.json({ message: "Profile saved successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(userProfile, { status: 200 });
}
