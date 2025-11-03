/**
 * SEO Metadata Generation Utilities for City Art Walks
 *
 * This module provides comprehensive utilities for generating consistent, SEO-optimized
 * metadata across all page types in the City Art Walks application. It includes support
 * for Open Graph tags, Twitter Cards, structured data, and dynamic image generation.
 *
 * Features: * - Static metadata for browse/list pages
 * - Dynamic metadata for detail pages with entity-specific data
 * - Fallback metadata for error cases and missing content
 * - Social media optimization with Open Graph and Twitter Card support
 * - Automatic Open Graph image generation for enhanced social sharing
 * - Local SEO optimization for location-based content
 *
 * @fileoverview Comprehensive SEO metadata generation utilities with Open Graph support
 * @version 1.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Utils.Metadata
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SEO-Metadata-Generation|SEO Metadata Generation Strategy}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Page-Component-Standards|Page Component Standards}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Global-Config|Global Config Documentation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Debug|Debug Documentation}
 */

import { debugLog } from 'src/lib/debug';
import { CONFIG } from 'src/global-config';

import {
  generateFaqOGImage,
  generateCityOGImage,
  generateHomeOGImage,
  generatePathOGImage,
  generatePostOGImage,
  generateAboutOGImage,
  generateTermsOGImage,
  generateArtistOGImage,
  generateBrowseOGImage,
  generateContactOGImage,
  generateDefaultOGImage,
  generateExploreOGImage,
  generatePrivacyOGImage,
  generateArtPieceOGImage,
} from './og-image';

/**
 * Base metadata configuration shared across all page types.
 *
 * Provides consistent SEO and social media configuration that is merged
 * with page-specific metadata to ensure uniform branding and optimization
 * across the entire City Art Walks application.
 *
 * @memberof CityArtWalks.Utils.Metadata
 * @constant {Object} BASE_METADATA
 * @property {string} robots - Search engine indexing directives
 * @property {string} creator - Content creator attribution
 * @property {string} publisher - Content publisher attribution
 * @property {string} category - Overall content category for classification
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SEO-Metadata-Generation#base-metadata-configuration|Base Metadata Configuration}
 */
const BASE_METADATA = {
  robots: 'index, follow',
  creator: 'City Art Walks',
  publisher: 'City Art Walks',
  category: 'Art & Culture',
};

/**
 * Generates comprehensive SEO metadata for individual art piece detail pages.
 *
 * Creates optimized metadata including dynamic titles with artist attribution,
 * descriptive content for social sharing, comprehensive keyword generation,
 * and automatic Open Graph image creation for enhanced social media visibility.
 *
 * Features: * - Dynamic title generation with art piece and artist names
 * - Automatic description generation with location context
 * - Comprehensive keyword extraction from art piece data
 * - Custom Open Graph image generation for social sharing
 * - Twitter Card optimization for enhanced social presence
 * - Structured data support for rich search results
 *
 * @memberof CityArtWalks.Utils.Metadata
 * @function generateArtPieceMetadata
 * @param {Object} artPiece - Art piece data object
 * @param {string} artPiece.title - Art piece title for metadata generation
 * @param {string} [artPiece.description] - Art piece description (HTML will be stripped)
 * @param {string} [artPiece.artistName] - Artist name for attribution and SEO
 * @param {string} [artPiece.location] - Location string for local SEO optimization
 * @param {string} [artPiece.imageUrl] - Art piece image URL for social media
 * @param {string[]} [artPiece.tags] - Art piece tags for keyword generation
 * @returns {Object} Complete Next.js metadata object with SEO and social optimization
 *
 * @example
 * // Generate metadata for a street art piece
 * const metadata = generateArtPieceMetadata({
 *   title: "Girl with Balloon",
 *   description: "A powerful piece depicting hope and innocence...",
 *   artistName: "Banksy",
 *   location: "London, England, United Kingdom",
 *   imageUrl: "https://example.com/girl-with-balloon.jpg",
 *   tags: ["street art", "stencil", "political art"]
 * });
 *
 * @example
 * // Generated metadata structure
 * {
 *   title: "Girl with Balloon by Banksy - City Art Walks",
 *   description: "A powerful piece depicting hope and innocence...",
 *   keywords: "Girl with Balloon, Banksy, City Art Walks, public art...",
 *   openGraph: { title, description, images: [...] },
 *   twitter: { card: "summary_large_image", title, description, images: [...] }
 * }
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SEO-Metadata-Generation#art-piece-metadata|Art Piece Metadata Strategy}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model|ArtPiece Data Model}
 */
