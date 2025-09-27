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

        if (!deviceFingerprint) {
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
            let detailedInfo: any = {};

            // Handle different types of limitations
            switch (limitType) {
                case 'second':
                    retryAfter = Math.ceil((result.resetTimes.second - Date.now()) / 1000);
                    message = `Too many requests per second. Limit: 20 requests/second (+ 10 burst). You have ${result.requestsRemaining.second} requests remaining.`;
                    detailedInfo = {
                        window: 'second',
                        limit: 20,
                        burstAllowance: 10,
                        remaining: result.requestsRemaining.second,
                        resetIn: `${retryAfter} seconds`
                    };
                    break;

                case 'minute':
                    retryAfter = Math.ceil((result.resetTimes.minute - Date.now()) / 1000);
                    const minutesRemaining = Math.ceil(retryAfter / 60);
                    message = `Too many requests per minute. Limit: 100 requests/minute (+ 25 burst). You have ${result.requestsRemaining.minute} requests remaining.`;
                    detailedInfo = {
                        window: 'minute',
                        limit: 100,
                        burstAllowance: 25,
                        remaining: result.requestsRemaining.minute,
                        resetIn: minutesRemaining > 1 ? `${minutesRemaining} minutes` : `${retryAfter} seconds`
                    };
                    break;

                case 'tenMinute':
                    retryAfter = Math.ceil((result.resetTimes.tenMinute - Date.now()) / 1000);
                    const tenMinutesRemaining = Math.ceil(retryAfter / 60);
                    message = `Too many requests per 10 minutes. Limit: 500 requests/10min (+ 50 burst). You have ${result.requestsRemaining.tenMinute} requests remaining.`;
                    detailedInfo = {
                        window: 'tenMinute',
                        limit: 500,
                        burstAllowance: 50,
                        remaining: result.requestsRemaining.tenMinute,
                        resetIn: tenMinutesRemaining > 1 ? `${tenMinutesRemaining} minutes` : `${retryAfter} seconds`
                    };
                    break;

                case 'suspicious_activity':
                    retryAfter = Math.ceil((result.backoffDelay || 0) / 1000);
                    const reasonText = result.errorDetails?.message || 'Suspicious activity detected';
                    message = `🚨 Security Alert: ${reasonText} Please wait ${retryAfter} seconds before retrying.`;
                    detailedInfo = {
                        window: 'security',
                        securityLevel: 'suspicious_activity',
                        backoffDelay: result.backoffDelay,
                        resetIn: retryAfter > 60 ? `${Math.ceil(retryAfter/60)} minutes` : `${retryAfter} seconds`,
                        securityFlags: result.securityFlags,
                        reasons: 'Possible causes: Clock sync issues, rapid requests, or unusual patterns'
                    };
                    break;

                case 'circuit_breaker':
                    retryAfter = Math.ceil((result.backoffDelay || 0) / 1000);
                    message = `⚡ Circuit Breaker Open: Too many consecutive failures detected. System is temporarily blocking requests for protection.`;
                    detailedInfo = {
                        window: 'protection',
                        securityLevel: 'circuit_breaker',
                        backoffDelay: result.backoffDelay,
                        resetIn: retryAfter > 60 ? `${Math.ceil(retryAfter/60)} minutes` : `${retryAfter} seconds`,
                        note: 'This is a protective measure. Normal service will resume automatically.',
                        securityFlags: result.securityFlags
                    };
                    break;

                default:
                    retryAfter = Math.ceil((result.backoffDelay || 1000) / 1000);
                    message = `Rate limit exceeded. Please wait ${retryAfter} seconds before retrying.`;
                    detailedInfo = {
                        window: 'general',
                        resetIn: `${retryAfter} seconds`
                    };
            }

            // Enhanced violation tracking info
            const violationInfo = {
                hasViolations: result.securityFlags?.suspiciousActivity || false,
                circuitBreakerState: result.securityFlags?.circuitBreakerState || 'CLOSED',
                adaptiveLimit: result.securityFlags?.adaptiveLimit || false,
                currentTime: new Date().toISOString(),
                nextAllowedTime: new Date(Date.now() + (retryAfter * 1000)).toISOString()
            };

            // Rate limit response with enhanced headers and info
            const response = NextResponse.json(
                {
                    error: 'Rate Limit Exceeded',
                    message,
                    limitedBy: limitType,
                    retryAfter,
                    details: detailedInfo,
                    violations: violationInfo,
                    requestsRemaining: result.requestsRemaining,
                    resetTimes: {
                        second: new Date(result.resetTimes.second).toISOString(),
                        minute: new Date(result.resetTimes.minute).toISOString(),
                        tenMinute: new Date(result.resetTimes.tenMinute).toISOString()
                    },
                    timeInfo: {
                        currentTime: new Date().toISOString(),
                        nextAllowedTime: new Date(Date.now() + (retryAfter * 1000)).toISOString(),
                        waitTimeHuman: getHumanReadableTime(retryAfter)
                    },
                    advice: getLimitationAdvice(limitType, result)
                },
                { status: 429 }
            );

            // Set comprehensive response headers
            response.headers.set('X-Device-Rate-Token', result.newToken);
            response.headers.set('X-RateLimit-Second-Remaining', result.requestsRemaining.second.toString());
            response.headers.set('X-RateLimit-Minute-Remaining', result.requestsRemaining.minute.toString());
            response.headers.set('X-RateLimit-TenMinute-Remaining', result.requestsRemaining.tenMinute.toString());
            response.headers.set('X-RateLimit-Second-Reset', Math.ceil(result.resetTimes.second / 1000).toString());
            response.headers.set('X-RateLimit-Minute-Reset', Math.ceil(result.resetTimes.minute / 1000).toString());
            response.headers.set('X-RateLimit-TenMinute-Reset', Math.ceil(result.resetTimes.tenMinute / 1000).toString());
            response.headers.set('Retry-After', retryAfter.toString());
            
            // Additional security headers
            response.headers.set('X-Rate-Limited-By', limitType || 'unknown');
            response.headers.set('X-Circuit-Breaker-State', result.securityFlags?.circuitBreakerState || 'CLOSED');
            response.headers.set('X-Suspicious-Activity', result.securityFlags?.suspiciousActivity ? 'true' : 'false');
            response.headers.set('X-Next-Allowed-Time', new Date(Date.now() + (retryAfter * 1000)).toISOString());

            if (result.backoffDelay) {
                response.headers.set('X-Backoff-Delay', result.backoffDelay.toString());
            }

            return response;
        }

        // Success case - execute handler aur headers add karna
        const handlerResponse = await handler();

        // Set comprehensive response headers for successful requests
        handlerResponse.headers.set('X-Device-Rate-Token', result.newToken);
        handlerResponse.headers.set('X-RateLimit-Second-Remaining', result.requestsRemaining.second.toString());
        handlerResponse.headers.set('X-RateLimit-Minute-Remaining', result.requestsRemaining.minute.toString());
        handlerResponse.headers.set('X-RateLimit-TenMinute-Remaining', result.requestsRemaining.tenMinute.toString());
        handlerResponse.headers.set('X-RateLimit-Second-Reset', Math.ceil(result.resetTimes.second / 1000).toString());
        handlerResponse.headers.set('X-RateLimit-Minute-Reset', Math.ceil(result.resetTimes.minute / 1000).toString());
        handlerResponse.headers.set('X-RateLimit-TenMinute-Reset', Math.ceil(result.resetTimes.tenMinute / 1000).toString());
        
        // Security status headers
        handlerResponse.headers.set('X-Circuit-Breaker-State', result.securityFlags?.circuitBreakerState || 'CLOSED');
        handlerResponse.headers.set('X-Suspicious-Activity', result.securityFlags?.suspiciousActivity ? 'true' : 'false');
        handlerResponse.headers.set('X-Adaptive-Limit', result.securityFlags?.adaptiveLimit ? 'true' : 'false');

        return handlerResponse;

    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.json(
            { 
                error: 'Internal server error',
                message: 'An unexpected error occurred while processing your request.',
                retryAfter: 60,
                timeInfo: {
                    currentTime: new Date().toISOString(),
                    nextAllowedTime: new Date(Date.now() + 60000).toISOString()
                }
            },
            { status: 500 }
        );
    }
}

