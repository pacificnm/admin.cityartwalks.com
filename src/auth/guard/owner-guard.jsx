'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { debugWarn } from 'src/lib/debug';

import { useAuthContext } from 'src/auth/hooks';

/**
 * OwnerGuard - Enforces ownership-based access control for protected content.
 * Also allows admin users to access all content regardless of ownership.
 *
 * @component
 * @memberof CityArtWalks.Auth.Guard
 * @param {Object} props - Component props
 * @param {string|number} props.userId - The user ID that owns the content
 * @param {React.ReactNode} props.children - The protected content to render if access is allowed
 * @param {boolean} [props.showLoader=true] - Whether to show a loading spinner while checking auth
 * @returns {JSX.Element|null} Returns children if user owns the content or is admin, null otherwise
 *
 * @description
 * Checks if the current authenticated user's ID matches the provided userId OR if the user has admin role.
 * If either condition is true, renders the children. If not, returns null (hides content).
 * Useful for protecting content that should only be visible to the owner or admins.
 *
 * @example
 * // Show edit button to the art piece creator or admins
 * <OwnerGuard userId={artPiece.createdBy}>
 *   <EditButton />
 * </OwnerGuard>
 *
 * // Show profile settings to the profile owner or admins
 * <OwnerGuard userId={profile.userId}>
 *   <ProfileSettings />
 * </OwnerGuard>
 *
 * // Without loading spinner
 * <OwnerGuard userId={comment.authorId} showLoader={false}>
 *   <DeleteCommentButton />
 * </OwnerGuard>
 */
export function OwnerGuard(props) {
  const { userId, children, showLoader = true } = props;

  const { user, loading } = useAuthContext();

  // Show loading while auth system is still loading
  if (loading && showLoader) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 40 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  // If auth is still loading but showLoader is false, return null
  if (loading) {
    return null;
  }

  // If no user is authenticated, deny access
  if (!user) {
    debugWarn(
      `[OwnerGuard]: No authenticated user found, denying access to content owned by userId: ${userId}`
    );
    return null;
  }

  // If no userId is provided, deny access
  if (!userId) {
    debugWarn(`[OwnerGuard]: No userId provided for ownership check`);
    return null;
  }

  // Check if current user's ID matches the provided userId or if user is admin
  // Convert both to strings for comparison to handle different data types
  const currentUserId = user.userId;
  const currentUserRole = user.role;
  const ownerUserId = String(userId);
  const userIdToCheck = String(currentUserId);

  // Allow access if user owns the content OR if user is admin
  if (userIdToCheck === ownerUserId || currentUserRole === 'ADMIN') {
    // User owns the content or is admin, show it
    return <>{children}</>;
  }

  // User does not own the content and is not admin, hide it
  debugWarn(
    `[OwnerGuard]: Access denied - current user ${userIdToCheck} (role: ${currentUserRole}) does not own content belonging to ${ownerUserId} and is not admin`
  );
  return null;
}

OwnerGuard.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.node.isRequired,
  showLoader: PropTypes.bool,
};
