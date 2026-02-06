/**
 * API Utilities and Helper Functions
 */

import { API_BASE_URL } from "./api";

/**
 * Build query string from parameters object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Get full URL for a file/image
 */
export function getFileUrl(filename: string): string {
  if (!filename) return "";
  return `${API_BASE_URL}/files/${filename}`;
}

/**
 * Convert File to base64 for preview
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Validate file size (in MB)
 */
export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validate file type
 */
export function validateFileType(
  file: File,
  allowedTypes: string[] = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ]
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error?.error) {
    return error.error;
  }

  return "An unexpected error occurred";
}

/**
 * Create FormData from object, handling files properly
 */
export function createFormData(data: Record<string, any>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "object" && !(value instanceof Date)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if response is successful (for messages)
 */
export function isSuccessResponse(response: any): boolean {
  return (
    response &&
    (response.message || response.success || response.status === "success")
  );
}

/**
 * Extract error message from response
 */
export function extractErrorMessage(response: any): string | null {
  if (response?.error) return response.error;
  if (response?.message) return response.message;
  return null;
}
