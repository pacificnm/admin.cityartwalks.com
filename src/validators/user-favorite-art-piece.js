/**
 * @file user-favorite-art-piece.js
 * @description Zod validation schemas and utilities for UserFavoriteArtPiece. Provides create, update, query,
 * toggle schemas and a default values helper used by API routes and forms to validate and initialize
 * user favorite art piece data consistently across the application.
 * @namespace CityArtWalks.Validators.UserFavoriteArtPiece
 * @version 1.0.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} zod - TypeScript-first schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-favorite-art-piece-Model} - UserFavoriteArtPiece database model
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation standards
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-favorite-art-piece-Validator} - UserFavoriteArtPiece validator documentation
 */
import { z } from 'zod';

/**
 * Zod schema for UserFavoriteArtPiece entity (base)
 * @memberof CityArtWalks.Validators.UserFavoriteArtPiece
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-favorite-art-piece-Model}
 */
export const userFavoriteArtPieceSchema = z.object({
  id: z.number().int().optional(),
  userId: z.number().int().positive('User ID must be a positive integer'),
  artPieceId: z.number().int().positive('Art Piece ID must be a positive integer'),
  createdAt: z.coerce.date().optional(),
});

/**
 * Zod schema for creating a UserFavoriteArtPiece entity
 * @memberof CityArtWalks.Validators.UserFavoriteArtPiece
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-favorite-art-piece-Validator}
 */
export const createUserFavoriteArtPieceSchema = userFavoriteArtPieceSchema.omit({
  id: true,
  createdAt: true,
});

/**
 * Zod schema for updating a UserFavoriteArtPiece entity (partial fields)
 * @memberof CityArtWalks.Validators.UserFavoriteArtPiece
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-favorite-art-piece-Validator}
 */
export const updateUserFavoriteArtPieceSchema = userFavoriteArtPieceSchema.partial();

/**
 * Zod schema for querying UserFavoriteArtPiece entities (filter, sort, pagination)
 * @memberof CityArtWalks.Validators.UserFavoriteArtPiece
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 */
export const userFavoriteArtPieceQuerySchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  userId: z.number().int().positive().optional(),
  artPieceId: z.number().int().positive().optional(),
  search: z.string().optional(),
});

/**
 * Zod schema for toggling UserFavoriteArtPiece status
 * @memberof CityArtWalks.Validators.UserFavoriteArtPiece
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-favorite-art-piece-Validator}
 */
export const toggleUserFavoriteArtPieceSchema = z.object({
  artPieceId: z.number().int().positive('Art Piece ID must be a positive integer'),
});

/**
 * Returns default values for UserFavoriteArtPiece forms
 * @memberof CityArtWalks.Validators.UserFavoriteArtPiece
 * @function defaultUserFavoriteArtPieceValues
 * @param {object} [userFavoriteArtPiece] - Optional UserFavoriteArtPiece object to populate defaults
 * @returns {object} Default values for UserFavoriteArtPiece form fields
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-favorite-art-piece-Validator}
 */
export function defaultUserFavoriteArtPieceValues(userFavoriteArtPiece) {
  return {
    id: userFavoriteArtPiece?.id ?? null,
    userId: userFavoriteArtPiece?.userId ?? null,
    artPieceId: userFavoriteArtPiece?.artPieceId ?? null,
    createdAt: userFavoriteArtPiece?.createdAt ?? null,
  };
}
