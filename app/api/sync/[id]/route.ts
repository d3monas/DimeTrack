import { NextResponse } from "next/server"

function getConfig() {
  let url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  let token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    const rawUrl = process.env.KV_URL || process.env.UPSTASH_REDIS_URL
    if (rawUrl && rawUrl.startsWith("rediss://")) {
      try {
        const parsed = new URL(rawUrl)
        url = `https://${parsed.hostname}`
        token = parsed.password
      } catch (e) {
        console.error("Failed to parse KV_URL")
      }
    }
  }

  if (!url || !token) {
    throw new Error("Missing KV environment variables")
  }

  return { url, token }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: syncId } = await params
  if (!syncId)
    return NextResponse.json({ error: "Invalid Sync ID" }, { status: 400 })

  try {
    const { url, token } = getConfig()

    const res = await fetch(`${url}/get/sync:${syncId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()

    if (!data.result) {
      return NextResponse.json({ error: "Sync ID not found" }, { status: 404 })
    }

    return new Response(data.result, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    })
  } catch (error) {
    console.error("KV GET Error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: syncId } = await params
  if (!syncId)
    return NextResponse.json({ error: "Invalid Sync ID" }, { status: 400 })

  try {
    const { url, token } = getConfig()
    const encryptedData = await request.text()

    const res = await fetch(`${url}/set/sync:${syncId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([encryptedData]),
    })

    if (!res.ok) throw new Error("Failed to save to KV")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("KV POST Error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
