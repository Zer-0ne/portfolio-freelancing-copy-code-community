'use server'
import { RateLimit } from "@/middleware/rate-limiting";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (request: NextRequest) => {
    return await RateLimit(request, async () => {
        // const deviceFingerprint =await  request.headers.get('x-device-fingerprint') || 'unknown';
        // const rateLimitToken = await request.headers.get('x-device-rate-token') || '';
        // const userAgent = await request.headers.get('user-agent') || 'unknown';
        // const forwarded = await request.headers.get('x-forwarded-for');
        // const realIp = await request.headers.get('x-real-ip');
        // console.log(deviceFingerprint,rateLimitToken,userAgent,realIp)
        return NextResponse.json({ msg: 'hi' }, { status: 200 })
    })
}