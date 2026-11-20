import { auth } from "@/lib/firebase/config";

export async function uploadToCloudinary(file: File, folder: string): Promise<{ url: string; publicId: string }> {
  if (!file.type.startsWith("image/")) throw new Error("Only image files can be uploaded");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be smaller than 5MB");
  const user = auth.currentUser;
  if (!user) throw new Error("You must be signed in to upload images");
  const idToken = await user.getIdToken();
  const purpose = folder === "products" ? "product" : "avatar";
  const signatureRes = await fetch("/api/cloudinary/signature", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ purpose }),
  });
  if (!signatureRes.ok) throw new Error("Image upload could not be authorized");
  const signatureData = await signatureRes.json() as {
    cloudName: string;
    apiKey: string;
    folder: string;
    timestamp: number;
    signature: string;
  };

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", String(signatureData.timestamp));
  formData.append("signature", signatureData.signature);
  formData.append("folder", signatureData.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Cloudinary upload failed");
  const data = await res.json();
  return { url: data.secure_url as string, publicId: data.public_id as string };
}

export function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

export async function deleteFromCloudinary(urls: string[]): Promise<void> {
  const publicIds = urls.map(extractPublicId).filter((id): id is string => Boolean(id));
  if (publicIds.length === 0) return;

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be signed in to delete images");
    const idToken = await user.getIdToken();
    const res = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ publicIds }),
    });
    if (!res.ok) console.error("Cloudinary delete failed:", await res.text());
  } catch (err) {
    console.error("Cloudinary delete failed:", err);
  }
}
