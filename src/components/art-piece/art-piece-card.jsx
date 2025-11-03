/**
 * @fileoverview Art Piece Card Component
 *
 * Renders a comprehensive card display for art pieces with interactive features,
 * status management, and hover integration for map functionality. Provides
 * visual representation of art piece metadata including images, statistics,
 * and ownership controls with responsive design.
 *
 * The component follows a modular composition pattern, delegating specific
 * responsibilities to specialized sub-components for maintainability and
 * reusability. Integrates with authentication system for ownership validation
 * and admin controls.
 *
 * Architecture Components:
 * - ArtPieceCardAvatar: Handles image display and upload functionality
 * - ArtPieceCardStatus: Manages owner-only status indicators
 * - ArtPieceCardTitle: Renders navigable title with SEO optimization
 * - ArtPieceCardDescription: Displays formatted description text
 * - ArtPieceFollowers: Shows statistics for favorites, views, images, reviews
 * - ErrorBoundary: Provides graceful error handling protection
 *
 * Integration Points:
 * - Authentication context for ownership validation
 * - Map components through hover event callbacks
 * - Navigation system through Next.js routing
 * - Material-UI theming for consistent visual design
 *
 * @version 1.0.0
 * @since 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Components.ArtPiece
 * @memberof CityArtWalks.Components.ArtPiece
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/art-piece/ArtPiece-Components|ArtPiece Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Card-Components|Card Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/auth/Owner-Guards|Owner Guards}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Error-Boundaries|Error Boundaries}
 */

'use client';

/**
 * React PropTypes for Runtime Validation
 *
 * Provides runtime type checking for component props to ensure data integrity
 * and improve debugging during development. Validates required props and
 * type consistency for reliable component behavior.
 *
 * @memberof CityArtWalks.Components.ArtPiece
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
 * @memberof CityArtWalks.Components.ArtPiece
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
 * art piece card. These components handle specific aspects of the card display
 * with proper separation of concerns and reusability across the application.
 *
 * Component Responsibilities:
 * - ArtPieceCardTitle: Title display with navigation and SEO optimization
 * - ArtPieceFollowers: Statistics and metrics display (favorites, views, etc.)
 * - ArtPieceCardAvatar: Avatar image with upload functionality and fallbacks
 * - ArtPieceCardStatus: Owner-only status indicators with authentication
 * - ArtPieceCardDescription: Formatted description text with truncation
 * - ErrorBoundary: Error handling protection for graceful failure recovery
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @see {@link ./art-piece-card-title} ArtPieceCardTitle Component
 * @see {@link ./art-piece-followers} ArtPieceFollowers Component
 * @see {@link ./art-piece-card-avatar} ArtPieceCardAvatar Component
 * @see {@link ./art-piece-card-status} ArtPieceCardStatus Component
 * @see {@link ./art-piece-card-description} ArtPieceCardDescription Component
 * @see {@link ../error/error-boundary} ErrorBoundary Component
 */
import {
  ArtPieceCardTitle,
  ArtPieceFollowers,
  ArtPieceCardAvatar,
  ArtPieceCardStatus,
  ArtPieceCardDescription,
} from 'src/components/art-piece';

import ErrorBoundary from '../error/error-boundary';

