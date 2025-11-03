/**
 * @version 1.1.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Utils.WithTracking
 * @description Wraps a function to track an analytics event after execution.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/With-Tracking-Util} - Complete documentation
 */

/**
 * Wraps an event handler to also send analytics tracking.
 *
 * @function withTracking
 * @param {Function} handler - The original event handler.
 * @param {Object} options - Tracking options.
 * @param {string} options.event - The name of the analytics event.
 * @param {Object} [options.data={}] - Additional tracking metadata.
 * @param {string} [options.userId] - User ID if available.
 * @param {string} [options.accessToken] - Access token for API authentication.
 * @returns {Function} A new function that calls the handler and tracks the event.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/With-Tracking-Util} - Complete documentation
 */
export function withTracking(handler, { event, data = {}, userId, accessToken } = {}) {
  return function wrappedHandler(...args) {
    if (typeof handler === 'function') {
      handler(...args);
    }

    // Analytics tracking removed - function now only executes the handler
  };
}