// Helper function for human readable time
function getHumanReadableTime(seconds: number): string {
    if (seconds < 60) {
        return `${seconds} seconds`;
    } else if (seconds < 3600) {
        const minutes = Math.ceil(seconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
        const hours = Math.ceil(seconds / 3600);
        const remainingMinutes = Math.ceil((seconds % 3600) / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes > 0 ? `and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`;
    }
}

// Helper function for limitation advice
function getLimitationAdvice(limitType: string | undefined, result: any): string {
    switch (limitType) {
        case 'second':
            return 'You are making requests too quickly. Please slow down to 1 request every 50ms (20/second max).';
            
        case 'minute':
            return 'You have exceeded the per-minute limit. Please wait for the window to reset or spread out your requests.';
            
        case 'tenMinute':
            return 'You have reached the 10-minute request limit. Please wait for the window to reset.';
            
        case 'suspicious_activity':
            return 'Suspicious activity detected. This could be due to clock synchronization issues, rapid repeated requests, or unusual request patterns. Please ensure your system clock is synchronized and avoid rapid-fire requests.';
            
        case 'circuit_breaker':
            return 'The system has temporarily blocked requests due to repeated failures. This is a protective measure that will automatically resolve. Please wait for the specified time before retrying.';
            
        default:
            return 'Please review your request patterns and ensure you are following rate limit guidelines.';
    }
}
