/**
 * @file art-piece-queue-tab-navigation.jsx
 * @description Tab navigation component for art piece queue detail view
 * @author Generated
 * @version 1.0.0
 */

'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

/**
 * ArtPieceQueueTabNavigation component
 * Provides tab navigation for the art piece queue detail view
 *
 * @param {Object} props - Component props
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.onTabChange - Tab change handler
 * @returns {JSX.Element} The tab navigation component
 */
export function ArtPieceQueueTabNavigation({ activeTab, onTabChange }) {
  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant={activeTab === 'details' ? 'contained' : 'text'}
          onClick={() => onTabChange('details')}
        >
          Details
        </Button>
        <Button
          variant={activeTab === 'verification' ? 'contained' : 'text'}
          onClick={() => onTabChange('verification')}
        >
          Verification
        </Button>
        <Button
          variant={activeTab === 'history' ? 'contained' : 'text'}
          onClick={() => onTabChange('history')}
        >
          History
        </Button>
      </Box>
    </Box>
  );
}
