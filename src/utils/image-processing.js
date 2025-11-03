/**
 * @namespace CityArtWalks.Utils.ImageProcessing
 * @version 1.0.0
 * @author jaimie garner
 * @description Image processing utilities for compression, resizing, and optimization.
 */

import { debugLog, debugError } from 'src/lib/debug';

/**
 * @memberof CityArtWalks.Utils.ImageProcessing
 * @function compressImage
 * @description Compresses an image file to reduce size while maintaining quality.
 * Automatically resizes images that are too large and compresses to target file size.
 *
 * @param {File} file - The image file to compress
 * @param {Object} [options={}] - Compression options
 * @param {number} [options.maxWidth=2048] - Maximum width in pixels
 * @param {number} [options.maxHeight=2048] - Maximum height in pixels
 * @param {number} [options.quality=0.8] - JPEG quality (0-1)
 * @param {number} [options.maxSizeBytes=5242880] - Maximum file size in bytes (5MB default)
 * @param {string} [options.outputType='image/jpeg'] - Output format
 * @returns {Promise<File>} Promise resolving to compressed image file
 *
 * @example
 * const compressedFile = await compressImage(originalFile, {
 *   maxWidth: 1920,
 *   maxHeight: 1080,
 *   quality: 0.85,
 *   maxSizeBytes: 3 * 1024 * 1024 // 3MB
 * });
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 2048,
    maxHeight = 2048,
    quality = 0.8,
    maxSizeBytes = 5242880, // 5MB
    outputType = 'image/jpeg',
  } = options;

  debugLog('CityArtWalks.Utils.ImageProcessing.compressImage', 'Starting image compression', {
    fileName: file.name,
    originalSize: file.size,
    originalType: file.type,
    maxWidth,
    maxHeight,
    quality,
    maxSizeBytes,
  });

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function handleImageLoad() {
      try {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = calculateDimensions(img.width, img.height, maxWidth, maxHeight);

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Configure canvas for high quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw and resize image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with compression
        let currentQuality = quality;

        const tryCompress = (qualityLevel) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              debugLog('CityArtWalks.Utils.ImageProcessing.compressImage', 'Compression attempt', {
                quality: qualityLevel,
                newSize: blob.size,
                targetSize: maxSizeBytes,
                compressionRatio: (((file.size - blob.size) / file.size) * 100).toFixed(1) + '%',
              });

              // If still too large and quality can be reduced, try again
              if (blob.size > maxSizeBytes && qualityLevel > 0.3) {
                tryCompress(qualityLevel - 0.1);
                return;
              }

              // Create new file with compressed data
              const compressedFile = new File([blob], file.name, {
                type: outputType,
                lastModified: Date.now(),
              });

              debugLog(
                'CityArtWalks.Utils.ImageProcessing.compressImage',
                'Compression completed',
                {
                  originalSize: file.size,
                  compressedSize: compressedFile.size,
                  finalQuality: qualityLevel,
                  dimensions: `${width}x${height}`,
                  compressionRatio:
                    (((file.size - compressedFile.size) / file.size) * 100).toFixed(1) + '%',
                }
              );

              resolve(compressedFile);
            },
            outputType,
            qualityLevel
          );
        };

        tryCompress(currentQuality);
      } catch (error) {
        debugError(
          'CityArtWalks.Utils.ImageProcessing.compressImage',
          'Canvas processing failed',
          error
        );
        reject(error);
      }
    };

    img.onerror = function handleImageError() {
      const error = new Error('Failed to load image for compression');
      debugError('CityArtWalks.Utils.ImageProcessing.compressImage', 'Image load failed', error);
      reject(error);
    };

    // Load image data
    img.src = URL.createObjectURL(file);
  });
}

/**
 * @memberof CityArtWalks.Utils.ImageProcessing
 * @function calculateDimensions
 * @description Calculates new image dimensions maintaining aspect ratio within constraints.
 * @private
 * @param {number} originalWidth - Original image width
 * @param {number} originalHeight - Original image height
 * @param {number} maxWidth - Maximum allowed width
 * @param {number} maxHeight - Maximum allowed height
 * @returns {Object} Object with width and height properties
 */
function calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
  let width = originalWidth;
  let height = originalHeight;

  // Scale down if too wide
  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  // Scale down if too tall
  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}

/**
 * @memberof CityArtWalks.Utils.ImageProcessing
 * @function shouldCompressImage
 * @description Determines if an image needs compression based on size and dimensions.
 * @param {File} file - The image file to check
 * @param {number} [maxSizeBytes=5242880] - Maximum file size in bytes
 * @returns {Promise<boolean>} Promise resolving to true if compression is needed
 */
export async function shouldCompressImage(file, maxSizeBytes = 5242880) {
  // Always compress if file is larger than max size
  if (file.size > maxSizeBytes) {
    debugLog('CityArtWalks.Utils.ImageProcessing.shouldCompressImage', 'File size exceeds limit', {
      fileName: file.name,
      fileSize: file.size,
      maxSizeBytes,
      needsCompression: true,
    });
    return true;
  }

  return new Promise((resolve) => {
    const img = new Image();

    img.onload = function handleDimensionCheck() {
      // Compress if dimensions are very large
      const needsCompression = img.width > 2048 || img.height > 2048;

      debugLog(
        'CityArtWalks.Utils.ImageProcessing.shouldCompressImage',
        'Dimension check completed',
        {
          fileName: file.name,
          dimensions: `${img.width}x${img.height}`,
          needsCompression,
        }
      );

      resolve(needsCompression);
      URL.revokeObjectURL(img.src);
    };

    img.onerror = function handleDimensionError() {
      debugError(
        'CityArtWalks.Utils.ImageProcessing.shouldCompressImage',
        'Failed to load image for dimension check'
      );
      resolve(false);
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * @memberof CityArtWalks.Utils.ImageProcessing
 * @function getImageDimensions
 * @description Gets the dimensions of an image file.
 * @param {File} file - The image file
 * @returns {Promise<{width: number, height: number}>} Promise resolving to image dimensions
 */
export async function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = function handleGetDimensions() {
      const dimensions = {
        width: img.width,
        height: img.height,
      };

      debugLog('CityArtWalks.Utils.ImageProcessing.getImageDimensions', 'Dimensions retrieved', {
        fileName: file.name,
        dimensions: `${dimensions.width}x${dimensions.height}`,
      });

      resolve(dimensions);
      URL.revokeObjectURL(img.src);
    };

    img.onerror = function handleGetDimensionsError() {
      const error = new Error('Failed to load image for dimension calculation');
      debugError(
        'CityArtWalks.Utils.ImageProcessing.getImageDimensions',
        'Failed to get dimensions',
        error
      );
      reject(error);
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  });
}
