/**
 * @namespace CityArtWalks.Components.UserPreferences.NotificationTab
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.UserPreferences
 * @description Notification preferences tab component following art-piece detail view pattern.
 * Direct rendering of notification settings with proper error handling.
 */

'use client';

import React from 'react';
import PropTypes from 'prop-types';

import { NotificationPreferencesForm } from 'src/forms/user-preferences';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Components.UserPreferences.NotificationTab
 * @function NotificationTab
 * @description Renders the notification preferences tab content with error boundary protection.
 * This component will eventually render the NotificationPreferencesForm component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.userId - The user ID for notification preferences.
 * @returns {JSX.Element} The rendered NotificationTab component.
 *
 * @example
 * <NotificationTab userId={user?.userId} />
 */
export function NotificationTab(props) {
  const { userId } = props;

  return (
    <ErrorBoundary>
      <NotificationPreferencesForm userId={userId} />
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Components.UserPreferences.NotificationTab
 * PropTypes validation for the NotificationTab component
 */
NotificationTab.propTypes = {
  userId: PropTypes.number,
};
