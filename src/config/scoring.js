/**
 * User Scoring Configuration
 *
 * This module defines the scoring rules, point values, and configuration
 * for the City Art Walks user scoring system. It provides centralized
 * configuration for point awards, counter mappings, and system limits.
 *
 * Configuration includes: * - Point values for different user actions
 * - Counter mappings for aggregate tracking
 * - Daily limits and system constraints
 * - Leaderboard and display settings
 *
 * @namespace CityArtWalks.Config.Scoring
 * @fileoverview Point values and scoring rules configuration
 * @author System Generated
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Scoring-Configuration} - Scoring configuration documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Scoring-Service} - Scoring service documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#UserEvent} - UserEvent schema documentation
 */

/**
 * Point values for different user actions
 *
 * @memberof CityArtWalks.Config.Scoring
 * @constant {Object} SCORE_RULES
 * @description Maps event types to their point values
 *
 * @property {number} CREATE_ARTIST - Points for creating an artist (50)
 * @property {number} CREATE_ART_PIECE - Points for creating an art piece (40)
 * @property {number} CREATE_PATH - Points for creating a path (30)
 * @property {number} CREATE_IMAGE - Points for creating an image (10)
 * @property {number} CREATE_REVIEW - Points for creating a review (5)
 * @property {number} BONUS - Base points for bonus events (0 - set per event)
 * @property {number} ADJUSTMENT - Base points for adjustments (0 - set per event)
 *
 * @example
 * import { SCORE_RULES } from 'src/config/scoring';
 * const artistPoints = SCORE_RULES.CREATE_ARTIST; // 50
 */
export const SCORE_RULES = {
  CREATE_ARTIST: 5,
  CREATE_ART_PIECE: 4,
  CREATE_PATH: 3,
  CREATE_IMAGE: 1,
  CREATE_REVIEW: 5,
  BONUS: 0, // set per-event
  ADJUSTMENT: 0, // set per-event
};

/**
 * Maps event types to UserScore counter fields
 *
 * @memberof CityArtWalks.Config.Scoring
 * @constant {Object} SCORE_COUNTER_MAP
 * @description Maps event types to which counter to increment in UserScore
 *
 * @property {string} CREATE_ARTIST - Maps to 'artists' counter
 * @property {string} CREATE_ART_PIECE - Maps to 'artPieces' counter
 * @property {string} CREATE_PATH - Maps to 'paths' counter
 * @property {string} CREATE_IMAGE - Maps to 'images' counter
 * @property {string} CREATE_REVIEW - Maps to 'reviews' counter
 *
 * @example
 * import { SCORE_COUNTER_MAP } from 'src/config/scoring';
 * const counter = SCORE_COUNTER_MAP.CREATE_ARTIST; // 'artists'
 */
export const SCORE_COUNTER_MAP = {
  CREATE_ARTIST: 'artists',
  CREATE_ART_PIECE: 'artPieces',
  CREATE_PATH: 'paths',
  CREATE_IMAGE: 'images',
  CREATE_REVIEW: 'reviews',
};

/**
 * General scoring system configuration
 *
 * @memberof CityArtWalks.Config.Scoring
 * @constant {Object} SCORING_CONFIG
 * @description System-wide scoring configuration and limits
 *
 * @property {number} MAX_DAILY_POINTS - Maximum points a user can earn per day (1000)
 * @property {number} MAX_EVENTS_PER_DAY - Maximum scoring events per user per day (50)
 * @property {number} LEADERBOARD_LIMIT - Default number of users shown in leaderboard (100)
 * @property {number} HISTORY_DEFAULT_LIMIT - Default number of events in history queries (50)
 * @property {number} MIN_LEADERBOARD_POINTS - Minimum points to appear on leaderboard (10)
 * @property {boolean} ENABLE_DAILY_LIMITS - Whether to enforce daily limits (true)
 * @property {boolean} ENABLE_BONUS_POINTS - Whether bonus points are allowed (true)
 * @property {boolean} ENABLE_ADJUSTMENTS - Whether admin adjustments are allowed (true)
 *
 * @example
 * import { SCORING_CONFIG } from 'src/config/scoring';
 * if (dailyPoints > SCORING_CONFIG.MAX_DAILY_POINTS) {
 *   throw new Error('Daily limit exceeded');
 * }
 */
export const SCORING_CONFIG = {
  MAX_DAILY_POINTS: 1000,
  MAX_EVENTS_PER_DAY: 50,
  LEADERBOARD_LIMIT: 100,
  HISTORY_DEFAULT_LIMIT: 50,
  MIN_LEADERBOARD_POINTS: 10,
  ENABLE_DAILY_LIMITS: true,
  ENABLE_BONUS_POINTS: true,
  ENABLE_ADJUSTMENTS: true,
};

/**
 * Event type definitions for validation
 *
 * @memberof CityArtWalks.Config.Scoring
 * @constant {string[]} VALID_EVENT_TYPES
 * @description Array of valid UserEvent types
 */
export const VALID_EVENT_TYPES = [
  'CREATE_ARTIST',
  'CREATE_ART_PIECE',
  'CREATE_PATH',
  'CREATE_IMAGE',
  'CREATE_REVIEW',
  'BONUS',
  'ADJUSTMENT',
];

/**
 * Entity type definitions for validation
 *
 * @memberof CityArtWalks.Config.Scoring
 * @constant {string[]} VALID_ENTITY_TYPES
 * @description Array of valid entity types that can be referenced in scoring events
 */
export const VALID_ENTITY_TYPES = ['Artist', 'ArtPiece', 'Path', 'Image', 'Review'];

/**
 * Default export containing all scoring configuration
 *
 * @memberof CityArtWalks.Config.Scoring
 * @default
 */
export default {
  SCORE_RULES,
  SCORE_COUNTER_MAP,
  SCORING_CONFIG,
  VALID_EVENT_TYPES,
  VALID_ENTITY_TYPES,
};
