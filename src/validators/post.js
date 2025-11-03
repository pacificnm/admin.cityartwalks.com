/**
 * @file post.js
 * @description Post validator module.
 * Provides Zod schemas for Post entity validation, including create, update, query, and publish schemas,
 * as well as a default values function for form initialization and helper validation utilities.
 *
 * @namespace CityArtWalks.Validators.Post
 * @version 1.0.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} z - Zod schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model} - Post database model
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation standards
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Validator} - Post validator documentation
 */
import { z } from 'zod';

/**
 * Zod schema for Post entity (base)
 * @memberof CityArtWalks.Validators.Post
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model}
 */
export const postSchema = z.object({
  postId: z.number().int().optional(),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255, 'Slug must be 255 characters or less')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be URL-safe (lowercase letters, numbers, and hyphens only)'
    ),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(1000, 'Excerpt must be 1000 characters or less').optional(),
  metaTitle: z.string().max(255, 'Meta title must be 255 characters or less').optional(),
  metaDescription: z
    .string()
    .max(500, 'Meta description must be 500 characters or less')
    .optional(),
  featuredImage: z
    .string()
    .url('Featured image must be a valid URL')
    .max(500, 'Featured image URL must be 500 characters or less')
    .optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  publishedAt: z
    .union([
      z.string().min(1).datetime('Published date must be a valid ISO datetime'),
      z.date().transform((date) => date.toISOString()),
      z.literal(''),
      z.literal(null),
      z.undefined(),
    ])
    .transform((val) => {
      if (!val || val === '') return null;
      if (val instanceof Date) return val;
      return new Date(val);
    })
    .optional(),
  category: z.string().max(100, 'Category must be 100 characters or less').optional(),
  tags: z
    .array(z.string().max(50, 'Each tag must be 50 characters or less'))
    .max(20, 'Maximum 20 tags allowed')
    .default([]),
  featured: z
    .union([z.boolean(), z.string().transform((val) => val === 'true' || val === true)])
    .default(false),
  createdBy: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

/**
 * Zod schema for creating a new Post entity
 * Excludes audit fields (postId, createdBy, createdAt, updatedAt) which are managed by the API route
 * @memberof CityArtWalks.Validators.Post
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Validator}
 */
export const createPostSchema = postSchema.omit({
  postId: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
});

/**
 * Zod schema for updating an existing Post entity (partial fields)
 * @memberof CityArtWalks.Validators.Post
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Validator}
 */

/**
 * Schema for updating an existing post
 *
 * @constant {z.ZodObject} updatePostSchema
 * @memberof CityArtWalks.Validators.Post
 */
export const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or less')
    .optional(),

  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255, 'Slug must be 255 characters or less')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be URL-safe (lowercase letters, numbers, and hyphens only)'
    )
    .optional(),

  content: z.string().min(1, 'Content is required').optional(),

  excerpt: z.string().max(1000, 'Excerpt must be 1000 characters or less').optional(),

  metaTitle: z.string().max(255, 'Meta title must be 255 characters or less').optional(),

  metaDescription: z
    .string()
    .max(500, 'Meta description must be 500 characters or less')
    .optional(),

  featuredImage: z
    .string()
    .url('Featured image must be a valid URL')
    .max(500, 'Featured image URL must be 500 characters or less')
    .optional(),

  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),

  publishedAt: z
    .union([
      z.string().min(1).datetime('Published date must be a valid ISO datetime'),
      z.date().transform((date) => date.toISOString()),
      z.literal(''),
      z.literal(null),
      z.undefined(),
    ])
    .transform((val) => {
      if (!val || val === '') return null;
      if (val instanceof Date) return val;
      return new Date(val);
    })
    .optional(),

  category: z.string().max(100, 'Category must be 100 characters or less').optional(),

  tags: z
    .array(z.string().max(50, 'Each tag must be 50 characters or less'))
    .max(20, 'Maximum 20 tags allowed')
    .optional(),

  featured: z.boolean().optional(),
});

