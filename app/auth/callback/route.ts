import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('OAuth callback received:', { code: !!code, next })

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log('OAuth exchange successful, redirecting to:', next)
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error('OAuth exchange failed:', error)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
