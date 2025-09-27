import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file found' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
  const path = join(process.cwd(), 'public/uploads', filename);

  try {
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);
    
    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl }, {status: 200 });

  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false, message: 'Error saving file' }, { status: 500 });
  }
}