export function generateArtPieceMetadata(artPiece) {
  const title = artPiece.title
    ? `${artPiece.title}${artPiece.artistName ? ` by ${artPiece.artistName}` : ''} - ${CONFIG.appName}`
    : `Art Piece - ${CONFIG.appName}`;

  const description =
    artPiece.description ||
    `Discover ${artPiece.title}${artPiece.artistName ? ` by ${artPiece.artistName}` : ''} in ${artPiece.location || 'the city'}. Explore public art with City Art Walks.`;

  // Build keywords
  const keywords = [
    artPiece.title,
    artPiece.artistName,
    'City Art Walks',
    'public art',
    'street art',
    'art piece',
    'art walk',
    artPiece.location,
    ...(artPiece.tags || []),
  ]
    .filter(Boolean)
    .join(', ');

  // Generate OG image
  const ogImageUrl = generateArtPieceOGImage({
    title: artPiece.title,
    artistName: artPiece.artistName,
    location: artPiece.location,
    image: artPiece.imageUrl,
  });

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    openGraph: {
      type: 'article',
      title: artPiece.title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${artPiece.title}${artPiece.artistName ? ` by ${artPiece.artistName}` : ''}`,
        },
        ...(artPiece.imageUrl
          ? [
              {
                url: artPiece.imageUrl,
                alt: artPiece.title,
              },
            ]
          : []),
      ],
      siteName: 'City Art Walks',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: artPiece.title,
      description,
      images: [ogImageUrl],
      creator: '@cityartwalks',
      site: '@cityartwalks',
    },
  };
}

/**
 * Generates comprehensive SEO metadata for individual blog post and content pages.
 *
 * Creates optimized metadata for post detail pages including content descriptions,
 * author attribution, category organization, and social media sharing enhancements
 * with automatically generated Open Graph images. Supports both custom meta fields
 * and automatic generation from post content.
 *
 * Features: * - Dynamic title generation with custom metaTitle support
 * - Rich description from metaDescription or excerpt with fallback
 * - Author attribution for content credibility and authority
 * - Category-based keyword organization and SEO enhancement
 * - Tag integration for comprehensive topic coverage
 * - Custom Open Graph image creation for social media sharing
 * - Publication date optimization for content freshness signals
 * - Featured image integration for visual social media presence
 *
 * @memberof CityArtWalks.Utils.Metadata
 * @function generatePostMetadata
 * @param {Object} post - Post data object
 * @param {string} [post.title] - Post title for metadata generation
 * @param {string} [post.metaTitle] - Custom SEO title override
 * @param {string} [post.metaDescription] - Custom SEO description
 * @param {string} [post.excerpt] - Post excerpt for description fallback
 * @param {string} [post.content] - Post content for description extraction
 * @param {Object} [post.author] - Author information object
 * @param {string} [post.author.name] - Author display name
 * @param {string} [post.category] - Post category for organization
 * @param {string[]} [post.tags] - Post tags array for keyword generation
 * @param {string} [post.featuredImage] - Featured image URL for social media
 * @param {Date} [post.publishedAt] - Publication date for freshness signals
 * @param {string} [post.slug] - Post slug for canonical URL generation
 * @returns {Object} Complete Next.js metadata object with SEO and social optimization
 *
 * @example
 * // Generate metadata for a blog post with custom meta fields
 * const metadata = generatePostMetadata({
 *   title: "The Future of Street Art in Urban Planning",
 *   metaTitle: "Future of Street Art | Urban Planning Guide",
 *   metaDescription: "Explore how street art is transforming urban spaces...",
 *   author: { name: "Jane Smith" },
 *   category: "Urban Planning",
 *   tags: ["street art", "urban planning", "public space"],
 *   featuredImage: "https://example.com/street-art-future.jpg",
 *   publishedAt: new Date("2024-01-15")
 * });
 *
 * @example
 * // Generated metadata structure with automatic fallbacks
 * {
 *   title: "Future of Street Art | Urban Planning Guide - City Art Walks",
 *   description: "Explore how street art is transforming urban spaces...",
 *   keywords: "Future of Street Art, Jane Smith, Urban Planning, City Art Walks...",
 *   openGraph: { title, description, images: [...], type: "article" },
 *   twitter: { card: "summary_large_image", title, description, images: [...] }
 * }
 *
 * @example
 * // Automatic description generation from content
 * const postWithoutMeta = {
 *   title: "Art Walk Guide",
 *   content: "Join us for an amazing art walk through downtown...",
 *   author: { name: "Art Guide Team" }
 * };
 * // Automatically extracts description from content and generates keywords
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SEO-Metadata-Generation#post-metadata|Post Metadata Strategy}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Post|Post Data Model}
 */
export function generatePostMetadata(post) {
  // Use custom metaTitle or fallback to post title
  const title = post.metaTitle
    ? `${post.metaTitle} - ${CONFIG.appName}`
    : post.title
      ? `${post.title} - ${CONFIG.appName}`
      : `Blog Post - ${CONFIG.appName}`;

  // Use custom metaDescription, excerpt, or extract from content
  let description = post.metaDescription;
  if (!description && post.excerpt) {
    description = post.excerpt;
  }
  if (!description && post.content) {
    // Extract first 150 characters from content, removing HTML
    description = post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  }
  if (!description) {
    description = `Read this ${post.category || 'blog post'} on City Art Walks${post.author?.name ? ` by ${post.author.name}` : ''}.`;
  }

  // Build comprehensive keywords
  const keywords = [
    post.title,
    post.author?.name,
    post.category,
    'City Art Walks',
    'blog',
    'public art',
    'art walk',
    'street art',
    ...(post.tags || []),
  ]
    .filter(Boolean)
    .join(', ');

  // Generate OG image with post data
  const ogImageUrl = generatePostOGImage({
    title: post.title,
    authorName: post.author?.name,
    category: post.category,
    featuredImage: post.featuredImage,
  });

  debugLog('MetadataUtils.generatePostMetadata', 'Generated post metadata', {
    title: post.title,
    hasCustomMeta: !!(post.metaTitle || post.metaDescription),
    authorName: post.author?.name,
    category: post.category,
    ogImageUrl,
  });

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    openGraph: {
      type: 'article',
      title: post.metaTitle || post.title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${post.title}${post.author?.name ? ` by ${post.author.name}` : ''}`,
        },
        ...(post.featuredImage
          ? [
              {
                url: post.featuredImage,
                alt: post.title,
              },
            ]
          : []),
      ],
      siteName: 'City Art Walks',
      locale: 'en_US',
      ...(post.publishedAt && {
        publishedTime:
          post.publishedAt instanceof Date ? post.publishedAt.toISOString() : post.publishedAt,
      }),
      ...(post.author?.name && {
        authors: [post.author.name],
      }),
      ...(post.category && {
        section: post.category,
      }),
      ...(post.tags &&
        post.tags.length > 0 && {
          tags: post.tags,
        }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description,
      images: [ogImageUrl],
      creator: '@cityartwalks',
      site: '@cityartwalks',
    },
  };
}

