/**
 * @file comment.js
 * @description Zod validation schemas and utilities for the Comment entity (create, update, query, helpers).
 * @namespace CityArtWalks.Validators.Comment
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Comment-Model} - Comment database model
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation standards
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Comment-Validator} - Comment validator documentation
 */
import { z } from 'zod';

/**
 * Zod schema for Comment entity (base)
 * @memberof CityArtWalks.Validators.Comment
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Comment-Model}
 */
export const commentSchema = z.object({
  commentId: z.number().int().optional(),
  postId: z.number().int().positive('Post ID must be a positive number'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(2000, 'Content must be 2000 characters or less'),
  status: z.enum(['ACTIVE', 'DELETED', 'MODERATED']).default('ACTIVE'),
  parentId: z.number().int().positive('Parent ID must be a positive number').optional(),
  createdBy: z.number().int().positive('Created by user ID must be a positive number'),
  updatedBy: z.number().int().positive('Updated by user ID must be a positive number').optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

/**
 * Zod schema for creating a new Comment entity
 * @memberof CityArtWalks.Validators.Comment
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Comment-Validator}
 */
export const createCommentSchema = commentSchema.omit({
  commentId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Zod schema for updating an existing Comment entity (partial fields)
 * @memberof CityArtWalks.Validators.Comment
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Comment-Validator}
 */
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(2000, 'Content must be 2000 characters or less')
    .optional(),

  status: z.enum(['ACTIVE', 'DELETED', 'MODERATED']).optional(),

  updatedBy: z.number().int().positive('Updated by user ID must be a positive number').optional(),
});

/**
 * Zod schema for querying Comment entities (filter, sort, pagination)
 * @memberof CityArtWalks.Validators.Comment
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 */
export const commentQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  rowsPerPage: z.coerce
    .number()
    .min(1, 'Rows per page must be at least 1')
    .max(100, 'Rows per page cannot exceed 100')
    .default(10),
  search: z.string().max(255, 'Search term must be 255 characters or less').default(''),
  status: z.enum(['ACTIVE', 'DELETED', 'MODERATED']).optional(),
  postId: z.coerce.number().int().positive('Post ID must be a positive number').optional(),
  parentId: z.coerce.number().int().positive('Parent ID must be a positive number').optional(),
  createdBy: z.coerce
    .number()
    .int()
    .positive('Created by user ID must be a positive number')
    .optional(),
  sortBy: z.enum(['createdAt', 'content', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  includeDeleted: z.coerce.boolean().default(false),
  includeModerated: z.coerce.boolean().default(false),
});

/**
 * Zod schema for search parameters
 * @memberof CityArtWalks.Validators.Comment
 */
export const searchCommentSchema = z.object({
  query: z.string().max(255, 'Search query must be 255 characters or less').default(''),
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
  postId: z.coerce.number().int().positive('Post ID must be a positive number').optional(),
  includeDeleted: z.coerce.boolean().default(false),
  includeModerated: z.coerce.boolean().default(false),
});

/**
 * Zod schema for comment ID parameter validation
 * @memberof CityArtWalks.Validators.Comment
 */
export const commentIdSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1, 'Comment ID must be a positive number')),
});

/**
 * Zod schema for post ID parameter validation
 * @memberof CityArtWalks.Validators.Comment
 */
export const commentPostIdSchema = z.object({
  postId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1, 'Post ID must be a positive number')),
});

/**
 * Validation helper to ensure comment content meets requirements
 * @memberof CityArtWalks.Validators.Comment
 * @param {object} data - Comment data to validate
 * @returns {boolean} True if valid, throws error otherwise
 * @throws {Error} If comment requirements are not met
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Comment-Validator}
 */
export function validateCommentContent(data) {
  if (!data.content || data.content.trim().length === 0) {
    throw new Error('Comment content is required');
  }
  if (data.content.length > 2000) {
    throw new Error('Comment content cannot exceed 2000 characters');
  }
  return true;
}

/**
 * Returns default values for Comment forms
 * @memberof CityArtWalks.Validators.Comment
 * @function defaultCommentValues
 * @param {object} [comment] - Optional Comment object to populate defaults
 * @returns {object} Default values for Comment form fields
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Comment-Validator}
 */
export function defaultCommentValues(comment) {
  return {
    commentId: comment?.commentId ?? null,
    postId: comment?.postId ?? null,
    content: comment?.content ?? '',
    status: comment?.status ?? 'ACTIVE',
    parentId: comment?.parentId ?? null,
    createdBy: comment?.createdBy ?? null,
    updatedBy: comment?.updatedBy ?? null,
    createdAt: comment?.createdAt ?? null,
    updatedAt: comment?.updatedAt ?? null,
  };
}
