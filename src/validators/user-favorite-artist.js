/**
 * @file user-favorite-artist.js
 * @description Zod validation schemas and utilities for UserFavoriteArtist. Provides create, update, query,
 * toggle schemas and a default values helper used by API routes and forms to validate and initialize
 * user favorite artist data consistently across the application.
 * @namespace CityArtWalks.Validators.UserFavoriteArtist
 * @version 1.0.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} zod - TypeScript-first schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserFavoriteArtist-Model} - UserFavoriteArtist database model
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation standards
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserFavoriteArtist-Validator} - UserFavoriteArtist validator documentation
 */
import { z } from 'zod';

/**
 * @namespace CityArtWalks.Validators.UserFavoriteArtist
 * @description Zod schema for validating UserFavoriteArtist data input.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserFavoriteArtist-Validator} - Complete documentation
 */

/**
 * Zod schema for UserFavoriteArtist entity (base)
 * @memberof CityArtWalks.Validators.UserFavoriteArtist
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserFavoriteArtist-Model}
 */
export const userFavoriteArtistSchema = z.object({
  id: z.number().int().optional(),
  userId: z.number().int().positive('User ID must be a positive integer'),
  artistId: z.number().int().positive('Artist ID must be a positive integer'),
  createdAt: z.coerce.date().optional(),
});

/**
 * Zod schema for creating a UserFavoriteArtist entity
 * @memberof CityArtWalks.Validators.UserFavoriteArtist
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserFavoriteArtist-Validator}
 */
export const createUserFavoriteArtistSchema = userFavoriteArtistSchema.omit({
  id: true,
  createdAt: true,
});

/**
 * Zod schema for updating a UserFavoriteArtist entity (partial fields)
 * @memberof CityArtWalks.Validators.UserFavoriteArtist
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserFavoriteArtist-Validator}
 */
export const updateUserFavoriteArtistSchema = userFavoriteArtistSchema.partial();

/**
 * Zod schema for querying UserFavoriteArtist entities (filter, sort, pagination)
 * @memberof CityArtWalks.Validators.UserFavoriteArtist
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 */
export const userFavoriteArtistQuerySchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  userId: z.number().int().positive().optional(),
  artistId: z.number().int().positive().optional(),
  search: z.string().optional(),
});

/**
 * Zod schema for toggling UserFavoriteArtist status
 * @memberof CityArtWalks.Validators.UserFavoriteArtist
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserFavoriteArtist-Validator}
 */
export const toggleUserFavoriteArtistSchema = z.object({
  artistId: z.number().int().positive('Artist ID must be a positive integer'),
});

/**
 * Returns default values for UserFavoriteArtist forms
 * @memberof CityArtWalks.Validators.UserFavoriteArtist
 * @function defaultUserFavoriteArtistValues
 * @param {object} [userFavoriteArtist] - Optional UserFavoriteArtist object to populate defaults
 * @returns {object} Default values for UserFavoriteArtist form fields
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserFavoriteArtist-Validator}
 */
export function defaultUserFavoriteArtistValues(userFavoriteArtist) {
  return {
    id: userFavoriteArtist?.id ?? null,
    userId: userFavoriteArtist?.userId ?? null,
    artistId: userFavoriteArtist?.artistId ?? null,
    createdAt: userFavoriteArtist?.createdAt ?? null,
  };
}
