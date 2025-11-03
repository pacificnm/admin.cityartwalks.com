/**
 * @file ai-chat-conversation.js
 * @description Zod validation schemas for AIChatConversation — create, update, query and helper schemas
 * used across the City Art Walks application to validate AI chat conversation data.
 * @namespace CityArtWalks.Validators.AIChatConversation
 * @version 1.0.0
 * @author jaimie garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/AIChatConversation-Model} - AIChatConversation model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#AIChatConversation} - Database schema reference
 * @see {@link https://zod.dev/} - Zod official documentation
 */
import { z } from 'zod';

/**
 * Base Zod schema for AI chat conversation data validation
 *
 * Defines the complete data structure for AIChatConversation entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.AIChatConversation
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#AIChatConversation} - Database schema reference
 */
export const aiChatConversationSchema = z.object({
  aiChatConversationId: z.number().int().positive(),
  userId: z.number().int().positive().nullable(),
  sessionId: z.string().min(1, 'Session ID is required').max(255),
  question: z.string().min(1, 'User message is required').max(2000, 'Message too long'),
  answer: z.string().min(1, 'AI response is required').max(5000, 'Response too long'),
  conversationContext: z.record(z.any()).nullable().optional(),
  responseTime: z.number().int().min(0).nullable().optional(),
  tokenCount: z.number().int().min(0).nullable().optional(),
  model: z.string().max(100).nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdBy: z.number().int().positive().nullable().optional(),
  updatedBy: z.number().int().positive().nullable().optional(),
});

/**
 * Schema for creating new AI chat conversation records
 *
 * Excludes auto-generated fields (ID, timestamps) and makes certain fields optional
 * for creation operations. Used by POST API routes.
 *
 * @memberof CityArtWalks.Validators.AIChatConversation
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST} - POST route documentation
 */
export const createAIChatConversationSchema = aiChatConversationSchema.omit({
  aiChatConversationId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema for updating existing AI chat conversation records
 *
 * Makes all fields optional except ID, allowing partial updates.
 * Used by PUT API routes.
 *
 * @memberof CityArtWalks.Validators.AIChatConversation
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT} - PUT route documentation
 */
export const updateAIChatConversationSchema = createAIChatConversationSchema.partial();

/**
 * Schema for AI chat conversation query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * All parameters are optional strings that get transformed to appropriate types.
 *
 * @memberof CityArtWalks.Validators.AIChatConversation
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const aiChatConversationQuerySchema = z.object({
  // Pagination parameters (REQUIRED for all entities)
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),

  // Search parameter (REQUIRED for all entities)
  search: z.string().optional(),

  // Sort parameters (REQUIRED for all entities)
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),

  // User-related filters (ADD if entity has user relationships)
  userId: z.string().optional(),

  // AI Chat specific filters
  sessionId: z.string().optional(),
  model: z.string().optional(),

  // Date range filters
  startDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  endDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  // Performance filters
  minResponseTime: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  maxResponseTime: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  minTokenCount: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  maxTokenCount: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
});

/**
 * Gets default values for AIChatConversation forms and initialization
 *
 * Provides sensible defaults for creating new AI chat conversation records and
 * initializing forms. Based on database schema defaults and business rules.
 *
 * @memberof CityArtWalks.Validators.AIChatConversation
 * @function getAIChatConversationDefaultValues
 * @returns {Object} Default values object matching create schema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#AIChatConversation} - Database schema defaults
 */
export function getAIChatConversationDefaultValues() {
  return {
    userId: null,
    sessionId: '',
    question: '',
    answer: '',
    conversationContext: null,
    responseTime: null,
    tokenCount: null,
    model: 'gpt-3.5-turbo',
    createdBy: null,
    updatedBy: null,
  };
}
