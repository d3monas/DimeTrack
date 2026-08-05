import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.KV_URL || process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const syncId = params.id;

  if (!syncId) {
    return NextResponse.json({ error: "Invalid Sync ID" }, { status: 400 });
  }

  try {
    const encryptedData = await redis.get<string>(`sync:${syncId}`);
    
    if (!encryptedData) {
      return NextResponse.json({ error: "Sync ID not found" }, { status: 404 });
    }

    return new Response(encryptedData, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("KV GET Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const syncId = params.id;

  if (!syncId) {
    return NextResponse.json({ error: "Invalid Sync ID" }, { status: 400 });
  }

  try {
    const encryptedData = await request.text();
    await redis.set(`sync:${syncId}`, encryptedData);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("KV POST Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}