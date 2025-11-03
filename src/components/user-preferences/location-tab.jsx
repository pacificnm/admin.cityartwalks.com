/**
 * @namespace CityArtWalks.Components.UserPreferences.LocationTab
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.UserPreferences
 * @description Location preferences tab component following art-piece detail view pattern.
 * Direct rendering of location settings with proper error handling.
 */

'use client';

import React from 'react';
import PropTypes from 'prop-types';

import { LocationPreferencesForm } from 'src/forms/user-preferences';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Components.UserPreferences.LocationTab
 * @function LocationTab
 * @description Renders the location preferences tab content with error boundary protection.
 * This component will eventually render the LocationPreferencesForm component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.userId - The user ID for location preferences.
 * @returns {JSX.Element} The rendered LocationTab component.
 *
 * @example
 * <LocationTab userId={user?.userId} />
 */
export function LocationTab(props) {
  const { userId } = props;

  return (
    <ErrorBoundary>
      <LocationPreferencesForm userId={userId} />
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Components.UserPreferences.LocationTab
 * PropTypes validation for the LocationTab component
 */
LocationTab.propTypes = {
  userId: PropTypes.number,
};
