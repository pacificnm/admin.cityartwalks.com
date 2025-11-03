/**
 * @file user-favorite-image.js
 * @description Zod validation schemas and utilities for UserFavoriteImage. Provides create/update/query schemas,
 * default values helpers, and query schemas used by API routes and forms to validate and initialize
 * user favorite image data consistently across the application.
 * @namespace CityArtWalks.Validators.UserFavoriteImage
 * @version 1.1.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} zod - TypeScript-first schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserFavoriteImage-Model} - UserFavoriteImage database model
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation standards
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-favorite-image-Validator} - UserFavoriteImage validator documentation
 */
import { z } from 'zod';
/**
 * Zod schema for UserFavoriteImage entity (base)
 * @memberof CityArtWalks.Validators.UserFavoriteImage
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserFavoriteImage-Model}
 */
export const userFavoriteImageSchema = z.object({
  id: z.number().int().optional(),
  userId: z.number().int().positive('User ID must be a positive integer'),
  imageId: z.number().int().positive('Image ID must be a positive integer'),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

/**
 * Zod schema for creating a UserFavoriteImage entity
 * @memberof CityArtWalks.Validators.UserFavoriteImage
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-favorite-image-Validator}
 */
export const createUserFavoriteImageSchema = userFavoriteImageSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Zod schema for updating a UserFavoriteImage entity (partial fields)
 * @memberof CityArtWalks.Validators.UserFavoriteImage
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-favorite-image-Validator}
 */
export const updateUserFavoriteImageSchema = userFavoriteImageSchema.partial();

/**
 * Zod schema for querying UserFavoriteImage entities (filter, sort, pagination)
 * @memberof CityArtWalks.Validators.UserFavoriteImage
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 */
export const userFavoriteImageQuerySchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  userId: z.number().int().positive().optional(),
  imageId: z.number().int().positive().optional(),
  search: z.string().optional(),
});

/**
 * Returns default values for UserFavoriteImage forms
 * @memberof CityArtWalks.Validators.UserFavoriteImage
 * @function defaultUserFavoriteImageValues
 * @param {object} [userFavoriteImage] - Optional UserFavoriteImage object to populate defaults
 * @returns {object} Default values for UserFavoriteImage form fields
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-favorite-image-Validator}
 */
export function defaultUserFavoriteImageValues(userFavoriteImage) {
  return {
    id: userFavoriteImage?.id ?? null,
    userId: userFavoriteImage?.userId ?? null,
    imageId: userFavoriteImage?.imageId ?? null,
    createdAt: userFavoriteImage?.createdAt ?? null,
    updatedAt: userFavoriteImage?.updatedAt ?? null,
  };
}
