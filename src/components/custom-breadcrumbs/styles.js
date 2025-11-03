/**
 * @file styles.js
 * @description Styled components for custom breadcrumbs navigation layout and appearance
 * @namespace CityArtWalks.Components.CustomBreadcrumbs.Styles
 * @version 2.0.0
 * @author CityArtWalks Team
 * @see {@link https://cityartwalks.com.wiki/CustomBreadcrumbs-Styles.md} - CustomBreadcrumbs Styles Documentation
 */

import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Root container for the entire breadcrumbs component
 * Provides vertical layout with consistent spacing between sections
 * @memberof CityArtWalks.Components.CustomBreadcrumbs.Styles
 */
export const BreadcrumbsRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

/**
 * Styled heading element for breadcrumb page titles
 * Uses h4 typography with reset margins and inline-flex display
 * @memberof CityArtWalks.Components.CustomBreadcrumbs.Styles
 */
export const BreadcrumbsHeading = styled('h1')(({ theme }) => ({
  ...theme.typography.h4,
  margin: 0,
  padding: 0,
  display: 'inline-flex',
}));

/**
 * Main container for breadcrumb content and actions
 * Provides responsive layout with flexible wrapping and end alignment
 * @memberof CityArtWalks.Components.CustomBreadcrumbs.Styles
 */
export const BreadcrumbsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
}));

/**
 * Content area container for heading and navigation links
 * Flexible container that takes available space with vertical layout
 * @memberof CityArtWalks.Components.CustomBreadcrumbs.Styles
 */
export const BreadcrumbsContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  gap: theme.spacing(2),
  flexDirection: 'column',
}));

/**
 * Visual separator between breadcrumb links
 * Small circular dot using theme disabled text color
 * @memberof CityArtWalks.Components.CustomBreadcrumbs.Styles
 */
export const BreadcrumbsSeparator = styled('span')(({ theme }) => ({
  width: 4,
  height: 4,
  borderRadius: '50%',
  backgroundColor: theme.vars.palette.text.disabled,
}));
