/**
 * @file email-template.js
 * @description Zod validation schemas for the EmailTemplate model.
 * This module provides schemas and helper validators for creating, updating,
 * querying, previewing, and managing email templates used across the
 * City Art Walks application. It also includes small utility validators for
 * template variables and slug uniqueness checks.
 *
 * @namespace CityArtWalks.Validators.EmailTemplate
 * @version 2.1.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Email-Template-Model}
 */

import { z } from 'zod';

/**
 * Base email template schema with common fields
 * @constant {z.ZodObject} baseEmailTemplateSchema
 * @memberof CityArtWalks.Validators.EmailTemplate
 */
const baseEmailTemplateSchema = z.object({
  name: z
    .string()
    .min(1, 'Template name is required')
    .max(200, 'Template name must be less than 200 characters'),

  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),

  subjectTemplate: z
    .string()
    .min(1, 'Email subject is required')
    .max(500, 'Email subject must be less than 500 characters'),

  htmlTemplate: z.string().min(1, 'HTML template is required'),

  textTemplate: z.string().optional().default(''),

  variables: z.record(z.any()).optional().default({}),

  isActive: z.boolean().optional().default(true),
});

/**
 * Schema for creating new email templates
 * @constant {z.ZodObject} emailTemplateCreateSchema
 * @memberof CityArtWalks.Validators.EmailTemplate
 */
export const emailTemplateCreateSchema = baseEmailTemplateSchema;

/**
 * Schema for updating email templates
 * @constant {z.ZodObject} emailTemplateUpdateSchema
 * @memberof CityArtWalks.Validators.EmailTemplate
 */
export const emailTemplateUpdateSchema = baseEmailTemplateSchema.partial();

// Export aliases for backward compatibility
export const createEmailTemplateSchema = emailTemplateCreateSchema;
export const updateEmailTemplateSchema = emailTemplateUpdateSchema;

/**
 * Schema for email template query parameters
 * @constant {z.ZodObject} emailTemplateQuerySchema
 * @memberof CityArtWalks.Validators.EmailTemplate
 */
