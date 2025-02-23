import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const requestUrl = new URL(req.url);
  let pathname = requestUrl.pathname;
  if (pathname !== '/') {
    pathname = pathname.replace(/\/$/, '');
  }
  
  const res = NextResponse.next();
  
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session && pathname !== '/signin') {
    return NextResponse.redirect(`${requestUrl.origin}/signin`);
  }
  if (session && pathname === '/signin' || pathname === '/') {
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
  }
  

  return res;
}

export const config = {
  matcher: ["/", '/dashboard', '/signin'],
};
