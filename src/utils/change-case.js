/**
 * @namespace CityArtWalks.Utils.ChangeCase
 * @description Utility functions for string case conversion and text manipulation.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Change-Case-Utils} - Complete documentation
 */

/**
 * Convert a string to param-case (lowercase with hyphens).
 * @memberof CityArtWalks.Utils.ChangeCase
 * @param {string} str
 * @returns {string}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Change-Case-Utils} - Complete documentation
 */
export function paramCase(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Convert a string to snake_case (lowercase with underscores).
 * @memberof CityArtWalks.Utils.ChangeCase
 * @param {string} str
 * @returns {string}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Change-Case-Utils} - Complete documentation
 */
export function snakeCase(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

/**
 * Capitalize the first letter of a string.
 * @memberof CityArtWalks.Utils.ChangeCase
 * @param {string} string
 * @returns {string}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Change-Case-Utils} - Complete documentation
 */
export function sentenceCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Convert a string to camelCase.
 * @memberof CityArtWalks.Utils.ChangeCase
 * @param {string} str
 * @returns {string}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Change-Case-Utils} - Complete documentation
 */
export function camelCase(str) {
  return str
    .replace(/\s(.)/g, ($1) => $1.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, ($1) => $1.toLowerCase());
}

/**
 * Convert a string to PascalCase.
 * @memberof CityArtWalks.Utils.ChangeCase
 * @param {string} str
 * @returns {string}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Change-Case-Utils} - Complete documentation
 */
export function pascalCase(str) {
  return str
    .replace(/\s(.)/g, ($1) => $1.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, ($1) => $1.toUpperCase());
}

/**
 * Convert a string to Capital Case (capitalize first letter, lower the rest).
 * @memberof CityArtWalks.Utils.ChangeCase
 * @param {string} str
 * @returns {string}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Change-Case-Utils} - Complete documentation
 */
export function capitalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert a slug string (with hyphens) back to normal text.
 * @memberof CityArtWalks.Utils.ChangeCase
 * @param {string} str
 * @returns {string}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Change-Case-Utils} - Complete documentation
 */
export function unslugify(str) {
  return str.replace(/-/g, ' ');
}

/**
 * Convert a string to CONSTANT_CASE (uppercase with underscores).
 * @memberof CityArtWalks.Utils.ChangeCase
 * @param {string} str
 * @returns {string}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Change-Case-Utils} - Complete documentation
 */
export function constantCase(str) {
  return str
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .toUpperCase();
}

/**
 * Convert a string to dot.case (lowercase with dots).
 * @memberof CityArtWalks.Utils.ChangeCase
 * @param {string} str
 * @returns {string}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Change-Case-Utils} - Complete documentation
 */
export function dotCase(str) {
  return str.replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
}

/**
 * Convert a string to header-case (lowercase with hyphens, cleaned of non-alphanumeric).
 * @memberof CityArtWalks.Utils.ChangeCase
 * @param {string} str
 * @returns {string}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Change-Case-Utils} - Complete documentation
 */
export function headerCase(str) {
  return str
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .toLowerCase();
}

/**
 * Strip HTML tags from a string.
 * @memberof CityArtWalks.Utils.ChangeCase
 * @param {string} html
 * @returns {string}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Change-Case-Utils} - Complete documentation
 */
export function stripHtmlTags(html) {
  return html.replace(/<[^>]*>/g, '');
}
