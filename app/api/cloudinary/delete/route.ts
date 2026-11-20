import { NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/server/auth";

export async function POST(req: Request) {
  try {
    await requireAdmin(req);
    const { publicIds } = (await req.json()) as { publicIds?: unknown };
    if (!Array.isArray(publicIds) || publicIds.length === 0 || publicIds.length > 20) {
      throw new HttpError(400, "Provide between 1 and 20 image IDs");
    }
    const safeIds = publicIds.filter(
      (id): id is string => typeof id === "string" && /^products\/[a-zA-Z0-9/_-]+$/.test(id)
    );
    if (safeIds.length !== publicIds.length) {
      throw new HttpError(400, "One or more image IDs are invalid");
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary server credentials are not configured");
    }
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const params = new URLSearchParams();
    for (const id of safeIds) params.append("public_ids[]", id);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?${params.toString()}`,
      {
        method: "DELETE",
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    if (!res.ok) {
      console.error("Cloudinary delete failed", res.status, await res.text());
      return NextResponse.json({ success: false, error: "Image deletion failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
