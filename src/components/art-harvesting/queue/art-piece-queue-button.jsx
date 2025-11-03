/**
 * @fileoverview ArtPieceQueueButton Component
 *
 * Reusable button component for creating new art piece queue items.
 * Provides consistent styling and functionality across the art harvesting interface.
 *
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue
 * @version 1.0.0
 * @author Jaimie Garner
 * @since 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for UI structure
 * @requires src/components/icons - Icon components library
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components Documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceQueue-Model} - ArtPieceQueue Model Documentation
 */

'use client';

import PropTypes from 'prop-types';

import { Button } from '@mui/material';

import { AddIcon } from 'src/components/icons';

/**
 * ArtPieceQueueButton Component
 *
 * Renders a standardized "New Queue Item" button with consistent styling
 * and behavior for creating new art piece queue entries.
 *
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Click handler function
 * @param {string} [props.dataCy="create-art-piece-queue-button"] - Cypress test identifier
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {Object} [props.sx] - Additional Material-UI styles
 * @param {...Object} other - Additional props passed to Button
 *
 * @returns {JSX.Element} The rendered button component
 *
 * @example
 * <ArtPieceQueueButton onClick={handleCreateDialogOpen} />
 *
 * @example
 * <ArtPieceQueueButton
 *   onClick={handleCreate}
 *   disabled={loading}
 *   sx={{ mb: 2 }}
 * />
 */
export function ArtPieceQueueButton({
  onClick,
  dataCy = 'create-art-piece-queue-button',
  disabled = false,
  sx = {},
  ...other
}) {
  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onClick}
      data-cy={dataCy}
      disabled={disabled}
      sx={{
        bgcolor: 'primary.main',
        '&:hover': {
          bgcolor: 'primary.dark',
        },
        ...sx,
      }}
      {...other}
    >
      New Queue Item
    </Button>
  );
}

ArtPieceQueueButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  dataCy: PropTypes.string,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};
