'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { debugWarn, debugError } from 'src/lib/debug';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import { UserSignUpDialog } from 'src/components/user';
import { ProductUpgradeDialog } from 'src/components/product';

import { UserSignUpView } from 'src/sections/user/view';
import { ProductUpgradeView } from 'src/sections/product/view';

import { useAuthContext } from 'src/auth/hooks';
/**
 * RoleBasedGuard - Enforces role-based access control for protected routes/components.
 *
 * @component
 * @memberof CityArtWalks.Auth.Guard
 * @param {Object} props - Component props
 * @param {string[]} [props.allowedRoles=[]] - Array of allowed roles for access (e.g., ['ADMIN', 'MEMBER', 'USER'])
 * @param {boolean} [props.hasContent=true] - If true, shows a permission denied UI when access is forbidden
 * @param {React.ReactNode} props.children - The protected content to render if access is allowed
 * @param {object|array} [props.sx] - Optional MUI style overrides
 * @param {'view'|'dialog'|'content'} [props.displayMode='view'] - Whether to show full-page views, dialog overlays, or raw content components for access denial
 * @param {boolean} [props.dialogOpen] - Controls dialog visibility when displayMode is 'dialog' (optional - uses internal state if not provided)
 * @param {Function} [props.onDialogClose] - Callback when dialog is closed (optional - uses internal handler if not provided)
 * @param {string} [props.protecting] - Optional identifier for what is being protected (used for logging and access validation tracking)
 * @returns {JSX.Element|null} Returns children if access is allowed, appropriate upgrade/signup view, or 403 denial UI
 *
 * @description
 * Enhanced role-based access control with smart view routing and dialog support:
 * Role hierarchy: public (anonymous) → USER (signed up) → MEMBER (paid) → ADMIN (restricted)
 * - Redirects to sign-in if user is authenticated but token is missing/expired, and logs an 'expired_token' event.
 * - PUBLIC/anonymous users accessing USER/MEMBER/ADMIN content: Shows UserSignUpView/Dialog
 * - USER role accessing MEMBER/ADMIN content: Shows ProductUpgradeView/Dialog
 * - Any user accessing ADMIN-only content: Shows 403 permission denied
 * - Shows a spinner while loading or if user is not yet loaded.
 * - Returns null if token is missing/expired (AuthGuard handles redirect).
 *
 * @example
 * // Admin-only access (shows 403 for non-admins)
 * <RoleBasedGuard allowedRoles={["ADMIN"]}>
 *   <AdminPanel />
 * </RoleBasedGuard>
 *
 * // Member content with full-page views (PUBLIC sees signup, USER sees upgrade)
 * <RoleBasedGuard allowedRoles={["MEMBER", "ADMIN"]} displayMode="view">
 *   <MemberContent />
 * </RoleBasedGuard>
 *
 * // Member content with dialog overlays (automatic state management)
 * <RoleBasedGuard allowedRoles={["MEMBER", "ADMIN"]} displayMode="dialog">
 *   <MemberButton />
 * </RoleBasedGuard>
 *
 * // Member content with raw content component for dialog swapping
 * <RoleBasedGuard allowedRoles={["MEMBER", "ADMIN"]} displayMode="content">
 *   <MemberButton />
 * </RoleBasedGuard>
 *
 * // Member content with external dialog control (optional)
 * <RoleBasedGuard
 *   allowedRoles={["MEMBER", "ADMIN"]}
 *   displayMode="dialog"
 *   dialogOpen={upgradeDialogOpen}
 *   onDialogClose={() => setUpgradeDialogOpen(false)}
 * >
 *   <MemberButton />
 * </RoleBasedGuard>
 */
