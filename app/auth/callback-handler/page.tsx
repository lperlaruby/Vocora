'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function CallbackHandlerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Processing authentication...')
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Handling OAuth callback...')
        console.log('Current URL:', window.location.href)
        console.log('Hash:', window.location.hash)
        
        // Handle the authentication session from URL hash
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          setStatus(`Error: ${error.message}`)
          setTimeout(() => {
            router.push('/auth/auth-code-error?error=session_error&description=' + encodeURIComponent(error.message))
          }, 2000)
          return
        }

        if (data.session) {
          console.log('Session found:', {
            hasSession: !!data.session,
            hasUser: !!data.session.user,
            userEmail: data.session.user?.email
          })

          // Check if this is coming from the login page (Google sign-in)
          const isFromLogin = searchParams?.get('next')?.includes('/dashboard')
          // Check if this is coming from signup page (language-setup)
          const isFromSignup = searchParams?.get('next')?.includes('/language-setup')
          
          if (isFromLogin) {
            // For login page Google sign-in, check if this is a new user
            const userCreatedAt = new Date(data.session.user.created_at)
            const now = new Date()
            const timeDiff = now.getTime() - userCreatedAt.getTime()
            
            // If user was created within the last 10 seconds, it's a new account
            if (timeDiff < 10000) {
              console.log('New Google user detected, redirecting to login with error')
              setStatus('Account not found. Please sign up first.')
              
              // Sign out the new user immediately
              await supabase.auth.signOut()
              
              setTimeout(() => {
                router.push('/login?error=google_account_not_exists')
              }, 2000)
              return
            }
          }
          
          if (isFromSignup) {
            // For signup flows, check if user already has completed language preferences
            const { data: preferences } = await supabase
              .from('user_preferences')
              .select('preferred_lang, practice_lang')
              .eq('uid', data.session.user.id)
              .maybeSingle()
            
            if (preferences?.preferred_lang && preferences?.practice_lang) {
              console.log('User with completed preferences trying to signup again')
              setStatus('Account already exists. Please sign in instead.')
              
              // Sign out the user and redirect to sign-in page
              await supabase.auth.signOut()
              
              setTimeout(() => {
                router.push('/login?error=account_exists_signup_attempt')
              }, 2000)
              return
            }
          }
          
          setStatus('Authentication successful! Redirecting...')
          
          // Get the next parameter
          const next = searchParams?.get('next') || '/dashboard'
          
          // Redirect to the intended destination
          setTimeout(() => {
            router.push(next)
          }, 1000)
        } else {
          console.log('No session found, trying to get session from URL hash...')
          
          // Try to handle the session from URL hash
          const { error: hashError } = await supabase.auth.getSession()
          
          if (hashError) {
            console.error('Hash session error:', hashError)
            setStatus(`Error processing authentication: ${hashError.message}`)
            setTimeout(() => {
              router.push('/auth/auth-code-error?error=hash_error&description=' + encodeURIComponent(hashError.message))
            }, 2000)
          } else {
            setStatus('No valid session found. Redirecting to login...')
            setTimeout(() => {
              router.push('/login')
            }, 2000)
          }
        }
      } catch (err) {
        console.error('Callback handler error:', err)
        setStatus(`Unexpected error: ${err}`)
        setTimeout(() => {
          router.push('/auth/auth-code-error?error=unexpected&description=' + encodeURIComponent(String(err)))
        }, 2000)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">{status}</p>
      </div>
    </div>
  )
}

export default function CallbackHandler() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <CallbackHandlerContent />
    </Suspense>
  )
}
