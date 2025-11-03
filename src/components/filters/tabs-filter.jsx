/**
 * @namespace CityArtWalks.Components.Filters.TabsFilter
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */

'use client';

import PropTypes from 'prop-types';
import { varAlpha } from 'minimal-shared/utils';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';

import { Label } from 'src/components/label';

/**
 * @memberof CityArtWalks.Components.Filters.TabsFilter
 * @description TabsFilter component provides a tabbed interface for filtering data with status labels and counts.
 * It displays tabs with optional icons/labels and handles tab changes with proper styling.
 *
 * Key Features:
 * - Customizable tab options with labels and counts
 * - Status-based color coding for labels
 * - Responsive design with proper spacing
 * - Accessible design with proper ARIA labels
 * - Material-UI Card wrapper for consistent styling
 *
 * @component
 * @example
 * // Basic usage with status tabs
 * <TabsFilter
 *   value="all"
 *   onChange={handleTabChange}
 *   tabOptions={[
 *     { value: 'all', label: 'All' },
 *     { value: 'ACTIVE', label: 'Active' },
 *     { value: 'PENDING', label: 'Pending' },
 *     { value: 'REJECTED', label: 'Rejected' },
 *   ]}
 *   getStatusColor={getStatusColor}
 *   totalCount={100}
 * />
 *
 * @param {Object} props - The component props.
 * @param {string} props.value - Currently selected tab value.
 * @param {Function} props.onChange - Handler for tab value changes.
 * @param {Array} props.tabOptions - Array of tab configuration objects with value and label.
 * @param {Function} [props.getStatusColor] - Function to get color for status-based styling.
 * @param {number} [props.totalCount] - Total count to display in 'all' tab label.
 * @param {Object} [props.sx] - Additional styling for the Card wrapper.
 * @param {Object} [props.tabsProps] - Additional props to pass to the Tabs component.
 * @returns {JSX.Element} The TabsFilter component.
 */
export function TabsFilter({
  value,
  onChange,
  tabOptions = [],
  getStatusColor,
  totalCount = 0,
  sx = {},
  tabsProps = {},
  ...other
}) {
  return (
    <Card sx={{ mb: 2, ...sx }} {...other}>
      <Tabs
        value={value}
        onChange={onChange}
        sx={[
          (theme) => ({
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }),
        ]}
        {...tabsProps}
      >
        {tabOptions.map((tab) => (
          <Tab
            key={tab.value}
            iconPosition="end"
            value={tab.value}
            label={tab.label}
            icon={
              <Label
                variant={((tab.value === 'all' || tab.value === value) && 'filled') || 'soft'}
                color={getStatusColor ? getStatusColor(tab.value) : 'default'}
              >
                {tab.value === 'all' ? totalCount : ''}
              </Label>
            }
          />
        ))}
      </Tabs>
    </Card>
  );
}

TabsFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  tabOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  getStatusColor: PropTypes.func,
  totalCount: PropTypes.number,
  sx: PropTypes.object,
  tabsProps: PropTypes.object,
};
