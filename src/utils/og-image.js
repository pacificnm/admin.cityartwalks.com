/**
 * @fileoverview Open Graph Image Utilities
 *
 * Provides helper functions to generate Open Graph image URLs for different
 * page types in the City Art Walks application.
 *
 * @memberof Utils
 */

import { debugLog } from 'src/lib/debug';

/**
 * Base URL for OG image generation API
 */
const OG_API_BASE = '/api/og';

/**
 * Generates OG image URL for art piece pages
 * @param {Object} artPiece - Art piece data
 * @param {string} artPiece.title - Art piece title
 * @param {string} [artPiece.artistName] - Artist name
 * @param {string} [artPiece.location] - Location string (city, state, country)
 * @param {string} [artPiece.image] - Art piece image URL
 * @returns {string} OG image URL
 */
export function generateArtPieceOGImage(artPiece) {
  const params = new URLSearchParams({
    type: 'artpiece',
    title: artPiece.title || 'Untitled Art Piece',
  });

  if (artPiece.artistName) {
    params.set('subtitle', artPiece.artistName);
  }

  if (artPiece.location) {
    params.set('location', artPiece.location);
  }

  if (artPiece.image) {
    params.set('image', artPiece.image);
  }

  const ogUrl = `${OG_API_BASE}?${params.toString()}`;

  debugLog('OGImageUtils.generateArtPieceOGImage', 'Generated art piece OG image URL', {
    artPieceTitle: artPiece.title,
    ogUrl,
  });

  return ogUrl;
}

/**
 * Generates OG image URL for artist pages
 * @param {Object} artist - Artist data
 * @param {string} artist.name - Artist name
 * @param {string} [artist.bio] - Artist biography excerpt
 * @param {string} [artist.location] - Artist location
 * @returns {string} OG image URL
 */
export function generateArtistOGImage(artist) {
  const params = new URLSearchParams({
    type: 'artist',
    title: artist.name || 'Unknown Artist',
  });

  if (artist.bio) {
    // Truncate bio for subtitle
    const bioExcerpt = artist.bio.length > 100 ? `${artist.bio.substring(0, 100)}...` : artist.bio;
    params.set('subtitle', bioExcerpt);
  }

  if (artist.location) {
    params.set('location', artist.location);
  }

  const ogUrl = `${OG_API_BASE}?${params.toString()}`;

  debugLog('OGImageUtils.generateArtistOGImage', 'Generated artist OG image URL', {
    artistName: artist.name,
    ogUrl,
  });

  return ogUrl;
}

/**
 * Generates OG image URL for city/location pages
 * @param {Object} location - Location data
 * @param {string} location.city - City name
 * @param {string} [location.state] - State/region name
 * @param {string} [location.country] - Country name
 * @param {number} [location.artPieceCount] - Number of art pieces in location
 * @returns {string} OG image URL
 */
export function generateCityOGImage(location) {
  const params = new URLSearchParams({
    type: 'city',
    title: location.city || 'City Art Walk',
  });

  // Build location string
  const locationParts = [];
  if (location.state) locationParts.push(location.state);
  if (location.country) locationParts.push(location.country);

  if (locationParts.length > 0) {
    params.set('location', locationParts.join(', '));
  }

  // Build subtitle with art piece count
  if (location.artPieceCount) {
    const subtitle = `${location.artPieceCount} Art Piece${location.artPieceCount !== 1 ? 's' : ''}`;
    params.set('subtitle', subtitle);
  }

  const ogUrl = `${OG_API_BASE}?${params.toString()}`;

  debugLog('OGImageUtils.generateCityOGImage', 'Generated city OG image URL', {
    cityName: location.city,
    ogUrl,
  });

  return ogUrl;
}

/**
 * Generates OG image URL for homepage
 * @param {Object} [options={}] - Homepage options
 * @param {string} [options.title='City Art Walks'] - Page title
 * @param {string} [options.subtitle] - Page subtitle
 * @returns {string} OG image URL
 */
export function generateHomeOGImage(options = {}) {
  const params = new URLSearchParams({
    type: 'home',
    title: options.title || 'City Art Walks',
  });

  if (options.subtitle) {
    params.set('subtitle', options.subtitle);
  }

  const ogUrl = `${OG_API_BASE}?${params.toString()}`;

  debugLog('OGImageUtils.generateHomeOGImage', 'Generated home OG image URL', {
    ogUrl,
  });

  return ogUrl;
}