/**
 * Generates comprehensive SEO metadata for individual artist profile pages.
 *
 * Creates optimized metadata for artist detail pages including biographical content,
 * portfolio information, location-based SEO optimization, and social media sharing
 * enhancements with automatically generated Open Graph images.
 *
 * Features: * - Dynamic title generation with artist name and professional context
 * - Biography-based descriptions with portfolio statistics
 * - Location-aware SEO optimization for local artist discovery
 * - Comprehensive keyword generation from artist data and specialties
 * - Custom Open Graph image creation for professional social sharing
 * - Portfolio count integration for rich snippet enhancement
 *
 * @memberof CityArtWalks.Utils.Metadata
 * @function generateArtistMetadata
 * @param {Object} artist - Artist data object
 * @param {string} artist.name - Artist name for title and attribution
 * @param {string} [artist.biography] - Artist biography (HTML will be stripped for meta description)
 * @param {string} [artist.location] - Artist location for local SEO optimization
 * @param {string} [artist.imageUrl] - Artist profile image URL for social media
 * @param {string[]} [artist.tags] - Artist tags and specialties for keyword generation
 * @param {number} [artist.artPieceCount] - Number of art pieces for portfolio statistics
 * @returns {Object} Complete Next.js metadata object with SEO and social optimization
 *
 * @example
 * // Generate metadata for a street artist profile
 * const metadata = generateArtistMetadata({
 *   name: "Banksy",
 *   biography: "Renowned street artist known for provocative stencils...",
 *   location: "United Kingdom",
 *   imageUrl: "https://example.com/banksy-profile.jpg",
 *   tags: ["street art", "stencil", "political art"],
 *   artPieceCount: 42
 * });
 *
 * @example
 * // Generated metadata structure
 * {
 *   title: "Banksy - Artist Profile - City Art Walks",
 *   description: "Renowned street artist known for provocative stencils...",
 *   keywords: "Banksy, City Art Walks, artist, public art, street art...",
 *   openGraph: { type: "profile", title, description, images: [...] },
 *   twitter: { card: "summary_large_image", title, description, images: [...] }
 * }
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SEO-Metadata-Generation#artist-metadata|Artist Metadata Strategy}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist-Model|Artist Data Model}
 */
