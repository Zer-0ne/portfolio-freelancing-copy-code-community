'use server'

import { cookies, headers } from "next/headers";
import { getStableDeviceFingerprint } from "./device-fingerprint";
import { currentSession } from "@/utils/Session";
import { Data } from "@dnd-kit/core";
// import { toast } from "react-toastify";
import { Session, User } from "@/utils/Interfaces";
import { update } from "@/utils/ToastConfig";
import connect from "@/utils/database";
import { isValidObjectId } from "mongoose";
import Users from "@/Models/Users";
// import { userInfo } from "@/utils/FetchFromApi";

/**
 * RATE LIMITING INTEGRATION FOR DATA FETCHING
 * 
 * Integrates device fingerprinting and rate limiting headers with server-side data fetching
 * Automatically handles rate limit responses and token management
 * 
 * Features:
 * - Device fingerprint generation and inclusion
 * - Rate limiting token management  
 * - Automatic retry on rate limit with backoff
 * - Response header parsing for updated tokens
 */

// Cookie utilities with better error handling
export const getCookie = async (key: string) => {
    try {
        const cookieStore = await cookies();
        const cookie = cookieStore.get(key);
        return cookie?.value;
    } catch (error) {
        console.error(`Error getting cookie ${key}:`, error);
        return undefined;
    }
}

export const setCookie = async (key: string, value: string, options?: any) => {
    try {
        const cookieStore = await cookies();
        cookieStore.set(key, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week default
            ...options // Allow override of default options
        });
        return true;
    } catch (error) {
        console.error(`Error setting cookie ${key}:`, error);
        return false;
    }
}

export const getOrigin = async () => {
    const headersList = await headers();

    // Get host from headers
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto');

    // Parse host
    const [hostname, port] = host?.split(':')!;

    const origin = `${protocol}://${host}`;
    const baseUrl = origin;
    // console.log("baseUrl", baseUrl)
    return baseUrl;
}

const userInfo = async (username: string, method: string = 'GET'): Promise<User | string | null | undefined> => {
    try {
        // await new Promise((resolve: TimerHandler) => setTimeout(resolve, 3000))
        // check the session
        await connect()

        let user;

        // Check if the username is a valid ObjectId
        if (isValidObjectId(username)) {
            user = await Users.findById(username);
        } else {
            // If it's not a valid ObjectId, assume it's a username
            user = await Users.findOne({ username });
        }

        if (!user) throw new Error('user not found')
        const { password, ...userWithoutPassword } = user.toObject();
        // const data = await res.json()
        if (userWithoutPassword) {
            return userWithoutPassword as User
        }
    } catch (error) {
        // console.log(error)
        console.error("Error fetching user info:", error);
        return null;
    }
}


/**
 * Enhanced data fetching with comprehensive rate limiting support
 * 
 * Features:
 * - Automatic device fingerprinting
 * - Rate limiting header management
 * - Retry logic for rate limited requests
 * - Token refresh handling
 * - Comprehensive error handling
 * 
 * @param {string} route - API endpoint path
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} [authHeaders] - Optional bearer token for authorization
 * @param {object} [data] - Optional request body data
 * @param {object} [options] - Additional fetch options and retry settings
 * @returns {Promise<T | null>} Response data or null on failure
 */
