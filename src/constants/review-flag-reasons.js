/**
 * Review Flag Reason Constants
 *
 * Centralized definition of flag reasons for review moderation system.
 * These constants ensure consistency between backend validation, API endpoints,
 * and frontend components.
 *
 * @namespace CityArtWalks.Constants.ReviewFlagReasons
 * @fileoverview Flag reason constants for review system
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-System} - Review system documentation
 */

/**
 * @memberof CityArtWalks.Constants.ReviewFlagReasons
 * @description Enumeration of valid flag reason values
 * @constant {Object}
 */
export const FLAG_REASON_VALUES = {
  INAPPROPRIATE_CONTENT: 'inappropriate_content',
  SPAM: 'spam',
  OFF_TOPIC: 'off_topic',
  FAKE_REVIEW: 'fake_review',
  HARASSMENT: 'harassment',
  OTHER: 'other',
};

/**
 * @memberof CityArtWalks.Constants.ReviewFlagReasons
 * @description Human-readable labels for flag reasons
 * @constant {Object}
 */
export const FLAG_REASON_LABELS = {
  inappropriate_content: 'Inappropriate Content',
  spam: 'Spam or Promotional',
  off_topic: 'Off Topic',
  fake_review: 'Fake or Misleading Review',
  harassment: 'Harassment or Abuse',
  other: 'Other',
};

/**
 * @memberof CityArtWalks.Constants.ReviewFlagReasons
 * @description Detailed descriptions for each flag reason
 * @constant {Object}
 */
export const FLAG_REASON_DESCRIPTIONS = {
  inappropriate_content: 'Review contains offensive, vulgar, or inappropriate language',
  spam: 'Review appears to be spam, advertising, or promotional content',
  off_topic: 'Review is not relevant to the art piece, artist, or path',
  fake_review: 'Review appears to be fake, dishonest, or misleading',
  harassment: 'Review contains harassment, threats, or abusive language',
  other: 'Another reason not listed above (please provide details)',
};

/**
 * @memberof CityArtWalks.Constants.ReviewFlagReasons
 * @description Array of flag reason options for UI components
 * @constant {Array<Object>}
 */
export const FLAG_REASON_OPTIONS = [
  {
    value: FLAG_REASON_VALUES.INAPPROPRIATE_CONTENT,
    label: FLAG_REASON_LABELS.inappropriate_content,
    description: FLAG_REASON_DESCRIPTIONS.inappropriate_content,
  },
  {
    value: FLAG_REASON_VALUES.SPAM,
    label: FLAG_REASON_LABELS.spam,
    description: FLAG_REASON_DESCRIPTIONS.spam,
  },
  {
    value: FLAG_REASON_VALUES.OFF_TOPIC,
    label: FLAG_REASON_LABELS.off_topic,
    description: FLAG_REASON_DESCRIPTIONS.off_topic,
  },
  {
    value: FLAG_REASON_VALUES.FAKE_REVIEW,
    label: FLAG_REASON_LABELS.fake_review,
    description: FLAG_REASON_DESCRIPTIONS.fake_review,
  },
  {
    value: FLAG_REASON_VALUES.HARASSMENT,
    label: FLAG_REASON_LABELS.harassment,
    description: FLAG_REASON_DESCRIPTIONS.harassment,
  },
  {
    value: FLAG_REASON_VALUES.OTHER,
    label: FLAG_REASON_LABELS.other,
    description: FLAG_REASON_DESCRIPTIONS.other,
  },
];

/**
 * @memberof CityArtWalks.Constants.ReviewFlagReasons
 * @description Array of all valid flag reason values for validation
 * @constant {Array<string>}
 */
export const VALID_FLAG_REASONS = Object.values(FLAG_REASON_VALUES);

/**
 * @memberof CityArtWalks.Constants.ReviewFlagReasons
 * @description Helper function to get label for a flag reason value
 * @function getFlagReasonLabel
 * @param {string} value - The flag reason value
 * @returns {string} The human-readable label
 */
export function getFlagReasonLabel(value) {
  return FLAG_REASON_LABELS[value] || value;
}

/**
 * @memberof CityArtWalks.Constants.ReviewFlagReasons
 * @description Helper function to get description for a flag reason value
 * @function getFlagReasonDescription
 * @param {string} value - The flag reason value
 * @returns {string} The detailed description
 */
export function getFlagReasonDescription(value) {
  return FLAG_REASON_DESCRIPTIONS[value] || '';
}

/**
 * @memberof CityArtWalks.Constants.ReviewFlagReasons
 * @description Helper function to validate if a reason is valid
 * @function isValidFlagReason
 * @param {string} value - The flag reason value to validate
 * @returns {boolean} True if the reason is valid
 */
export function isValidFlagReason(value) {
  return VALID_FLAG_REASONS.includes(value);
}
