import { NextRequest, NextResponse } from 'next/server';
import { ipAddress } from "@vercel/functions";
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// Ratelimit
const requestLimit = 3;
const interval = 60;
const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(requestLimit, `${interval} s`),
});

// Define which routes you want to rate limit
export const config = {
  matcher: '/',
};

export default async function middleware(request: NextRequest) {
  // You could alternatively limit based on user ID or similar
  const ip = ipAddress(request) ?? '127.0.0.1';
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    ip
  );
  return success
    ? NextResponse.next()
    : NextResponse.redirect(new URL('/blocked', request.url));
}