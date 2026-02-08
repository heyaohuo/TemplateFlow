// app/api/download/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get('url');
  if (!url) return new Response('Missing url', { status: 400 });

  const res = await fetch(url);
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': res.headers.get('content-type') || 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="image.png"',
    },
  });
}
