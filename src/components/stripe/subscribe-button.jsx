/**
 * @file subscribe-button.jsx
 * @description Stripe subscription button component for user subscription management
 * @namespace CityArtWalks.Components.Stripe.SubscribeButton
 * @version 1.0.0
 * @author jaimie garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Stripe-Integration} - Stripe integration documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Authentication} - Authentication documentation
 */

'use client';

import { track } from '@vercel/analytics';

import Button from '@mui/material/Button';

import { useSubscribeUser } from 'src/actions/stripe/hooks';

import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Components.Stripe.SubscribeButton
 * @description Subscribe Button Component
 *
 * A button component that handles user subscription through Stripe integration.
 * Requires user authentication and uses the access token for secure subscription processing.
 *
 * Features:
 * - Authentication-aware subscription handling
 * - Error handling with user feedback
 * - Secure token-based API calls
 * - Simple click-to-subscribe interface
 *
 * @component
 * @returns {JSX.Element} The subscription button component
 *
 * @example
 * // Basic usage
 * <SubscribeButton />
 *
 * @example
 * // In a subscription section
 * <div className="subscription-section">
 *   <h3>Upgrade to Premium</h3>
 *   <SubscribeButton />
 * </div>
 *
 * @since 1.0.0
 */
export default function SubscribeButton() {
  /**
   * @description Get authentication context for access token
   * @type {Object}
   */
  const { accessToken } = useAuthContext();

  /**
   * @description Hook for handling user subscription
   * @type {Function}
   */
  const subscribe = useSubscribeUser(accessToken); // Pass token to hook

  /**
   * @memberof CityArtWalks.Components.Stripe.SubscribeButton
   * @description Handles the subscription button click event
   *
   * Initiates the subscription process using the authenticated user's access token.
   * Shows a toast notification if the subscription fails.
   *
   * @async
   * @function handleClick
   * @returns {Promise<void>} Promise that resolves when subscription is complete
   *
   * @throws {Error} When subscription fails - displays error toast to user
   *
   * @example
   * // Called automatically on button click
   * await handleClick();
   */
  const handleClick = async () => {
    track('stripe_subscribe_button', {
      action: 'subscription_click',
      source: 'upgrade_dialog',
    });

    try {
      await subscribe(); // Don't pass token here since it's already in the hook
      toast.success('Successfully subscribed to City Art Walks Annual Membership!');
    } catch (err) {
      toast.error(`Subscription failed: ${err.message}`);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      fullWidth
      onClick={handleClick}
      sx={{ py: 1.5 }}
    >
      Subscribe Now
    </Button>
  );
}
