import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/admin-api";

const UPLOAD_DIR = "public/uploads";

export async function POST(request: Request) {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Dosya gerekli." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    const uploadPath = path.join(process.cwd(), UPLOAD_DIR);
    await mkdir(uploadPath, { recursive: true });

    const filePath = path.join(uploadPath, safeName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${safeName}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("upload error:", error);
    return NextResponse.json(
      { message: "Yükleme hatası." },
      { status: 500 }
    );
  }
}
