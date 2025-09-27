'use server'
import { CryptoService } from "@/lib/encryption.service";

// Enhanced multi-window rate limit configuration with burst handling
const RATE_LIMITS = {
  SECOND: { windowMs: 1000, maxRequests: 20, burstAllowance: 3 },
  MINUTE: { windowMs: 60 * 1000, maxRequests: 100, burstAllowance: 25 },
  TEN_MINUTE: { windowMs: 10 * 60 * 1000, maxRequests: 500, burstAllowance: 50 }
};

// Advanced security configurations
const SECURITY_CONFIG = {
  MAX_TOKEN_CHAIN_LENGTH: 10000,
  TOKEN_LIFETIME_MS: 15 * 60 * 1000, // 15 minutes
  MAX_CONSECUTIVE_VIOLATIONS: 5,
  EXPONENTIAL_BACKOFF_BASE: 2,
  MAX_BACKOFF_MS: 5 * 60 * 1000, // 5 minutes
  SUSPICIOUS_ACTIVITY_THRESHOLD: 10,
  TOKEN_ENTROPY_MINIMUM: 128, // bits
  MAX_CLOCK_SKEW_MS: 30 * 1000, // 30 seconds
};

// Circuit breaker states
const CircuitBreakerState = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN', 
  HALF_OPEN: 'HALF_OPEN'
} as const;

type CircuitBreakerStateType = typeof CircuitBreakerState[keyof typeof CircuitBreakerState];

interface RateLimitViolation {
  timestamp: number;
  violationType: 'second' | 'minute' | 'tenMinute';
  consecutiveCount: number;
  suspiciousScore: number;
}

interface WindowState {
  count: number;
  windowStart: number;
  violations: number;
}

interface DeviceRateLimitPayload {
  deviceFingerprint: string;
  windows: {
    second: WindowState;
    minute: WindowState;
    tenMinute: WindowState;
  };
  timestamp: number;
  tokenId: string;
  previousToken?: string;
  sequenceNumber: number;
  entropy: string;
  deviceMetrics?: {
    userAgent?: string;
    screenResolution?: string;
    timezone?: string;
    language?: string;
  };
  securityFlags: {
    suspiciousActivity: boolean;
    consecutiveViolations: number;
    lastViolationType?: string;
    circuitBreakerState: CircuitBreakerStateType;
    adaptiveLimitMultiplier: number;
  };
}

// 🔥 NEW: Dynamic cleanup scheduling interface
interface ScheduledCleanup {
  deviceFingerprint: string;
  violationTimestamp: number;
  cleanupTime: number;
  violationCount: number;
}

// Enhanced monitoring and storage
const usedTokens = new Map<string, { 
  timestamp: number; 
  deviceFingerprint: string; 
  violationCount: number;
  suspiciousScore: number;
}>();

const deviceViolationHistory = new Map<string, RateLimitViolation[]>();
const circuitBreakers = new Map<string, {
  state: CircuitBreakerStateType;
  failures: number;
  lastFailure: number;
  nextAttempt: number;
}>();

// 🚀 DYNAMIC CLEANUP SYSTEM
const scheduledCleanups: ScheduledCleanup[] = [];
let cleanupTimeoutId: NodeJS.Timeout | null = null;
let adaptiveCleanupInterval = 10000; // Start with 10 seconds
let adaptiveTimeoutId: NodeJS.Timeout | null = null;

// Performance monitoring
interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  errorRate: number;
}

let systemMetrics: SystemMetrics = {
  cpuUsage: 0,
  memoryUsage: 0,
  responseTime: 0,
  errorRate: 0
};

// Helper functions
function generateSecureTokenId(): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `token_${timestamp}_${randomPart}`;
}

function generateTokenHash(tokenId: string, deviceFingerprint: string, timestamp: number): string {
  return `${tokenId}:${deviceFingerprint}:${timestamp}`.slice(0, 32);
}

function isTokenUsed(tokenHash: string): boolean {
  cleanupExpiredTokens();
  return usedTokens.has(tokenHash);
}

function markTokenAsUsed(tokenHash: string, deviceFingerprint: string, timestamp: number): void {
  cleanupExpiredTokens();
  usedTokens.set(tokenHash, { 
    timestamp, 
    deviceFingerprint, 
    violationCount: 0, 
    suspiciousScore: 0 
  });
}

