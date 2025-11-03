/**
 * @namespace CityArtWalks.Components.Auth.PermissionsGate
 * @version 1.0.0
 * @author [Jaimie Garner]
 */

'use client';

import React from 'react';

import { PricingView } from 'src/sections/pricing/view';

import { ErrorView } from '../error/error-view';
/**
 * @memberof CityArtWalks.Components.Auth.PermissionsGate
 * @function PermissionsGate
 * @param {Object} permissions
 * @param {Obaject} requiredPermission
 * @param {Object} children
 * @returns {null| Object} Returns either null or the children object that passed the permission check
 * @example
 * <PermissionsGate permissions={user?.permissions} requiredPermission="piece:favorite">
 * <button onClick={handleFavorite}>Favorite</button>
 * </PermissionsGate>
 */
export const PermissionsGate = ({ permissions, requiredPermission, children }) => {
  // Return null if there are no permissions (e.g., user not signed in)
  if (!permissions || !Array.isArray(permissions)) {
    return null;
  }

  // Corrected: Compare requiredPermission directly to the permission strings in the array
  const hasPermission = permissions.includes(requiredPermission);

  // If the user has the required permission, render the children; otherwise, return null
  return hasPermission ? <>{children}</> : null;
};

/**
 * @memberof CityArtWalks.Components.Auth.PermissionsGate
 * @function SubscriptionGate
 * @description A component that conditionally renders its children based on whether the user has the required subscription permission.
 * If the required permission is missing, it displays a pricing view instead.
 *
 * @param {Object} props - The component properties.
 * @param {Array<string>} props.permissions - An array of permissions associated with the user.
 * @param {string} props.requiredPermission - The specific permission required to render the children.
 * @param {React.ReactNode} props.children - The content to render if the required permission is present.
 * @returns {JSX.Element|null} The rendered children if the user has the required permission, a pricing view if not, or null if permissions are not defined.
 *
 * @example
 * <SubscriptionGate
 *   permissions={['view:premium', 'edit:basic']}
 *   requiredPermission="view:premium"
 * >
 *   <PremiumContent />
 * </SubscriptionGate>
 */
export const SubscriptionGate = ({ permissions, requiredPermission, children }) => {
  // Return null if there are no permissions (e.g., user not signed in)
  if (!permissions || !Array.isArray(permissions)) {
    return <PricingView />;
  }

  // Corrected: Compare requiredPermission directly to the permission strings in the array
  const hasPermission = permissions.includes(requiredPermission);

  return hasPermission ? <>{children}</> : <PricingView />;
};

/**
 * @memberof CityArtWalks.Components.Auth.PermissionsGate
 * @description A component that restricts access to its children based on user permissions.
 *
 * This component checks whether the user has the necessary permissions to view the page or content.
 * If the user lacks permissions or is not signed in, it displays an error view with a 403 status.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Array<string>} props.permissions - The list of permissions the user has.
 * @param {string} props.requiredPermission - The specific permission required to access the page.
 * @param {React.ReactNode} props.children - The content to display if the user has the required permission.
 * @returns {React.ReactNode} The children content if the user has access, or an error view if not.
 *
 * @example
 * import { PagePermissionsGate } from './PagePermissionsGate';
 *
 * <PagePermissionsGate
 *   permissions={['read', 'write']}
 *   requiredPermission="admin"
 * >
 *   <AdminPanel />
 * </PagePermissionsGate>
 */
export const PagePermissionsGate = ({ permissions, requiredPermission, children }) => {
  // Return null if there are no permissions (e.g., user not signed in)
  if (!permissions || !Array.isArray(permissions)) {
    return (
      <ErrorView
        status={403}
        message="You do not have the necessary permissions to access this page. (Missing Permissions)"
      />
    );
  }

  // Corrected: Compare requiredPermission directly to the permission strings in the array
  const hasPermission = permissions.includes(requiredPermission);

  // If the user has the required permission, render the children; otherwise, return null
  return hasPermission ? (
    <>{children}</>
  ) : (
    <ErrorView
      status={403}
      message="You do not have the necessary permissions to access this page."
    />
  );
};

/**
 * @memberof CityArtWalks.Components.Auth.PermissionsGate
 * @function APIPermissionsGate
 * @description A function to validate user permissions for API access.
 *
 * This function checks whether the user has the necessary permissions to access a given API.
 * If the user lacks permissions or the provided permissions array is invalid, it returns a
 * `403 Forbidden` response with an error message.
 *
 * @param {Object} props - The properties passed to the function.
 * @param {Array<string>} props.permissions - The list of permissions the user has.
 * @param {string} props.requiredPermission - The specific permission required to access the API.
 * @returns {Response|null} A `403 Forbidden` response if the user lacks the required permission,
 * or `null` if the user has the necessary access.
 *
 * @example
 * import { APIPermissionsGate } from './APIPermissionsGate';
 *
 * const response = APIPermissionsGate({
 *   permissions: ['read', 'write'],
 *   requiredPermission: 'admin',
 * });
 *
 * if (response) {
 *   return response; // Respond with the 403 error.
 * }
 *
 * // Continue with API logic if the user has access
 */
export const APIPermissionsGate = ({ permissions, requiredPermission }) => {
  // Check if permissions are provided and valid
  if (!permissions || !Array.isArray(permissions)) {
    return new Response(
      JSON.stringify({
        error: 'You do not have the necessary permissions to access this API.',
      }),
      { status: 403 }
    );
  }

  // Corrected: Compare requiredPermission directly to the permission strings in the array
  const hasPermission = permissions.includes(requiredPermission);

  // Return appropriate response based on permission
  if (!hasPermission) {
    return new Response(
      JSON.stringify({
        error: 'You do not have the necessary permissions to access this API.',
      }),
      { status: 403 }
    );
  }

  // Return success or continue further logic
  return new Response(
    JSON.stringify({
      message: 'Allowed',
    }),
    { status: 200 }
  );
};
