'use client';

import PropTypes from 'prop-types';
import { track } from '@vercel/analytics';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { CloseIcon } from 'src/components/icons';

import { ProductUpgradeView } from 'src/sections/product/view';
/**
 * ProductUpgradeDialog - Modal dialog for displaying product upgrade options and information.
 *
 * @component
 * @memberof CityArtWalks.Components.Product
 * @param {Object} props - Component props
 * @param {boolean} props.open - Controls whether the dialog is open
 * @param {Function} props.onClose - Callback function called when dialog should be closed
 * @param {string} [props.title="Upgrade Your Plan"] - Dialog title text
 * @param {React.ReactNode} [props.children] - Content to display in the dialog body
 * @param {boolean} [props.showCloseButton=true] - Whether to show the close button in the top right
 * @param {string} [props.closeButtonLabel="Close"] - Label for the close button
 * @param {Function} [props.onUpgrade] - Callback function called when upgrade action is triggered
 * @param {string} [props.upgradeButtonLabel="Upgrade Now"] - Label for the upgrade button
 * @param {boolean} [props.showUpgradeButton=true] - Whether to show the upgrade button
 * @param {object} [props.sx] - Optional MUI style overrides for the dialog
 * @returns {JSX.Element} The ProductUpgradeDialog component
 *
 * @description
 * A reusable dialog component for displaying product upgrade information and options.
 * Can be customized with different content, buttons, and styling.
 *
 * @example
 * <ProductUpgradeDialog
 *   open={upgradeDialogOpen}
 *   onClose={() => setUpgradeDialogOpen(false)}
 *   onUpgrade={() => handleUpgrade()}
 *   title="Upgrade to Premium"
 * >
 *   <Typography>Get access to premium features...</Typography>
 * </ProductUpgradeDialog>
 */
export function ProductUpgradeDialog({
  open,
  onClose,
  title = 'Upgrade Your Plan',
  children,
  showCloseButton = true,
  closeButtonLabel = 'Close',
  onUpgrade,
  upgradeButtonLabel = 'Upgrade Now',
  showUpgradeButton = true,
  sx,
}) {
  const handleClose = () => {
    track('product_upgrade_dialog', {
      action: 'dialog_close',
      title,
      source: 'close_button',
    });
    if (onClose) {
      onClose();
    }
  };

  const handleUpgrade = () => {
    track('product_upgrade_dialog', {
      action: 'upgrade_click',
      title,
      upgradeButtonLabel,
    });
    if (onUpgrade) {
      onUpgrade();
    }
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
        {children || <ProductUpgradeView containerMaxWidth="lg" cardMaxWidth="100%" />}
      </DialogContent>

      {showUpgradeButton && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            {closeButtonLabel}
          </Button>
          <Button onClick={handleUpgrade} variant="contained" color="primary">
            {upgradeButtonLabel}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

ProductUpgradeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  showCloseButton: PropTypes.bool,
  closeButtonLabel: PropTypes.string,
  onUpgrade: PropTypes.func,
  upgradeButtonLabel: PropTypes.string,
  showUpgradeButton: PropTypes.bool,
  sx: PropTypes.object,
};
