/**
 * @fileoverview Summary Card Component for Dashboard Statistics
 *
 * Reusable card component for displaying key metrics and statistics with icons,
 * values, titles, and optional trend indicators. Designed for dashboard analytics
 * and monitoring interfaces with consistent Material-UI styling.
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

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// ----------------------------------------------------------------------

/**
 * Summary Card Component
 *
 * Displays a metric or statistic in a card format with an icon, value, title,
 * optional subtitle, and optional trend indicator. Supports different color
 * themes and responsive design for dashboard analytics.
 *
 * @memberof CityArtWalks.Components.Dashboard
 * @function SummaryCard
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon element to display (typically from icon library)
 * @param {string} props.title - Main title/label for the metric
 * @param {string|number} props.value - Primary value to display (will show '0' if falsy)
 * @param {string} [props.subtitle] - Optional subtitle text below the title
 * @param {string} [props.color='primary'] - Theme color for the icon background
 * @param {number} [props.trend] - Optional trend percentage (positive/negative for color)
 * @returns {JSX.Element} Summary card component
 *
 * @example
 * // Basic usage
 * <SummaryCard
 *   icon={<DocumentIcon size={24} />}
 *   title="Total Users"
 *   value="1,234"
 *   subtitle="All time"
 *   color="primary"
 * />
 *
 * @example
 * // With trend indicator
 * <SummaryCard
 *   icon={<CheckCircleIcon size={24} />}
 *   title="Success Rate"
 *   value="98.5%"
 *   subtitle="Last 30 days"
 *   color="success"
 *   trend={5.2}
 * />
 */
export function SummaryCard({ icon, title, value, subtitle, color = 'primary', trend }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: `${color}.main`,
              color: 'common.white',
            }}
          >
            {icon}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="text.primary">
              {value || '0'}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>

          {trend && (
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'}>
                {trend > 0 ? '+' : ''}
                {trend}%
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