export function generateArtistMetadata(artist) {
  const title = artist.name
    ? `${artist.name} - Artist Profile - ${CONFIG.appName}`
    : `Artist Profile - ${CONFIG.appName}`;

  const description =
    artist.biography ||
    `Discover the work of ${artist.name || 'this artist'}${artist.location ? ` based in ${artist.location}` : ''}. ${artist.artPieceCount ? `View ${artist.artPieceCount} art pieces` : 'Explore their public art'} with City Art Walks.`;

  // Build keywords
  const keywords = [
    artist.name,
    'City Art Walks',
    'artist',
    'public art',
    'street art',
    'art collection',
    'artist profile',
    artist.location,
    ...(artist.tags || []),
  ]
    .filter(Boolean)
    .join(', ');

  // Generate OG image
  const ogImageUrl = generateArtistOGImage({
    name: artist.name,
    bio: artist.biography,
    location: artist.location,
  });

  debugLog('MetadataUtils.generateArtistMetadata', 'Generated artist metadata', {
    name: artist.name,
    ogImageUrl,
  });

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    openGraph: {
      type: 'profile',
      title: artist.name,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${artist.name} - Artist Profile`,
        },
        ...(artist.imageUrl
          ? [
              {
                url: artist.imageUrl,
                alt: artist.name,
              },
            ]
          : []),
      ],
      siteName: 'City Art Walks',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: artist.name,
      description,
      images: [ogImageUrl],
      creator: '@cityartwalks',
      site: '@cityartwalks',
    },
  };
}

/**
 * Generates metadata for city/location pages
 * @param {Object} location - Location data
 * @param {string} location.city - City name
 * @param {string} [location.state] - State/region name
 * @param {string} [location.country] - Country name
 * @param {string} [location.description] - Location description
 * @param {number} [location.artPieceCount] - Number of art pieces
 * @param {number} [location.artistCount] - Number of artists
 * @returns {Object} Next.js metadata object
 */
export function generateCityMetadata(location) {
  const locationName = buildLocationName(location);
  const title = `${locationName} - Explore Public Art - ${CONFIG.appName}`;

  const description =
    location.description ||
    `Discover public art in ${locationName}. ${location.artPieceCount ? `Explore ${location.artPieceCount} art pieces` : 'Find street art and sculptures'}${location.artistCount ? ` by ${location.artistCount} artists` : ''} with City Art Walks.`;

  // Build keywords
  const keywords = [
    location.city,
    location.state,
    location.country,
    'City Art Walks',
    'public art',
    'street art',
    'art walk',
    'city guide',
    'art map',
    'explore art',
  ]
    .filter(Boolean)
    .join(', ');

  // Generate OG image
  const ogImageUrl = generateCityOGImage(location);

  debugLog('MetadataUtils.generateCityMetadata', 'Generated city metadata', {
    locationName,
    ogImageUrl,
  });

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    openGraph: {
      type: 'website',
      title: `${locationName} Public Art`,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Public Art in ${locationName}`,
        },
      ],
      siteName: 'City Art Walks',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${locationName} Public Art`,
      description,
      images: [ogImageUrl],
      creator: '@cityartwalks',
      site: '@cityartwalks',
    },
  };
}

/**
 * Generates metadata for explore pages
 * @param {Object} location - Location data for explore page
 * @param {string} [location.country] - Country name
 * @param {string} [location.state] - State/region name
 * @param {string} [location.city] - City name
 * @param {number} [location.artPieceCount] - Number of art pieces
 * @param {number} [location.artistCount] - Number of artists
 * @returns {Object} Next.js metadata object
 */
export function generateExploreMetadata(location) {
  const locationName = buildLocationName(location);
  const title = `Explore Public Art${locationName ? ` in ${locationName}` : ''} - ${CONFIG.appName}`;

  const description = `Explore public art${locationName ? ` in ${locationName}` : ' around the world'}. ${location.artPieceCount ? `Discover ${location.artPieceCount} art pieces` : 'Find street art, murals, and sculptures'}${location.artistCount ? ` by ${location.artistCount} artists` : ''} with City Art Walks.`;

  // Build keywords
  const keywords = [
    location.city,
    location.state,
    location.country,
    'City Art Walks',
    'explore art',
    'public art',
    'street art',
    'art discovery',
    'art map',
    'art walk',
  ]
    .filter(Boolean)
    .join(', ');

  // Generate OG image
  const ogImageUrl = generateExploreOGImage(location);

  debugLog('MetadataUtils.generateExploreMetadata', 'Generated explore metadata', {
    locationName,
    ogImageUrl,
  });

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    openGraph: {
      type: 'website',
      title: `Explore Public Art${locationName ? ` in ${locationName}` : ''}`,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Explore Public Art${locationName ? ` in ${locationName}` : ''}`,
        },
      ],
      siteName: 'City Art Walks',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Explore Public Art${locationName ? ` in ${locationName}` : ''}`,
      description,
      images: [ogImageUrl],
      creator: '@cityartwalks',
      site: '@cityartwalks',
    },
  };
}

/**
 * Generates metadata for homepage
 * @param {Object} [options={}] - Homepage options
 * @param {string} [options.title] - Custom title
 * @param {string} [options.description] - Custom description
 * @param {number} [options.totalArtPieces] - Total art pieces count
 * @param {number} [options.totalCities] - Total cities count
 * @returns {Object} Next.js metadata object
 */
export function generateHomeMetadata(options = {}) {
  const title = options.title || `${CONFIG.appName} - Discover Public Art Around the World`;

  const description =
    options.description ||
    `Discover and explore public art around the world with City Art Walks. ${options.totalArtPieces ? `Browse ${options.totalArtPieces.toLocaleString()} art pieces` : 'Find street art, murals, and sculptures'}${options.totalCities ? ` across ${options.totalCities.toLocaleString()} cities` : ''}.`;

  const keywords = [
    'City Art Walks',
    'public art',
    'street art',
    'art discovery',
    'art map',
    'art walk',
    'murals',
    'sculptures',
    'urban art',
    'art tourism',
  ].join(', ');

  // Generate OG image
  const ogImageUrl = generateHomeOGImage({
    title: 'City Art Walks',
    subtitle: 'Discover Public Art Around the World',
  });

  debugLog('MetadataUtils.generateHomeMetadata', 'Generated home metadata', {
    ogImageUrl,
  });

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    openGraph: {
      type: 'website',
      title: 'City Art Walks',
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'City Art Walks - Discover Public Art Around the World',
        },
      ],
      siteName: 'City Art Walks',
      locale: 'en_US',
      url: CONFIG.serverUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'City Art Walks',
      description,
      images: [ogImageUrl],
      creator: '@cityartwalks',
      site: '@cityartwalks',
    },
  };
}

/**
 * Generates SEO-optimized metadata for browse and listing pages.
 *
 * Creates consistent metadata for collection pages including art pieces, artists,
 * and other entity listings. Provides optimized titles, descriptions, and social
 * media content with automatically generated Open Graph images for enhanced
 * discoverability and user engagement.
 *
 * Features: * - Configurable titles and descriptions for different browse contexts
 * - Category-specific keyword generation for improved SEO
 * - Custom Open Graph image generation with category branding
 * - Consistent social media optimization across all browse pages
 * - Flexible configuration for different entity types and collections
 *
 * @memberof CityArtWalks.Utils.Metadata
 * @function generateBrowseMetadata
 * @param {Object} [options={}] - Browse page configuration options
 * @param {string} [options.title] - Custom page title (defaults to "Browse Art - City Art Walks")
 * @param {string} [options.description] - Custom meta description for SEO optimization
 * @param {string} [options.subtitle] - Custom subtitle for Open Graph image generation
 * @param {string} [options.category] - Content category for keywords and branding (e.g., 'Art Pieces', 'Artists')
 * @returns {Object} Complete Next.js metadata object with SEO and social optimization
 *
 * @example
 * // Generate metadata for art pieces browse page
 * const metadata = generateBrowseMetadata({
 *   title: 'Art Pieces - City Art Walks',
 *   description: 'Browse and discover stunning public art pieces in your city...',
 *   category: 'Art Pieces',
 *   subtitle: 'Discover Stunning Public Art'
 * });
 *
 * @example
 * // Generate metadata for artists browse page
 * const metadata = generateBrowseMetadata({
 *   title: 'Artists - City Art Walks',
 *   description: 'Discover talented artists and their profiles...',
 *   category: 'Artists',
 *   subtitle: 'Discover Talented Artists'
 * });
 *
 * @example
 * // Generated metadata structure
 * {
 *   title: "Art Pieces - City Art Walks",
 *   description: "Browse and discover stunning public art pieces...",
 *   keywords: "City Art Walks, browse art, Art Pieces, public art...",
 *   openGraph: { type: "website", title, description, images: [...] },
 *   twitter: { card: "summary_large_image", title, description, images: [...] }
 * }
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SEO-Metadata-Generation#browse-page-metadata|Browse Page Metadata Strategy}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Page-Component-Standards|Page Component Standards}
 */
export function generateBrowseMetadata(options = {}) {
  const title = options.title || `Browse Art - ${CONFIG.appName}`;
  const description =
    options.description ||
    'Browse and discover stunning public art pieces, talented artists, and inspiring locations. Explore detailed artwork information and artist profiles with City Art Walks.';

  const keywords = [
    'City Art Walks',
    'browse art',
    'art gallery',
    'public art',
    'art discovery',
    'art collection',
    'street art',
    'murals',
    'sculptures',
    options.category,
  ]
    .filter(Boolean)
    .join(', ');

  // Generate OG image
  const ogImageUrl = generateBrowseOGImage({
    title: options.category || 'Browse Art',
    subtitle: options.subtitle || 'Discover Amazing Public Art',
  });

  debugLog('MetadataUtils.generateBrowseMetadata', 'Generated browse metadata', {
    ogImageUrl,
  });

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    openGraph: {
      type: 'website',
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'City Art Walks',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@cityartwalks',
      site: '@cityartwalks',
    },
  };
}

/**
 * Generates metadata for contact us page
 * @param {Object} [options={}] - Contact page options
 * @param {string} [options.title] - Custom title
 * @param {string} [options.description] - Custom description
 * @param {string} [options.subtitle] - Custom subtitle for OG image
 * @returns {Object} Next.js metadata object
 */
export function generateContactMetadata(options = {}) {
  const title = options.title || `Contact Us - ${CONFIG.appName}`;
  const description =
    options.description ||
    'Get in touch with City Art Walks. Contact us for support, partnerships, suggestions, or questions about public art and art walks in your city.';

  const keywords = [
    'City Art Walks',
    'contact us',
    'support',
    'partnerships',
    'feedback',
    'customer service',
    'inquiries',
    'art walks',
    'public art',
    'help',
  ].join(', ');

  // Generate OG image
  const ogImageUrl = generateContactOGImage({
    title: 'Contact Us',
    subtitle: options.subtitle || 'Get in Touch with Us',
  });

  debugLog('MetadataUtils.generateContactMetadata', 'Generated contact metadata', {
    ogImageUrl,
  });

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    openGraph: {
      type: 'website',
      title: 'Contact Us - City Art Walks',
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Contact Us - City Art Walks',
        },
      ],
      siteName: 'City Art Walks',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Contact Us - City Art Walks',
      description,
      images: [ogImageUrl],
      creator: '@cityartwalks',
      site: '@cityartwalks',
    },
  };
}

/**
 * Generates metadata for about us page
 * @param {Object} [options={}] - About page options
 * @param {string} [options.title] - Custom title
 * @param {string} [options.description] - Custom description
 * @param {string} [options.subtitle] - Custom subtitle for OG image
 * @returns {Object} Next.js metadata object
 */
export function generateAboutMetadata(options = {}) {
  const title = options.title || `About Us - ${CONFIG.appName}`;
  const description =
    options.description ||
    'Learn about the founders and mission behind City Art Walks. Discover how we connect communities with public art and support local artists worldwide.';

  const keywords = [
    'City Art Walks',
    'about us',
    'founders',
    'mission',
    'public art',
    'community',
    'local artists',
    'art tourism',
  ].join(', ');

  // Generate OG image
  const ogImageUrl = generateAboutOGImage({
    title: 'About Us',
    subtitle: options.subtitle || 'Meet the Team Behind City Art Walks',
  });

  debugLog('MetadataUtils.generateAboutMetadata', 'Generated about metadata', {
    ogImageUrl,
  });

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    openGraph: {
      type: 'website',
      title: 'About Us - City Art Walks',
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'About Us - City Art Walks',
        },
      ],
      siteName: 'City Art Walks',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About Us - City Art Walks',
      description,
      images: [ogImageUrl],
      creator: '@cityartwalks',
      site: '@cityartwalks',
    },
  };
}

/**
 * Generates default fallback metadata for error cases and missing content.
 *
 * Provides comprehensive fallback metadata when specific entity data is unavailable,
 * ensuring that all pages remain discoverable and maintain consistent branding
 * even in error conditions. Essential for graceful degradation and SEO maintenance.
 *
 * Features: * - Graceful fallback for missing or failed data requests
 * - Consistent branding and messaging across error states
 * - Generic but descriptive content that maintains SEO value
 * - Automatic Open Graph image generation for error pages
 * - Configurable titles and descriptions for different error contexts
 *
 * @memberof CityArtWalks.Utils.Metadata
 * @function generateDefaultMetadata
 * @param {Object} [options={}] - Default metadata configuration options
 * @param {string} [options.title] - Override title for specific error contexts
 * @param {string} [options.description] - Override description for specific scenarios
 * @returns {Object} Complete Next.js metadata object with fallback SEO optimization
 *
 * @example
 * // Generate default metadata for missing artist
 * const metadata = generateDefaultMetadata({
 *   title: `Artist Details - ${CONFIG.appName}`,
 *   description: 'Artist details and art collection.'
 * });
 *
 * @example
 * // Generate default metadata for missing art piece
 * const metadata = generateDefaultMetadata({
 *   title: `Art Piece Details - ${CONFIG.appName}`,
 *   description: 'Discover this art piece and its story with City Art Walks.'
 * });
 *
 * @example
 * // Generated metadata structure
 * {
 *   title: "Artist Details - City Art Walks",
 *   description: "Artist details and art collection.",
 *   keywords: "City Art Walks, public art, street art, art discovery",
 *   openGraph: { type: "website", title, description, images: [...] },
 *   twitter: { card: "summary_large_image", title, description, images: [...] }
 * }
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SEO-Metadata-Generation#fallback-metadata|Fallback Metadata Strategy}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Dynamic-Routing#error-handling|Error Handling in Dynamic Routes}
 */
export function generateDefaultMetadata(options = {}) {
  const title = options.title || `${CONFIG.appName} - Discover Public Art`;
  const description =
    options.description ||
    'Discover public art around the world with City Art Walks. Explore street art, murals, and sculptures in your city and beyond.';

  const keywords = ['City Art Walks', 'public art', 'street art', 'art discovery'].join(', ');

  // Generate OG image
  const ogImageUrl = generateDefaultOGImage({
    title: options.title,
    subtitle: options.description,
  });

  debugLog('MetadataUtils.generateDefaultMetadata', 'Generated default metadata', {
    ogImageUrl,
  });

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    openGraph: {
      type: 'website',
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'City Art Walks',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@cityartwalks',
      site: '@cityartwalks',
    },
  };
}

/**
 * Generates metadata for FAQ/help pages
 * @param {Object} [options={}] - FAQ page options
 * @param {string} [options.title] - Custom title
 * @param {string} [options.description] - Custom description
 * @param {string} [options.subtitle] - Custom subtitle for OG image
 * @returns {Object} Next.js metadata object
 */
export function generateFaqMetadata(options = {}) {
  const title = options.title || `Help & FAQs - ${CONFIG.appName}`;
  const description =
    options.description ||
    'Get answers to frequently asked questions about City Art Walks. Find help with exploring art, creating paths, using maps, and discovering public art in your city.';

  const keywords = [
    'City Art Walks',
    'help',
    'FAQ',
    'frequently asked questions',
    'support',
    'guide',
    'how to use',
    'public art',
    'art exploration',
    'walking paths',
    'art maps',
  ].join(', ');

  // Generate OG image
  const ogImageUrl = generateFaqOGImage({
    title: 'Help & FAQs',
    subtitle: options.subtitle || 'Get Answers & Support',
  });

  debugLog('MetadataUtils.generateFaqMetadata', 'Generated FAQ metadata', {
    ogImageUrl,
  });

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    openGraph: {
      type: 'website',
      title: 'Help & FAQs - City Art Walks',
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Help & FAQs - City Art Walks',
        },
      ],
      siteName: 'City Art Walks',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Help & FAQs - City Art Walks',
      description,
      images: [ogImageUrl],
      creator: '@cityartwalks',
      site: '@cityartwalks',
    },
  };
}

/**
 * Generates metadata for path pages
 * @param {Object} path - Path data
 * @param {string} path.title - Path title
 * @param {string} [path.description] - Path description
 * @param {string} [path.location] - Path location
 * @param {number} [path.artPieceCount] - Number of art pieces in path
 * @param {string} [path.pathType] - Path type
 * @param {string} [path.createdBy] - Path creator
 * @returns {Object} Next.js metadata object
 */
export function generatePathMetadata(path) {
  const title = path.title
    ? `${path.title} - Art Walking Path - ${CONFIG.appName}`
    : `Art Walking Path - ${CONFIG.appName}`;

  const description =
    path.description ||
    `Explore ${path.title || 'this curated art walking path'}${path.location ? ` in ${path.location}` : ''}. ${path.artPieceCount ? `Discover ${path.artPieceCount} art pieces` : 'Discover public art'} along this guided route with City Art Walks.`;

  // Build keywords
  const keywords = [
    path.title,
    'City Art Walks',
    'art walking path',
    'art route',
    'art tour',
    'public art',
    'walking tour',
    'art guide',
    path.location,
    path.pathType,
    path.createdBy,
  ]
    .filter(Boolean)
    .join(', ');

  // Generate OG image
  const ogImageUrl = generatePathOGImage({
    title: path.title,
    description: path.description,
    location: path.location,
    artPieceCount: path.artPieceCount,
  });

  debugLog('MetadataUtils.generatePathMetadata', 'Generated path metadata', {
    title: path.title,
    ogImageUrl,
  });

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    openGraph: {
      type: 'article',
      title: path.title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${path.title} - Art Walking Path`,
        },
      ],
      siteName: 'City Art Walks',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: path.title,
      description,
      images: [ogImageUrl],
      creator: '@cityartwalks',
      site: '@cityartwalks',
    },
  };
}

