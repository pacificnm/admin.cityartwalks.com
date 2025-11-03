/**
 * @namespace CityArtWalks.Components.UserPreferences.EmailTab
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.UserPreferences
 * @description Email preferences tab component following art-piece detail view pattern.
 * Direct rendering of email settings with proper error handling.
 */

'use client';

import React from 'react';
import PropTypes from 'prop-types';

import { EmailPreferencesForm } from 'src/forms/user-preferences';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Components.UserPreferences.EmailTab
 * @function EmailTab
 * @description Renders the email preferences tab content with error boundary protection.
 * This component will eventually render the EmailPreferencesForm component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.userId - The user ID for email preferences.
 * @returns {JSX.Element} The rendered EmailTab component.
 *
 * @example
 * <EmailTab userId={user?.userId} />
 */
export function EmailTab(props) {
  const { userId } = props;

  return (
    <ErrorBoundary>
      <EmailPreferencesForm userId={userId} />
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Components.UserPreferences.EmailTab
 * PropTypes validation for the EmailTab component
 */
EmailTab.propTypes = {
  userId: PropTypes.number,
};