// 🚀 DYNAMIC CLEANUP: Schedule individual violation cleanup
function scheduleViolationCleanup(
  deviceFingerprint: string, 
  violationTimestamp: number, 
  violationCount: number
): void {
  
  // Calculate when this specific violation should be cleaned
  const backoffDelay = Math.min(
    Math.pow(SECURITY_CONFIG.EXPONENTIAL_BACKOFF_BASE, violationCount) * 1000,
    SECURITY_CONFIG.MAX_BACKOFF_MS
  );
  
  const cleanupTime = violationTimestamp + backoffDelay;
  
  const scheduledCleanup: ScheduledCleanup = {
    deviceFingerprint,
    violationTimestamp,
    cleanupTime,
    violationCount
  };
  
  // Insert in sorted order (earliest cleanup first)
  const insertIndex = scheduledCleanups.findIndex(sc => sc.cleanupTime > cleanupTime);
  if (insertIndex === -1) {
    scheduledCleanups.push(scheduledCleanup);
  } else {
    scheduledCleanups.splice(insertIndex, 0, scheduledCleanup);
  }
  
  console.log(`⏰ Scheduled cleanup for device in ${Math.ceil(backoffDelay/1000)} seconds`);
  
  // Reschedule the cleanup timer with the earliest time
  rescheduleCleanupTimer();
}

// 🚀 DYNAMIC TIMER: Adjusts to next cleanup
function rescheduleCleanupTimer(): void {
  // Clear existing timer
  if (cleanupTimeoutId) {
    clearTimeout(cleanupTimeoutId);
    cleanupTimeoutId = null;
  }
  
  // Find next cleanup time
  const now = Date.now();
  const nextCleanup = scheduledCleanups.find(sc => sc.cleanupTime > now);
  
  if (nextCleanup) {
    const delay = Math.max(100, nextCleanup.cleanupTime - now); // Minimum 100ms
    
    cleanupTimeoutId = setTimeout(() => {
      processDueCleanups();
    }, delay);
    
    console.log(`🔄 Next cleanup scheduled in ${Math.ceil(delay/1000)} seconds`);
  }
}

// 🚀 PROCESS DUE CLEANUPS: Handle all expired violations
function processDueCleanups(): void {
  const now = Date.now();
  const dueCleanups: ScheduledCleanup[] = [];
  
  // Find all cleanups that are due
  while (scheduledCleanups.length > 0 && scheduledCleanups[0].cleanupTime <= now) {
    dueCleanups.push(scheduledCleanups.shift()!);
  }
  
  // Process each due cleanup
  for (const cleanup of dueCleanups) {
    cleanupSpecificViolation(cleanup.deviceFingerprint, cleanup.violationTimestamp);
  }
  
  if (dueCleanups.length > 0) {
    console.log(`🧹 Dynamic cleanup: Processed ${dueCleanups.length} violation cleanups`);
  }
  
  // Schedule next cleanup if any remaining
  rescheduleCleanupTimer();
}

// 🚀 CLEAN SPECIFIC VIOLATION: Remove individual violation
function cleanupSpecificViolation(deviceFingerprint: string, violationTimestamp: number): void {
  const violations = deviceViolationHistory.get(deviceFingerprint) || [];
  const filteredViolations = violations.filter(v => v.timestamp !== violationTimestamp);
  
  if (filteredViolations.length !== violations.length) {
    if (filteredViolations.length === 0) {
      deviceViolationHistory.delete(deviceFingerprint);
      console.log(`✨ All violations cleared for device ${deviceFingerprint}`);
    } else {
      deviceViolationHistory.set(deviceFingerprint, filteredViolations);
      console.log(`✨ Specific violation cleaned for device ${deviceFingerprint}`);
    }
  }
}

