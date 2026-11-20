import { createHash } from "node:crypto";
import { errorResponse, HttpError, requireAdmin, requireUser } from "@/lib/server/auth";

interface SignatureRequest {
  purpose?: "product" | "avatar";
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as SignatureRequest;
    let folder: string;

    if (body.purpose === "product") {
      await requireAdmin(request);
      folder = "products";
    } else if (body.purpose === "avatar") {
      const user = await requireUser(request);
      folder = `avatars/${user.uid}`;
    } else {
      throw new HttpError(400, "Invalid upload purpose");
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary server credentials are not configured");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHash("sha1")
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    return Response.json({ cloudName, apiKey, folder, timestamp, signature });
  } catch (error) {
    return errorResponse(error);
  }
}

