/**
 * @file ai-validator.js
 * @description Centralized Zod schemas and validation pipeline for AI outputs used by the
 * art harvesting and AI services (extraction, image analysis, moderation, metadata enhancement,
 * and artist research/biography validation).
 * @namespace CityArtWalks.Validators.AI
 * @version 1.0.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} z - Zod schema validation library
 */

import { z } from 'zod';

// -----------------------------------------------------------------------------
// Art Piece Extraction Schema
// -----------------------------------------------------------------------------

/**
 * Schema for validating art piece extraction results from AI.
 *
 * @constant {z.ZodObject} ArtPieceExtractionSchema
 * @memberof CityArtWalks.Validators.AI
 */
export const ArtPieceExtractionSchema = z
  .object({
    title: z
      .string()
      .nullable()
      .transform((val) => (val ? cleanText(val).slice(0, 200) : null))
      .refine((val) => !val || val.length >= 2, 'Title must be at least 2 characters'),

    artistName: z
      .string()
      .nullable()
      .transform((val) => (val ? cleanArtistName(val).slice(0, 100) : null))
      .refine((val) => !val || isValidArtistName(val), 'Invalid artist name format'),

    description: z
      .string()
      .nullable()
      .transform((val) => (val ? cleanText(val).slice(0, 2000) : null))
      .refine((val) => !val || val.length >= 10, 'Description must be at least 10 characters'),

    latitude: z
      .number()
      .nullable()
      .refine((val) => !val || (val >= -90 && val <= 90), 'Invalid latitude'),

    longitude: z
      .number()
      .nullable()
      .refine((val) => !val || (val >= -180 && val <= 180), 'Invalid longitude'),

    address: z
      .string()
      .nullable()
      .transform((val) => (val ? cleanAddress(val).slice(0, 200) : null)),

    city: z
      .string()
      .nullable()
      .transform((val) => (val ? cleanPlaceName(val).slice(0, 100) : null))
      .refine((val) => !val || isValidPlaceName(val), 'Invalid city name'),

    state: z
      .string()
      .nullable()
      .transform((val) => (val ? cleanPlaceName(val).slice(0, 100) : null))
      .refine((val) => !val || isValidPlaceName(val), 'Invalid state name'),

    country: z
      .string()
      .nullable()
      .transform((val) => (val ? cleanPlaceName(val).slice(0, 100) : null))
      .refine((val) => !val || isValidCountryName(val), 'Invalid country name'),

    creationDate: z
      .string()
      .nullable()
      .transform((val) => (val ? cleanDate(val) : null))
      .refine((val) => !val || isValidDate(val), 'Invalid creation date format'),

    installationDate: z
      .string()
      .nullable()
      .transform((val) => (val ? cleanDate(val) : null))
      .refine((val) => !val || isValidDate(val), 'Invalid installation date format'),

    medium: z
      .string()
      .nullable()
      .transform((val) => (val ? cleanText(val).slice(0, 200) : null)),

    dimensions: z
      .string()
      .nullable()
      .transform((val) => (val ? cleanDimensions(val).slice(0, 200) : null)),

    artPieceMaterial: z.any().optional().nullable(),

    artPieceType: z.any().optional().nullable(),

    artPieceTag: z.any().optional().nullable(),

    imageUrls: z
      .array(z.string().url('Invalid image URL'))
      .default([])
      .transform((urls) => urls.filter((url) => isValidImageUrl(url)).slice(0, 10)),

    confidence: z
      .number()
      .min(0)
      .max(1)
      .transform((val) => Math.round(val * 100) / 100),

    extractedData: z.record(z.any()).default({}),
  })
  .transform((data) => ({
    ...data,
    // Add computed validation fields
    _validation: {
      hasLocation: !!(data.city || data.state || data.address),
      hasArtist: !!data.artistName,
      hasDescription: !!(data.description && data.description.length >= 10),
      hasCoordinates: !!(data.latitude && data.longitude),
      hasMaterials: !!(
        data.artPieceMaterial &&
        (Array.isArray(data.artPieceMaterial) ? data.artPieceMaterial.length > 0 : true)
      ),
      hasTypes: !!(
        data.artPieceType &&
        (Array.isArray(data.artPieceType) ? data.artPieceType.length > 0 : true)
      ),
      hasTags: !!(
        data.artPieceTag && (Array.isArray(data.artPieceTag) ? data.artPieceTag.length > 0 : true)
      ),
      completenessScore: calculateCompletenessScore(data),
      qualityScore: calculateQualityScore(data),
    },
  }));

