import Note from "@/models/Note";
import dbConnect from "@/lib/db";
import Tenant from "@/models/Tenant";
import { getAuthUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notes = await Note.find({ tenantId: authUser.tenantId })
      .populate("createdBy", "email")
      .sort({ createdAt: -1 });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Get notes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (authUser.role !== "admin" && authUser.role !== "member") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tenant = await Tenant.findById(authUser.tenantId);
    if (tenant?.plan === "free") {
      const noteCount = await Note.countDocuments({
        tenantId: authUser.tenantId,
      });
      if (noteCount >= 3) {
        return NextResponse.json(
          {
            error: "Note limit reached. Upgrade to Pro plan.",
          },
          { status: 403 }
        );
      }
    }

    const { title, content } = await request.json();

    const note = new Note({
      title,
      content,
      tenantId: authUser.tenantId,
      createdBy: authUser.userId,
    });

    await note.save();

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
