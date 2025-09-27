'use server'
import { NextRequest, NextResponse } from 'next/server';
import { createInitialDeviceToken, validateDeviceRateLimit } from '@/lib/rate-limiting.service';

export async function RateLimit(request: NextRequest, handler: () => Promise<NextResponse>) {
    try {
        // Headers extract karna
        const deviceFingerprint = request.headers.get('x-device-fingerprint') || undefined;
        const rateLimitToken = request.headers.get('x-device-rate-token') || undefined;
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const forwarded = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const clientIp = forwarded?.split(',')[0] || realIp || 'unknown';

        if (!deviceFingerprint ) {
            return NextResponse.json({
                "message": "Bot not allowed!",
                "error": "Bots not allowed"
            }, {
                status: 403
            })
        }

        // Token validate karna ya create karna
        let token = rateLimitToken;
        if (!token) {
            token = await createInitialDeviceToken(deviceFingerprint!);
        }

        // Rate limit check
        const result = await validateDeviceRateLimit(token, deviceFingerprint!);

        // Rate limit exceeded check
        if (!result.isAllowed) {
            const limitType = result.limitedBy;
            let retryAfter: number;
            let message: string;

            switch (limitType) {
                case 'second':
                    retryAfter = Math.ceil((result.resetTimes.second - Date.now()) / 1000);
                    message = 'Too many requests per second. Max 3 requests per second allowed.';
                    break;
                case 'minute':
                    retryAfter = Math.ceil((result.resetTimes.minute - Date.now()) / 1000);
                    message = 'Too many requests per minute. Max 20 requests per minute allowed.';
                    break;
                case 'tenMinute':
                    retryAfter = Math.ceil((result.resetTimes.tenMinute - Date.now()) / 1000);
                    message = 'Too many requests per 10 minutes. Max 500 requests per 10 minutes allowed.';
                    break;
                default:
                    retryAfter = 1;
                    message = 'Rate limit exceeded.';
            }

            // Rate limit response with headers
            const response = NextResponse.json(
                {
                    error: 'Rate Limit Exceeded',
                    message,
                    limitedBy: limitType,
                    retryAfter,
                },
                { status: 429 }
            );

            // Set response headers
            response.headers.set('X-Device-Rate-Token', result.newToken);
            response.headers.set('X-RateLimit-Second-Remaining', result.requestsRemaining.second.toString());
            response.headers.set('X-RateLimit-Minute-Remaining', result.requestsRemaining.minute.toString());
            response.headers.set('X-RateLimit-TenMinute-Remaining', result.requestsRemaining.tenMinute.toString());
            response.headers.set('X-RateLimit-Second-Reset', Math.ceil(result.resetTimes.second / 1000).toString());
            response.headers.set('X-RateLimit-Minute-Reset', Math.ceil(result.resetTimes.minute / 1000).toString());
            response.headers.set('X-RateLimit-TenMinute-Reset', Math.ceil(result.resetTimes.tenMinute / 1000).toString());
            response.headers.set('Retry-After', retryAfter.toString());

            return response;
        }

        // Success case - execute handler aur headers add karna
        const handlerResponse = await handler();

        // Set response headers for successful requests
        handlerResponse.headers.set('X-Device-Rate-Token', result.newToken);
        handlerResponse.headers.set('X-RateLimit-Second-Remaining', result.requestsRemaining.second.toString());
        handlerResponse.headers.set('X-RateLimit-Minute-Remaining', result.requestsRemaining.minute.toString());
        handlerResponse.headers.set('X-RateLimit-TenMinute-Remaining', result.requestsRemaining.tenMinute.toString());
        handlerResponse.headers.set('X-RateLimit-Second-Reset', Math.ceil(result.resetTimes.second / 1000).toString());
        handlerResponse.headers.set('X-RateLimit-Minute-Reset', Math.ceil(result.resetTimes.minute / 1000).toString());
        handlerResponse.headers.set('X-RateLimit-TenMinute-Reset', Math.ceil(result.resetTimes.tenMinute / 1000).toString());

        return handlerResponse;

    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
