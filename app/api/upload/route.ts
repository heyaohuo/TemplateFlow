import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    let buffer: Uint8Array;
    let contentType: string = 'image/png';

    if (file instanceof Blob) {
      contentType = file.type || 'image/png';
      buffer = new Uint8Array(await file.arrayBuffer());
    } else if (typeof file === 'string') {
      const matches = file.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        contentType = matches[1];
        buffer = new Uint8Array(Buffer.from(matches[2], 'base64'));
      } else {
        buffer = new Uint8Array(Buffer.from(file, 'base64'));
      }
    } else {
      throw new Error("Invalid input");
    }

    // 智能提取后缀名
    const ext = contentType.split('/')[1]?.split('+')[0] || 'png';
    const filename = `${Date.now()}.${ext === 'octet-stream' ? 'png' : ext}`;

    // 发送到 R2 Worker
    const uploadUrl = `${process.env.NEXT_PUBLIC_WORKER_UPLOAD_URL}/${filename}`;
    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: new Uint8Array(buffer), // 已经是 Uint8Array，fetch 不会报错
    });

    if (!res.ok) throw new Error("Worker upload failed");

    return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${filename}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}