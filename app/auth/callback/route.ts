import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('OAuth callback received:', { 
    error, 
    errorDescription, 
    next,
    fullUrl: request.url,
    allParams: Object.fromEntries(searchParams.entries())
  })

  // If there's an error parameter, show it
  if (error && error !== 'no_code') {
    console.error('OAuth error:', { error, errorDescription })
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error}&description=${encodeURIComponent(errorDescription || '')}`)
  }

  // For implicit flow (token in URL hash), we need to redirect to a page that can handle the hash
  console.log('Redirecting to handle implicit OAuth flow...')
  
  // Create the redirect page that will handle the token from URL hash
  return NextResponse.redirect(`${origin}/auth/callback-handler?next=${encodeURIComponent(next)}`)
}
