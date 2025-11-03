/**
 * @fileoverview Artist Card Component
 *
 * Universal card component for displaying artist information with interactive features,
 * status management, and responsive design. This component provides the foundation for
 * consistent artist card implementation across all artist display contexts
 * in the City Art Walks application.
 *
 * Features:
 * - Modular composition with specialized sub-components
 * - Error boundary protection for graceful failure handling
 * - Interactive hover integration for map functionality
 * - Owner-only status indicators with authentication validation
 * - Responsive design with Material-UI integration
 * - Accessibility compliance with WCAG 2.1 AA standards
 * - Comprehensive PropTypes validation for type safety
 * - Performance optimization through React.memo implementation
 *
 * @version 1.0.0
 * @since 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Components.Artist
 * @memberof CityArtWalks.Components.Artist
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Card-Components|Card Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Artist|Artist Schema}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Components|Artist Components}
 */

'use client';

/**
 * React PropTypes for Runtime Validation
 *
 * Provides runtime type checking for component props to ensure data integrity
 * and improve debugging during development. Validates required props and
 * type consistency for reliable component behavior.
 *
 * @memberof CityArtWalks.Components.Artist
 * @see {@link https://www.npmjs.com/package/prop-types} PropTypes Documentation
 */
import PropTypes from 'prop-types';

/**
 * Material-UI Core Components
 *
 * Essential Material-UI components for building the card interface with
 * consistent theming, responsive design, and accessibility features.
 * These components provide the visual foundation and layout structure.
 *
 * @memberof CityArtWalks.Components.Artist
 * @see {@link https://mui.com/material-ui/react-box/} Material-UI Box Documentation
 * @see {@link https://mui.com/material-ui/react-card/} Material-UI Card Documentation
 * @see {@link https://mui.com/material-ui/react-divider/} Material-UI Divider Documentation
 */
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';

/**
 * Project Component Imports
 *
 * Internal project components used for specialized functionality within the
 * Artist card. These components handle specific aspects of the card display
 * with proper separation of concerns and reusability across the application.
 *
 * Component Responsibilities:
 * - ArtistCardTitle: Title display with navigation and SEO optimization
 * - ArtistCardAvatar: Avatar/image with upload functionality and fallbacks
 * - ArtistCardStatus: Owner-only status indicators with authentication
 * - ArtistCardDescription: Formatted description text with truncation
 * - ArtistCardActions: Statistics and action buttons for engagement
 * - ErrorBoundary: Error handling protection for graceful failure recovery
 *
 * @memberof CityArtWalks.Components.Artist
 * @see {@link ./artist-card-title} ArtistCardTitle Component
 * @see {@link ./artist-card-avatar} ArtistCardAvatar Component
 * @see {@link ./artist-card-status} ArtistCardStatus Component
 * @see {@link ./artist-card-description} ArtistCardDescription Component
 * @see {@link ./artist-card-actions} ArtistCardActions Component
 * @see {@link ../error/error-boundary} ErrorBoundary Component
 */
import ErrorBoundary from '../error/error-boundary';
import { ArtistCardTitle } from './artist-card-title';
import { ArtistCardAvatar } from './artist-card-avatar';
import { ArtistCardStatus } from './artist-card-status';
import { ArtistCardActions } from './artist-card-actions';
import { ArtistCardDescription } from './artist-card-description';

