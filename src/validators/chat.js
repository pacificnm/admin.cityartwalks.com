/**
 * @file chat.js
 * @description Zod validation schemas and helpers for Chat messages used across City Art Walks.
 * Provides create/update schemas, query validation, and default values for chat-related forms.
 * @namespace CityArtWalks.Validators.Chat
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Chat-Model} - Chat model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Chat} - Database schema reference
 * @see {@link https://zod.dev/} - Zod official documentation
 */
import { z } from 'zod';

/**
 * Base Zod schema for chat data validation
 *
 * Defines the complete data structure for chat entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.Chat
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Chat} - Database schema reference
 */
export const chatSchema = z.object({
  // Primary key (auto-increment, optional for creates)
  chatId: z.number().int().optional(),

  // Required string fields
  message: z.string().min(1, 'Message is required').max(5000, 'Message too long'),

  // Optional numeric fields
  senderId: z.number().int().positive().nullable().optional(),
  receiverId: z.number().int().positive().nullable().optional(),

  // Optional string fields
  roomId: z.string().nullable().optional(),
  messageType: z.enum(['text', 'image', 'file', 'system']).default('text'),

  // Boolean fields
  isRead: z.boolean().default(false),

  // Date fields
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),

  // User tracking fields
  createdBy: z.number().int().positive().nullable().optional(),
  updatedBy: z.number().int().positive().nullable().optional(),
});

/**
 * Zod schema for creating new chat entries
 *
 * Used for validating data when creating new chat entities. Excludes
 * auto-generated fields like timestamps and IDs.
 *
 * @memberof CityArtWalks.Validators.Chat
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Chat-Model} - Chat model documentation
 */
export const createChatSchema = chatSchema.omit({
  chatId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Zod schema for updating existing chat entries
 *
 * Allows partial updates by making all fields optional. Used for PATCH operations
 * where only specific fields need to be updated.
 *
 * @memberof CityArtWalks.Validators.Chat
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Chat-Model} - Chat model documentation
 */
export const updateChatSchema = chatSchema.partial();

/**
 * Returns default chat values for form initialization and data consistency
 *
 * Provides consistent default values for all chat fields, filling in missing
 * properties with appropriate defaults. Used for form initialization and ensuring
 * complete data structures for chat operations.
 *
 * @function defaultChatValues
 * @memberof CityArtWalks.Validators.Chat
 * @param {Object} [chat] - Partial chat object (may be incomplete)
 * @returns {Object} Complete chat object with all default fields populated
 *
 * @example
 * // Create defaults for new chat entry
 * const defaults = defaultChatValues();
 *
 * // Merge with existing partial data
 * const chatData = defaultChatValues({
 *   message: 'Hello!',
 *   senderId: 123
 * });
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Chat-Model} - Chat model documentation
 */
export function defaultChatValues(chat) {
  return {
    chatId: chat?.chatId ?? undefined,
    message: chat?.message ?? '',
    senderId: chat?.senderId ?? null,
    receiverId: chat?.receiverId ?? null,
    roomId: chat?.roomId ?? null,
    messageType: chat?.messageType ?? 'text',
    isRead: chat?.isRead ?? false,
    createdAt: chat?.createdAt ?? undefined,
    updatedAt: chat?.updatedAt ?? undefined,
    createdBy: chat?.createdBy ?? null,
    updatedBy: chat?.updatedBy ?? null,
  };
}

/**
 * Zod schema for validating chat query parameters
 *
 * Handles pagination, filtering, and sorting parameters for chat API endpoints.
 * Includes automatic string-to-number transformations for query parameters and
 * support for various filtering options.
 *
 * @memberof CityArtWalks.Validators.Chat
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Chat-Model} - Chat model documentation
 */
export const chatQuerySchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1))
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(100))
    .optional(),
  search: z.string().optional(),
  senderId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int())
    .optional(),
  receiverId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int())
    .optional(),
  roomId: z.string().optional(),
  messageType: z.enum(['text', 'image', 'file', 'system']).optional(),
  isRead: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int())
    .optional(),
  updatedBy: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int())
    .optional(),
  sortBy: z.enum(['message', 'createdAt', 'updatedAt', 'messageType']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
