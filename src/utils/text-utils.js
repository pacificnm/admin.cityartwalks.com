import sanitizeHtml from 'sanitize-html';

/**
 * Truncates a string to a given size. If `more` is true, it returns an object with truncated and hidden text,
 * allowing you to reveal the full text later.
 *
 * @param {string} str - The input string to truncate.
 * @param {number} [size=50] - The maximum number of characters to show in the truncated version.
 * @param {string} [ending='...'] - The string to append after truncation.
 * @param {boolean} [more=false] - Whether to hide the remaining text for "read more" functionality.
 * @returns {string|{ preview: string, hidden: string }} A truncated string or an object with preview/hidden text.
 */
export function truncate(str, size = 50, ending = '...', more = false) {
  if (typeof str !== 'string') return '';

  if (str.length <= size || size <= 0) {
    return more ? { preview: str, hidden: '' } : str;
  }

  const preview = str.slice(0, size - ending.length) + ending;
  const hidden = str.slice(size - ending.length);

  return more ? { preview, hidden } : preview;
}

/**
 * Removes HTML tags from a string.
 * @param {string} str - The string to clean.
 * @returns {string} The string with HTML tags removed.
 */
export function stripTags(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '');
}

export const sanitizeHtmlContent = (htmlContent) => {
  if (typeof htmlContent !== 'string') return '';

  return sanitizeHtml(htmlContent, {
    allowedTags: ['p', 'hr', 'br', 'a', 'strong', 'em', 'b', 'i', 'u'],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
    transformTags: {
      a: (tagName, attribs) => ({
        tagName: 'a',
        attribs: {
          href: attribs.href || '',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    },
  });
};