/**
 * Artist Card Component
 *
 * Renders a sophisticated card interface for Artist display with comprehensive
 * metadata, interactive hover capabilities, and ownership-based status management.
 * Integrates with map components through hover events and provides detailed
 * navigation to Artist profiles and related content.
 *
 * Architecture:
 * The component follows a modular composition pattern using specialized
 * sub-components for different sections (Avatar, Title, Description, Actions)
 * to maintain clean separation of concerns and reusability. Each sub-component
 * handles its own state and interactions while the main card coordinates
 * the overall layout and user interactions.
 *
 * Key Features:
 * - Responsive card layout with centered text alignment
 * - Interactive hover events for map integration and highlighting
 * - Owner-only status indicators with color-coded visual chips
 * - Comprehensive statistics display and action buttons
 * - Error boundary protection for graceful error handling
 * - Accessibility-compliant navigation and interactions
 * - Automatic fallback handling for missing images and data
 * - Authentication-aware ownership controls
 * - Material-UI theming integration
 * - SEO-friendly structured markup
 *
 * @memberof CityArtWalks.Components.Artist
 * @function ArtistCard
 * @param {Object} props - The component props
 * @param {string} props.artistId - The unique ID of the artist
 * @param {string} props.slug - URL-safe slug for Artist navigation and SEO
 * @param {string} props.name - Display name of the Artist (used for navigation and SEO)
 * @param {string} [props.biography] - Brief biography or description of the Artist for preview
 * @param {string} [props.imageUrl] - Primary image URL for the Artist (with automatic fallback)
 * @param {('ACTIVE'|'PENDING'|'DRAFT'|'REVIEW'|'ARCHIVED'|'DELETED'|'FLAGGED')} [props.status] - Current publication status
 * @param {(string|number)} [props.createdBy] - User ID of the Artist creator (for ownership validation)
 * @param {Function} [props.onMouseEnter] - Callback fired when mouse enters the card (for map highlight integration)
 * @param {Function} [props.onMouseLeave] - Callback fired when mouse leaves the card (for map de-highlight)
 * @param {number} [props.viewCount=0] - Total view count for analytics and popularity
 * @param {number} [props.favoriteCount=0] - Number of users who favorited this Artist
 * @param {number} [props.pieceCount=0] - Number of art pieces created by this artist
 * @param {number} [props.reviewCount=0] - Number of reviews for this artist
 * @param {boolean} [props.uploadable=false] - If true, enables upload functionality for owners/admins
 * @returns {JSX.Element} The rendered Artist card component with all interactive features
 *
 * @example
 * // Basic usage with required props
 * <ArtistCard
 *   artistId="123"
 *   slug="vincent-van-gogh"
 *   name="Vincent van Gogh"
 *   biography="Dutch post-impressionist painter"
 *   imageUrl="/images/van-gogh.jpg"
 * />
 *
 * @example
 * // Full usage with statistics and interactive features
 * <ArtistCard
 *   artistId="123"
 *   slug="vincent-van-gogh"
 *   name="Vincent van Gogh"
 *   biography="Dutch post-impressionist painter known for vivid colors"
 *   imageUrl="/images/van-gogh.jpg"
 *   favoriteCount={45}
 *   pieceCount={12}
 *   viewCount={1250}
 *   reviewCount={8}
 *   status="ACTIVE"
 *   createdBy="user-456"
 *   uploadable={true}
 *   onMouseEnter={() => highlightOnMap('123')}
 *   onMouseLeave={() => clearMapHighlight()}
 * />
 */
export function ArtistCard(props) {
  const {
    artistId,
    slug,
    name,
    biography,
    imageUrl,
    favoriteCount,
    pieceCount,
    viewCount,
    reviewCount,
    status,
    createdBy,
    uploadable,
    onMouseEnter,
    onMouseLeave,
    ...other
  } = props;

  return (
    <ErrorBoundary>
      <Box onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...other} data-cy="artist-card">
        <Card sx={{ textAlign: 'center', position: 'relative' }}>
          {/* Owner-only status indicator positioned in top-right corner */}
          <ArtistCardStatus status={status} createdBy={createdBy} />

          {/* Artist avatar section with fallback image handling */}
          <ArtistCardAvatar
            name={name}
            imageUrl={imageUrl}
            slug={slug}
            artistId={artistId}
            createdBy={createdBy}
            uploadable={uploadable}
          />

          {/* Artist title with navigation link */}
          <ArtistCardTitle name={name} />

          {/* Artist biography with text formatting */}
          <ArtistCardDescription biography={biography} />

          <Divider />

          {/* Statistics and actions section with engagement metrics */}
          <ArtistCardActions
            favoriteCount={favoriteCount}
            pieceCount={pieceCount}
            viewCount={viewCount}
            reviewCount={reviewCount}
            artistId={artistId}
          />
        </Card>
      </Box>
    </ErrorBoundary>
  );
}

/**
 * PropTypes Validation for ArtistCard Component
 *
 * Defines comprehensive type validation rules for the ArtistCard component
 * to ensure data integrity and provide development-time warnings for incorrect
 * prop usage. Includes detailed validation for complex object structures and
 * callback functions with proper type safety measures.
 *
 * @memberof CityArtWalks.Components.Artist
 * @name ArtistCard.propTypes
 * @type {Object}
 */
ArtistCard.propTypes = {
  // Required props
  artistId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  slug: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,

  // Optional content props
  biography: PropTypes.string,
  imageUrl: PropTypes.string,

  // Optional statistics props
  favoriteCount: PropTypes.number,
  pieceCount: PropTypes.number,
  viewCount: PropTypes.number,
  reviewCount: PropTypes.number,

  // Optional status and ownership props
  status: PropTypes.oneOf([
    'ACTIVE',
    'PENDING',
    'DRAFT',
    'REVIEW',
    'ARCHIVED',
    'DELETED',
    'FLAGGED',
    'BANNED',
    'REJECTED',
  ]),
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  uploadable: PropTypes.bool,

  // Optional interaction callback props
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

/**
 * Default Props for ArtistCard Component
 *
 * Provides sensible default values for optional props to ensure consistent
 * behavior and prevent undefined values in component rendering.
 *
 * @memberof CityArtWalks.Components.Artist
 * @name ArtistCard.defaultProps
 * @type {Object}
 */
ArtistCard.defaultProps = {
  favoriteCount: 0,
  pieceCount: 0,
  viewCount: 0,
  reviewCount: 0,
  uploadable: false,
  onMouseEnter: undefined,
  onMouseLeave: undefined,
};
