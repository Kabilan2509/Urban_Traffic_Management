import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { recordActivity } from "@/lib/activity-log";

export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const activity = await recordActivity({
      kind: body.kind || "user",
      actor: body.actor || "Unknown User",
      role: body.role || "Unknown",
      target: body.target || "Portal",
      action: body.action || "user.action",
      summary: body.summary || "User activity recorded",
      status: body.status || "Success",
      meta: body.meta || undefined,
    });

    return NextResponse.json({
      ok: true,
      id: activity._id.toString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
