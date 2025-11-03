/**
 * @fileoverview SWR hooks for Stripe operations
 * @author Generated
 * @version 1.1.0
 * @namespace CityArtWalks.Actions.Stripe.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions-Pattern} - Actions documentation
 */

import useSWR from 'swr';

import { debugError } from 'src/lib/debug';
import { subscribeUser, getStripeInvoices } from 'src/actions/stripe/requests';

/**
 * @memberof CityArtWalks.Actions.Stripe.Hooks
 * @function useSubscribeUser
 * @description Hook for subscribing a user via Stripe Checkout. Automatically redirects on success.
 *
 * @param {string} [token=''] - Optional Auth token for authorization
 * @returns {Function} Function to initiate subscription
 * @throws {Error} When Stripe session creation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Action documentation
 */
export function useSubscribeUser(token = '') {
  return async () => {
    try {
      await subscribeUser(token);
    } catch (error) {
      debugError('CityArtWalks.Actions.Stripe.Hooks.useSubscribeUser', 'Failed to subscribe user', {
        error: error.message,
        token: token ? '[REDACTED]' : 'none',
      });
      throw error;
    }
  };
}

/**
 * @memberof CityArtWalks.Actions.Stripe.Hooks
 * @description Custom SWR hook for fetching user's Stripe invoices with pagination
 * @param {Object} filters - Filter parameters
 * @param {string} accessToken - User access token for authorization
 * @param {number} [revalidateInterval=0] - Auto-revalidation interval in seconds
 * @param {string|null} [refreshKey=null] - Key to trigger refresh
 * @returns {Object} SWR response object with invoices data
 */
export function useStripeInvoices(
  filters = {},
  accessToken,
  revalidateInterval = 0,
  refreshKey = null
) {
  const { limit = 10, starting_after } = filters;

  const swrKey = refreshKey
    ? ['getStripeInvoices', limit, starting_after, refreshKey]
    : ['getStripeInvoices', limit, starting_after];

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    accessToken ? swrKey : null,
    async () => {
      const response = await getStripeInvoices(filters, accessToken);
      return response;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: revalidateInterval > 0 ? revalidateInterval * 1000 : 0,
      onError: (err) => {
        debugError('CityArtWalks.Actions.Stripe.Hooks.useStripeInvoices', err);
      },
    }
  );

  return {
    invoices: data?.invoices || [],
    hasMore: data?.hasMore || false,
    total: data?.total || 0,
    invoiceLoading: isLoading,
    invoiceValidating: isValidating,
    invoiceError: error,
    mutate,
  };
}
