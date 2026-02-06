/**
 * Image utilities for product images with fallback support
 */

import { ref } from "vue";
import { API_BASE_URL } from "../api/api";

/**
 * Get product image URL with fallback
 */
export function getProductImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) {
    return getDefaultProductImage();
  }
  return `${API_BASE_URL}${imageUrl}`;
}

/**
 * Get default/fallback product image as data URI
 */
export function getDefaultProductImage(): string {
  // SVG placeholder image
  //   const svg = `
  //     <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  //       <rect width="200" height="200" fill="#E5E7EB"/>
  //       <g transform="translate(100, 100)">
  //         <path d="M0-35 L-20-15 L-20,25 L20,25 L20,-15 Z" fill="#9CA3AF" stroke="#6B7280" stroke-width="2"/>
  //         <circle cx="0" cy="-5" r="8" fill="#6B7280"/>
  //         <polyline points="-15,15 -5,5 5,10 15,0" fill="none" stroke="#6B7280" stroke-width="2"/>
  //       </g>
  //       <text x="100" y="175" text-anchor="middle" fill="#6B7280" font-size="14" font-family="Arial">No Image</text>
  //     </svg>
  //   `;
  return "/public/default-product.jpg";
}

/**
 * Composable for handling product images with error fallback
 */
export function useProductImage(imageUrl?: string | null) {
  const currentImageUrl = ref(getProductImageUrl(imageUrl));
  const hasError = ref(false);

  const handleImageError = () => {
    if (!hasError.value) {
      hasError.value = true;
      currentImageUrl.value = getDefaultProductImage();
    }
  };

  return {
    imageUrl: currentImageUrl,
    handleImageError,
    hasError,
  };
}

/**
 * Check if image URL is valid
 */
export function isValidImageUrl(url?: string | null): boolean {
  return !!url && url.length > 0;
}