export const dataFetch = async <T>(
    route: string,
    method: string,
    authHeaders?: string,
    data?: object,
    options: {
        maxRetries?: number;
        retryDelay?: number;
        skipRateLimit?: boolean;
        fetchOptions?: Data
    } = {}
): Promise<T | null> => {
    const { maxRetries = 2, retryDelay = 1000, skipRateLimit = false } = options;

    try {
        // Get stored cookies and tokens
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();
        const rateLimitToken = await getCookie('refresh-token') || '';

        // Generate device fingerprint for rate limiting
        const deviceFingerprint = skipRateLimit ? 'skip' : await getStableDeviceFingerprint();

        // Create cookie header string
        const cookieHeader = allCookies?.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        // Prepare headers with rate limiting support
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Cookie': cookieHeader,
        };

        // Add authorization header if provided
        if (authHeaders) {
            headers.Authorization = `Bearer ${authHeaders}`;
        }

        // Add rate limiting headers (middleware expects these)
        if (!skipRateLimit) {
            console.log(deviceFingerprint)
            headers['x-device-fingerprint'] = deviceFingerprint;
            headers['x-device-rate-token'] = rateLimitToken;
        }

        // Internal retry function with rate limit handling
        const attemptRequest = async (attemptNumber: number): Promise<T | null> => {
            const response = await fetch(`${await getOrigin()}${route}`, {
                method,
                headers,
                ...options.fetchOptions,
                body: data ? JSON.stringify(data) : undefined,
                redirect: 'manual' // Handle redirects manually
            });

            // Handle rate limiting response (429)
            if (response.status === 429) {
                console.warn(`Rate limited on attempt ${attemptNumber} for route: ${route}`);

                // Extract rate limiting information from response headers
                const retryAfter = response.headers.get('Retry-After');
                const newRateLimitToken = response.headers.get('X-Device-Rate-Token');
                const remainingRequests = {
                    second: response.headers.get('X-RateLimit-Second-Remaining'),
                    minute: response.headers.get('X-RateLimit-Minute-Remaining'),
                    tenMinute: response.headers.get('X-RateLimit-TenMinute-Remaining')
                };

                // Update rate limit token if provided
                if (newRateLimitToken) {
                    await setCookie('refresh-token', newRateLimitToken);
                    headers['x-device-rate-token'] = newRateLimitToken; // Update for next attempt
                }

                // Log rate limiting details
                // console.log('Rate Limit Info:', {
                //     retryAfter,
                //     remainingRequests,
                //     route
                // });

                const rateLimitError = await response.json();
                console.log(rateLimitError)
                // Retry with exponential backoff if attempts remaining
                // if (attemptNumber < maxRetries) {
                //     const delay = retryAfter ? parseInt(retryAfter) * 1000 : retryDelay * attemptNumber;
                //     // console.log(`Retrying in ${delay}ms (attempt ${attemptNumber + 1}/${maxRetries})`);

                //     await new Promise(resolve => setTimeout(resolve, delay));
                //     return attemptRequest(attemptNumber + 1);
                // } else {
                //     // Max retries exceeded, return rate limit error
                //     console.error('Max retries exceeded for rate limited request:', rateLimitError);
                //     throw new Error(`Rate limit exceeded: ${rateLimitError.message}`);
                //     // return 
                // }
                throw new Error(`Rate limit exceeded: ${rateLimitError.message}`);
            }

            // Update rate limiting token from successful responses
            const newRateLimitToken = response.headers.get('X-Device-Rate-Token');
            if (newRateLimitToken) {
                await setCookie('refresh-token', newRateLimitToken);
            }
            // console.log(response)
            // Handle redirects manually
            if (response.status >= 300 && response.status < 400) {
                const redirectUrl = response.headers.get('Location');
                return redirectUrl as T;
            }

            // Handle successful responses
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();

                // Log successful request with rate limit info for monitoring
                const remainingRequests = response.headers.get('X-RateLimit-Minute-Remaining');
                if (remainingRequests) {
                    // console.log(`Request successful. Remaining requests this minute: ${remainingRequests}`);
                }

                return { result, success: true } as T;
            } else {
                // Handle non-JSON responses
                const text = await response.text();
                console.error('Expected JSON response but received:', text);
                throw new Error(`Expected JSON response, but got: ${text}`);
            }
        };

        // Start the request with attempt number 1
        return await attemptRequest(1);

    } catch (error) {
        console.error(`DataFetch error for ${method} ${route}:`, (error as Error).message);

        // Return null for consistent error handling
        // Calling functions can check for null response
        return { result: { message: (error as Error).message }, success: false } as T;
    }
}


export const POST = async (data: Data, route: string, method?: "PATCH",) => {
    // const Toast = toast.loading('Please wait')
    try {
        const session = await currentSession() as Session;
        const isLoginRequired = data?.isLoginRequired;
        // console.log(data.isLoginRequired)

        if (!session && isLoginRequired) return
        // if (!session && isLoginRequired) return toast.update(Toast, update('Please Login!', 'error'))

        // Fetch user info only if login required and session available
        let user: User | null = null;
        if (isLoginRequired && session) {
            user = await userInfo(session?.user?.username) as User;
            if (!['comment', 'form'].includes(route)) {
                // if (['user'].includes(user.role)) return toast.update(Toast, update('Your are not Authorized!', 'error'))
                if (['user'].includes(user?.role)) return
            }
        }

        if (data.file) {
            const file = data.file as File;
            const base64File = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file); // Convert to Base64
            });
            data.file = { name: file.name, type: file.type, content: base64File };
        }


        // setIsDisabled && setIsDisabled(true)

        // Prepare body conditionally
        const bodyData = {
            ...data,
            ...(user ? { authorId: user._id } : {})  // only add authorId if user exists
        };

        const { result, success } = await dataFetch<{ result: Data, success: Boolean }>(`/api/${route}`, method || 'POST', undefined, bodyData) as { result: Data, success: Boolean };
        // console.log(result)

        // if (success) {
        //     // setIsDisabled && setIsDisabled(false)
        //     // toast.update(Toast, update(result.message, result.status))
        //     return result

        // }
        if (!success) {
            throw new Error((result as Data).message);

        }
        // if (response.) {
        // }

        // setIsDisabled && setIsDisabled(false)
        // return toast.update(Toast, update(result.message ?? result.error, result.status))
        return result
    } catch (error) {
        // setIsDisabled && setIsDisabled(false)
        console.log('error', (error as Error).message)
        // return toast.update(Toast, update('Something went wrong!', 'error'))
        return { message: (error as Error).message }
    }
}