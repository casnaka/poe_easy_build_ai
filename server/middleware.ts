import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function middleware(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders })
  }
  const res = NextResponse.next()
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.headers.set(key, value)
  })
  return res
}

export const config = {
  matcher: '/api/:path*',
}
