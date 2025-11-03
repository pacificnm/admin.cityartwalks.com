/**
 * IndexNow Action Chip Component
 *
 * Displays IndexNow submission action type with appropriate colors.
 * Supports CREATED, UPDATED, and DELETED actions with consistent
 * visual styling across the application.
 *
 * @namespace CityArtWalks.Components.IndexNow
 * @fileoverview Action chip component for IndexNow submissions
 * @author GitHub Copilot
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Integration} - IndexNow integration docs
 */

import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';

/**
 * @memberof CityArtWalks.Components.IndexNow
 * @function ActionChip
 * @description Displays IndexNow submission action type with appropriate visual styling.
 *
 * Provides consistent action type visualization across IndexNow submission interfaces
 * with color-coded chips for each action type that triggered the submission.
 *
 * @param {Object} props - Component props
 * @param {string} props.action - Action type (CREATED, UPDATED, DELETED)
 * @returns {JSX.Element} The rendered action chip component
 *
 * @example
 * // Display created action
 * <ActionChip action="CREATED" />
 *
 * // Display updated action
 * <ActionChip action="UPDATED" />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Actions} - Action documentation
 */
export function ActionChip({ action }) {
  const actionConfig = {
    CREATED: { label: 'Created', color: 'primary' },
    UPDATED: { label: 'Updated', color: 'secondary' },
    DELETED: { label: 'Deleted', color: 'error' },
  };

  const config = actionConfig[action] || { label: action, color: 'default' };

  return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
}

ActionChip.propTypes = {
  action: PropTypes.oneOf(['CREATED', 'UPDATED', 'DELETED']).isRequired,
};
