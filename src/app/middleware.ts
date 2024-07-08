import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const stringSession = cookies().get('tgSession') 
    console.log('middware', stringSession)
    if(!stringSession?.value) return NextResponse.redirect(new URL('/login', request.url))
}
 