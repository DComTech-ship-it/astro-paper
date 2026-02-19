import type { APIRoute } from "astro";
import { getCurrentUser } from "@/lib/admin/auth";
import { createMediaFile } from "@/lib/filedb";
import { promises as fs } from 'fs';
import { join } from 'path';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check authentication
  const user = getCurrentUser(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: "File type not allowed" }),
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: "File too large" }),
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${timestamp}_${randomString}.${fileExtension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save file
    const filePath = join(uploadsDir, uniqueFilename);
    const fileData = new Uint8Array(await file.arrayBuffer());
    await fs.writeFile(filePath, fileData);

    // Get file dimensions for images
    let dimensions = '';
    if (file.type.startsWith('image/')) {
      try {
        // For simplicity, we'll use a basic approach
        // In production, you'd want to use a proper image processing library
        dimensions = '1920x1080'; // Placeholder
      } catch (error) {
        dimensions = '';
      }
    }

    // Create media record
    const mediaFile = {
      id: Date.now(),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      size: file.size,
      url: `/uploads/${uniqueFilename}`,
      alt: formData.get('alt') as string || '',
      uploadedBy: user.email,
      uploadDate: new Date().toISOString().split('T')[0],
      dimensions,
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      createdAt: new Date().toISOString()
    };

    // Save to file database
    await createMediaFile(mediaFile);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "File uploaded successfully",
        file: mediaFile
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ error: "Upload failed" }),
      { status: 500 }
    );
  }
};