// -----------------------------------------------------------------------------
// Image Analysis Schema
// -----------------------------------------------------------------------------

/**
 * Schema for validating AI image analysis results
 *
 * @constant {z.ZodObject} ImageAnalysisSchema
 * @memberof CityArtWalks.Validators.AI
 */
export const ImageAnalysisSchema = z.object({
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description too long')
    .transform((val) => cleanText(val)),

  artStyle: z
    .string()
    .nullable()
    .transform((val) => (val ? cleanText(val).slice(0, 100) : null)),

  colors: z
    .array(z.string())
    .default([])
    .transform((colors) => colors.filter((color) => isValidColor(color)).slice(0, 10)),

  subjects: z
    .array(z.string())
    .default([])
    .transform((subjects) => subjects.map((s) => cleanText(s)).slice(0, 15)),

  condition: z
    .string()
    .nullable()
    .transform((val) => (val ? cleanText(val).slice(0, 200) : null)),

  setting: z
    .string()
    .nullable()
    .transform((val) => (val ? cleanText(val).slice(0, 200) : null)),

  confidence: z
    .number()
    .min(0)
    .max(1)
    .transform((val) => Math.round(val * 100) / 100),
});

// -----------------------------------------------------------------------------
// Content Moderation Schema
// -----------------------------------------------------------------------------

/**
 * Schema for validating AI content moderation results
 *
 * @constant {z.ZodObject} ModerationSchema
 * @memberof CityArtWalks.Validators.AI
 */
export const ModerationSchema = z.object({
  appropriate: z.boolean(),

  flaggedCategories: z
    .array(
      z.enum([
        'inappropriate-language',
        'offensive-content',
        'cultural-insensitivity',
        'copyright-concern',
        'accuracy-issue',
        'age-inappropriate',
        'bias-discrimination',
        'misinformation',
      ])
    )
    .default([]),

  severity: z.enum(['low', 'medium', 'high']),

  confidence: z
    .number()
    .min(0)
    .max(1)
    .transform((val) => Math.round(val * 100) / 100),

  recommendation: z
    .string()
    .min(10, 'Recommendation must be at least 10 characters')
    .transform((val) => cleanText(val)),

  detailedFeedback: z
    .string()
    .optional()
    .transform((val) => (val ? cleanText(val) : undefined)),

  suggestedEdits: z
    .array(z.string())
    .default([])
    .transform((edits) => edits.map((e) => cleanText(e)).slice(0, 5)),
});

// -----------------------------------------------------------------------------
// Metadata Enhancement Schema
// -----------------------------------------------------------------------------

/**
 * Schema for validating AI metadata enhancement results
 *
 * @constant {z.ZodObject} MetadataEnhancementSchema
 * @memberof CityArtWalks.Validators.AI
 */
export const MetadataEnhancementSchema = z.object({
  suggestedTags: z
    .array(z.string())
    .default([])
    .transform((tags) =>
      tags
        .filter((tag) => isValidTag(tag))
        .map((tag) => cleanTag(tag))
        .slice(0, 20)
    ),

  category: z
    .string()
    .nullable()
    .transform((val) => (val ? cleanText(val).slice(0, 50) : null)),

  artMovement: z
    .string()
    .nullable()
    .transform((val) => (val ? cleanText(val).slice(0, 100) : null)),

  themes: z
    .array(z.string())
    .default([])
    .transform((themes) =>
      themes
        .filter((theme) => theme.length >= 2)
        .map((theme) => cleanText(theme))
        .slice(0, 10)
    ),

  relatedArtists: z
    .array(z.string())
    .default([])
    .transform((artists) =>
      artists
        .filter((artist) => isValidArtistName(artist))
        .map((artist) => cleanArtistName(artist))
        .slice(0, 8)
    ),

  historicalContext: z
    .string()
    .nullable()
    .transform((val) => (val ? cleanText(val).slice(0, 1000) : null)),

  technicalNotes: z
    .string()
    .nullable()
    .transform((val) => (val ? cleanText(val).slice(0, 500) : null)),

  accessibility: z
    .string()
    .nullable()
    .transform((val) => (val ? cleanText(val).slice(0, 300) : null)),

  confidence: z
    .number()
    .min(0)
    .max(1)
    .transform((val) => Math.round(val * 100) / 100),
});