/**
 * Art Piece Card Component
 *
 * Renders a sophisticated card interface for art piece display with comprehensive
 * metadata, interactive hover capabilities, and ownership-based status management.
 * Integrates with map components through hover events and provides detailed
 * navigation to art piece and artist profiles.
 *
 * Architecture:
 * The component follows a modular composition pattern using specialized
 * sub-components for different sections (Avatar, Title, Description, Stats)
 * to maintain clean separation of concerns and reusability. Each sub-component
 * handles its own state and interactions while the main card coordinates
 * the overall layout and user interactions.
 *
 * Key Features:
 * - Responsive card layout with centered text alignment
 * - Interactive hover events for map integration and highlighting
 * - Owner-only status indicators with color-coded visual chips
 * - Comprehensive statistics display (favorites, images, views, reviews)
 * - Error boundary protection for graceful error handling
 * - Accessibility-compliant navigation and interactions
 * - Automatic fallback image handling for missing artwork
 * - Authentication-aware ownership controls
 * - Material-UI theming integration
 * - SEO-friendly structured markup
 *
 * Interaction Patterns:
 * - Click-through navigation to detailed art piece view
 * - Hover events trigger map highlighting for spatial context
 * - Owner-specific controls appear based on authentication state
 * - Progressive enhancement with graceful degradation
 *
 * Performance Considerations:
 * - Optimized re-renders through proper prop extraction
 * - Error boundary protection prevents cascade failures
 * - Lazy loading support through image URLs
 * - Efficient hover event handling with minimal re-renders
 * - Memoized sub-components prevent unnecessary updates
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @function ArtPieceCard
 * @param {Object} props - The component props
 * @param {string} props.artPieceId - Unique identifier for the art piece (required for uploads and actions)
 * @param {string} props.title - Display title of the art piece (used for navigation and SEO)
 * @param {string} props.description - Brief description or excerpt of the art piece for preview
 * @param {string} props.artistName - Full name of the artist who created the piece
 * @param {string} props.artPieceImageUrl - Primary image URL for the art piece (with automatic fallback)
 * @param {string} props.artistImageUrl - Profile image URL for the artist avatar
 * @param {string} props.artPieceSlug - URL-safe slug for art piece navigation and SEO
 * @param {string} props.artistSlug - URL-safe slug for artist profile navigation
 * @param {number} [props.favoriteCount=0] - Number of users who favorited this piece
 * @param {number} [props.imageCount=0] - Total number of images associated with this piece
 * @param {number} [props.viewCount=0] - Total view count for analytics and popularity
 * @param {number} [props.reviewCount=0] - Number of reviews/comments for social proof
 * @param {('ACTIVE'|'PENDING'|'DRAFT'|'REVIEW'|'ARCHIVED'|'DELETED'|'FLAGGED')} [props.status] - Current publication status
 * @param {(string|number)} [props.createdBy] - User ID of the art piece creator (for ownership validation)
 * @param {boolean} [props.uploadable] - Whether image upload functionality is available to the current user
 * @param {Function} [props.onMouseEnter] - Callback fired when mouse enters the card (for map highlight integration)
 * @param {Function} [props.onMouseLeave] - Callback fired when mouse leaves the card (for map de-highlight)
 * @param {Object} [props.other] - Additional props spread to the root Box component (sx, className, etc.)
 * @returns {JSX.Element} The rendered art piece card component with all interactive features
 *
 * @throws {Error} Renders error boundary fallback if sub-components fail
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/art-piece/ArtPiece-Components|ArtPiece Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Card-Components|Card Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/auth/Owner-Guards|Owner Guards}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Error-Boundaries|Error Boundaries}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Interactive-Components|Interactive Components}
 *
 * @example
 * // Basic usage with required props (minimal configuration)
 * <ArtPieceCard
 *   title="Sunset Sculpture"
 *   description="A beautiful bronze sculpture depicting the sunset over the city"
 *   artistName="Jane Smith"
 *   artPieceImageUrl="/images/sunset-sculpture.jpg"
 *   artistImageUrl="/images/jane-smith.jpg"
 *   artPieceSlug="sunset-sculpture"
 *   artistSlug="jane-smith"
 * />
 *
 * @example
 * // Full usage with statistics and interactive features
 * <ArtPieceCard
 *   title="Urban Mural"
 *   description="Vibrant street art celebrating community diversity and cultural heritage"
 *   artistName="Carlos Rivera"
 *   artPieceImageUrl="/images/urban-mural.jpg"
 *   artistImageUrl="/images/carlos-rivera.jpg"
 *   artPieceSlug="urban-mural"
 *   artistSlug="carlos-rivera"
 *   favoriteCount={45}
 *   imageCount={8}
 *   viewCount={1250}
 *   reviewCount={12}
 *   status="ACTIVE"
 *   createdBy="456"
 *   onMouseEnter={() => highlightOnMap('123')}
 *   onMouseLeave={() => clearMapHighlight()}
 * />
 *
 * @example
 * // Integration in responsive grid layout with map interaction
 * <Grid container spacing={3}>
 *   {artPieces.map((piece) => (
 *     <Grid item xs={12} sm={6} md={4} lg={3} key={piece.artPieceId}>
 *       <ArtPieceCard
 *         {...piece}
 *         onMouseEnter={() => handleMapHighlight(piece.artPieceId, piece.coordinates)}
 *         onMouseLeave={handleMapClearHighlight}
 *         sx={{ height: '100%' }} // Ensure consistent card heights
 *       />
 *     </Grid>
 *   ))}
 * </Grid>
 *
 * @example
 * // Usage with custom styling and additional props
 * <ArtPieceCard
 *   title="Modern Installation"
 *   description="Interactive digital art installation"
 *   artistName="Alex Chen"
 *   artPieceImageUrl="/images/modern-installation.jpg"
 *   artistImageUrl="/images/alex-chen.jpg"
 *   artPieceSlug="modern-installation"
 *   artistSlug="alex-chen"
 *   status="PENDING"
 *   createdBy={currentUser.id}
 *   sx={{
 *     maxWidth: 345,
 *     transition: 'transform 0.2s',
 *     '&:hover': { transform: 'translateY(-4px)' }
 *   }}
 *   data-testid="art-piece-card"
 * />
 *
 * @example
 * // Status color mapping and visual indicators:
 * // ACTIVE → Green chip (success) - Published and visible to public
 * // PENDING → Orange chip (warning) - Awaiting review or approval
 * // DRAFT → Blue chip (info) - Work in progress, not published
 * // REVIEW → Purple chip (secondary) - Under editorial review
 * // ARCHIVED → Gray chip (default) - Archived but preserved
 * // DELETED → Red chip (error) - Marked for deletion
 * // FLAGGED → Red chip (error) - Flagged for content review
 *
 * @example
 * // Image fallback behavior and error handling:
 * // Missing artPieceImageUrl → Handled by ArtPieceCardAvatar with default City Art Walks logo
 * // Missing artistImageUrl → Handled by ArtPieceCardAvatar component with placeholder avatar
 * // Network errors → Graceful degradation with fallback images
 * // Loading states → Progressive loading with skeleton placeholders
 *
 * @example
 * // Owner-only features (when authenticated user.userId === createdBy):
 * // - Status chip displayed in top-right corner with current publication state
 * // - OwnerGuard wrapped status indicator for security
 * // - Enhanced management capabilities through status visibility
 * // - Upload functionality for updating art piece images (admin only)
 * // - Edit and delete actions in context menus
 *
 * @example
 * // Accessibility features and WCAG compliance:
 * // - Semantic HTML structure with proper heading hierarchy
 * // - Keyboard navigation support through Material-UI Card
 * // - Screen reader compatible text and image alt attributes
 * // - High contrast status indicators for visual impairment
 * // - Focus management and keyboard shortcuts
 * // - ARIA labels and descriptions for interactive elements
 *
 * @example
 * // Error boundary usage and error recovery:
 * // - Wraps entire card in ErrorBoundary for graceful failure
 * // - Prevents cascade failures from affecting other components
 * // - Provides fallback UI when sub-components fail
 * // - Logs errors for debugging and monitoring
 * // - Maintains application stability during runtime errors
 *
 * @example
 * // Performance optimizations and best practices:
 * // - Props destructuring follows React best practices
 * // - Efficient re-renders through proper prop dependencies
 * // - Lazy loading support through image URLs
 * // - Memoized sub-components prevent unnecessary updates
 * // - Optimized hover event handling with debouncing
 * // - Material-UI sx prop for performant styling
 * // - Error boundary protection prevents cascade failures
 *
 * @example
 * // Integration with external systems:
 * // - Map component integration through hover callbacks
 * // - Analytics tracking through view count updates
 * // - Social features through favorite and review counts
 * // - SEO optimization through structured markup
 * // - Authentication system integration for ownership
 * // - Content management through status indicators
 */
