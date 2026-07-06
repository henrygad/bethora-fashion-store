import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { publicIds } = (await req.json()) as { publicIds: string[] };
  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    return NextResponse.json({ success: true });
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  const params = new URLSearchParams();
  for (const id of publicIds) params.append("public_ids[]", id);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?${params.toString()}`,
    {
      method: "DELETE",
      headers: { Authorization: `Basic ${auth}` },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ success: false, error: text }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