// 🚀 ADAPTIVE INTERVAL: Smart cleanup that adapts to shortest backoff
function updateAdaptiveCleanupInterval(): void {
  const now = Date.now();
  let shortestBackoff = 60000; // Default 1 minute
  
  // Find shortest backoff time among all violations
  for (const [device, violations] of deviceViolationHistory) {
    for (const violation of violations) {
      const backoffDelay = Math.min(
        Math.pow(SECURITY_CONFIG.EXPONENTIAL_BACKOFF_BASE, violation.consecutiveCount) * 1000,
        SECURITY_CONFIG.MAX_BACKOFF_MS
      );
      const remainingTime = (violation.timestamp + backoffDelay) - now;
      
      if (remainingTime > 0 && remainingTime < shortestBackoff) {
        shortestBackoff = remainingTime;
      }
    }
  }
  
  // Adaptive interval: 25% of shortest backoff, min 1 second, max 30 seconds
  const newInterval = Math.max(1000, Math.min(30000, Math.floor(shortestBackoff * 0.25)));
  
  if (newInterval !== adaptiveCleanupInterval) {
    adaptiveCleanupInterval = newInterval;
    console.log(`🎯 Adaptive cleanup interval updated to ${adaptiveCleanupInterval/1000} seconds`);
    
    // Restart with new interval
    if (adaptiveTimeoutId) {
      clearTimeout(adaptiveTimeoutId);
    }
    startAdaptiveCleanup();
  }
}

function startAdaptiveCleanup(): void {
  adaptiveTimeoutId = setTimeout(() => {
    cleanupExpiredTokens();
    
    // Auto-recovery for circuit breakers
    const now = Date.now();
    for (const [device, breaker] of circuitBreakers) {
      if (breaker.state === CircuitBreakerState.OPEN && 
          now - breaker.lastFailure > SECURITY_CONFIG.MAX_BACKOFF_MS * 2) {
        breaker.state = CircuitBreakerState.CLOSED;
        breaker.failures = 0;
        circuitBreakers.set(device, breaker);
        console.log(`🔄 Auto-recovery: Circuit breaker closed for ${device}`);
      }
    }
    
    // Update interval for next cleanup
    updateAdaptiveCleanupInterval();
  }, adaptiveCleanupInterval);
}

// Real-time violation management
function isViolationExpired(violation: RateLimitViolation, currentTime: number): boolean {
  const violationBackoffTime = Math.min(
    Math.pow(SECURITY_CONFIG.EXPONENTIAL_BACKOFF_BASE, violation.consecutiveCount) * 1000,
    SECURITY_CONFIG.MAX_BACKOFF_MS
  );
  const violationExpiry = violation.timestamp + violationBackoffTime;
  return currentTime > violationExpiry;
}

function cleanupExpiredViolations(deviceFingerprint: string, currentTime: number): void {
  const violations = deviceViolationHistory.get(deviceFingerprint) || [];
  const activeViolations = violations.filter(v => !isViolationExpired(v, currentTime));
  
  if (activeViolations.length !== violations.length) {
    if (activeViolations.length === 0) {
      deviceViolationHistory.delete(deviceFingerprint);
      console.log(`🧹 Real-time cleanup: All violations cleared for device`);
    } else {
      deviceViolationHistory.set(deviceFingerprint, activeViolations);
      console.log(`🧹 Real-time cleanup: ${violations.length - activeViolations.length} violations cleared`);
    }
  }
}

function cleanupExpiredTokens(): void {
  const now = Date.now();
  const expiredTime = now - SECURITY_CONFIG.TOKEN_LIFETIME_MS;
  
  let cleanedCount = 0;
  let cleanedContexts = 0;
  
  for (const [tokenHash, data] of usedTokens) {
    if (data.timestamp < expiredTime) {
      usedTokens.delete(tokenHash);
      cleanedCount++;
    }
  }
  
  // Clean violation history
  for (const [device, violations] of deviceViolationHistory) {
    const filteredViolations = violations.filter(v => v.timestamp > expiredTime);
    if (filteredViolations.length === 0) {
      deviceViolationHistory.delete(device);
      cleanedContexts++;
    } else {
      deviceViolationHistory.set(device, filteredViolations);
    }
  }
  
  if (cleanedCount > 0 || cleanedContexts > 0) {
    console.log(`🧹 Cleanup completed: ${cleanedCount} tokens, ${cleanedContexts} contexts`);
  }
}

function calculateBackoffDelay(violationCount: number): number {
  const delay = Math.min(
    Math.pow(SECURITY_CONFIG.EXPONENTIAL_BACKOFF_BASE, violationCount) * 1000,
    SECURITY_CONFIG.MAX_BACKOFF_MS
  );
  
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 0.1 * delay;
  return Math.floor(delay + jitter);
}

