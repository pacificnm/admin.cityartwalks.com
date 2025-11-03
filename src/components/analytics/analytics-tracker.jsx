/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Components.Analytics.AnalyticsTracker
 */

'use client';

import usePageViewTracking from 'src/hooks/use-page-view-tracking';

/**
 * AnalyticsTracker component for tracking page views.
 *
 * This component initializes page view tracking using the `usePageViewTracking` hook.
 * It does not render any UI and should be placed at the root of your application or page.
 *
 * @function
 * @returns {null} This component does not render anything.
 */
export default function AnalyticsTracker() {
  usePageViewTracking();
  return null;
}
