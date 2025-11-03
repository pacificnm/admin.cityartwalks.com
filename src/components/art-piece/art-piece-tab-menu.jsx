/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceTabMenu
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.ArtPiece
 * @description Responsive tab menu component that displays tabs on desktop and dropdown on mobile.
 */

'use client';

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { track } from '@vercel/analytics';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import { ArrowDownIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceTabMenu
 * @function ArtPieceTabMenu
 * @description Renders a responsive tab menu that shows horizontal tabs on desktop and dropdown on mobile.
 * Includes support for icons, counts, and tracking analytics.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.tabs - Array of tab objects with value, label, and icon.
 * @param {string} props.currentTab - Currently selected tab value.
 * @param {Function} props.onTabChange - Callback when tab selection changes.
 * @param {Object} [props.sx] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered ArtPieceTabMenu component.
 *
 * @example
 * <ArtPieceTabMenu
 *   tabs={tabsWithCounts}
 *   currentTab={currentTab}
 *   onTabChange={setCurrentTab}
 * />
 */
export function ArtPieceTabMenu(props) {
  const { tabs, currentTab, onTabChange, sx = {} } = props;

  const [tabMenuAnchor, setTabMenuAnchor] = useState(null);

  /**
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceTabMenu
   * @function handleTabChange
   * @description Handles tab change for desktop tabs.
   * @private
   * @param {Event} event - The event object.
   * @param {string} newValue - The new tab value.
   */
  const handleTabChange = (event, newValue) => {
    track('art_piece_tab_change', {
      tab: newValue,
      section: 'Art Piece Details',
      device: 'desktop',
    });
    onTabChange(newValue);
  };

  /**
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceTabMenu
   * @function handleTabMenuOpen
   * @description Opens the dropdown menu on mobile.
   * @private
   * @param {Event} event - The click event.
   */
  const handleTabMenuOpen = (event) => {
    setTabMenuAnchor(event.currentTarget);
  };

  /**
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceTabMenu
   * @function handleTabMenuClose
   * @description Closes the dropdown menu.
   * @private
   */
  const handleTabMenuClose = () => {
    setTabMenuAnchor(null);
  };

  /**
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceTabMenu
   * @function handleTabMenuSelect
   * @description Handles tab selection from dropdown menu.
   * @private
   * @param {string} tabValue - The selected tab value.
   */
  const handleTabMenuSelect = (tabValue) => {
    track('art_piece_tab_change', {
      tab: tabValue,
      section: 'Art Piece Details',
      device: 'mobile',
    });
    onTabChange(tabValue);
    setTabMenuAnchor(null);
  };

  const currentTabData = tabs.find((tab) => tab.value === currentTab);

  return (
    <>
      {/* Desktop Tabs */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, ...sx }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: { sm: 'center', md: 'flex-end' },
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {/* Mobile Dropdown */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'absolute',
          bottom: 0,
          right: 0,
          zIndex: 9,
          p: 2,
          bgcolor: 'background.paper',
          width: 1,
          ...sx,
        }}
      >
        <IconButton
          onClick={handleTabMenuOpen}
          sx={{
            width: 1,
            justifyContent: 'space-between',
            borderRadius: 1,
            px: 2,
            py: 1,
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {currentTabData?.icon}
            <Typography variant="body2" color="primary.main">
              {currentTabData?.label}
            </Typography>
          </Box>
          <ArrowDownIcon size={16} />
        </IconButton>

        <Menu
          anchorEl={tabMenuAnchor}
          open={Boolean(tabMenuAnchor)}
          onClose={handleTabMenuClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: { width: tabMenuAnchor?.offsetWidth || 200, mt: -1 },
            },
          }}
        >
          {tabs.map((tab) => (
            <MenuItem
              key={tab.value}
              onClick={() => handleTabMenuSelect(tab.value)}
              selected={currentTab === tab.value}
              sx={{ gap: 1 }}
            >
              {tab.icon}
              <Typography variant="body2">{tab.label}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  );
}

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceTabMenu
 * PropTypes validation for the ArtPieceTabMenu component
 */
ArtPieceTabMenu.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
  currentTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  sx: PropTypes.object,
};
