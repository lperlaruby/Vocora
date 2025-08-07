import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    authUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
}
