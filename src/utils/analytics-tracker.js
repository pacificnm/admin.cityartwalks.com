/**
 * @namespace CityArtWalks.Utils.AnalyticsTracker
 * @version 3.0.0
 * @description Modern analytics tracking utility following project patterns
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Tracker-Util} - Complete documentation
 */

import { v4 as uuidv4 } from 'uuid';

import { debugInfo, debugError } from 'src/lib/debug';
import { trackAnalyticsEvent, updateAnalyticsUserMapping } from 'src/actions/analytics';

import { getGeoIPFromCache } from './geo-location';

// --------------------------------------
// Analytics throttling and deduplication
const eventQueue = new Map(); // Track recent events to prevent duplicates
const userUpdateQueue = new Set(); // Track pending user updates
const THROTTLE_WINDOW = 2000; // 2 seconds throttle window
const UPDATE_DEBOUNCE = 5000; // 5 seconds debounce for user updates

// Clean up old events from throttle cache every minute
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamp] of eventQueue.entries()) {
      if (now - timestamp > THROTTLE_WINDOW * 5) {
        // Keep for 5x throttle window
        eventQueue.delete(key);
      }
    }
  }, 60000);
}

// --------------------------------------

/**
 * Track an analytics event using the actions pattern.
 * @function trackEvent
 * @param {Object} options - Tracking options
 * @param {string} options.event - Event name
 * @param {string} [options.type='event'] - Event type
 * @param {Object} [options.data={}] - Additional event data
 * @param {string} [options.userId] - User ID
 * @param {string} [options.accessToken] - Access token for API authentication
 * @param {boolean} [options.skipUserUpdate=false] - Skip automatic user mapping update
 * @returns {Promise<void>}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Tracker-Util} - Complete documentation
 */
export async function trackEvent({
  event,
  type = 'event',
  data = {},
  userId,
  accessToken,
  skipUserUpdate = false,
}) {
  // Only run in browser environment
  if (typeof window === 'undefined') return;

  // Require userId to be passed in from React context/component
  // Convert userId to number if it exists, otherwise return early
  let resolvedUserId = null;
  if (userId !== null && userId !== undefined && userId !== '') {
    const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    if (!isNaN(numericUserId)) {
      resolvedUserId = numericUserId;
    }
  }

  // Skip tracking if no valid user ID
  if (!resolvedUserId) {
    debugInfo(
      'CityArtWalks.Utils.AnalyticsTracker',
      `Skipped tracking event '${event}' - no user ID provided`
    );
    return;
  }

  // Prevent duplicate events within throttle window
  const eventKey = `${event}-${type}-${JSON.stringify(data)}`;
  const now = Date.now();

  if (eventQueue.has(eventKey)) {
    const lastCall = eventQueue.get(eventKey);
    if (now - lastCall < THROTTLE_WINDOW) {
      // console.log('[Analytics] Throttled duplicate event?:', eventKey);
      return;
    }
  }

  eventQueue.set(eventKey, now);

  const visitorId = getOrSetVisitorId();
  const sessionId = getOrSetSessionId();
  // Defensive: ensure path and referer are always strings
  const rawPath = window.location.pathname;
  const path = typeof rawPath === 'string' ? rawPath : '';
  const rawReferer = getReferrer(path);
  const referer = typeof rawReferer === 'string' ? rawReferer : '';

  // Fetch geo if needed
  const geo = await getGeoIPFromCache();

  // Prepare event payload
  const payload = {
    type,
    event,
    visitorId,
    sessionId,
    path,
    userId: resolvedUserId,
    userAgent: navigator.userAgent,
    referer,
    locale: navigator.language,
    data,
    ...(geo && {
      city: geo.city,
      region: geo.regionName,
      country: geo.countryCode,
      latitude: geo.lat,
      longitude: geo.lon,
      postalCode: geo.zip,
      timezone: geo.timezone,
      isp: geo.isp,
      ip: geo.query,
    }),
  };

  try {
    // Track the event using the actions pattern
    await trackAnalyticsEvent(payload, accessToken);
    debugInfo('CityArtWalks.Utils.AnalyticsTracker', `Tracked event: ${event}`, {
      type,
      userId: resolvedUserId,
    });

    // Debounced user update - only send if userId exists, not skipped, and not already queued
    if (resolvedUserId && !skipUserUpdate && !userUpdateQueue.has(resolvedUserId)) {
      userUpdateQueue.add(resolvedUserId);

      // Debounce user updates to prevent excessive calls
      setTimeout(async () => {
        try {
          await updateAnalyticsUserMapping(
            {
              visitorId,
              sessionId,
              path: typeof path === 'string' ? path : '', // ensure string
              userId: resolvedUserId, // keep as number
            },
            accessToken
          );
        } catch (error) {
          debugError('CityArtWalks.Utils.AnalyticsTracker', 'Failed to update user mapping', error);
        } finally {
          userUpdateQueue.delete(resolvedUserId);
        }
      }, UPDATE_DEBOUNCE);
    }
  } catch (error) {
    debugError('CityArtWalks.Utils.AnalyticsTracker', 'Failed to track event', error);
  }
}

// --------------------------------------
// Helper functions
// --------------------------------------

/**
 * Get or create visitor ID.
 * @function getOrSetVisitorId
 * @returns {string} Visitor ID
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Tracker-Util} - Complete documentation
 */
function getOrSetVisitorId() {
  if (typeof window === 'undefined') return uuidv4();

  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = uuidv4();
    localStorage.setItem('visitor_id', id);
  }
  return id;
}

/**
 * Get or create session ID.
 * @function getOrSetSessionId
 * @returns {string} Session ID
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Tracker-Util} - Complete documentation
 */
function getOrSetSessionId() {
  if (typeof window === 'undefined') return uuidv4();

  let id = sessionStorage.getItem('session_id');
  if (!id) {
    id = uuidv4();
    sessionStorage.setItem('session_id', id);
  }
  return id;
}

/**
 * Get referrer URL.
 * @function getReferrer
 * @param {string} currentPath - Current path
 * @returns {string} Referrer URL
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Tracker-Util} - Complete documentation
 */
function getReferrer(currentPath) {
  if (typeof window === 'undefined') return '';

  return document.referrer && document.referrer !== window.location.href
    ? document.referrer
    : sessionStorage.getItem('previousPath') || '';
}
