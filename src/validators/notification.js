/**
 * @file notification.js
 * @description Notification validator schemas using Zod.
 * This file defines Zod schemas for validating Notification entities used by models, API routes,
 * and admin forms. Includes create/update/query schemas and default value helpers.
 *
 * @namespace CityArtWalks.Validators.Notification
 * @version 1.0.0
 * @author Jaimie Garner
 * @requires zod - Zod validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Notification-Model} - Notification model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema} - Database schema documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Validation patterns documentation
 */

import { z } from 'zod';

/**
 * Notification create schema
 * @memberof CityArtWalks.Validators.Notification
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 */
export const createNotificationSchema = z.object({
  userId: z.number().int(),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.string().min(1, 'Type is required'),
  isRead: z.boolean().optional().default(false),
  priority: z.enum(['low', 'normal', 'medium', 'high']).optional().default('normal'),
  actionUrl: z.string().nullable().optional(),
  metadata: z.string().optional(), // JSON string for flexible metadata
});

/**
 * Notification update schema
 * @memberof CityArtWalks.Validators.Notification
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 */
export const updateNotificationSchema = z.object({
  title: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
  type: z.string().optional(),
  isRead: z.boolean().optional(),
  priority: z.string().optional(),
  // Add other fields as needed
});

/**
 * Notification query schema
 * @memberof CityArtWalks.Validators.Notification
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 */
export const notificationQuerySchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
  userId: z.number().int().optional(),
  type: z.string().optional(),
  isRead: z.boolean().optional(),
  priority: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * Default values for Notification form initialization
 * @memberof CityArtWalks.Validators.Notification
 */
export function getNotificationDefaultValues() {
  return {
    userId: '',
    title: '',
    message: '',
    type: '',
    isRead: false,
    priority: '',
  };
}
