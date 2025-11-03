/**
 * @file vercel-blob-utils.js
 * @description Utilities for extracting information from Vercel Blob URLs and metadata
 * @author jaimie garner
 * @version 1.0.0
 */

/**
 * Extract information from a Vercel Blob URL
 * @param {string} blobUrl - The Vercel Blob URL
 * @returns {Object} Extracted information from the URL
 */
export function extractBlobUrlInfo(blobUrl) {
  if (!blobUrl || typeof blobUrl !== 'string') {
    return {};
  }

  try {
    const url = new URL(blobUrl);

    // Extract filename from URL path
    const pathParts = url.pathname.split('/');
    const filename = pathParts[pathParts.length - 1];

    // Extract file extension
    const lastDotIndex = filename.lastIndexOf('.');
    const extension = lastDotIndex > 0 ? filename.slice(lastDotIndex + 1).toLowerCase() : '';

    // Extract original filename (before the hash)
    const originalFilename = filename.split('-')[0];

    // Extract blob hash/ID from filename
    const hashMatch = filename.match(/-([a-zA-Z0-9]+)\./);
    const blobHash = hashMatch ? hashMatch[1] : null;

    return {
      hostname: url.hostname,
      pathname: url.pathname,
      filename,
      originalFilename: decodeURIComponent(originalFilename),
      extension,
      blobHash,
      isVercelBlob: url.hostname.includes('vercel-storage.com'),
    };
  } catch (error) {
    console.warn('Failed to parse blob URL?:', error);
    return {};
  }
}

/**
 * Get MIME type from file extension
 * @param {string} extension - File extension
 * @returns {string} MIME type
 */
export function getMimeTypeFromExtension(extension) {
  const mimeTypes = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    tiff: 'image/tiff',
    ico: 'image/x-icon',

    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

    // Other
    txt: 'text/plain',
    json: 'application/json',
    xml: 'text/xml',
  };

  return mimeTypes[extension?.toLowerCase()] || 'application/octet-stream';
}

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get estimated file information from image URL
 * This creates an image element to load the image and extract dimensions
 * @param {string} imageUrl - The image URL
 * @returns {Promise<Object>} Promise resolving to image information
 */
export function getImageInfo(imageUrl) {
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve({});
      return;
    }

    const img = new Image();

    img.onload = () => {
      resolve({
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
        loaded: true,
      });
    };

    img.onerror = () => {
      resolve({
        loaded: false,
        error: 'Failed to load image',
      });
    };

    // Set a timeout to avoid hanging
    setTimeout(() => {
      resolve({
        loaded: false,
        error: 'Timeout loading image',
      });
    }, 5000);

    img.src = imageUrl;
  });
}