// -----------------------------------------------------------------------------
// Validation Utility Functions
// -----------------------------------------------------------------------------

/**
 * Clean and normalize text content.
 *
 * @function cleanText
 * @memberof CityArtWalks.Validators.AI
 * @param {string} text - Raw text to clean
 * @returns {string} Normalized text
 */
function cleanText(text) {
  if (!text) return '';

  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-.,!?;:()"']/g, '')
    .trim()
    .replace(/^["']|["']$/g, '');
}

/**
 * Clean and validate artist names.
 *
 * @function cleanArtistName
 * @memberof CityArtWalks.Validators.AI
 * @param {string} name - Raw artist name
 * @returns {string} Cleaned artist name
 */
function cleanArtistName(name) {
  if (!name) return '';

  return name
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-.,]/g, '')
    .trim()
    .replace(/^(by|artist?:?)\s*/i, '')
    .slice(0, 100);
}

/**
 * Validate artist name format.
 *
 * @function isValidArtistName
 * @memberof CityArtWalks.Validators.AI
 * @param {string} name - Candidate artist name
 * @returns {boolean} True if name appears valid
 */
function isValidArtistName(name) {
  if (!name || name.length < 2) return false;

  const suspiciousPatterns = [
    /^(unknown|anonymous|n\/a|none|null)$/i,
    /^\d+$/,
    /^[^a-zA-Z]*$/,
    /(http|www)/i,
  ];

  return !suspiciousPatterns.some((pattern) => pattern.test(name));
}

/**
 * Clean address formatting.
 *
 * @function cleanAddress
 * @memberof CityArtWalks.Validators.AI
 * @param {string} address - Raw address string
 * @returns {string} Cleaned address
 */
function cleanAddress(address) {
  if (!address) return '';

  return address
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-.,#]/g, '')
    .trim();
}

/**
 * Clean place names (city, state, country).
 *
 * @function cleanPlaceName
 * @memberof CityArtWalks.Validators.AI
 * @param {string} place - Raw place name
 * @returns {string} Cleaned place name
 */
function cleanPlaceName(place) {
  if (!place) return '';

  return place
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-]/g, '')
    .trim();
}

/**
 * Validate place name format.
 *
 * @function isValidPlaceName
 * @memberof CityArtWalks.Validators.AI
 * @param {string} place - Candidate place name
 * @returns {boolean} True if place name is valid
 */
function isValidPlaceName(place) {
  if (!place || place.length < 2) return false;

  const invalidPatterns = [/^\d+$/, /^[^a-zA-Z]*$/, /^(unknown|n\/a|none)$/i];

  return !invalidPatterns.some((pattern) => pattern.test(place));
}

/**
 * Validate country name.
 *
 * @function isValidCountryName
 * @memberof CityArtWalks.Validators.AI
 * @param {string} country - Candidate country name
 * @returns {boolean} True if country name is valid
 */
function isValidCountryName(country) {
  if (!isValidPlaceName(country)) return false;
  return country.length <= 50;
}

/**
 * Clean and normalize date strings.
 *
 * @function cleanDate
 * @memberof CityArtWalks.Validators.AI
 * @param {string} dateStr - Raw date string
 * @returns {string|null} Normalized date or null
 */
function cleanDate(dateStr) {
  if (!dateStr) return null;

  const yearMatch = dateStr.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    const year = parseInt(yearMatch[0]);
    if (year >= 1800 && year <= new Date().getFullYear() + 5) {
      return year.toString();
    }
  }

  if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(dateStr.trim())) {
    return dateStr.trim();
  }

  return null;
}

/**
 * Validate date format.
 *
 * @function isValidDate
 * @memberof CityArtWalks.Validators.AI
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} True if date is valid or empty
 */
function isValidDate(dateStr) {
  if (!dateStr) return true;

  if (/^\d{4}$/.test(dateStr)) {
    const year = parseInt(dateStr);
    return year >= 1800 && year <= 2030;
  }

  if (/^\d{4}-\d{2}(-\d{2})?$/.test(dateStr)) {
    return !isNaN(Date.parse(dateStr));
  }

  return false;
}