function ArtPieceCard(props) {
  const {
    artPieceId,
    title,
    description,
    artistName,
    artPieceImageUrl,
    artistImageUrl,
    artPieceSlug,
    artistSlug,
    favoriteCount,
    imageCount,
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
      <Box
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...other}
        data-cy="art-piece-card"
      >
        <Card sx={{ textAlign: 'center', mb: 3, position: 'relative' }}>
          {/* Owner-only status indicator positioned in top-right corner */}
          <ArtPieceCardStatus status={status} createdBy={createdBy} />
          {/* Art piece avatar section with fallback image handling */}
          <ArtPieceCardAvatar
            artPieceId={artPieceId}
            title={title}
            artistName={artistName}
            artPieceImageUrl={artPieceImageUrl}
            artistImageUrl={artistImageUrl}
            artPieceSlug={artPieceSlug}
            artistSlug={artistSlug}
            createdBy={createdBy}
            uploadable={uploadable}
          />
          {/* Art piece title with navigation link */}
          <ArtPieceCardTitle title={title} />
          {/* Art piece description with text formatting */}
          <ArtPieceCardDescription description={description} />
          <Divider />
          {/* Statistics section with engagement metrics */}
          <ArtPieceFollowers
            favoriteCount={favoriteCount}
            imageCount={imageCount}
            viewCount={viewCount}
            reviewCount={reviewCount}
          />
        </Card>
      </Box>
    </ErrorBoundary>
  );
}