export function RoleBasedGuard(props) {
  const {
    allowedRoles = [],
    hasContent = true,
    children,
    sx,
    displayMode = 'hidden',
    dialogOpen, // Optional external control
    onDialogClose, // Optional external control
    protecting = 'unknown', // What is being protected
  } = props;

  // Internal state for dialog management when external control is not provided
  const [internalDialogOpen, setInternalDialogOpen] = useState(true);

  // Use external control if provided, otherwise use internal state
  const isDialogOpen = dialogOpen !== undefined ? dialogOpen : internalDialogOpen;
  const handleDialogClose = onDialogClose || (() => setInternalDialogOpen(false));

  const { user, loading } = useAuthContext();

  const currentRole = user?.role || 'public';

  // Show loading while auth system is still loading
  if (loading) {
    return (
      <Box
        sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Normalize current role and allowed roles (case-insensitive handling)
  const normalizedRoleRaw =
    typeof currentRole === 'string' && currentRole.trim() ? currentRole.trim() : 'public';
  const roleUpper = normalizedRoleRaw.toUpperCase();
  const roleLower = normalizedRoleRaw.toLowerCase();
  const normalizedAllowed = allowedRoles
    .map((r) => (typeof r === 'string' && r.trim() ? r.trim().toUpperCase() : ''))
    .filter(Boolean);

  // If no roles are required, always allow access (public content)
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Handle role-based access control with enhanced logic
  // Case-insensitive authorization check using normalized values
  if (allowedRoles.length > 0 && !normalizedAllowed.includes(roleUpper)) {
    debugWarn(
      'RoleBasedGuard.checkAccess',
      `Unauthorized access attempt - protecting: ${protecting}, role: ${roleLower || 'public'}, allowedRoles: ${allowedRoles.join(', ')}`
    );

    // If displayMode is 'hidden', return null (completely hide the component)
    if (displayMode === 'hidden') return null;

    // If hasContent is explicitly false, return null
    if (hasContent === false) return null;

    // Validate that only allowed roles are used
    const validRoles = ['PUBLIC', 'USER', 'MEMBER', 'ADMIN'];
    const invalidRoles = normalizedAllowed.filter((role) => !validRoles.includes(role));

    if (invalidRoles.length > 0) {
      debugError(
        'RoleBasedGuard.validateRoles',
        `Invalid roles detected - protecting: ${protecting}, invalidRoles: ${invalidRoles.join(', ')}. Only 'public', 'USER', 'MEMBER', 'ADMIN' are allowed.`
      );
      return (
        <Container sx={[{ textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Configuration Error
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Invalid role configuration detected. Please contact support.
          </Typography>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </Container>
      );
    }

    // Enhanced role-based view logic with new role hierarchy
    // Role hierarchy: public (anonymous) → USER (signed up) → MEMBER (paid) → ADMIN (restricted)
    const isPublicUser = roleLower === 'public';
    const isUserRole = roleUpper === 'USER';
    const isMemberRole = roleUpper === 'MEMBER';
    const isAdminRole = roleUpper === 'ADMIN';
    const requiresAdmin = normalizedAllowed.includes('ADMIN');
    const requiresOnlyAdmin = normalizedAllowed.length === 1 && normalizedAllowed[0] === 'ADMIN';
    const requiresMember = normalizedAllowed.includes('MEMBER');
    const requiresUser = normalizedAllowed.includes('USER');

    // Determine what to show based on display mode and role requirements
    if (displayMode === 'dialog') {
      // Dialog mode - show dialog overlays

      // PUBLIC user trying to access USER/MEMBER/ADMIN content -> Show signup dialog
      if (isPublicUser && (requiresUser || requiresMember || requiresAdmin)) {
        return (
          <>
            {children}
            <UserSignUpDialog open={isDialogOpen} onClose={handleDialogClose} />
          </>
        );
      }

      // USER trying to access MEMBER/ADMIN content -> Show upgrade dialog
      if (isUserRole && (requiresMember || requiresAdmin)) {
        return (
          <>
            {children}
            <ProductUpgradeDialog
              open={isDialogOpen}
              onClose={handleDialogClose}
              showUpgradeButton={false}
            />
          </>
        );
      }

      // MEMBER trying to access ADMIN content -> Don't show content at all
      if (isMemberRole && requiresOnlyAdmin) {
        return null;
      }
    } else if (displayMode === 'content') {
      // Content mode - return raw content components for dialog swapping

      // PUBLIC user trying to access USER/MEMBER/ADMIN content -> Return signup content
      if (isPublicUser && (requiresUser || requiresMember || requiresAdmin)) {
        return <UserSignUpView />;
      }

      // USER trying to access MEMBER/ADMIN content -> Return upgrade content
      if (isUserRole && (requiresMember || requiresAdmin)) {
        return <ProductUpgradeView />;
      }

      // MEMBER trying to access ADMIN content -> Return permission denied content
      if (isMemberRole && requiresOnlyAdmin) {
        return (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Permission denied
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              You do not have permission to access this content.
            </Typography>
          </Box>
        );
      }
    } else {
      // View mode - show full-page views

      // PUBLIC user trying to access USER/MEMBER/ADMIN content -> Show signup view
      if (isPublicUser && (requiresUser || requiresMember || requiresAdmin)) {
        return <UserSignUpView />;
      }

      // USER trying to access MEMBER/ADMIN content -> Show upgrade view
      if (isUserRole && (requiresMember || requiresAdmin)) {
        return <ProductUpgradeView />;
      }
    }

    // Any user accessing ADMIN-only content without ADMIN role -> Show 403
    if (requiresOnlyAdmin && !isAdminRole) {
      return (
        <Container sx={[{ textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Permission denied
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page.
          </Typography>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </Container>
      );
    }

    // Fallback to default 403 view
    return (
      <Container sx={[{ textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Permission denied
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          You do not have permission to access this page.
        </Typography>
        <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
      </Container>
    );
  }
  //console.log(`[RoleBasedGuard]: Authorized access attempt by role: ${currentRole}, allowedRoles: ${allowedRoles.join(', ')}`);
  return <>{children}</>;
}

RoleBasedGuard.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  hasContent: PropTypes.bool,
  children: PropTypes.node,
  sx: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  displayMode: PropTypes.oneOf(['view', 'dialog', 'content', 'hidden']),
  dialogOpen: PropTypes.bool,
  onDialogClose: PropTypes.func,
  protecting: PropTypes.string,
};