/**
 * Generates OG image URL for explore pages
 * @param {Object} location - Location data for explore page
 * @param {string} [location.country] - Country name
 * @param {string} [location.state] - State/region name
 * @param {string} [location.city] - City name
 * @param {number} [location.artPieceCount] - Number of art pieces
 * @returns {string} OG image URL
 */
export function generateExploreOGImage(location) {
  // Determine the primary location name for title
  const title = location.city || location.state || location.country || 'Explore Art';

  const params = new URLSearchParams({
    type: 'city',
    title: `Explore ${title}`,
  });

  // Build location breadcrumb
  const locationParts = [];
  if (location.city && location.state) locationParts.push(location.state);
  if (location.country) locationParts.push(location.country);

  if (locationParts.length > 0) {
    params.set('location', locationParts.join(', '));
  }

  // Add art piece count if available
  if (location.artPieceCount) {
    const subtitle = `${location.artPieceCount} Art Piece${location.artPieceCount !== 1 ? 's' : ''}`;
    params.set('subtitle', subtitle);
  }

  const ogUrl = `${OG_API_BASE}?${params.toString()}`;

  debugLog('OGImageUtils.generateExploreOGImage', 'Generated explore OG image URL', {
    locationTitle: title,
    ogUrl,
  });

  return ogUrl;
}

/**
 * Generates OG image URL for about us page
 * @param {Object} [options={}] - About page options
 * @param {string} [options.title='About Us'] - Page title
 * @param {string} [options.subtitle] - Page subtitle
 * @returns {string} OG image URL
 */
export function generateAboutOGImage(options = {}) {
  const params = new URLSearchParams({
    type: 'about',
    title: options.title || 'About Us',
  });

  if (options.subtitle) {
    params.set('subtitle', options.subtitle);
  }

  const ogUrl = `${OG_API_BASE}?${params.toString()}`;

  debugLog('OGImageUtils.generateAboutOGImage', 'Generated about OG image URL', {
    ogUrl,
  });

  return ogUrl;
}

/**
 * Generates OG image URL for browse/listing pages
 * @param {Object} [options={}] - Browse page options
 * @param {string} [options.title] - Page title
 * @param {string} [options.subtitle] - Page subtitle
 * @returns {string} OG image URL
 */
export function generateBrowseOGImage(options = {}) {
  const params = new URLSearchParams({
    type: 'browse',
    title: options.title || 'Browse Art',
  });

  if (options.subtitle) {
    params.set('subtitle', options.subtitle);
  }

  const ogUrl = `${OG_API_BASE}?${params.toString()}`;

  debugLog('OGImageUtils.generateBrowseOGImage', 'Generated browse OG image URL', {
    ogUrl,
  });

  return ogUrl;
}

/**
 * Generates OG image URL for contact us page
 * @param {Object} [options={}] - Contact page options
 * @param {string} [options.title='Contact Us'] - Page title
 * @param {string} [options.subtitle] - Page subtitle
 * @returns {string} OG image URL
 */
export function generateContactOGImage(options = {}) {
  const params = new URLSearchParams({
    type: 'contact',
    title: options.title || 'Contact Us',
  });

  if (options.subtitle) {
    params.set('subtitle', options.subtitle);
  }

  const ogUrl = `${OG_API_BASE}?${params.toString()}`;

  debugLog('OGImageUtils.generateContactOGImage', 'Generated contact OG image URL', {
    ogUrl,
  });

  return ogUrl;
}

/**
 * Generates OG image URL for FAQ/help pages
 * @param {Object} [options={}] - FAQ page options
 * @param {string} [options.title='Help & FAQs'] - Page title
 * @param {string} [options.subtitle] - Page subtitle
 * @returns {string} OG image URL
 */
export function generateFaqOGImage(options = {}) {
  const params = new URLSearchParams({
    type: 'contact',
    title: options.title || 'Help & FAQs',
  });

  if (options.subtitle) {
    params.set('subtitle', options.subtitle);
  } else {
    params.set('subtitle', 'Get Answers & Support');
  }

  const ogUrl = `${OG_API_BASE}?${params.toString()}`;

  debugLog('OGImageUtils.generateFaqOGImage', 'Generated FAQ OG image URL', {
    ogUrl,
  });

  return ogUrl;
}

