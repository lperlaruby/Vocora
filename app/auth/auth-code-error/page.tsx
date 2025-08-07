'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

function AuthCodeErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')
  const description = searchParams?.get('description')

  const getErrorMessage = () => {
    switch (error) {
      case 'no_code':
        return 'No authorization code was provided by the OAuth provider.'
      case 'exchange_failed':
        return `Failed to exchange authorization code: ${description || 'Unknown error'}`
      case 'unexpected':
        return `An unexpected error occurred: ${description || 'Unknown error'}`
      default:
        return description || 'An unknown authentication error occurred.'
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-red-600">Authentication Error</CardTitle>
          <CardDescription>
            Sorry, we couldn't sign you in. This might be due to an expired link or a server error.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800 font-medium">Error Details:</p>
              <p className="text-sm text-red-700 mt-1">{getErrorMessage()}</p>
              {error && (
                <p className="text-xs text-red-600 mt-2 font-mono">Error Code: {error}</p>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Please try signing in again. If the problem persists, please contact support.
            </p>
            <div className="space-y-2">
              <Link href="/login">
                <Button className="w-full">
                  Back to Sign In
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Go to Home
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthCodeError() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    }>
      <AuthCodeErrorContent />
    </Suspense>
  )
}