/**
 * Generates metadata for privacy policy page
 * @param {Object} [options={}] - Privacy policy page options
 * @param {string} [options.title] - Custom title
 * @param {string} [options.description] - Custom description
 * @param {string} [options.subtitle] - Custom subtitle for OG image
 * @returns {Object} Next.js metadata object
 */
export function generatePrivacyMetadata(options = {}) {
  const title = options.title || `Privacy Policy - ${CONFIG.appName}`;
  const description =
    options.description ||
    'Learn about how City Art Walks collects, uses, and protects your personal information. Read our comprehensive privacy policy to understand your rights and our data practices.';

  const keywords = [
    'City Art Walks',
    'privacy policy',
    'data protection',
    'personal information',
    'privacy rights',
    'data collection',
    'user privacy',
    'terms of service',
  ].join(', ');

  // Generate OG image
  const ogImageUrl = generatePrivacyOGImage({
    title: 'Privacy Policy',
    subtitle: options.subtitle || 'Your Privacy Matters',
  });

  debugLog('MetadataUtils.generatePrivacyMetadata', 'Generated privacy policy metadata', {
    ogImageUrl,
  });

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    openGraph: {
      type: 'website',
      title: 'Privacy Policy - City Art Walks',
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Privacy Policy - City Art Walks',
        },
      ],
      siteName: 'City Art Walks',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Privacy Policy - City Art Walks',
      description,
      images: [ogImageUrl],
      creator: '@cityartwalks',
      site: '@cityartwalks',
    },
  };
}