/**
 * Zod schema for querying Post entities (filter, sort, pagination)
 * @memberof CityArtWalks.Validators.Post
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 */
export const postQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  rowsPerPage: z.coerce
    .number()
    .min(1, 'Rows per page must be at least 1')
    .max(100, 'Rows per page cannot exceed 100')
    .default(10),
  search: z.string().max(255, 'Search term must be 255 characters or less').default(''),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  category: z.string().max(100, 'Category must be 100 characters or less').default(''),
  sortBy: z.enum(['createdAt', 'title', 'status', 'category', 'createdBy']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  featured: z.coerce.boolean().optional(),
  createdBy: z.coerce.number().int().positive('Author ID must be a positive number').optional(),
  includeUnpublished: z.coerce.boolean().default(false),
});

/**
 * Zod schema for search parameters
 * @memberof CityArtWalks.Validators.Post
 */
export const searchPostSchema = z.object({
  query: z.string().max(255, 'Search query must be 255 characters or less').default(''),
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
  category: z.string().max(100, 'Category must be 100 characters or less').default(''),
  featured: z.coerce.boolean().optional(),
  includeUnpublished: z.coerce.boolean().default(false),
});

/**
 * Zod schema for post ID parameter validation
 * @memberof CityArtWalks.Validators.Post
 */
export const postIdSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1, 'Post ID must be a positive number')),
});

/**
 * Zod schema for post slug parameter validation
 * @memberof CityArtWalks.Validators.Post
 */
export const postSlugSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255, 'Slug must be 255 characters or less')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe'),
});

/**
 * Zod schema for category parameter validation
 * @memberof CityArtWalks.Validators.Post
 */
export const postCategorySchema = z.object({
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must be 100 characters or less'),
});

/**
 * Zod schema for validating post content before publishing
 * @memberof CityArtWalks.Validators.Post
 */
export const publishPostSchema = createPostSchema.extend({
  status: z.literal('PUBLISHED'),
  content: z.string().min(100, 'Published posts must have at least 100 characters of content'),
  excerpt: z.string().min(1, 'Published posts must have an excerpt'),
  publishedAt: z
    .union([
      z.string().min(1).datetime('Published date must be a valid ISO datetime'),
      z.date().transform((date) => date.toISOString()),
      z.literal(''),
      z.literal(null),
      z.undefined(),
    ])
    .transform((val) => {
      if (!val || val === '') return null;
      if (val instanceof Date) return val;
      return new Date(val);
    })
    .refine((date) => !date || date <= new Date(), 'Published date cannot be in the future')
    .optional(),
});

/**
 * Validation helper to ensure required fields for published posts
 * @memberof CityArtWalks.Validators.Post
 * @param {object} data - Post data to validate
 * @returns {boolean} True if valid, throws error otherwise
 * @throws {Error} If published post requirements are not met
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Validator}
 */
export function validatePublishedPost(data) {
  if (data.status === 'PUBLISHED') {
    if (!data.content || data.content.length < 100) {
      throw new Error('Published posts must have at least 100 characters of content');
    }
    if (!data.excerpt) {
      throw new Error('Published posts must have an excerpt');
    }
    if (data.publishedAt && new Date(data.publishedAt) > new Date()) {
      throw new Error('Published date cannot be in the future');
    }
  }
  return true;
}

/**
 * Returns default values for Post forms
 * @memberof CityArtWalks.Validators.Post
 * @function defaultPostValues
 * @param {object} [post] - Optional Post object to populate defaults
 * @returns {object} Default values for Post form fields
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Validator}
 */
export function defaultPostValues(post) {
  return {
    postId: post?.postId ?? null,
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    content: post?.content ?? '',
    excerpt: post?.excerpt ?? '',
    metaTitle: post?.metaTitle ?? '',
    metaDescription: post?.metaDescription ?? '',
    featuredImage: post?.featuredImage ?? '',
    status: post?.status ?? 'DRAFT',
    publishedAt: post?.publishedAt ?? null,
    category: post?.category ?? '',
    tags: post?.tags ?? [],
    featured: post?.featured ?? false,
    // Only include audit fields for existing posts (edit mode)
    // For new posts, these should not be in the form data
    ...(post?.postId && {
      createdBy: post.createdBy ?? null,
      createdAt: post.createdAt ?? null,
      updatedAt: post.updatedAt ?? null,
    }),
  };
}
