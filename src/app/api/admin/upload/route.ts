import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch (e) {
      // ignore if already exists
    }

    // Clean filename
    const originalName = file.name || 'saree.jpg';
    const ext = path.extname(originalName) || '.jpg';
    const safeBase = path
      .basename(originalName, ext)
      .replace(/[^\w-]/g, '')
      .slice(0, 30);
    const fileName = `saree-${safeBase || 'photo'}-${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    try {
      await fs.writeFile(filePath, buffer);
      const publicUrl = `/uploads/${fileName}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName,
      });
    } catch (fsErr) {
      console.warn('Could not write to public/uploads directory, falling back to data URL:', fsErr);
      // Resilient fallback: base64 Data URL
      const mimeType = file.type || 'image/jpeg';
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        fileName,
      });
    }
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}