/**
 * Generates metadata for terms of service page
 * @param {Object} [options={}] - Terms of service page options
 * @param {string} [options.title] - Custom title
 * @param {string} [options.description] - Custom description
 * @param {string} [options.subtitle] - Custom subtitle for OG image
 * @returns {Object} Next.js metadata object
 */
export function generateTermsMetadata(options = {}) {
  const title = options.title || `Terms of Service - ${CONFIG.appName}`;
  const description =
    options.description ||
    'Read the Terms of Service for City Art Walks. Understand your rights, responsibilities, and the guidelines for using our platform to explore public art and cultural experiences.';

  const keywords = [
    'City Art Walks',
    'terms of service',
    'terms and conditions',
    'user agreement',
    'platform guidelines',
    'user rights',
    'service terms',
    'legal terms',
    'user responsibilities',
  ].join(', ');

  // Generate OG image
  const ogImageUrl = generateTermsOGImage({
    title: 'Terms of Service',
    subtitle: options.subtitle || 'Terms & Conditions',
  });

  debugLog('MetadataUtils.generateTermsMetadata', 'Generated terms of service metadata', {
    ogImageUrl,
  });

  return {
    ...BASE_METADATA,
    title,
    description,
    keywords,
    openGraph: {
      type: 'website',
      title: 'Terms of Service - City Art Walks',
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Terms of Service - City Art Walks',
        },
      ],
      siteName: 'City Art Walks',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Terms of Service - City Art Walks',
      description,
      images: [ogImageUrl],
      creator: '@cityartwalks',
      site: '@cityartwalks',
    },
  };
}

/**
 * Helper function to build location name from location object
 * @param {Object} location - Location data
 * @param {string} [location.city] - City name
 * @param {string} [location.state] - State/region name
 * @param {string} [location.country] - Country name
 * @returns {string} Formatted location name
 */
function buildLocationName(location) {
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.state) parts.push(location.state);
  if (location.country) parts.push(location.country);
  return parts.join(', ');
}
