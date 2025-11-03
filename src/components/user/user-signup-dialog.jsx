'use client';

import PropTypes from 'prop-types';
import { track } from '@vercel/analytics';

import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

import { CloseIcon } from 'src/components/icons';

import { UserSignUpView } from 'src/sections/user/view';

/**
 * UserSignUpDialog - Modal dialog for user signup redirect to Auth0.
 *
 * @component
 * @memberof CityArtWalks.Components.User
 * @param {Object} props - Component props
 * @param {boolean} props.open - Controls whether the dialog is open
 * @param {Function} props.onClose - Callback function called when dialog should be closed
 * @param {string} [props.title="Create Your Account"] - Dialog title text
 * @param {string} [props.description="Join City Art Walks to unlock premium features and personalized experiences."] - Description text
 * @param {boolean} [props.showCloseButton=true] - Whether to show the close button in the top right
 * @param {string} [props.closeButtonLabel="Maybe Later"] - Label for the close button
 * @param {string} [props.signupButtonLabel="Sign Up with Auth0"] - Label for the signup button
 * @param {string} [props.signupUrl="/auth/auth0/sign-up"] - URL to redirect to for signup
 * @param {object} [props.sx] - Optional MUI style overrides for the dialog
 * @returns {JSX.Element} The UserSignUpDialog component
 *
 * @description
 * A dialog component that encourages users to sign up by redirecting them to Auth0.
 * All signup functionality is handled by Auth0, not within the application.
 *
 * @example
 * <UserSignUpDialog
 *   open={signupDialogOpen}
 *   onClose={() => setSignupDialogOpen(false)}
 *   title="Join Us Today"
 *   description="Sign up to access exclusive art walks and features."
 * />
 */
export function UserSignUpDialog({ open, onClose, title = 'Create Your Account', children, sx }) {
  const handleClose = () => {
    track('user_signup_dialog', {
      action: 'dialog_close',
      title,
      source: 'close_button',
    });
    if (onClose) onClose();
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose} sx={sx}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon size={24} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 0, flex: 1, overflow: 'auto' }}>
        {children || <UserSignUpView containerMaxWidth="lg" cardMaxWidth="100%" />}
      </DialogContent>
    </Dialog>
  );
}

UserSignUpDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  showCloseButton: PropTypes.bool,
  children: PropTypes.node,
  sx: PropTypes.object,
};
