import { NextResponse } from 'next/server'

export async function GET() {
  const hasUrl = !!process.env.SUPABASE_URL
  const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY

  return NextResponse.json({
    ok: hasUrl && hasKey,
    env: {
      hasUrl,
      hasKey,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV, // production | preview | development
    },
  })
}