// Enhanced suspicious activity detection with real-time cleanup
function detectSuspiciousActivity(
  payload: DeviceRateLimitPayload, 
  currentTime: number
): { isSuspicious: boolean; score: number; reasons: string[] } {
  
  const reasons: string[] = [];
  let suspiciousScore = 0;
  
  // 🚀 CRITICAL: Clean expired violations BEFORE checking
  cleanupExpiredViolations(payload.deviceFingerprint, currentTime);
  
  // Check for rapid consecutive violations (now with cleaned data)
  const violations = deviceViolationHistory.get(payload.deviceFingerprint) || [];
  const recentViolations = violations.filter(v => currentTime - v.timestamp < 60000);
  
  if (recentViolations.length > 3) {
    suspiciousScore += 30;
    reasons.push('Rapid consecutive violations');
  }
  
  // Check for token chain anomalies
  if (payload.sequenceNumber > SECURITY_CONFIG.MAX_TOKEN_CHAIN_LENGTH) {
    suspiciousScore += 50;
    reasons.push('Excessive token chain length');
  }
  
  // Check for clock skew attacks
  const timeDiff = Math.abs(currentTime - payload.timestamp);
  if (timeDiff > SECURITY_CONFIG.MAX_CLOCK_SKEW_MS) {
    suspiciousScore += 40;
    reasons.push('Clock skew detected');
  }
  
  // Check for pattern-based attacks
  const windowCounts = [
    payload.windows.second.count,
    payload.windows.minute.count,
    payload.windows.tenMinute.count
  ];
  
  if (windowCounts.every(count => count === windowCounts[0]) && windowCounts[0] > 10) {
    suspiciousScore += 25;
    reasons.push('Suspicious uniform request pattern');
  }
  
  return {
    isSuspicious: suspiciousScore >= SECURITY_CONFIG.SUSPICIOUS_ACTIVITY_THRESHOLD,
    score: suspiciousScore,
    reasons
  };
}

function getCircuitBreakerState(deviceFingerprint: string): CircuitBreakerStateType {
  const breaker = circuitBreakers.get(deviceFingerprint);
  const now = Date.now();
  
  if (!breaker) {
    circuitBreakers.set(deviceFingerprint, {
      state: CircuitBreakerState.CLOSED,
      failures: 0,
      lastFailure: 0,
      nextAttempt: 0
    });
    return CircuitBreakerState.CLOSED;
  }
  
  // Check if we should move from OPEN to HALF_OPEN
  if (breaker.state === CircuitBreakerState.OPEN && now >= breaker.nextAttempt) {
    breaker.state = CircuitBreakerState.HALF_OPEN;
    circuitBreakers.set(deviceFingerprint, breaker);
  }
  
  return breaker.state;
}

function updateCircuitBreaker(deviceFingerprint: string, success: boolean): void {
  const breaker = circuitBreakers.get(deviceFingerprint);
  if (!breaker) return;
  
  const now = Date.now();
  
  if (success) {
    if (breaker.state === CircuitBreakerState.HALF_OPEN) {
      breaker.state = CircuitBreakerState.CLOSED;
      breaker.failures = 0;
    }
  } else {
    breaker.failures++;
    breaker.lastFailure = now;
    
    if (breaker.failures >= SECURITY_CONFIG.MAX_CONSECUTIVE_VIOLATIONS) {
      breaker.state = CircuitBreakerState.OPEN;
      breaker.nextAttempt = now + calculateBackoffDelay(breaker.failures);
    }
  }
  
  circuitBreakers.set(deviceFingerprint, breaker);
}

function getAdaptiveLimitMultiplier(): number {
  const { cpuUsage, memoryUsage, responseTime, errorRate } = systemMetrics;
  
  let multiplier = 1.0;
  
  if (cpuUsage > 80) multiplier *= 0.5;
  else if (cpuUsage > 60) multiplier *= 0.7;
  
  if (memoryUsage > 85) multiplier *= 0.6;
  else if (memoryUsage > 70) multiplier *= 0.8;
  
  if (responseTime > 1000) multiplier *= 0.4;
  else if (responseTime > 500) multiplier *= 0.7;
  
  if (errorRate > 5) multiplier *= 0.3;
  else if (errorRate > 2) multiplier *= 0.6;
  
  return Math.max(0.1, multiplier);
}

