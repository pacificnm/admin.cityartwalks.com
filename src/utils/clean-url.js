/**
 * Safely joins baseURL and relative path, removing any double slashes
 * and ensuring no trailing slash before query string.
 *
 * @param {string} baseURL - The base URL (e.g., https://example.com)
 * @param {string} path - The API path (e.g., /api/data/)
 * @returns {string} A clean and normalized full URL
 */
export function cleanUrl(baseURL, path) {
  if (!baseURL) return path;
  if (!path) return baseURL;

  // Remove trailing slash from baseURL
  const trimmedBase = baseURL.replace(/\/+$/, '');

  // Remove leading slashes from path
  const trimmedPath = path.replace(/^\/+/, '');

  return `${trimmedBase}/${trimmedPath}`;
}
