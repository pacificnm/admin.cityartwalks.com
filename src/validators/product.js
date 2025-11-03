/**
 * @file product.js
 * @description Product validator module.
 * Provides Zod schemas for Product entity validation, including create, update, query, and inventory schemas,
 * as well as a default values function for form initialization and helper utilities for query transformation.
 *
 * @namespace CityArtWalks.Validators.Product
 * @version 1.0.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} z - Zod schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Product-Model} - Product database model
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation standards
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Product-Validator} - Product validator documentation
 */
import { z } from 'zod';

/**
 * Zod enum schema for product status
 * @memberof CityArtWalks.Validators.Product
 */
export const productStatusSchema = z.enum(['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED']);

/**
 * Zod schema for Product entity (base)
 * @memberof CityArtWalks.Validators.Product
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Product-Model}
 */
export const productSchema = z.object({
  productId: z.number().int().optional(),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255, 'Slug must be 255 characters or less')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z
    .string()
    .max(500, 'Short description must be 500 characters or less')
    .optional(),
  price: z.number().positive('Price must be positive'),
  salePrice: z.number().positive('Sale price must be positive').optional(),
  currency: z.string().length(3, 'Currency must be a 3-character code').default('USD'),
  category: z.string().max(100, 'Category must be 100 characters or less').optional(),
  tags: z.array(z.string()).optional(),
  sku: z
    .string()
    .max(100, 'SKU must be 100 characters or less')
    .regex(/^[A-Z0-9-_]+$/i, 'SKU must contain only letters, numbers, hyphens, and underscores')
    .optional(),
  status: productStatusSchema.optional(),
  featured: z.boolean().optional(),
  stockQuantity: z.number().int().min(0, 'Stock quantity must be non-negative').optional(),
  trackInventory: z.boolean().optional(),
  allowBackorder: z.boolean().optional(),
  isDigital: z.boolean().optional(),
  downloadUrl: z.string().url('Download URL must be a valid URL').max(500).optional(),
  fileSize: z.number().int().min(0, 'File size must be non-negative').optional(),
  metaTitle: z.string().max(255, 'Meta title must be 255 characters or less').optional(),
  metaDescription: z
    .string()
    .max(500, 'Meta description must be 500 characters or less')
    .optional(),
  featuredImage: z.string().url('Featured image must be a valid URL').max(500).optional(),
  gallery: z.array(z.string().url('Gallery image must be a valid URL')).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

/**
 * Zod schema for creating a new Product entity
 * @memberof CityArtWalks.Validators.Product
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Product-Validator}
 */
export const createProductSchema = productSchema.omit({
  productId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Zod schema for updating an existing Product entity (partial fields)
 * @memberof CityArtWalks.Validators.Product
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Product-Validator}
 */
export const updateProductSchema = productSchema.partial();

// Update product schema (allows partial updates)

/**
 * Zod schema for querying Product entities (filter, sort, pagination)
 * @memberof CityArtWalks.Validators.Product
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 */
export const productQuerySchema = z.object({
  skip: z.string().regex(/^\d+$/, 'Skip must be a number').optional(),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional(),
  status: productStatusSchema.optional(),
  category: z.string().optional(),
  featured: z
    .string()
    .regex(/^(true|false)$/, 'Featured must be true or false')
    .optional(),
  isDigital: z
    .string()
    .regex(/^(true|false)$/, 'IsDigital must be true or false')
    .optional(),
  minPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'MinPrice must be a valid price')
    .optional(),
  maxPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'MaxPrice must be a valid price')
    .optional(),
});

/**
 * Zod schema for searching Product entities
 * @memberof CityArtWalks.Validators.Product
 */
export const searchProductSchema = z.object({
  q: z.string().optional(),
  query: z.string().optional(),
  category: z.string().optional(),
  featured: z
    .string()
    .regex(/^(true|false)$/, 'Featured must be true or false')
    .optional(),
  isDigital: z
    .string()
    .regex(/^(true|false)$/, 'IsDigital must be true or false')
    .optional(),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional(),
  status: productStatusSchema.optional(),
});

/**
 * Zod schema for product ID parameter validation
 * @memberof CityArtWalks.Validators.Product
 */
export const productIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Product ID must be a number'),
});

/**
 * Zod schema for product slug parameter validation
 * @memberof CityArtWalks.Validators.Product
 */
export const productSlugSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

/**
 * Zod schema for inventory update
 * @memberof CityArtWalks.Validators.Product
 */
export const inventoryUpdateSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
});

/**
 * Zod schema for product details query (for details endpoint)
 * @memberof CityArtWalks.Validators.Product
 */
export const productDetailsQuerySchema = z
  .object({
    id: z.string().regex(/^\d+$/, 'Product ID must be a number').optional(),
    slug: z.string().optional(),
    sku: z.string().optional(),
  })
  .refine((data) => data.id || data.slug || data.sku, {
    message: 'Either id, slug, or sku must be provided',
  });

/**
 * Helper function to transform product query parameters
 * @memberof CityArtWalks.Validators.Product
 * @param {object} query - Query parameters
 * @returns {object} Transformed query object
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Product-Validator}
 */
export function transformProductQuery(query) {
  const result = {};
  if (query.skip) result.skip = parseInt(query.skip);
  if (query.limit) result.limit = parseInt(query.limit);
  if (query.featured) result.featured = query.featured === 'true';
  if (query.isDigital) result.isDigital = query.isDigital === 'true';
  if (query.minPrice) result.minPrice = parseFloat(query.minPrice);
  if (query.maxPrice) result.maxPrice = parseFloat(query.maxPrice);
  if (query.status) result.status = query.status;
  if (query.category) result.category = query.category;
  return result;
}

/**
 * Helper function to transform product search parameters
 * @memberof CityArtWalks.Validators.Product
 * @param {object} query - Search parameters
 * @returns {object} Transformed search object
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Product-Validator}
 */
export function transformSearchQuery(query) {
  const result = {};
  const searchTerm = query.q || query.query;
  if (searchTerm) result.query = searchTerm;
  if (query.featured) result.featured = query.featured === 'true';
  if (query.isDigital) result.isDigital = query.isDigital === 'true';
  if (query.limit) result.limit = parseInt(query.limit);
  if (query.status) result.status = query.status;
  if (query.category) result.category = query.category;
  return result;
}

/**
 * Returns default values for Product forms
 * @memberof CityArtWalks.Validators.Product
 * @function defaultProductValues
 * @param {object} [product] - Optional Product object to populate defaults
 * @returns {object} Default values for Product form fields
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Product-Validator}
 */
export function defaultProductValues(product) {
  return {
    productId: product?.productId ?? null,
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    shortDescription: product?.shortDescription ?? '',
    price: product?.price ?? 0,
    salePrice: product?.salePrice ?? null,
    currency: product?.currency ?? 'USD',
    category: product?.category ?? '',
    tags: product?.tags ?? [],
    sku: product?.sku ?? '',
    status: product?.status ?? 'DRAFT',
    featured: product?.featured ?? false,
    stockQuantity: product?.stockQuantity ?? 0,
    trackInventory: product?.trackInventory ?? false,
    allowBackorder: product?.allowBackorder ?? false,
    isDigital: product?.isDigital ?? false,
    downloadUrl: product?.downloadUrl ?? '',
    fileSize: product?.fileSize ?? null,
    metaTitle: product?.metaTitle ?? '',
    metaDescription: product?.metaDescription ?? '',
    featuredImage: product?.featuredImage ?? '',
    gallery: product?.gallery ?? [],
    createdAt: product?.createdAt ?? null,
    updatedAt: product?.updatedAt ?? null,
  };
}
