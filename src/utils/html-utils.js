/**
 * HTML Utility Functions
 *
 * Common utilities for processing and cleaning HTML content
 * used across the application for content sanitization.
 *
 * @namespace CityArtWalks.Utils.HTML
 * @version 1.0.0
 * @fileoverview HTML processing and cleaning utilities
 */

/**
 * Clean HTML content for text extraction and processing
 * Removes scripts, styles, and converts block elements to appropriate text formatting
 *
 * @param {string} html - Raw HTML content to clean
 * @returns {string} Cleaned text content
 */
export function cleanHtml(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '') // Remove script tags and content
    .replace(/<style[\s\S]*?<\/style>/gi, '') // Remove style tags and content
    .replace(/<br\s*\/?>/gi, '\n') // Convert br tags to newlines
    .replace(/<\/(p|li|tr|h\d)>/gi, '\n') // Convert block endings to newlines
    .replace(/<[^>]+>/g, ' ') // Remove all remaining HTML tags
    .replace(/\s+\n/g, '\n') // Clean up whitespace before newlines
    .replace(/[ \t]+/g, ' ') // Normalize spaces and tabs
    .trim(); // Remove leading/trailing whitespace
}

/**
 * Extract text content from HTML while preserving basic structure
 * More conservative cleaning that maintains some formatting
 *
 * @param {string} html - Raw HTML content
 * @returns {string} Text content with basic structure preserved
 */
export function extractTextContent(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/?(p|div|h[1-6]|li|td|th)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Sanitize HTML for safe display (basic sanitization)
 * Removes potentially dangerous elements while preserving safe formatting
 *
 * @param {string} html - HTML content to sanitize
 * @returns {string} Sanitized HTML content
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Remove dangerous tags and attributes
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/javascript?:/gi, '') // Remove javascript: URLs
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?<\/embed>/gi, '')
    .trim();
}

/**
 * Extract specific HTML elements by tag name
 *
 * @param {string} html - HTML content to search
 * @param {string} tagName - Tag name to extract (e.g., 'img', 'a')
 * @returns {Array<Object>} Array of extracted elements with attributes
 */
export function extractElements(html, tagName) {
  if (!html || !tagName) {
    return [];
  }

  const elements = [];
  const regex = new RegExp(`<${tagName}[^>]*>`, 'gi');
  let match;

  while ((match = regex.exec(html)) !== null) {
    const element = match[0];
    const attributes = {};

    // Extract attributes
    const attrRegex = /(\w+)=["']([^"']*)["']/g;
    let attrMatch;

    while ((attrMatch = attrRegex.exec(element)) !== null) {
      attributes[attrMatch[1]] = attrMatch[2];
    }

    elements.push({
      tag: tagName,
      attributes,
      fullMatch: element,
    });
  }

  return elements;
}

/**
 * Extract image URLs from HTML content
 *
 * @param {string} html - HTML content to search
 * @returns {Array<string>} Array of image URLs found
 */
export function extractImageUrls(html) {
  const images = extractElements(html, 'img');
  return images
    .map((img) => img.attributes.src)
    .filter((src) => src && (src.startsWith('http') || src.startsWith('//')))
    .slice(0, 10); // Limit to 10 images
}

/**
 * Extract link URLs from HTML content
 *
 * @param {string} html - HTML content to search
 * @returns {Array<Object>} Array of link objects with href and text
 */
export function extractLinks(html) {
  if (!html) return [];

  const links = [];
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const text = cleanHtml(match[2]);

    if (href && text) {
      links.push({ href, text });
    }
  }

  return links.slice(0, 20); // Limit to 20 links
}

/**
 * Count words in HTML content (after cleaning)
 *
 * @param {string} html - HTML content
 * @returns {number} Word count
 */
export function countWords(html) {
  const text = cleanHtml(html);
  if (!text) return 0;

  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Truncate HTML content to approximate character limit while preserving structure
 *
 * @param {string} html - HTML content to truncate
 * @param {number} maxLength - Maximum character length (approximate)
 * @returns {string} Truncated HTML content
 */
export function truncateHtml(html, maxLength = 1000) {
  if (!html || html.length <= maxLength) {
    return html;
  }

  // Simple truncation at word boundary near the limit
  const truncated = html.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

export default {
  cleanHtml,
  extractTextContent,
  sanitizeHtml,
  extractElements,
  extractImageUrls,
  extractLinks,
  countWords,
  truncateHtml,
};
