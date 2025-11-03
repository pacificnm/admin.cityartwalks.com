/**
 * @file geo-location.js
 * @description Zod validation schemas for geo-location parameters and helpers.
 * This module provides validators for city slug and name parameter parsing and
 * transforms user-friendly names into URL-safe slugs. Useful for route
 * parameter validation and server-side lookup of geographic entities.
 *
 * @namespace CityArtWalks.Validators.GeoLocation
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Validator}
 */

import { z } from 'zod';
import slugify from 'slugify';

/**
 * Slug parameter schema for city lookup
 * @memberof CityArtWalks.Validators.GeoLocation
 */
export const geoCitySlugParamsSchema = z.object({
  countrySlug: z.string().min(1, 'countrySlug is required'),
  stateSlug: z.string().min(1, 'stateSlug is required'),
  citySlug: z.string().min(1, 'citySlug is required'),
});

/**
 * Name parameter schema with transform to slugs
 * @memberof CityArtWalks.Validators.GeoLocation
 */
export const geoCityNameParamsSchema = z
  .object({
    country: z.string().min(1, 'country is required'),
    region: z.string().min(1, 'region is required'),
    city: z.string().min(1, 'city is required'),
  })
  .transform(({ country, region, city }) => ({
    countrySlug: slugify(country, { lower: true, strict: true }),
    stateSlug: slugify(region, { lower: true, strict: true }),
    citySlug: slugify(city, { lower: true, strict: true }),
  }));

export default {
  geoCitySlugParamsSchema,
  geoCityNameParamsSchema,
};
