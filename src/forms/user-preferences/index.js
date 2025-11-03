/**
 * User Preferences Forms Index
 *
 * Central export point for all user preference form components.
 * These forms are designed to work with the tabbed preference interface
 * and provide comprehensive settings management for user preferences.
 *
 * @namespace CityArtWalks.Forms.UserPreferences
 * @fileoverview User preference forms module exports
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Preferences} - User preferences documentation
 */

export { EmailPreferencesForm } from './email-preferences-form';
export { PrivacyPreferencesForm } from './privacy-preferences-form';
export { LocationPreferencesForm } from './location-preferences-form';
export { NotificationPreferencesForm } from './notification-preferences-form';

// Re-export the legacy notification form for backward compatibility
export { NotificationPreferencesForm as LegacyNotificationPreferencesForm } from '../user-preference/notification-preferences-form';
