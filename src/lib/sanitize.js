/**
 * @file sanitize.js
 * @description Shared sanitization and parsing utilities for CityArtWalks. Provides comprehensive utility functions for parsing, sanitizing, and validating user input and API data with security-focused sanitization patterns for HTML, SQL injection prevention, XSS protection, and data type validation.
 * @namespace CityArtWalks.Lib.Sanitize
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer} - Sanitizer utility documentation
 */
/**
 * Parses a value as an integer. Returns null if not a valid integer.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function parseInteger
 * @param {string|number} value - The value to parse.
 * @returns {number|null} The parsed integer or null.
 * @example
 *   parseInteger('42'); // 42
 *   parseInteger('abc'); // null
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const parseInteger = (value) => {
  const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
  return isNaN(parsed) ? null : parsed;
};

/**
 * Parses a value as a float and ensures it is within the given range.
 * Returns null if not a valid float or out of range.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function parseFloatInRange
 * @param {string|number} value - The value to parse.
 * @param {number} min - Minimum allowed value.
 * @param {number} max - Maximum allowed value.
 * @returns {number|null} The parsed float or null.
 * @example
 *   parseFloatInRange('3.14', 0, 10); // 3.14
 *   parseFloatInRange('20', 0, 10); // null
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const parseFloatInRange = (value, min, max) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) || parsed < min || parsed > max ? null : parsed;
};

/**
 * Sanitizes a value as a boolean. Accepts true, false, 1, 0, '1', '0', 'true', 'false'.
 * Returns the boolean value or the original value if not recognized.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeBoolean
 * @param {any} val - The value to sanitize.
 * @returns {boolean|any} The sanitized boolean or original value.
 * @example
 *   sanitizeBoolean('true'); // true
 *   sanitizeBoolean(0); // false
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeBoolean = (val) => {
  if (val === true || val === 'true' || val === 1 || val === '1') return true;
  if (val === false || val === 'false' || val === 0 || val === '0') return false;
  return val;
};

/**
 * Sanitizes a value as an array. Splits comma-separated strings or returns the array.
 * Returns an empty array for invalid input.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeArray
 * @param {any} val - The value to sanitize.
 * @returns {Array} The sanitized array.
 * @example
 *   sanitizeArray('a,b,c'); // ['a', 'b', 'c']
 *   sanitizeArray([1,2]); // [1,2]
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeArray = (val) =>
  typeof val === 'string' ? val.split(',').map((s) => s.trim()) : Array.isArray(val) ? val : [];

/**
 * Sanitizes a value as a URL. Returns the normalized URL string or null if invalid.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeUrl
 * @param {string} val - The value to sanitize.
 * @returns {string|null} The sanitized URL or null.
 * @example
 *   sanitizeUrl('https://example.com'); // 'https://example.com/'
 *   sanitizeUrl('not a url'); // null
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeUrl = (val) => {
  try {
    return new URL(val).toString();
  } catch {
    return null;
  }
};

/**
 * Sanitizes a string value by trimming whitespace and removing dangerous content.
 * Alias for sanitizeText with trimming.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeString
 * @param {string} val - The string to sanitize.
 * @returns {string} The sanitized string.
 * @example
 *   sanitizeString('  hello world  '); // 'hello world'
 *   sanitizeString('<script>alert(1)</script>'); // ''
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeString = (val) => {
  if (typeof val !== 'string') return '';
  return sanitizeText(val).trim();
};

/**
 * Sanitizes a string by removing dangerous HTML, scripts, SQLi, and code injection patterns.
 * Returns a safe string for public use.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeText
 * @param {string} val - The string to sanitize.
 * @returns {string} The sanitized string.
 * @example
 *   sanitizeText('<script>alert(1)</script>hello'); // 'hello'
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeText = (val) => {
  if (typeof val !== 'string' || !val) return '';
  let sanitized = val
    .replace(/<script.*?>.*?<\/script>/gis, '')
    .replace(/<iframe.*?>.*?<\/iframe>/gis, '')
    .replace(/<style.*?>.*?<\/style>/gis, '')
    .replace(/<object.*?>.*?<\/object>/gis, '')
    .replace(/<embed.*?>.*?<\/embed>/gis, '')
    .replace(/<link.*?>/gis, '')
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '') // Remove inline event handlers
    .replace(/javascript?:/gi, '')
    .replace(/data?:/gi, '')
    .replace(/['"`]/g, '') // Remove quotes (helps with SQL injection)
    .replace(
      /(;|--|\/\*|\*\/|\b(OR|AND|SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|XP_)\b)/gi,
      ''
    ) // Remove common SQLi patterns
    .trim();
  return sanitized;
};

/**
 * Sanitizes a value as an ISO date string. Returns null if invalid date.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeDate
 * @param {string|Date} val - The value to sanitize.
 * @returns {string|null} The ISO date string or null.
 * @example
 *   sanitizeDate('2020-01-01'); // '2020-01-01T00?:00:00.000Z'
 *   sanitizeDate('bad'); // null
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeDate = (val) => {
  const date = new Date(val);
  return isNaN(date.getTime()) ? null : date.toISOString();
};

/**
 * Sanitizes a value as a number. Returns null if not a valid number.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeNumber
 * @param {string|number} val - The value to sanitize.
 * @returns {number|null} The sanitized number or null.
 * @example
 *   sanitizeNumber('3.14'); // 3.14
 *   sanitizeNumber('abc'); // null
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeNumber = (val) => {
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
};

/**
 * Recursively sanitizes all string values in an object using sanitizeText.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeObject
 * @param {object} obj - The object to sanitize.
 * @returns {object} The sanitized object.
 * @example
 *   sanitizeObject({a: '<b>x</b>'}); // {a: 'x'}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'string') return [key, sanitizeText(value)];
      if (Array.isArray(value)) return [key, value.map(sanitizeObject)];
      if (typeof value === 'object' && value !== null) return [key, sanitizeObject(value)];
      return [key, value];
    })
  );
};

/**
 * Sanitizes an array of objects using sanitizeObject.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeArrayOfObjects
 * @param {Array} arr - The array to sanitize.
 * @returns {Array} The sanitized array of objects.
 * @example
 *   sanitizeArrayOfObjects([{a: '<b>x</b>'}]); // [{a: 'x'}]
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeArrayOfObjects = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => sanitizeObject(item));
};

/**
 * Sanitizes pagination parameters, ensuring skip and take are integers with defaults.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizePagination
 * @param {object} pagination - The pagination object.
 * @returns {object} The sanitized pagination object.
 * @example
 *   sanitizePagination({skip: '5', take: '20'}); // {skip: 5, take: 20}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizePagination = (pagination) => {
  if (!pagination || typeof pagination !== 'object') return { skip: 0, take: 10 };
  return {
    skip: parseInteger(pagination.skip) || 0,
    take: parseInteger(pagination.take) || 10,
  };
};

/**
 * Sanitizes sort parameters, ensuring field and order are valid.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeSort
 * @param {object} sort - The sort object.
 * @returns {object} The sanitized sort object.
 * @example
 *   sanitizeSort({field: 'name', order: 'asc'}); // {field: 'name', order: 'asc'}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeSort = (sort) => {
  if (!sort || typeof sort !== 'object') return { field: 'createdAt', order: 'desc' };
  return {
    field: sort.field || 'createdAt',
    order: sort.order === 'asc' ? 'asc' : 'desc',
  };
};

/**
 * Sanitizes a search string for safe use, removing HTML, scripts, SQLi, and normalizing whitespace.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeSearch
 * @param {string} search - The search string.
 * @returns {string} The sanitized search string.
 * @example
 *   sanitizeSearch('<b>hello</b>'); // 'hello'
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeSearch = (search) => {
  if (typeof search !== 'string') return '';
  let sanitized = search
    .replace(/<script.*?>.*?<\/script>/gis, '')
    .replace(/<iframe.*?>.*?<\/iframe>/gis, '')
    .replace(/<style.*?>.*?<\/style>/gis, '')
    .replace(/<object.*?>.*?<\/object>/gis, '')
    .replace(/<embed.*?>.*?<\/embed>/gis, '')
    .replace(/<link.*?>/gis, '')
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '') // Remove inline event handlers
    .replace(/javascript?:/gi, '')
    .replace(/data?:/gi, '')
    .replace(/['"`]/g, '') // Remove quotes (helps with SQL injection)
    .replace(
      /(;|--|\/\*|\*\/|\b(OR|AND|SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|XP_)\b)/gi,
      ''
    ) // Remove common SQLi patterns
    .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  return sanitized;
};

/**
 * Recursively sanitizes all string values in a filter object using sanitizeText.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeFilter
 * @param {object} filter - The filter object.
 * @returns {object} The sanitized filter object.
 * @example
 *   sanitizeFilter({name: '<b>x</b>'}); // {name: 'x'}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeFilter = (filter) => {
  if (!filter || typeof filter !== 'object') return {};
  return Object.fromEntries(
    Object.entries(filter).map(([key, value]) => {
      if (typeof value === 'string') return [key, sanitizeText(value)];
      if (Array.isArray(value)) return [key, value.map(sanitizeObject)];
      if (typeof value === 'object' && value !== null) return [key, sanitizeObject(value)];
      return [key, value];
    })
  );
};

/**
 * Sanitizes a request body object, with special handling for API endpoints.
 * For validated API data, we only sanitize potential XSS without breaking JSON structure.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeRequestBody
 * @param {object} body - The request body object.
 * @param {boolean} [isApiData=false] - Whether this is validated API data (less aggressive sanitization).
 * @returns {object} The sanitized request body.
 * @example
 *   sanitizeRequestBody({name: '<b>x</b>'}); // {name: 'x'}
 *   sanitizeRequestBody({title: 'My "Awesome" Post'}, true); // {title: 'My "Awesome" Post'} (preserves quotes for API)
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeRequestBody = (body, isApiData = false) => {
  if (!body || typeof body !== 'object') return {};
  return Object.fromEntries(
    Object.entries(body).map(([key, value]) => {
      if (Array.isArray(value)) return [key, sanitizeArray(value)];
      if (typeof value === 'object') return [key, sanitizeObject(value)];
      // For API data, use lighter sanitization that preserves quotes and structure
      if (isApiData && typeof value === 'string') {
        return [key, sanitizeHtml(value)]; // Only remove HTML tags, keep quotes
      }
      return [key, sanitizeText(value)];
    })
  );
};

/**
 * Recursively sanitizes query parameters for safe use in URLs and APIs.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeQueryParams
 * @param {object} params - The query parameters object.
 * @returns {object} The sanitized query parameters.
 * @example
 *   sanitizeQueryParams({q: '<b>x</b>'}); // {q: 'x'}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeQueryParams = (params) => {
  if (!params || typeof params !== 'object') return {};
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (Array.isArray(value)) return [key, value.map(sanitizeQueryParams)];
      if (typeof value === 'object' && value !== null) return [key, sanitizeQueryParams(value)];
      if (typeof value === 'string') return [key, sanitizeSearch(value)];
      return [key, value];
    })
  );
};

/**
 * Sanitizes HTTP headers by lowercasing keys and sanitizing values.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeHeaders
 * @param {object} headers - The headers object.
 * @returns {object} The sanitized headers object.
 * @example
 *   sanitizeHeaders({'X-Token': '<b>x</b>'}); // { 'x-token': 'x' }
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeHeaders = (headers) => {
  if (!headers || typeof headers !== 'object') return {};
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), sanitizeText(value)])
  );
};

/**
 * Sanitizes a response object, sanitizing arrays, objects, and strings appropriately.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeResponse
 * @param {object} response - The response object.
 * @returns {object} The sanitized response object.
 * @example
 *   sanitizeResponse({name: '<b>x</b>'}); // {name: 'x'}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeResponse = (response) => {
  if (!response || typeof response !== 'object') return response;
  return Object.fromEntries(
    Object.entries(response).map(([key, value]) => {
      if (Array.isArray(value)) return [key, sanitizeArrayOfObjects(value)];
      if (typeof value === 'object') return [key, sanitizeObject(value)];
      return [key, sanitizeText(value)];
    })
  );
};

/**
 * Sanitizes an artist status string to a valid enum value.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeArtistStatus
 * @param {string} status - The status string.
 * @returns {string} The sanitized status.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeArtistStatus = (status) => {
  const validStatuses = ['ACTIVE', 'DELETED', 'INACTIVE'];
  return validStatuses.includes(status) ? status : 'ACTIVE';
};

/**
 * Sanitizes a user role string to a valid enum value.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeUserRole
 * @param {string} role - The role string.
 * @returns {string} The sanitized role.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeUserRole = (role) => {
  if (typeof role !== 'string' || !role.trim()) return '';
  const trimmed = role.trim().toUpperCase();
  const validRoles = ['USER', 'ADMIN'];
  return validRoles.includes(trimmed) ? trimmed : '';
};

/**
 * Sanitizes an email address by trimming and lowercasing.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeEmail
 * @param {string} email - The email address.
 * @returns {string} The sanitized email.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export function sanitizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

/**
 * Sanitizes a user status string to a valid enum value.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeUserStatus
 * @param {string} status - The status string.
 * @returns {string} The sanitized status.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export const sanitizeUserStatus = (status) => {
  if (typeof status !== 'string' || !status.trim()) return '';
  const normalized = status.trim().toUpperCase();
  const validStatuses = ['ACTIVE', 'INACTIVE', 'DELETED', 'BANNED', 'PENDING'];
  return validStatuses.includes(normalized) ? normalized : '';
};

/**
 * Sanitizes an Auth0 sub (subject) string. Only allows values like 'auth0|<24-32 hex chars>'.
 * Returns the sanitized sub or null if invalid.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeAuth0Sub
 * @param {string} sub - The Auth0 sub string.
 * @returns {string|null} The sanitized sub or null if invalid.
 * @example
 *   sanitizeAuth0Sub('auth0|66ce738b19c2d14f6aa50b80'); // 'auth0|66ce738b19c2d14f6aa50b80'
 *   sanitizeAuth0Sub('bad|value'); // null
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export function sanitizeAuth0Sub(sub) {
  if (typeof sub !== 'string') return null;
  let decoded;
  try {
    decoded = decodeURIComponent(sub.trim());
  } catch {
    return null;
  }
  const match = decoded.match(/^auth0\|[a-fA-F0-9]{24,32}$/);
  return match ? match[0] : null;
}

/**
 * Sanitizes an IP address. Returns the IP if valid IPv4 or IPv6, otherwise null.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeIpAddress
 * @param {string} ip - The IP address to sanitize.
 * @returns {string|null} The sanitized IP address or null if invalid.
 * @example
 *   sanitizeIpAddress('192.168.1.1'); // '192.168.1.1'
 *   sanitizeIpAddress('2001:0db8?:85a3?:0000:0000:8a2e?:0370:7334'); // '2001:0db8?:85a3?:0000:0000:8a2e?:0370:7334'
 *   sanitizeIpAddress('bad'); // null
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export function sanitizeIpAddress(ip) {
  if (typeof ip !== 'string') return null;
  const trimmed = ip.trim();
  // IPv4 regex
  const ipv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  // IPv6 regex (simple, covers most cases)
  const ipv6 =
    /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^([\da-fA-F]{1,4}:){1,7}:$|^:((:[\da-fA-F]{1,4}){1,7}|:)$/;
  if (ipv4.test(trimmed)) {
    // Extra check: each octet <= 255
    const parts = trimmed.split('.').map(Number);
    if (parts.every((n) => n >= 0 && n <= 255)) return trimmed;
    return null;
  }
  if (ipv6.test(trimmed)) return trimmed;
  return null;
}

/**
 * Sanitizes HTML content by removing dangerous elements and attributes while preserving safe formatting.
 * This function is specifically designed for rich text content like user descriptions.
 * @memberof CityArtWalks.Lib.Sanitize
 * @function sanitizeHtml
 * @param {string} html - The HTML content to sanitize.
 * @returns {string} The sanitized HTML content.
 * @example
 *   sanitizeHtml('<p>Hello <script>alert(1)</script></p>'); // '<p>Hello </p>'
 *   sanitizeHtml('<p>Safe <strong>content</strong></p>'); // '<p>Safe <strong>content</strong></p>'
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Sanitizer}
 */