function updateWindowStateEnhanced(
  existingWindow: WindowState,
  windowMs: number,
  currentTime: number
): WindowState & { isExpired: boolean } {
  
  const timeSinceWindowStart = currentTime - existingWindow.windowStart;
  
  if (timeSinceWindowStart >= windowMs) {
    return {
      count: 0,
      windowStart: currentTime,
      violations: 0,
      isExpired: true
    };
  }
  
  return {
    count: existingWindow.count,
    windowStart: existingWindow.windowStart,
    violations: existingWindow.violations,
    isExpired: false
  };
}

// Main exported functions
export async function encryptDeviceData(payload: DeviceRateLimitPayload): Promise<string> {
  try {
    if (payload.entropy.length < SECURITY_CONFIG.TOKEN_ENTROPY_MINIMUM / 8) {
      throw new Error('Insufficient entropy in token');
    }
    
    const jsonPayload = JSON.stringify(payload);
    return await CryptoService.encryptData(jsonPayload);
    
  } catch (error) {
    console.error('🔐 Encryption failed:', error);
    throw new Error(`Device data encryption failed: ${(error as Error).message}`);
  }
}

export async function decryptDeviceData(encryptedData: string): Promise<DeviceRateLimitPayload | null> {
  try {
    const decryptedPayload = await CryptoService.decryptData(encryptedData);
    const payload = JSON.parse(decryptedPayload) as DeviceRateLimitPayload;
    
    if (!payload.entropy || payload.entropy.length < SECURITY_CONFIG.TOKEN_ENTROPY_MINIMUM / 8) {
      console.log('🚨 Token entropy validation failed');
      return null;
    }
    
    const now = Date.now();
    if (now - payload.timestamp > SECURITY_CONFIG.TOKEN_LIFETIME_MS) {
      console.log('🚨 Token expired');
      return null;
    }
    
    const tokenHash = generateTokenHash(payload.tokenId, payload.deviceFingerprint, payload.timestamp);
    
    if (isTokenUsed(tokenHash)) {
      const violations = deviceViolationHistory.get(payload.deviceFingerprint) || [];
      violations.push({
        timestamp: now,
        violationType: 'second',
        consecutiveCount: violations.length + 1,
        suspiciousScore: 100
      });
      deviceViolationHistory.set(payload.deviceFingerprint, violations);
      
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('🔐 Decryption failed:', error);
    return null;
  }
}

export async function createInitialDeviceToken(
  deviceFingerprint: string,
  deviceMetrics?: any
): Promise<string> {
  const now = Date.now();
  const tokenId = generateSecureTokenId();
  const entropy = Array.from(
    { length: SECURITY_CONFIG.TOKEN_ENTROPY_MINIMUM / 8 }, 
    () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');
  
  const initialPayload: DeviceRateLimitPayload = {
    deviceFingerprint,
    windows: {
      second: { count: 1, windowStart: now, violations: 0 },
      minute: { count: 1, windowStart: now, violations: 0 },
      tenMinute: { count: 1, windowStart: now, violations: 0 }
    },
    timestamp: now,
    tokenId,
    sequenceNumber: 1,
    entropy,
    deviceMetrics,
    securityFlags: {
      suspiciousActivity: false,
      consecutiveViolations: 0,
      circuitBreakerState: CircuitBreakerState.CLOSED,
      adaptiveLimitMultiplier: 1.0
    }
  };
  
  return await encryptDeviceData(initialPayload);
}

// 🚀 ENHANCED: Real-time validation with dynamic cleanup
export async function validateDeviceRateLimit(
  encryptedToken: string,
  deviceFingerprint: string,
  requestMetrics?: SystemMetrics
): Promise<{
  isAllowed: boolean;
  newToken: string;
  limitedBy?: 'second' | 'minute' | 'tenMinute' | 'circuit_breaker' | 'suspicious_activity';
  requestsRemaining: { second: number; minute: number; tenMinute: number };
  resetTimes: { second: number; minute: number; tenMinute: number };
  backoffDelay?: number;
  securityFlags: {
    suspiciousActivity: boolean;
    circuitBreakerState: CircuitBreakerStateType;
    adaptiveLimit: boolean;
  };
  errorDetails?: {
    code: string;
    message: string;
    retryAfter: number;
  };
}> {
  
  const now = Date.now();
  
  // 🔥 CRITICAL: Real-time cleanup before validation
  cleanupExpiredViolations(deviceFingerprint, now);
  
  if (requestMetrics) {
    systemMetrics = requestMetrics;
  }
  
  // Check circuit breaker first
  const circuitState = getCircuitBreakerState(deviceFingerprint);
  if (circuitState === CircuitBreakerState.OPEN) {
    const breaker = circuitBreakers.get(deviceFingerprint)!;
    const backoffDelay = Math.max(0, breaker.nextAttempt - now);
    
    return {
      isAllowed: false,
      newToken: encryptedToken,
      limitedBy: 'circuit_breaker',
      requestsRemaining: { second: 0, minute: 0, tenMinute: 0 },
      resetTimes: { second: now, minute: now, tenMinute: now },
      backoffDelay,
      securityFlags: {
        suspiciousActivity: false,
        circuitBreakerState: circuitState,
        adaptiveLimit: false
      },
      errorDetails: {
        code: 'CIRCUIT_BREAKER_OPEN',
        message: 'Too many consecutive failures. Please wait before retrying.',
        retryAfter: Math.ceil(backoffDelay / 1000)
      }
    };
  }
  
  const payload = await decryptDeviceData(encryptedToken);
  
  // Handle invalid/compromised tokens
  if (!payload || payload.deviceFingerprint !== deviceFingerprint) {
    updateCircuitBreaker(deviceFingerprint, false);
    
    const adaptiveMultiplier = getAdaptiveLimitMultiplier();
    const tokenId = generateSecureTokenId();
    const entropy = Array.from(
      { length: SECURITY_CONFIG.TOKEN_ENTROPY_MINIMUM / 8 }, 
      () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join('');
    
    const newPayload: DeviceRateLimitPayload = {
      deviceFingerprint,
      windows: {
        second: { count: 1, windowStart: now, violations: 0 },
        minute: { count: 1, windowStart: now, violations: 0 },
        tenMinute: { count: 1, windowStart: now, violations: 0 }
      },
      timestamp: now,
      tokenId,
      sequenceNumber: 1,
      entropy,
      securityFlags: {
        suspiciousActivity: false,
        consecutiveViolations: 0,
        circuitBreakerState: circuitState,
        adaptiveLimitMultiplier: adaptiveMultiplier
      }
    };
    
    return {
      isAllowed: true,
      newToken: await encryptDeviceData(newPayload),
      requestsRemaining: {
        second: Math.floor((RATE_LIMITS.SECOND.maxRequests - 1) * adaptiveMultiplier),
        minute: Math.floor((RATE_LIMITS.MINUTE.maxRequests - 1) * adaptiveMultiplier),
        tenMinute: Math.floor((RATE_LIMITS.TEN_MINUTE.maxRequests - 1) * adaptiveMultiplier)
      },
      resetTimes: {
        second: now + RATE_LIMITS.SECOND.windowMs,
        minute: now + RATE_LIMITS.MINUTE.windowMs,
        tenMinute: now + RATE_LIMITS.TEN_MINUTE.windowMs
      },
      securityFlags: {
        suspiciousActivity: false,
        circuitBreakerState: circuitState,
        adaptiveLimit: adaptiveMultiplier !== 1.0
      }
    };
  }
  
  // Enhanced suspicious activity detection (now with real-time cleanup)
  const suspiciousAnalysis = detectSuspiciousActivity(payload, now);
  
  if (suspiciousAnalysis.isSuspicious) {
    console.log('🚨 SUSPICIOUS ACTIVITY DETECTED:', suspiciousAnalysis.reasons);
    
    updateCircuitBreaker(deviceFingerprint, false);
    
    const backoffDelay = calculateBackoffDelay(payload.securityFlags.consecutiveViolations + 1);
    console.log('backoffDelay: ', backoffDelay);
    
    return {
      isAllowed: false,
      newToken: encryptedToken,
      limitedBy: 'suspicious_activity',
      requestsRemaining: { second: 0, minute: 0, tenMinute: 0 },
      resetTimes: { 
        second: now + backoffDelay,
        minute: now + backoffDelay,
        tenMinute: now + backoffDelay
      },
      backoffDelay,
      securityFlags: {
        suspiciousActivity: true,
        circuitBreakerState: circuitState,
        adaptiveLimit: false
      },
      errorDetails: {
        code: 'SUSPICIOUS_ACTIVITY',
        message: 'Suspicious activity detected. Request blocked for security.',
        retryAfter: Math.ceil(backoffDelay / 1000)
      }
    };
  }
  
  // Mark current token as used
  const currentTokenHash = generateTokenHash(payload.tokenId, payload.deviceFingerprint, payload.timestamp);
  markTokenAsUsed(currentTokenHash, deviceFingerprint, payload.timestamp);
  
  // Get adaptive limits
  const adaptiveMultiplier = getAdaptiveLimitMultiplier();
  const adaptedLimits = {
    second: Math.floor(RATE_LIMITS.SECOND.maxRequests * adaptiveMultiplier),
    minute: Math.floor(RATE_LIMITS.MINUTE.maxRequests * adaptiveMultiplier),
    tenMinute: Math.floor(RATE_LIMITS.TEN_MINUTE.maxRequests * adaptiveMultiplier)
  };
  
  // Enhanced window state updates
  const updatedSecondWindow = updateWindowStateEnhanced(payload.windows.second, RATE_LIMITS.SECOND.windowMs, now);
  const updatedMinuteWindow = updateWindowStateEnhanced(payload.windows.minute, RATE_LIMITS.MINUTE.windowMs, now);
  const updatedTenMinuteWindow = updateWindowStateEnhanced(payload.windows.tenMinute, RATE_LIMITS.TEN_MINUTE.windowMs, now);
  
  // Check limits with burst allowance
  const secondCountAfterIncrement = updatedSecondWindow.count + 1;
  const minuteCountAfterIncrement = updatedMinuteWindow.count + 1;
  const tenMinuteCountAfterIncrement = updatedTenMinuteWindow.count + 1;
  
  let isAllowed = true;
  let limitedBy: 'second' | 'minute' | 'tenMinute' | undefined;
  let backoffDelay = 0;
  
  // Enhanced limit checking with burst allowance
  if (secondCountAfterIncrement > adaptedLimits.second + RATE_LIMITS.SECOND.burstAllowance) {
    isAllowed = false;
    limitedBy = 'second';
  } else if (minuteCountAfterIncrement > adaptedLimits.minute + RATE_LIMITS.MINUTE.burstAllowance) {
    isAllowed = false;
    limitedBy = 'minute';
  } else if (tenMinuteCountAfterIncrement > adaptedLimits.tenMinute + RATE_LIMITS.TEN_MINUTE.burstAllowance) {
    isAllowed = false;
    limitedBy = 'tenMinute';
  }
  
  // Handle rate limit violations
  if (!isAllowed) {
    const violations = payload.securityFlags.consecutiveViolations + 1;
    backoffDelay = calculateBackoffDelay(violations);
    
    // Record violation and schedule its cleanup
    const deviceViolations = deviceViolationHistory.get(deviceFingerprint) || [];
    const newViolation: RateLimitViolation = {
      timestamp: now,
      violationType: limitedBy!,
      consecutiveCount: violations,
      suspiciousScore: suspiciousAnalysis.score
    };
    deviceViolations.push(newViolation);
    deviceViolationHistory.set(deviceFingerprint, deviceViolations);
    
    // 🚀 SCHEDULE DYNAMIC CLEANUP for this specific violation
    scheduleViolationCleanup(deviceFingerprint, now, violations);
    
    updateCircuitBreaker(deviceFingerprint, false);
  } else {
    updateCircuitBreaker(deviceFingerprint, true);
  }
  
  // Create new token
  const newTokenId = generateSecureTokenId();
  const previousTokenHash = generateTokenHash(payload.tokenId, payload.deviceFingerprint, payload.timestamp);
  const newEntropy = Array.from(
    { length: SECURITY_CONFIG.TOKEN_ENTROPY_MINIMUM / 8 }, 
    () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');
  
  const finalWindows = {
    second: { 
      count: isAllowed ? secondCountAfterIncrement : updatedSecondWindow.count,
      windowStart: updatedSecondWindow.windowStart,
      violations: updatedSecondWindow.violations + (isAllowed ? 0 : 1)
    },
    minute: { 
      count: isAllowed ? minuteCountAfterIncrement : updatedMinuteWindow.count,
      windowStart: updatedMinuteWindow.windowStart,
      violations: updatedMinuteWindow.violations + (isAllowed ? 0 : 1)
    },
    tenMinute: { 
      count: isAllowed ? tenMinuteCountAfterIncrement : updatedTenMinuteWindow.count,
      windowStart: updatedTenMinuteWindow.windowStart,
      violations: updatedTenMinuteWindow.violations + (isAllowed ? 0 : 1)
    }
  };
  
  const newPayload: DeviceRateLimitPayload = {
    deviceFingerprint,
    windows: finalWindows,
    timestamp: now,
    tokenId: newTokenId,
    previousToken: previousTokenHash,
    sequenceNumber: payload.sequenceNumber + 1,
    entropy: newEntropy,
    deviceMetrics: payload.deviceMetrics,
    securityFlags: {
      suspiciousActivity: suspiciousAnalysis.isSuspicious,
      consecutiveViolations: isAllowed ? 0 : payload.securityFlags.consecutiveViolations + 1,
      lastViolationType: !isAllowed ? limitedBy : payload.securityFlags.lastViolationType,
      circuitBreakerState: getCircuitBreakerState(deviceFingerprint),
      adaptiveLimitMultiplier: adaptiveMultiplier
    }
  };
  
  const resetTimes = {
    second: finalWindows.second.windowStart + RATE_LIMITS.SECOND.windowMs + (isAllowed ? 0 : backoffDelay),
    minute: finalWindows.minute.windowStart + RATE_LIMITS.MINUTE.windowMs + (isAllowed ? 0 : backoffDelay),
    tenMinute: finalWindows.tenMinute.windowStart + RATE_LIMITS.TEN_MINUTE.windowMs + (isAllowed ? 0 : backoffDelay)
  };
  
  const requestsRemaining = {
    second: Math.max(0, adaptedLimits.second - finalWindows.second.count),
    minute: Math.max(0, adaptedLimits.minute - finalWindows.minute.count),
    tenMinute: Math.max(0, adaptedLimits.tenMinute - finalWindows.tenMinute.count)
  };
  
  const result: any = {
    isAllowed,
    newToken: await encryptDeviceData(newPayload),
    limitedBy,
    requestsRemaining,
    resetTimes,
    backoffDelay: !isAllowed ? backoffDelay : undefined,
    securityFlags: {
      suspiciousActivity: suspiciousAnalysis.isSuspicious,
      circuitBreakerState: getCircuitBreakerState(deviceFingerprint),
      adaptiveLimit: adaptiveMultiplier !== 1.0
    }
  };
  
  if (!isAllowed) {
    result.errorDetails = {
      code: `RATE_LIMIT_EXCEEDED_${limitedBy?.toUpperCase()}`,
      message: `Rate limit exceeded for ${limitedBy} window. Exponential backoff applied.`,
      retryAfter: Math.ceil(backoffDelay / 1000)
    };
  }
  
  return result;
}

export async function emergencyOverride(
  deviceFingerprint: string,
  action: 'block' | 'unblock' | 'reset'
): Promise<boolean> {
  try {
    switch (action) {
      case 'block':
        circuitBreakers.set(deviceFingerprint, {
          state: CircuitBreakerState.OPEN,
          failures: SECURITY_CONFIG.MAX_CONSECUTIVE_VIOLATIONS,
          lastFailure: Date.now(),
          nextAttempt: Date.now() + SECURITY_CONFIG.MAX_BACKOFF_MS
        });
        break;
        
      case 'unblock':
        circuitBreakers.set(deviceFingerprint, {
          state: CircuitBreakerState.CLOSED,
          failures: 0,
          lastFailure: 0,
          nextAttempt: 0
        });
        deviceViolationHistory.delete(deviceFingerprint);
        break;
        
      case 'reset':
        circuitBreakers.delete(deviceFingerprint);
        deviceViolationHistory.delete(deviceFingerprint);
        for (const [hash, data] of usedTokens) {
          if (data.deviceFingerprint === deviceFingerprint) {
            usedTokens.delete(hash);
          }
        }
        break;
    }
    
    console.log(`🚨 Emergency override ${action} applied for device:`, deviceFingerprint);
    return true;
  } catch (error) {
    console.error('Emergency override failed:', error);
    return false;
  }
}

// 🚀 INITIALIZE DYNAMIC CLEANUP SYSTEM
function initializeDynamicCleanup(): void {
  console.log('🚀 Initializing dynamic cleanup system');
  
  // Start adaptive cleanup
  startAdaptiveCleanup();
  
  // Also keep a safety net global cleanup every 2 minutes
  setInterval(() => {
    cleanupExpiredTokens();
    console.log('🛡️ Safety net cleanup executed');
  }, 2 * 60 * 1000);
}

// Initialize the dynamic system
initializeDynamicCleanup();
