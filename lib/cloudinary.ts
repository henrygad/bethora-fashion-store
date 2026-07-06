const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export async function uploadToCloudinary(file: File, folder: string): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET as string);
  formData.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
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
    const res = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicIds }),
    });
    if (!res.ok) console.error("Cloudinary delete failed:", await res.text());
  } catch (err) {
    console.error("Cloudinary delete failed:", err);
  }
}