export function sanitizeHtml(html) {
  if (typeof html !== 'string' || !html) return '';

  // Define allowed tags and their attributes
  const allowedTags = {
    p: [],
    br: [],
    strong: [],
    b: [],
    em: [],
    i: [],
    u: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    ul: [],
    ol: [],
    li: [],
    blockquote: [],
    a: ['href', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height'],
  };

  let sanitized = html
    // Remove dangerous tags completely
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*>[\s\S]*?<\/embed>/gi, '')
    .replace(/<applet[^>]*>[\s\S]*?<\/applet>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '')
    .replace(/<input[^>]*>/gi, '')
    .replace(/<textarea[^>]*>[\s\S]*?<\/textarea>/gi, '')
    .replace(/<select[^>]*>[\s\S]*?<\/select>/gi, '')
    .replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '')
    // Remove dangerous attributes
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/\s+javascript?:/gi, '') // Remove javascript: URLs
    .replace(/\s+data?:/gi, '') // Remove data: URLs
    .replace(/\s+vbscript?:/gi, '') // Remove vbscript: URLs
    .replace(/\s+style\s*=\s*["'][^"']*expression[^"']*["']/gi, '') // Remove CSS expressions
    .replace(/\s+style\s*=\s*["'][^"']*javascript[^"']*["']/gi, ''); // Remove javascript in CSS

  // Remove any remaining tags that are not in the allowed list
  sanitized = sanitized.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (match, tagName, attributes) => {
    const tag = tagName.toLowerCase();

    // If tag is not allowed, remove it completely
    if (!allowedTags[tag]) {
      return '';
    }

    // If it's a closing tag, allow it
    if (match.startsWith('</')) {
      return `</${tag}>`;
    }

    // For opening tags, filter attributes
    const allowedAttrs = allowedTags[tag];
    if (allowedAttrs.length === 0) {
      // Tag has no allowed attributes
      return `<${tag}>`;
    }

    // Filter and validate attributes
    const cleanAttributes = [];
    const attrRegex = /(\w+)\s*=\s*["']([^"']*)["']/g;
    let attrMatch;

    while ((attrMatch = attrRegex.exec(attributes)) !== null) {
      const [, attrName, attrValue] = attrMatch;
      const attr = attrName.toLowerCase();

      if (allowedAttrs.includes(attr)) {
        let cleanValue = attrValue;

        // Special validation for href and src attributes
        if (attr === 'href' || attr === 'src') {
          // Only allow http, https, and relative URLs
          if (!/^(https?:\/\/|\/)/.test(cleanValue)) {
            continue; // Skip this attribute
          }
          // Remove javascript?:, data?:, vbscript: etc.
          if (/^(javascript|data|vbscript):/i.test(cleanValue)) {
            continue; // Skip this attribute
          }
        }

        // Remove any quotes and dangerous characters from attribute values
        cleanValue = cleanValue.replace(/["'<>]/g, '');
        cleanAttributes.push(`${attr}="${cleanValue}"`);
      }
    }

    return cleanAttributes.length > 0 ? `<${tag} ${cleanAttributes.join(' ')}>` : `<${tag}>`;
  });

  // Final cleanup
  sanitized = sanitized
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  return sanitized;
}
