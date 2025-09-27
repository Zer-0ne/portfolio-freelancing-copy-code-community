import { getCookie, setCookie } from "./rate-limit-token.manager";

/**
 * STABLE DEVICE FINGERPRINT - CLIENT/SERVER COMPATIBLE
 * 
 * Handles both client-side (browser) and server-side (Node.js) environments
 * Uses feature detection to avoid ReferenceError on server
 */

interface StableFingerprint {
  // Hardware attributes (never change)
  screen: string;
  colorDepth: number;
  pixelDepth: number;
  cpu: number;
  platform: string;

  // Browser capabilities (stable)
  timezone: string;
  language: string;
  cookieEnabled: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  touchSupport: boolean;

  // Rendering fingerprints
  canvasStable: string;
  webglRenderer: string;
  webglVendor: string;
}

/**
 * Check if code is running in browser environment
 * Prevents server-side errors when accessing browser-only APIs
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Generate stable canvas fingerprint - client-side only
 * Returns fallback value if running on server
 */
function generateStableCanvasFingerprint(): string {
  // Server-side check - return consistent fallback
  if (!isBrowser()) {
    return 'server-side-canvas-fallback';
  }

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'canvas-unavailable';

    // Fixed dimensions and content - no randomization
    canvas.width = 200;
    canvas.height = 50;

    // Use basic, consistent drawing operations
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial'; // Web-safe font
    ctx.fillStyle = '#000000'; // Fixed colors
    ctx.fillRect(10, 10, 100, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('StableFingerprint2024', 15, 15);

    // Simple geometry - consistent rendering
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(150, 25, 15, 0, Math.PI * 2);
    ctx.stroke();

    return canvas.toDataURL();
  } catch (error) {
    return 'canvas-error';
  }
}

/**
 * Get stable WebGL info - client-side only
 * Returns fallback values if running on server
 */
function getStableWebGLInfo(): { renderer: string; vendor: string } {
  // Server-side check - return consistent fallback
  if (!isBrowser()) {
    return { 
      renderer: 'server-side-webgl-fallback', 
      vendor: 'server-side-vendor-fallback' 
    };
  }

  try {
    const canvas = document.createElement('canvas');
    const gl: any = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return { renderer: 'webgl-unavailable', vendor: 'webgl-unavailable' };

    const renderer = gl.getParameter(gl.RENDERER) || 'unknown-renderer';
    const vendor = gl.getParameter(gl.VENDOR) || 'unknown-vendor';

    return { renderer, vendor };
  } catch (error) {
    return { renderer: 'webgl-error', vendor: 'webgl-error' };
  }
}

/**
 * Get stable fingerprint data with environment detection
 * Works on both client-side and server-side
 */
async function getStableFingerprint(): Promise<StableFingerprint> {
  // Browser-specific APIs with fallbacks
  const isClientSide = isBrowser();
  const webglInfo = getStableWebGLInfo();
  
  // Navigator with fallbacks (some properties available server-side in certain environments)
  const nav = (isClientSide && typeof navigator !== 'undefined') ? navigator as any : null;

  return {
    // Screen properties - client-side only
    screen: isClientSide && typeof screen !== 'undefined' 
      ? `${screen.width}x${screen.height}` 
      : 'server-side-screen-fallback',
    
    colorDepth: isClientSide && typeof screen !== 'undefined' 
      ? (screen.colorDepth || 24) 
      : 24,
    
    pixelDepth: isClientSide && typeof screen !== 'undefined' 
      ? (screen.pixelDepth || 24) 
      : 24,

    // CPU info - available in both environments (limited server-side)
    cpu: nav?.hardwareConcurrency || 4,

    // Platform - may be available server-side
    platform: nav?.platform || process?.platform || 'unknown',

    // Timezone - available in both environments
    timezone: (() => {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      } catch {
        return 'UTC';
      }
    })(),

    // Language - available in both environments
    language: nav?.language || nav?.languages?.[0] || 'en-US',

    // Browser capabilities - client-side only
    cookieEnabled: nav?.cookieEnabled || false,
    
    localStorage: isClientSide 
      ? (typeof Storage !== 'undefined' && !!window.localStorage) 
      : false,
    
    sessionStorage: isClientSide 
      ? (typeof Storage !== 'undefined' && !!window.sessionStorage) 
      : false,
    
    touchSupport: isClientSide 
      ? (nav?.maxTouchPoints > 0 || 'ontouchstart' in window) 
      : false,

    // Rendering fingerprints
    canvasStable: generateStableCanvasFingerprint(),
    webglRenderer: webglInfo.renderer,
    webglVendor: webglInfo.vendor
  };
}

