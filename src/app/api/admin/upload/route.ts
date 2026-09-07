import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

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

    // Clean filename
    const originalName = file.name || 'saree.jpg';
    const originalExt = path.extname(originalName) || '.jpg';
    const safeBase = path
      .basename(originalName, originalExt)
      .replace(/[^\w-]/g, '')
      .slice(0, 30);

    // Compress & optimize image with Sharp to high-quality WebP
    let processedBuffer = buffer;
    let finalExt = '.webp';
    let mimeType = 'image/webp';

    try {
      processedBuffer = await sharp(buffer)
        .rotate() // Auto-orient phone camera photos
        .resize({
          width: 1400,
          height: 1800,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85, effort: 4 })
        .toBuffer();
    } catch (sharpErr) {
      console.warn('Sharp compression fallback to original buffer:', sharpErr);
      finalExt = originalExt;
      mimeType = file.type || 'image/jpeg';
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch (e) {
      // ignore if already exists
    }

    const fileName = `saree-${safeBase || 'photo'}-${Date.now()}${finalExt}`;
    const filePath = path.join(uploadsDir, fileName);

    try {
      await fs.writeFile(filePath, processedBuffer);
      const publicUrl = `/uploads/${fileName}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName,
        size: processedBuffer.length,
      });
    } catch (fsErr) {
      console.warn('Could not write to public/uploads directory, falling back to data URL:', fsErr);
      // Resilient fallback: base64 Data URL
      const base64 = processedBuffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        fileName,
        size: processedBuffer.length,
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
