/**
 * @namespace CityArtWalks.Components.UserPreferences.PrivacyTab
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.UserPreferences
 * @description Privacy preferences tab component following art-piece detail view pattern.
 * Direct rendering of privacy settings with proper error handling.
 */

'use client';

import React from 'react';
import PropTypes from 'prop-types';

import { PrivacyPreferencesForm } from 'src/forms/user-preferences';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Components.UserPreferences.PrivacyTab
 * @function PrivacyTab
 * @description Renders the privacy preferences tab content with error boundary protection.
 * This component renders the PrivacyPreferencesForm component for managing user privacy settings.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.userId - The user ID for privacy preferences.
 * @returns {JSX.Element} The rendered PrivacyTab component.
 *
 * @example
 * <PrivacyTab userId={user?.userId} />
 */
export function PrivacyTab({ userId }) {
  return (
    <ErrorBoundary>
      <PrivacyPreferencesForm userId={userId} />
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Components.UserPreferences.PrivacyTab
 * PropTypes validation for the PrivacyTab component
 */
PrivacyTab.propTypes = {
  userId: PropTypes.number,
};
