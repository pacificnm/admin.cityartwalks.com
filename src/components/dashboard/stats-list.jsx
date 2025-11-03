/**
 * @fileoverview Stats List Component for Dashboard Analytics
 *
 * Reusable card component for displaying lists of statistics with key-value pairs.
 * Designed for dashboard analytics showing breakdowns, distributions, and categorical
 * data with consistent Material-UI styling and responsive design.
 *
 * @namespace CityArtWalks.Components.Dashboard
 * @version 1.0.0
 * @author Jaimie Garner
 * @since 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for card structure
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Dashboard-Components} - Dashboard Components Documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Design-System} - Design System Guidelines
 */

'use client';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// ----------------------------------------------------------------------

/**
 * Stats List Component
 *
 * Displays a list of statistics in a card format with a title and key-value pairs.
 * Each item shows a label and corresponding count/value, formatted consistently
 * for dashboard analytics and data visualization.
 *
 * @memberof CityArtWalks.Components.Dashboard
 * @function StatsList
 * @param {Object} props - Component props
 * @param {string} props.title - Card title/heading for the statistics list
 * @param {Array<Object>} props.data - Array of statistics items
 * @param {string} props.data[].key - Unique identifier for the item (used as React key)
 * @param {string} props.data[].label - Display label for the statistic
 * @param {string|number} props.data[].value - Value to display (will be formatted with toLocaleString)
 * @param {string} [props.keyField='key'] - Field name to use as the React key
 * @param {string} [props.labelField='label'] - Field name to use as the display label
 * @param {string} [props.valueField='value'] - Field name to use as the display value
 * @returns {JSX.Element} Stats list card component
 *
 * @example
 * // Basic usage with custom data structure
 * <StatsList
 *   title="Submissions by Entity Type"
 *   data={[
 *     { key: 'artist', label: 'ARTIST', value: 25 },
 *     { key: 'artpiece', label: 'ART_PIECE', value: 12 }
 *   ]}
 * />
 *
 * @example
 * // Usage with API data structure (different field names)
 * <StatsList
 *   title="Submissions by Status"
 *   data={stats?.byStatus}
 *   keyField="status"
 *   labelField="status"
 *   valueField="count"
 * />
 */
export function StatsList({
  title,
  data = [],
  keyField = 'key',
  labelField = 'label',
  valueField = 'value',
}) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Stack spacing={2}>
          {data?.map((item) => (
            <Stack key={item[keyField]} direction="row" justifyContent="space-between">
              <Typography variant="body2">{item[labelField]}</Typography>
              <Typography variant="body2" fontWeight="medium">
                {typeof item[valueField] === 'number'
                  ? item[valueField]?.toLocaleString()
                  : item[valueField] || '0'}
              </Typography>
            </Stack>
          ))}
          {(!data || data.length === 0) && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              No data available
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