/**
 * Generate consistent SHA-256 hash
 * Works in both browser and Node.js environments
 */
async function generateStableHash(data: StableFingerprint): Promise<string> {
  // Sort keys for consistent ordering
  const sortedKeys = Object.keys(data).sort();
  const orderedData: Record<string, any> = {};

  // Create ordered object
  sortedKeys.forEach(key => {
    orderedData[key] = data[key as keyof StableFingerprint];
  });

  // Convert to deterministic JSON string
  const jsonString = JSON.stringify(orderedData, null, 0);

  try {
    // Try Web Crypto API first (browser and modern Node.js)
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(jsonString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback for environments without Web Crypto API
    // Simple hash function for fallback (not cryptographically secure)
    let hash = 0;
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
    
  } catch (error) {
    console.error('Hash generation error:', error);
    // Ultimate fallback
    return `fallback-${Date.now().toString(16)}`;
  }
}

/**
 * Main function - environment-aware fingerprint generation
 * Works on both client and server side
 */
export async function generateStableDeviceFingerprint(): Promise<string> {
  try {
    const fingerprintData = await getStableFingerprint();
    const stableHash = await generateStableHash(fingerprintData);

    // Store fingerprint (only on client-side or if cookies are available)
    try {
      // await setCookie('device-fingerprint', stableHash);
      // await setCookie('fingerprint-data', JSON.stringify(fingerprintData));
    } catch (cookieError) {
      console.warn('Could not store fingerprint in cookies:', cookieError);
      // Continue without storing - not critical
    }

    return stableHash;
  } catch (error) {
    console.error('Stable fingerprint error:', error);

    // Deterministic fallback that works everywhere
    const fallbackData = {
      platform: isBrowser() && navigator?.platform 
        ? navigator.platform 
        : (process?.platform || 'unknown'),
      screen: isBrowser() && typeof screen !== 'undefined'
        ? `${screen.width}x${screen.height}`
        : 'fallback-screen',
      language: isBrowser() && navigator?.language 
        ? navigator.language 
        : 'en-US',
      environment: isBrowser() ? 'client' : 'server',
      timestamp: Math.floor(Date.now() / (1000 * 60 * 60 * 24)) // Day-level for consistency
    };

    try {
      const fallbackString = JSON.stringify(fallbackData);
      
      // Simple fallback hash
      if (typeof crypto !== 'undefined' && crypto.subtle) {
        const encoder = new TextEncoder();
        const buffer = encoder.encode(fallbackString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } else {
        // Non-crypto fallback
        let hash = 0;
        for (let i = 0; i < fallbackString.length; i++) {
          hash = ((hash << 5) - hash) + fallbackString.charCodeAt(i);
          hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(8, '0') + '-fallback';
      }
    } catch (fallbackError) {
      // Ultimate fallback
      return `emergency-fallback-${Date.now()}`;
    }
  }
}

/**
 * Get existing fingerprint or generate new one
 * Environment-aware function
 */
export async function getStableDeviceFingerprint(): Promise<string> {
  // try {
  //   const stored = await getCookie('device-fingerprint');
  //   if (stored) {
  //     return stored;
  //   }
  // } catch (error) {
  //   console.warn('Could not access stored fingerprint:', error);
  // }

  return await generateStableDeviceFingerprint();
}

/**
 * CLIENT-SIDE ONLY: Initialize fingerprint
 * Call this from useEffect or client components only
 */
export async function initializeClientFingerprint(): Promise<string> {
  if (!isBrowser()) {
    console.warn('initializeClientFingerprint called on server-side');
    return 'server-side-init-error';
  }

  return await generateStableDeviceFingerprint();
}

/**
 * Check if running in browser environment
 */
export { isBrowser };