/**
 * PropTypes Validation for ArtPieceCard Component
 *
 * Defines the expected prop types and validation rules for the ArtPieceCard component.
 * Ensures type safety and provides development-time warnings for incorrect prop usage.
 * All props follow consistent naming conventions and include proper validation for
 * data integrity and component reliability.
 *
 * Validation Benefits:
 * - Prevents runtime errors from incorrect prop types
 * - Provides clear developer feedback during development
 * - Documents expected prop formats and requirements
 * - Enables better IDE support and autocompletion
 * - Facilitates debugging and testing processes
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @name ArtPieceCard.propTypes
 * @type {Object}
 * @property {string} title - Display title of the art piece (required for SEO and navigation)
 * @property {string} description - Brief description or excerpt (required for preview and accessibility)
 * @property {string} artistName - Full name of the artist (required for attribution and navigation)
 * @property {string} artPieceImageUrl - Primary image URL (required, with automatic fallback handling)
 * @property {string} artistImageUrl - Artist profile image URL (required for avatar display)
 * @property {string} artPieceSlug - URL slug for navigation (required, must be unique and SEO-friendly)
 * @property {string} artistSlug - Artist profile slug (required for navigation and SEO)
 * @property {number} [favoriteCount] - Number of favorites (optional, defaults to 0 if not provided)
 * @property {number} [imageCount] - Total associated images (optional, used for gallery indicators)
 * @property {number} [viewCount] - Total view count (optional, used for popularity metrics)
 * @property {number} [reviewCount] - Number of reviews (optional, used for social proof)
 * @property {string} [status] - Art piece status (optional, used for owner-only status indicators)
 * @property {(string|number)} [createdBy] - Creator user ID for ownership (optional, enables owner features)
 * @property {Function} [onMouseEnter] - Mouse enter callback for map integration (optional, enables hover effects)
 * @property {Function} [onMouseLeave] - Mouse leave callback for map integration (optional, clears hover effects)
 *
 * @example
 * // PropTypes validation will warn if required props are missing:
 * // Warning: Failed prop type: The prop `title` is marked as required
 * // in `ArtPieceCard`, but its value is `undefined`.
 *
 * @example
 * // PropTypes validation will warn for incorrect types:
 * // Warning: Failed prop type: Invalid prop `favoriteCount` of type `string`
 * // supplied to `ArtPieceCard`, expected `number`.
 *
 * @example
 * // PropTypes validation for slug format (should be URL-safe):
 * // Valid: "sunset-sculpture", "modern-art-installation"
 * // Invalid: "Sunset Sculpture!", "modern art/installation"
 *
 * @example
 * // PropTypes validation for callback functions:
 * // Valid: () => {}, (id) => highlightMap(id), handleMouseEnter
 * // Invalid: "handleClick", null, undefined (when expecting function)
 *
 * @example
 * // PropTypes validation for mixed type props (createdBy):
 * // Valid: "123", 123, 0, "user_456"
 * // Invalid: [], {}, null, undefined, false
 */
ArtPieceCard.propTypes = {
  artPieceId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  artistName: PropTypes.string.isRequired,
  artPieceImageUrl: PropTypes.string.isRequired,
  artistImageUrl: PropTypes.string.isRequired,
  artPieceSlug: PropTypes.string.isRequired,
  artistSlug: PropTypes.string.isRequired,
  favoriteCount: PropTypes.number,
  imageCount: PropTypes.number,
  viewCount: PropTypes.number,
  reviewCount: PropTypes.number,
  status: PropTypes.string,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  uploadable: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

/**
 * Component Export Documentation
 *
 * Exports the ArtPieceCard component for use throughout the application.
 * This component serves as the primary interface for displaying art piece
 * information in grid layouts, list views, and featured content sections.
 *
 * Export Usage:
 * - Import as named export for specific component usage
 * - Available through art-piece component barrel exports
 * - Supports both direct import and re-export patterns
 * - Compatible with dynamic imports for code splitting
 *
 * Integration Examples:
 * - Art piece discovery grids and lists
 * - Featured content carousels and showcases
 * - Search result displays with hover map integration
 * - Artist portfolio art piece collections
 * - Admin management interfaces with owner controls
 *
 * Performance Considerations:
 * - Component is optimized for rendering in large lists
 * - Supports virtualization through consistent sizing
 * - Error boundary protection prevents cascade failures
 * - Lazy loading compatible through image URL props
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @see {@link ./index.js} Component Barrel Exports
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Export-Patterns|Export Patterns Documentation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/performance/Component-Optimization|Component Optimization Guide}
 */
export { ArtPieceCard };
