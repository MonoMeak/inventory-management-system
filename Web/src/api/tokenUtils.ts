/**
 * Token Management Utilities
 * Helpers for storing and managing JWT tokens in localStorage
 */

/**
 * Store JWT token in localStorage
 */
export function storeToken(token: string): void {
  localStorage.setItem("token", token);
}

/**
 * Retrieve JWT token from localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem("token");
}

/**
 * Clear JWT token from localStorage
 */
export function clearToken(): void {
  localStorage.removeItem("token");
}

/**
 * Check if token exists and is valid
 */
export function hasValidToken(): boolean {
  const token = getToken();
  return !!token && token.length > 0;
}

/**
 * Decode JWT token (basic parsing - doesn't verify signature)
 * Only use for reading claims, not for validation
 */
export function decodeToken(token: string): {
  sub?: string;
  role?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
} | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (base64url decode)
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Get token expiration time in seconds
 */
export function getTokenExpiresIn(token: string): number | null {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp - currentTime;
}

/**
 * Store token from login response
 */
export function handleTokenResponse(response: { token?: string }): void {
  if (response.token) {
    storeToken(response.token);
  }
}

/**
 * Log token info for debugging
 */
export function logTokenInfo(): void {
  const token = getToken();
  if (!token) {
    console.log("No token stored");
    return;
  }

  const decoded = decodeToken(token);
  const expiresIn = getTokenExpiresIn(token);

  console.group("JWT Token Info");
  console.log("Token length:", token.length);
  console.log("Decoded payload:", decoded);
  console.log("Expires in (seconds):", expiresIn);
  console.log("Is expired:", isTokenExpired(token));
  console.groupEnd();
}