/**
 * Generates OG image URL for path pages
 * @param {Object} path - Path data
 * @param {string} path.title - Path title
 * @param {string} [path.description] - Path description
 * @param {string} [path.location] - Path location
 * @param {number} [path.artPieceCount] - Number of art pieces in path
 * @returns {string} OG image URL
 */
export function generatePathOGImage(path) {
  const params = new URLSearchParams({
    type: 'browse',
    title: path.title || 'Art Walking Path',
  });

  if (path.location) {
    params.set(
      'subtitle',
      `${path.location}${path.artPieceCount ? ` • ${path.artPieceCount} stops` : ''}`
    );
  } else if (path.artPieceCount) {
    params.set('subtitle', `${path.artPieceCount} Art Piece${path.artPieceCount !== 1 ? 's' : ''}`);
  } else if (path.description) {
    // Truncate description for subtitle
    const descExcerpt =
      path.description.length > 100 ? `${path.description.substring(0, 100)}...` : path.description;
    params.set('subtitle', descExcerpt);
  }

  const ogUrl = `${OG_API_BASE}?${params.toString()}`;

  debugLog('OGImageUtils.generatePathOGImage', 'Generated path OG image URL', {
    pathTitle: path.title,
    ogUrl,
  });

  return ogUrl;
}

/**
 * Generates OG image URL for privacy policy page
 * @param {Object} [options={}] - Privacy policy page options
 * @param {string} [options.title='Privacy Policy'] - Page title
 * @param {string} [options.subtitle] - Page subtitle
 * @returns {string} OG image URL
 */
export function generatePrivacyOGImage(options = {}) {
  const params = new URLSearchParams({
    type: 'contact',
    title: options.title || 'Privacy Policy',
  });

  if (options.subtitle) {
    params.set('subtitle', options.subtitle);
  } else {
    params.set('subtitle', 'Your Privacy Matters');
  }

  const ogUrl = `${OG_API_BASE}?${params.toString()}`;

  debugLog('OGImageUtils.generatePrivacyOGImage', 'Generated privacy policy OG image URL', {
    ogUrl,
  });

  return ogUrl;
}

/**
 * Generates OG image URL for terms of service page
 * @param {Object} [options={}] - Terms of service page options
 * @param {string} [options.title='Terms of Service'] - Page title
 * @param {string} [options.subtitle] - Page subtitle
 * @returns {string} OG image URL
 */
export function generateTermsOGImage(options = {}) {
  const params = new URLSearchParams({
    type: 'contact',
    title: options.title || 'Terms of Service',
  });

  if (options.subtitle) {
    params.set('subtitle', options.subtitle);
  } else {
    params.set('subtitle', 'Terms & Conditions');
  }

  const ogUrl = `${OG_API_BASE}?${params.toString()}`;

  debugLog('OGImageUtils.generateTermsOGImage', 'Generated terms of service OG image URL', {
    ogUrl,
  });

  return ogUrl;
}

/**
 * Generates OG image URL for post/blog pages
 * @param {Object} post - Post data
 * @param {string} post.title - Post title
 * @param {string} [post.authorName] - Author name
 * @param {string} [post.category] - Post category
 * @param {string} [post.featuredImage] - Post featured image URL
 * @returns {string} OG image URL
 */
export function generatePostOGImage(post) {
  const params = new URLSearchParams({
    type: 'post',
    title: post.title || 'Blog Post',
  });

  if (post.authorName) {
    params.set('subtitle', `by ${post.authorName}`);
  } else if (post.category) {
    params.set('subtitle', post.category);
  }

  if (post.featuredImage) {
    params.set('image', post.featuredImage);
  }

  const ogUrl = `${OG_API_BASE}?${params.toString()}`;

  debugLog('OGImageUtils.generatePostOGImage', 'Generated post OG image URL', {
    postTitle: post.title,
    ogUrl,
  });

  return ogUrl;
}

/**
 * Generates default OG image URL with fallback values
 * @param {Object} [options={}] - Default options
 * @param {string} [options.title] - Override title
 * @param {string} [options.subtitle] - Override subtitle
 * @returns {string} OG image URL
 */
export function generateDefaultOGImage(options = {}) {
  return generateHomeOGImage({
    title: options.title || 'City Art Walks',
    subtitle: options.subtitle || 'Discover Public Art Around the World',
  });
}