export const emailTemplateQuerySchema = z.object({
  page: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .pipe(z.number().int().min(1, 'Page must be at least 1'))
    .optional()
    .default(1),

  limit: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .pipe(z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100'))
    .optional()
    .default(25),

  search: z.string().max(200, 'Search term must be less than 200 characters').optional(),

  category: z.string().max(50, 'Category must be less than 50 characters').optional(),

  isActive: z.boolean().optional(),

  createdBy: z.string().regex(/^\d+$/, 'Created by must be a valid user ID').optional(),
});

/**
 * Internal schema for model function parameters (skip/rowsPerPage format)
 * @constant {z.ZodObject} emailTemplateInternalQuerySchema
 * @memberof CityArtWalks.Validators.EmailTemplate
 */
export const emailTemplateInternalQuerySchema = z.object({
  skip: z.number().int().min(0, 'Skip must be a non-negative integer').optional().default(0),

  rowsPerPage: z
    .number()
    .int()
    .min(1, 'Rows per page must be at least 1')
    .max(100, 'Rows per page cannot exceed 100')
    .optional()
    .default(25),

  search: z.string().max(200, 'Search term must be less than 200 characters').optional(),

  category: z.string().max(50, 'Category must be less than 50 characters').optional(),

  isActive: z.boolean().optional(),

  createdBy: z.number().int().positive().optional(),
});

/**
 * Schema for email template ID validation
 * @constant {z.ZodObject} emailTemplateIdSchema
 * @memberof CityArtWalks.Validators.EmailTemplate
 */
export const emailTemplateIdSchema = z.object({
  templateId: z.number().int().positive('Template ID must be a positive integer'),
});

/**
 * Schema for email template slug validation
 * @constant {z.ZodObject} emailTemplateSlugSchema
 * @memberof CityArtWalks.Validators.EmailTemplate
 */
export const emailTemplateSlugSchema = z.object({
  slug: z
    .string()
    .min(1, 'Template slug is required')
    .max(100, 'Template slug must be less than 100 characters')
    .regex(
      /^[a-z0-9-_]+$/,
      'Template slug can only contain lowercase letters, numbers, hyphens, and underscores'
    ),
});

/**
 * Schema for validating template variables
 * @constant {z.ZodObject} templateVariableSchema
 * @memberof CityArtWalks.Validators.EmailTemplate
 */
export const templateVariableSchema = z.object({
  variables: z
    .array(
      z
        .string()
        .min(1, 'Variable name cannot be empty')
        .max(50, 'Variable name must be less than 50 characters')
        .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Variable name must be a valid identifier')
    )
    .optional()
    .default([]),
});

/**
 * Schema for email template preview data
 * @constant {z.ZodObject} emailTemplatePreviewSchema
 * @memberof CityArtWalks.Validators.EmailTemplate
 */
export const emailTemplatePreviewSchema = z.object({
  templateId: z.number().int().positive('Template ID must be a positive integer'),

  variables: z.record(z.string(), z.any()).optional().default({}),

  recipientEmail: z.string().email('Valid email address is required').optional(),
});

/**
 * Schema for bulk email template operations
 * @constant {z.ZodObject} bulkEmailTemplateSchema
 * @memberof CityArtWalks.Validators.EmailTemplate
 */
export const bulkEmailTemplateSchema = z.object({
  templateIds: z
    .array(z.number().int().positive('Template ID must be a positive integer'))
    .min(1, 'At least one template ID is required')
    .max(50, 'Cannot process more than 50 templates at once'),

  action: z.enum(['activate', 'deactivate', 'delete'], {
    errorMap: () => ({ message: 'Action must be activate, deactivate, or delete' }),
  }),

  updatedBy: z.number().int().positive('Updated by user ID must be a positive integer'),
});

/**
 * Validation helper functions
 * @description Helper utilities for EmailTemplate. Kept under the file-level
 * namespace to avoid creating a nested helper namespace in generated docs.
 */

/**
 * Validate template content for required variables
 * @function validateTemplateContent
 * @memberof CityArtWalks.Validators.EmailTemplate
 * @param {string} content - Template content
 * @param {Array<string>} declaredVariables - Declared template variables
 * @returns {Object} Validation result
 */
export function validateTemplateContent(content, declaredVariables = []) {
  const errors = [];
  const variablePattern = /\{\{(\w+)\}\}/g;
  const foundVariables = new Set();

  let match;
  while ((match = variablePattern.exec(content)) !== null) {
    foundVariables.add(match[1]);
  }

  const foundVariablesArray = Array.from(foundVariables);
  const declaredSet = new Set(declaredVariables);

  // Check for undeclared variables
  const undeclaredVariables = foundVariablesArray.filter((variable) => !declaredSet.has(variable));
  if (undeclaredVariables.length > 0) {
    errors.push(`Undeclared variables found in template: ${undeclaredVariables.join(', ')}`);
  }

  // Check for unused declared variables
  const unusedVariables = declaredVariables.filter((variable) => !foundVariables.has(variable));
  if (unusedVariables.length > 0) {
    errors.push(`Declared variables not used in template: ${unusedVariables.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    foundVariables: foundVariablesArray,
  };
}

/**
 * Validate template slug uniqueness (for use in API routes)
 * @function validateTemplateSlugUniqueness
 * @memberof CityArtWalks.Validators.EmailTemplate
 * @param {string} slug - Template slug to validate
 * @param {number} [excludeTemplateId] - Template ID to exclude from uniqueness check
 * @returns {z.ZodString} Zod schema with custom validation
 */
export function validateTemplateSlugUniqueness(slug, excludeTemplateId) {
  return z
    .string()
    .min(1, 'Template slug is required')
    .max(100, 'Template slug must be less than 100 characters')
    .regex(
      /^[a-z0-9-_]+$/,
      'Template slug can only contain lowercase letters, numbers, hyphens, and underscores'
    )
    .refine(
      async (value) =>
        // Note: This would typically include database check in actual implementation
        // For now, we just validate the format
        true,
      {
        message: 'Template slug must be unique',
      }
    );
}
