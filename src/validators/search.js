import { z } from 'zod';
/**
 * @file search.js
 * @description Zod schemas for validating search parameters, pagination, filters, and sorting used across search endpoints.
 * @namespace CityArtWalks.Validators.Search
 * @version 0.2.0
 * @author Jaimie
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Search-Validation} - Search validation docs
 */
/**
 * @memberof CityArtWalks.Validators.Search
 * @description Schema for search query parameters
 *
 * @property {string} q - Search query string (required, 1-100 characters)
 * @property {number} [countryId] - ID of country to filter by
 * @property {number} [stateId] - ID of state to filter by
 * @property {number} [cityId] - ID of city to filter by
 * @property {number} [limit=5] - Number of results per category (1-20)
 * @property {number} [page=1] - Page number for pagination (min 1)
 */
export const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  countryId: z.coerce.number().int().positive().optional().nullable(),
  stateId: z.coerce.number().int().positive().optional().nullable(),
  cityId: z.coerce.number().int().positive().optional().nullable(),
  limit: z.coerce.number().min(1).max(20).optional().default(5),
  page: z.coerce.number().min(1).optional().default(1),
});

/**
 * @memberof CityArtWalks.Validators.Search
 * @description Schema for individual artist search result
 */
const artistResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  link: z.string(),
  type: z.literal('artist'),
  imageUrl: z.string().nullable(),
  location: z.string().nullable(),
});

/**
 * @memberof CityArtWalks.Validators.Search
 * @description Schema for individual art piece search result
 */
const artPieceResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  link: z.string(),
  type: z.literal('artPiece'),
  imageUrl: z.string().nullable(),
  artistName: z.string().nullable(),
  location: z.string().nullable(),
});

/**
 * @memberof CityArtWalks.Validators.Search
 * @description Schema for individual city search result
 */
const cityResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  link: z.string(),
  type: z.literal('city'),
  stateName: z.string().nullable(),
  countryName: z.string().nullable(),
});

/**
 * @memberof CityArtWalks.Validators.Search
 * @description Schema for individual path search result
 */
const pathResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  link: z.string(),
  type: z.literal('path'),
  distance: z.number().nullable(),
  location: z.string().nullable(),
});

/**
 * @memberof CityArtWalks.Validators.Search
 * @description Schema for search response metadata
 */
const searchMetaSchema = z.object({
  query: z.string(),
  totalResults: z.number(),
  page: z.number(),
  limit: z.number(),
  hasMore: z.boolean(),
});

/**
 * @memberof CityArtWalks.Validators.Search
 * @description Schema for complete search response
 *
 * @property {Array} artists - Array of artist search results
 * @property {Array} artPieces - Array of art piece search results
 * @property {Array} cities - Array of city search results
 * @property {Array} paths - Array of path search results
 * @property {Object} meta - Search metadata including pagination info
 */
export const searchResponseSchema = z.object({
  artists: z.array(artistResultSchema),
  artPieces: z.array(artPieceResultSchema),
  cities: z.array(cityResultSchema),
  paths: z.array(pathResultSchema),
  meta: searchMetaSchema,
});

/**
 * @memberof CityArtWalks.Validators.Search
 * @description Schema for popular searches response
 */
export const popularSearchesSchema = z.array(z.string()).max(20);
