import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"

function getRedisClient() {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.KV_URL ||
    process.env.UPSTASH_REDIS_REST_URL
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    console.error(
      "Missing Redis environment variables. URL exists:",
      !!url,
      "Token exists:",
      !!token
    )
    throw new Error("Missing Redis environment variables")
  }

  return new Redis({ url, token })
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: syncId } = await params

  if (!syncId) {
    return NextResponse.json({ error: "Invalid Sync ID" }, { status: 400 })
  }

  try {
    const redis = getRedisClient()
    const encryptedData = await redis.get<string>(`sync:${syncId}`)

    if (!encryptedData) {
      return NextResponse.json({ error: "Sync ID not found" }, { status: 404 })
    }

    return new Response(encryptedData, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    })
  } catch (error) {
    console.error("KV GET Error:", error)
    return NextResponse.json(
      { error: "Database error", details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: syncId } = await params

  if (!syncId) {
    return NextResponse.json({ error: "Invalid Sync ID" }, { status: 400 })
  }

  try {
    const redis = getRedisClient()
    const encryptedData = await request.text()
    await redis.set(`sync:${syncId}`, encryptedData)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("KV POST Error:", error)
    return NextResponse.json(
      { error: "Database error", details: (error as Error).message },
      { status: 500 }
    )
  }
}
