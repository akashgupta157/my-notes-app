import dbConnect from "@/lib/db";
import Tenant from "@/models/Tenant";
import { getAuthUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  try {
    await dbConnect();

    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (authUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tenant = await Tenant.findOne({ slug });
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    if (tenant._id.toString() !== authUser.tenantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    tenant.plan = "pro";
    await tenant.save();

    return NextResponse.json({
      message: "Tenant upgraded to Pro plan successfully",
      tenant,
    });
  } catch (error) {
    console.error("Upgrade tenant error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
