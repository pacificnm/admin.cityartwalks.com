/**
 * @namespace CityArtWalks.Utils.ImageUrlValidator
 * @fileoverview Utility functions for validating and providing fallback URLs for images
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Utils} - Utils documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Handling} - Image handling patterns
 */

/**
 * Default fallback image URL used when image validation fails
 * @constant {string}
 * @memberof CityArtWalks.Utils.ImageUrlValidator
 */
export const DEFAULT_FALLBACK_IMAGE =
  'https://0wffk7gp4dmp1u2g.public.blob.vercel-storage.com/logo-single.png';

/**
 * Validates an image URL and provides a fallback if validation fails
 *
 * This function ensures that only valid URLs are passed to image components,
 * preventing "Failed to construct 'URL': Invalid URL" errors that can occur
 * with null, undefined, empty, or malformed URLs.
 *
 * @memberof CityArtWalks.Utils.ImageUrlValidator
 * @function getValidImageUrl
 * @param {string|null|undefined} url - The image URL to validate
 * @param {string} [fallback=DEFAULT_FALLBACK_IMAGE] - Fallback URL to use if validation fails
 * @returns {string} A valid image URL (either the original or fallback)
 *
 * @example
 * // Valid URL - returns original
 * getValidImageUrl('https://example.com/image.jpg')
 * // => 'https://example.com/image.jpg'
 *
 * @example
 * // Invalid URL - returns fallback
 * getValidImageUrl(null)
 * // => 'https://0wffk7gp4dmp1u2g.public.blob.vercel-storage.com/logo-single.png'
 *
 * @example
 * // Custom fallback
 * getValidImageUrl('invalid-url', '/default-avatar.png')
 * // => '/default-avatar.png'
 *
 * @throws {Error} Never throws - always returns a valid URL
 */
export function getValidImageUrl(url, fallback = DEFAULT_FALLBACK_IMAGE) {
  // Check for null, undefined, non-string, or empty string
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  try {
    // Try to construct a URL to validate it
    // This will throw an error for malformed URLs
    new URL(url);
    return url;
  } catch {
    // If URL construction fails, return fallback
    return fallback;
  }
}

/**
 * Checks if an image URL is valid without providing a fallback
 *
 * @memberof CityArtWalks.Utils.ImageUrlValidator
 * @function isValidImageUrl
 * @param {string|null|undefined} url - The image URL to validate
 * @returns {boolean} True if the URL is valid, false otherwise
 *
 * @example
 * isValidImageUrl('https://example.com/image.jpg') // => true
 * isValidImageUrl(null) // => false
 * isValidImageUrl('invalid-url') // => false
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a URL is the default fallback image
 *
 * @memberof CityArtWalks.Utils.ImageUrlValidator
 * @function isFallbackImage
 * @param {string} url - The URL to check
 * @returns {boolean} True if the URL is the default fallback image
 *
 * @example
 * isFallbackImage('https://0wffk7gp4dmp1u2g.public.blob.vercel-storage.com/logo-single.png') // => true
 * isFallbackImage('https://example.com/image.jpg') // => false
 */
export function isFallbackImage(url) {
  return url === DEFAULT_FALLBACK_IMAGE;
}
