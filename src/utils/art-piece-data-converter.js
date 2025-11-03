/**
 * @fileoverview Art Piece Data Conversion Utilities
 * @description Utilities for converting and normalizing art piece data formats
 * @author jaimie garner
 * @version 1.0.0
 * @namespace CityArtWalks.Utils.ArtPieceDataConverter
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Data-Conversion|Data Conversion Documentation}
 */

/**
 * Normalizes art piece metadata fields to consistent array of strings format
 *
 * Handles various input formats: * - Arrays of strings: ["Modern", "Sculpture"]
 * - Arrays of objects: [{name: "Modern", description: "..."}, {name: "Sculpture", description: "..."}]
 * - Single strings: "Modern"
 * - Single objects: {name: "Modern", description: "..."}
 * - null/undefined values
 *
 * @memberof CityArtWalks.Utils.ArtPieceDataConverter
 * @function normalizeMetadataField
 * @param {Array|string|Object|null|undefined} field - The field to normalize
 * @returns {Array<string>} Array of strings representing the metadata
 *
 * @example
 * // Array of objects to array of strings
 * normalizeMetadataField([{name: "Modern"}, {name: "Sculpture"}])
 * // Returns: ["Modern", "Sculpture"]
 *
 * @example
 * // Mixed array to array of strings
 * normalizeMetadataField(["Modern", {name: "Sculpture"}])
 * // Returns: ["Modern", "Sculpture"]
 *
 * @example
 * // Single value to array
 * normalizeMetadataField("Modern")
 * // Returns: ["Modern"]
 *
 * @example
 * // Null/undefined to empty array
 * normalizeMetadataField(null)
 * // Returns: []
 */
export function normalizeMetadataField(field) {
  // Handle null/undefined
  if (!field) {
    return [];
  }

  // Handle arrays
  if (Array.isArray(field)) {
    return field.map((item) => {
      if (typeof item === 'string') {
        return item;
      }
      if (typeof item === 'object' && item !== null && item.name) {
        return item.name;
      }
      // Fallback: convert to string
      return String(item);
    });
  }

  // Handle single values
  if (typeof field === 'string') {
    return [field];
  }

  if (typeof field === 'object' && field !== null && field.name) {
    return [field.name];
  }

  // Fallback: convert to string and wrap in array
  return [String(field)];
}

/**
 * Converts art piece queue data to normalized art piece format
 *
 * Ensures all metadata fields (type, material, tags) are stored as arrays of strings
 * for consistent data format across the application.
 *
 * @memberof CityArtWalks.Utils.ArtPieceDataConverter
 * @function convertQueueToArtPiece
 * @param {Object} queueItem - The queue item data
 * @param {number} userId - The ID of the user creating the art piece
 * @returns {Object} Normalized art piece data ready for creation
 *
 * @example
 * // Convert queue item to art piece
 * const queueItem = {
 *   title: "Modern Sculpture",
 *   artPieceTag: [{name: "Modern"}, {name: "Sculpture"}],
 *   artPieceMaterial: ["Steel", "Aluminum"],
 *   artPieceType: "SCULPTURE"
 * };
 *
 * const artPieceData = convertQueueToArtPiece(queueItem, 123);
 * // Returns normalized data with consistent array formats
 */
export function convertQueueToArtPiece(queueItem, userId = 1) {
  return {
    title: queueItem.title,
    artistId: queueItem.artistId,
    description: queueItem.description,
    latitude: queueItem.latitude,
    longitude: queueItem.longitude,
    city: queueItem.city,
    state: queueItem.state,
    cityId: queueItem.cityId,
    stateId: queueItem.stateId,
    countryId: queueItem.countryId,
    creationDate: queueItem.creationDate,
    installationDate: queueItem.installationDate,
    // Normalize metadata fields to consistent array of strings format
    artPieceType: normalizeMetadataField(queueItem.artPieceType),
    artPieceMaterial: normalizeMetadataField(queueItem.artPieceMaterial),
    artPieceTag: normalizeMetadataField(queueItem.artPieceTag),
    // Set defaults
    status: 'ACTIVE',
    featured: false,
    viewCount: 0,
    createdBy: userId,
    updatedBy: userId,
  };
}

/**
 * Normalizes existing art piece data to ensure consistent metadata formats
 *
 * Useful for updating existing art pieces that may have inconsistent data formats
 * from legacy imports or different data sources.
 *
 * @memberof CityArtWalks.Utils.ArtPieceDataConverter
 * @function normalizeArtPieceData
 * @param {Object} artPiece - The art piece data to normalize
 * @returns {Object} Art piece data with normalized metadata fields
 *
 * @example
 * // Normalize existing art piece data
 * const artPiece = {
 *   title: "Mixed Format Piece",
 *   artPieceTag: [{name: "Modern"}, "Sculpture"], // Mixed format
 *   artPieceMaterial: "Steel", // Single string
 *   // ... other fields
 * };
 *
 * const normalized = normalizeArtPieceData(artPiece);
 * // Returns data with consistent array formats
 */
export function normalizeArtPieceData(artPiece) {
  return {
    ...artPiece,
    artPieceType: normalizeMetadataField(artPiece.artPieceType),
    artPieceMaterial: normalizeMetadataField(artPiece.artPieceMaterial),
    artPieceTag: normalizeMetadataField(artPiece.artPieceTag),
  };
}