/**
 * Clean dimensions string.
 *
 * @function cleanDimensions
 * @memberof CityArtWalks.Validators.AI
 * @param {string} dims - Raw dimensions text
 * @returns {string} Cleaned dimensions
 */
function cleanDimensions(dims) {
  if (!dims) return '';

  return dims
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-.,×x"']/g, '')
    .trim();
}

/**
 * Validate image URL.
 *
 * @function isValidImageUrl
 * @memberof CityArtWalks.Validators.AI
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is a valid image URL
 */
function isValidImageUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate color name or hex code.
 *
 * @function isValidColor
 * @memberof CityArtWalks.Validators.AI
 * @param {string} color - Color name or hex string
 * @returns {boolean} True if color is acceptable
 */
function isValidColor(color) {
  if (!color || typeof color !== 'string') return false;

  if (/^#[0-9A-Fa-f]{6}$/.test(color)) return true;

  const validColors = [
    'red',
    'blue',
    'green',
    'yellow',
    'orange',
    'purple',
    'pink',
    'black',
    'white',
    'gray',
    'grey',
    'brown',
    'gold',
    'silver',
    'bronze',
    'copper',
    'beige',
    'tan',
    'maroon',
    'navy',
    'teal',
  ];

  return validColors.includes(color.toLowerCase()) || color.length <= 20;
}

/**
 * Validate tag string.
 *
 * @function isValidTag
 * @memberof CityArtWalks.Validators.AI
 * @param {string} tag - Tag to validate
 * @returns {boolean} True if tag is valid
 */
function isValidTag(tag) {
  if (!tag || typeof tag !== 'string') return false;
  if (tag.length < 2 || tag.length > 50) return false;

  const invalidPatterns = [/^\d+$/, /^[^a-zA-Z]*$/, /(http|www)/i];

  return !invalidPatterns.some((pattern) => pattern.test(tag));
}

/**
 * Clean tag formatting.
 *
 * @function cleanTag
 * @memberof CityArtWalks.Validators.AI
 * @param {string} tag - Raw tag text
 * @returns {string} Cleaned tag
 */
function cleanTag(tag) {
  return tag
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

// -----------------------------------------------------------------------------
// Quality Scoring Functions
// -----------------------------------------------------------------------------

/**
 * Calculate data completeness score (0-1).
 *
 * @function calculateCompletenessScore
 * @memberof CityArtWalks.Validators.AI
 * @param {Object} data - Extracted art piece data
 * @returns {number} Completeness score between 0 and 1
 */
function calculateCompletenessScore(data) {
  const fields = [
    'title',
    'artistName',
    'description',
    'address',
    'city',
    'state',
    'medium',
    'creationDate',
    'artPieceMaterial',
    'artPieceType',
    'artPieceTag',
  ];

  const completedFields = fields.filter((field) => {
    if (field === 'artPieceMaterial' || field === 'artPieceType' || field === 'artPieceTag') {
      return data[field] && (Array.isArray(data[field]) ? data[field].length > 0 : true);
    }
    return data[field] && data[field].length > 0;
  });

  return completedFields.length / fields.length;
}

/**
 * Calculate data quality score (0-1).
 *
 * @function calculateQualityScore
 * @memberof CityArtWalks.Validators.AI
 * @param {Object} data - Extracted art piece data
 * @returns {number} Quality score between 0 and 1
 */
function calculateQualityScore(data) {
  let score = 0;
  let maxScore = 0;

  // Title quality (0-20 points)
  maxScore += 20;
  if (data.title) {
    if (data.title.length >= 5 && data.title.length <= 100) score += 20;
    else if (data.title.length >= 2) score += 10;
  }

  // Artist quality (0-15 points)
  maxScore += 15;
  if (data.artistName && isValidArtistName(data.artistName)) {
    score += 15;
  }

  // Description quality (0-25 points)
  maxScore += 25;
  if (data.description) {
    if (data.description.length >= 50) score += 25;
    else if (data.description.length >= 20) score += 15;
    else if (data.description.length >= 10) score += 10;
  }

  // Location quality (0-20 points)
  maxScore += 20;
  if (data.city && data.state) score += 20;
  else if (data.city || data.state) score += 10;
  else if (data.address) score += 5;

  // Coordinate quality (0-10 points)
  maxScore += 10;
  if (data.latitude && data.longitude) score += 10;

  // Date quality (0-10 points)
  maxScore += 10;
  if (data.creationDate && isValidDate(data.creationDate)) score += 10;
  else if (data.installationDate && isValidDate(data.installationDate)) score += 5;

  // Materials quality (0-10 points)
  maxScore += 10;
  if (Array.isArray(data.artPieceMaterial) && data.artPieceMaterial.length > 0) {
    score += Math.min(10, data.artPieceMaterial.length * 3);
  }

  // Type quality (0-5 points)
  maxScore += 5;
  if (Array.isArray(data.artPieceType) && data.artPieceType.length > 0) {
    score += 5;
  }

  // Tags quality (0-10 points)
  maxScore += 10;
  if (Array.isArray(data.artPieceTag) && data.artPieceTag.length > 0) {
    score += Math.min(10, data.artPieceTag.length * 2);
  }

  return score / maxScore;
}

// -----------------------------------------------------------------------------
// Validation Pipeline
// -----------------------------------------------------------------------------

/**
 * Main validation pipeline for AI outputs.
 *
 * Central class that validates and enhances AI-generated data (extraction,
 * biography, research) and produces validation metadata and warnings.
 *
 * @class AIValidationPipeline
 * @memberof CityArtWalks.Validators.AI
 */
export class AIValidationPipeline {
  /**
   * Validate and enhance art extraction results
   */
  static validateArtExtraction(rawData, context = {}) {
    try {
      const validated = ArtPieceExtractionSchema.parse(rawData);
      const enhanced = this.enhanceExtractionData(validated, context);

      return {
        success: true,
        data: enhanced,
        validation: enhanced._validation,
        warnings: this.generateWarnings(enhanced),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        issues: error.issues || [],
        rawData,
      };
    }
  }

  /**
   * Enhance extraction data with additional context
   */
  static enhanceExtractionData(data, context) {
    const enhanced = { ...data };

    if (context.sourceUrl) {
      enhanced.sourceMetadata = {
        url: context.sourceUrl,
        extractedAt: new Date().toISOString(),
      };
    }

    if (data.latitude && data.longitude) {
      enhanced._validation.hasCoordinates = true;
    }

    return enhanced;
  }

  /**
   * Validate artist biography generation results
   */
  static validateArtistBiography(rawData, context = {}) {
    try {
      const validated = ArtistBiographySchema.parse(rawData);
      const enhanced = this.enhanceArtistBiographyData(validated, context);

      return {
        success: true,
        data: enhanced,
        validation: enhanced._validation,
        warnings: this.generateArtistBiographyWarnings(enhanced),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        issues: error.issues || [],
        rawData,
      };
    }
  }

  /**
   * Validate artist research results
   */
  static validateArtistResearch(rawData, context = {}) {
    try {
      const validated = ArtistResearchSchema.parse(rawData);
      const enhanced = this.enhanceArtistResearchData(validated, context);

      return {
        success: true,
        data: enhanced,
        validation: enhanced._validation,
        warnings: this.generateArtistResearchWarnings(enhanced),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        issues: error.issues || [],
        rawData,
      };
    }
  }

  /**
   * Enhance artist biography data with additional context
   */
  static enhanceArtistBiographyData(data, context) {
    const enhanced = { ...data };

    // Add validation metadata
    enhanced._validation = {
      hasPersonalDetails: Boolean(
        data.personalDetails && Object.keys(data.personalDetails).length > 0
      ),
      hasArtisticDetails: Boolean(
        data.artisticDetails && Object.keys(data.artisticDetails).length > 0
      ),
      biographyLength: data.biography.length,
      confidence: data.confidence,
      generatedAt: new Date().toISOString(),
    };

    if (context.artistName) {
      enhanced.requestedArtist = context.artistName;
    }

    if (context.artPieces) {
      enhanced.referencedArtworks = context.artPieces.length;
    }

    return enhanced;
  }

  /**
   * Enhance artist research data with additional context
   */
  static enhanceArtistResearchData(data, context) {
    const enhanced = { ...data };

    // Add validation metadata
    enhanced._validation = {
      hasPersonalDetails: Boolean(
        data.personalDetails &&
          Object.keys(data.personalDetails).some((key) => data.personalDetails[key])
      ),
      hasArtisticProfile: Boolean(
        data.artisticProfile &&
          Object.keys(data.artisticProfile).some((key) =>
            Array.isArray(data.artisticProfile[key])
              ? data.artisticProfile[key].length > 0
              : data.artisticProfile[key]
          )
      ),
      hasCareerHighlights: Boolean(
        data.careerHighlights &&
          Object.keys(data.careerHighlights).some((key) => data.careerHighlights[key].length > 0)
      ),
      hasTimeline: Boolean(data.timeline && data.timeline.length > 0),
      researchDepth: this.calculateResearchDepth(data),
      confidence: data.confidence,
      researchedAt: new Date().toISOString(),
    };

    if (context.originalQuery) {
      enhanced.originalQuery = context.originalQuery;
    }

    if (context.researchDate) {
      enhanced.researchDate = context.researchDate;
    }

    return enhanced;
  }

  /**
   * Calculate research depth score
   */
  static calculateResearchDepth(data) {
    let score = 0;
    let maxScore = 0;

    // Personal details (25 points)
    maxScore += 25;
    const personalFields = [
      'birthDate',
      'deathDate',
      'birthPlace',
      'hometown',
      'nationality',
      'education',
    ];
    const completedPersonal = personalFields.filter(
      (field) =>
        data.personalDetails[field] &&
        (Array.isArray(data.personalDetails[field])
          ? data.personalDetails[field].length > 0
          : data.personalDetails[field].length > 0)
    );
    score += (completedPersonal.length / personalFields.length) * 25;

    // Artistic profile (25 points)
    maxScore += 25;
    const artisticFields = [
      'style',
      'movement',
      'techniques',
      'preferredMaterials',
      'themes',
      'influences',
    ];
    const completedArtistic = artisticFields.filter(
      (field) =>
        data.artisticProfile[field] &&
        (Array.isArray(data.artisticProfile[field])
          ? data.artisticProfile[field].length > 0
          : data.artisticProfile[field].length > 0)
    );
    score += (completedArtistic.length / artisticFields.length) * 25;

    // Career highlights (25 points)
    maxScore += 25;
    const careerFields = ['majorWorks', 'exhibitions', 'awards', 'recognition'];
    const completedCareer = careerFields.filter(
      (field) => data.careerHighlights[field] && data.careerHighlights[field].length > 0
    );
    score += (completedCareer.length / careerFields.length) * 25;

    // Timeline and context (25 points)
    maxScore += 25;
    if (data.timeline && data.timeline.length > 0) score += 15;
    if (
      data.culturalContext &&
      Object.keys(data.culturalContext).some((key) =>
        Array.isArray(data.culturalContext[key])
          ? data.culturalContext[key].length > 0
          : data.culturalContext[key]
      )
    )
      score += 10;

    return score / maxScore;
  }

  /**
   * Generate warnings for artist biography data
   */
  static generateArtistBiographyWarnings(data) {
    const warnings = [];

    if (!data._validation.hasPersonalDetails) {
      warnings.push('Missing personal details (birth date, hometown, etc.)');
    }

    if (!data._validation.hasArtisticDetails) {
      warnings.push('Missing artistic details (style, techniques, materials)');
    }

    if (data._validation.biographyLength < 200) {
      warnings.push('Biography is quite short - may lack detail');
    }

    if (data.confidence < 0.6) {
      warnings.push('Low confidence score - verify accuracy');
    }

    return warnings;
  }

  /**
   * Generate warnings for artist research data
   */
  static generateArtistResearchWarnings(data) {
    const warnings = [];

    if (!data._validation.hasPersonalDetails) {
      warnings.push('Limited personal biographical information found');
    }

    if (!data._validation.hasArtisticProfile) {
      warnings.push('Missing artistic style and technique information');
    }

    if (!data._validation.hasCareerHighlights) {
      warnings.push('Limited career achievement information');
    }

    if (data._validation.researchDepth < 0.5) {
      warnings.push('Research depth is limited - consider additional sources');
    }

    if (data.uncertainties && data.uncertainties.length > 0) {
      warnings.push(`${data.uncertainties.length} pieces of uncertain information noted`);
    }

    if (data.confidence < 0.7) {
      warnings.push('Lower confidence in research accuracy - verify key facts');
    }

    return warnings;
  }

  /**
   * Generate validation warnings
   */
  static generateWarnings(data) {
    const warnings = [];

    if (!data.title) warnings.push('Missing artwork title');
    if (!data.artistName) warnings.push('Missing artist name');
    if (!data._validation.hasLocation) warnings.push('Missing location information');
    if (data.confidence < 0.7) warnings.push('Low extraction confidence score');

    return warnings;
  }
}

// -----------------------------------------------------------------------------
// Artist Biography Schema
// -----------------------------------------------------------------------------

/**
 * Schema for validating artist biography generation results.
 *
 * @constant {z.ZodObject} ArtistBiographySchema
 * @memberof CityArtWalks.Validators.AI
 */
export const ArtistBiographySchema = z
  .object({
    biography: z
      .string()
      .min(50, 'Biography must be at least 50 characters')
      .max(5000, 'Biography must not exceed 5000 characters')
      .transform((val) => cleanText(val)),

    confidence: z.number().min(0).max(1).default(0.5),

    personalDetails: z
      .object({
        birthDate: z.string().nullable().optional(),
        deathDate: z.string().nullable().optional(),
        birthPlace: z.string().nullable().optional(),
        nationality: z.string().nullable().optional(),
        education: z.string().nullable().optional(),
      })
      .optional(),

    artisticDetails: z
      .object({
        style: z.string().nullable().optional(),
        movement: z.string().nullable().optional(),
        techniques: z.array(z.string()).default([]).optional(),
        materials: z.array(z.string()).default([]).optional(),
        influences: z.array(z.string()).default([]).optional(),
      })
      .optional(),

    sources: z.array(z.string()).default([]).optional(),
  })
  .refine((data) => data.biography.length > 0, 'Biography content is required');

// -----------------------------------------------------------------------------
// Artist Research Schema
// -----------------------------------------------------------------------------

/**
 * Schema for validating artist research results.
 *
 * @constant {z.ZodObject} ArtistResearchSchema
 * @memberof CityArtWalks.Validators.AI
 */
export const ArtistResearchSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Artist name must be at least 2 characters')
      .transform((val) => cleanArtistName(val)),

    biography: z
      .string()
      .min(50, 'Biography must be at least 50 characters')
      .max(3000, 'Biography must not exceed 3000 characters')
      .transform((val) => cleanText(val)),

    personalDetails: z
      .object({
        fullName: z.string().nullable().optional(),
        birthDate: z.string().nullable().optional(),
        deathDate: z.string().nullable().optional(),
        birthPlace: z.string().nullable().optional(),
        hometown: z.string().nullable().optional(),
        nationality: z.string().nullable().optional(),
        education: z.array(z.string()).default([]).optional(),
        family: z.string().nullable().optional(),
        personalInterests: z.array(z.string()).default([]).optional(),
      })
      .default({}),

    artisticProfile: z
      .object({
        style: z.array(z.string()).default([]),
        movement: z.array(z.string()).default([]),
        techniques: z.array(z.string()).default([]),
        preferredMaterials: z.array(z.string()).default([]),
        themes: z.array(z.string()).default([]),
        influences: z.array(z.string()).default([]),
        philosophy: z.string().nullable().optional(),
      })
      .default({}),

    careerHighlights: z
      .object({
        majorWorks: z.array(z.string()).default([]),
        exhibitions: z.array(z.string()).default([]),
        awards: z.array(z.string()).default([]),
        recognition: z.array(z.string()).default([]),
        publicCommissions: z.array(z.string()).default([]),
        collaborations: z.array(z.string()).default([]),
      })
      .default({}),

    timeline: z
      .array(
        z.object({
          year: z.string(),
          event: z.string(),
          significance: z.string().optional(),
        })
      )
      .default([])
      .optional(),

    culturalContext: z
      .object({
        historicalPeriod: z.string().nullable().optional(),
        culturalMovements: z.array(z.string()).default([]),
        socialInfluences: z.array(z.string()).default([]),
        geographicInfluences: z.array(z.string()).default([]),
      })
      .default({})
      .optional(),

    confidence: z.number().min(0).max(1).default(0.5),

    sources: z.array(z.string()).default([]),

    uncertainties: z.array(z.string()).default([]),
  })
  .refine((data) => data.name.length > 0, 'Artist name is required')
  .refine((data) => data.biography.length > 0, 'Biography content is required');

export default {
  ArtPieceExtractionSchema,
  ImageAnalysisSchema,
  ModerationSchema,
  MetadataEnhancementSchema,
  ArtistBiographySchema,
  ArtistResearchSchema,
  AIValidationPipeline,
};
