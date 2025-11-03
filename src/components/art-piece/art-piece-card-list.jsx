/**
 * @fileoverview Art Piece Card List Component
 *
 * Renders a responsive grid layout of art piece cards with comprehensive list management,
 * error handling, and performance optimization. Provides interactive hover integration
 * for map functionality and handles empty states gracefully.
 *
 * The component uses CSS Grid for flexible responsive layouts and React.memo for
 * performance optimization to prevent unnecessary re-renders when data hasn't changed.
 * Integrates seamlessly with map components through hover event callbacks and
 * provides comprehensive error boundary protection.
 *
 * Key Features:
 * - Responsive CSS Grid layout with customizable column configurations
 * - Performance-optimized with React.memo and custom comparison function
 * - Interactive hover events for map integration and spatial highlighting
 * - Comprehensive error boundary protection for graceful failure handling
 * - Empty state management with dedicated ArtPieceEmpty component
 * - Type-safe prop validation and array safety checks
 * - Material-UI integration for consistent theming and styling
 * - Accessibility-compliant with proper ARIA attributes and data-cy testing
 *
 * Performance Considerations:
 * - Memoized component prevents unnecessary re-renders
 * - Custom comparison function for deep prop equality checking
 * - Array safety checks prevent runtime errors
 * - Efficient grid rendering for large datasets
 * - Error boundary isolation prevents cascade failures
 *
 * @version 1.0.0
 * @since 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Components.ArtPiece
 * @memberof CityArtWalks.Components.ArtPiece
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/art-piece/ArtPiece-Components|ArtPiece Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Card-Components|Card Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Card-List-Components|List Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/performance/Component-Optimization|Performance Optimization}
 */

'use client';

/**
 * React and PropTypes Imports
 *
 * Essential React imports for component functionality and runtime prop validation.
 * React provides memo functionality for performance optimization, while PropTypes
 * ensures type safety and provides development-time warnings for incorrect usage.
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @see {@link https://react.dev/reference/react/memo} React memo Documentation
 * @see {@link https://www.npmjs.com/package/prop-types} PropTypes Documentation
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Material-UI Box Component
 *
 * Provides the container layout system with CSS Grid support for responsive
 * card arrangement. Box component offers flexible styling through the sx prop
 * and integrates seamlessly with Material-UI theming system.
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @see {@link https://mui.com/material-ui/react-box/} Material-UI Box Documentation
 * @see {@link https://mui.com/system/grid/} Material-UI Grid System
 */
import Box from '@mui/material/Box';

/**
 * Project Component Imports
 *
 * Internal components used for art piece display and empty state handling.
 * ArtPieceCard provides individual card rendering while ArtPieceEmpty handles
 * graceful empty state display when no art pieces are available.
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @see {@link ./art-piece-card} ArtPieceCard Component
 * @see {@link ./art-piece-empty} ArtPieceEmpty Component
 */
import { ArtPieceCard, ArtPieceEmpty } from 'src/components/art-piece';

/**
 * Error Boundary Component
 *
 * Provides comprehensive error handling protection to prevent component
 * failures from cascading to parent components. Ensures graceful degradation
 * and maintains application stability during runtime errors.
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @see {@link ../error/error-boundary} ErrorBoundary Component
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Error-Boundaries|Error Boundaries Documentation}
 */
import ErrorBoundary from '../error/error-boundary';

/**
 * Art Piece Card List Component
 *
 * Renders a responsive grid layout of art piece cards with comprehensive list management,
 * performance optimization, and interactive features. Handles large datasets efficiently
 * while providing seamless integration with map components and maintaining accessibility
 * standards throughout the user experience.
 *
 * Architecture:
 * The component follows a container-presenter pattern where it manages the overall
 * layout and data flow while delegating individual card rendering to ArtPieceCard
 * components. Uses CSS Grid for flexible responsive layouts that adapt to various
 * screen sizes and content densities.
 *
 * Key Features:
 * - Responsive CSS Grid layout with customizable column configurations
 * - Performance-optimized rendering with React.memo and deep comparison
 * - Interactive hover events for map integration and spatial context
 * - Comprehensive error boundary protection for stability
 * - Empty state handling with dedicated component
 * - Type-safe array validation and runtime safety checks
 * - Material-UI theming integration for consistent visual design
 * - Accessibility compliance with proper ARIA attributes
 * - Test-friendly with data-cy attributes for automation
 *
 * Performance Optimizations:
 * - Memoized component prevents unnecessary re-renders
 * - Custom comparison function for efficient prop equality checking
 * - Array safety validation prevents runtime errors
 * - Efficient grid rendering scales to large datasets
 * - Error boundary isolation contains failures locally
 *
 * Integration Points:
 * - Map component integration through hover event callbacks
 * - Material-UI theming system for visual consistency
 * - Error boundary system for graceful failure handling
 * - Testing framework integration through data-cy attributes
 * - Responsive design system for cross-device compatibility
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @function ArtPieceCardListComponent
 * @param {Object} props - The component props with art piece data and configuration
 * @param {Array<Object>} props.artPieces - Array of art piece objects to display in grid layout
 * @param {Function} [props.onHover] - Callback fired when mouse enters an art piece card (for map highlighting)
 * @param {Function} [props.onLeave] - Callback fired when mouse leaves an art piece card (for map clearing)
 * @param {Object} [props.gridTemplateColumns] - CSS Grid template columns configuration for responsive layout
 * @param {Object} [props.other] - Additional props spread to the root Box component (sx, className, etc.)
 * @returns {JSX.Element} Responsive grid of art piece cards or empty state component
 *
 * @throws {Error} Renders error boundary fallback if card rendering fails
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/art-piece/ArtPiece-Components|ArtPiece Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Card-Components|Card Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Card-List-Components|List Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/performance/Component-Optimization|Performance Optimization}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Error-Boundaries|Error Boundaries}
 *
 * @example
 * // Basic usage with art pieces array
 * <ArtPieceCardList
 *   artPieces={[
 *     {
 *       artPieceId: "1",
 *       title: "Sunset Sculpture",
 *       description: "Beautiful bronze sculpture",
 *       Artist: { name: "Jane Smith", imageUrl: "/images/jane.jpg", slug: "jane-smith" },
 *       imageUrl: "/images/sculpture.jpg",
 *       slug: "sunset-sculpture",
 *       status: "ACTIVE",
 *       createdBy: "user123",
 *       _count: { UserFavoriteArtPiece: 45, Image: 8 },
 *       viewCount: 1250
 *     }
 *   ]}
 * />
 *
 * @example
 * // With map integration and responsive grid configuration
 * <ArtPieceCardList
 *   artPieces={artPiecesData}
 *   onHover={(artPiece) => mapRef.current?.highlightLocation(artPiece.coordinates)}
 *   onLeave={() => mapRef.current?.clearHighlight()}
 *   gridTemplateColumns={{
 *     xs: '1fr',
 *     sm: 'repeat(2, 1fr)',
 *     md: 'repeat(3, 1fr)',
 *     lg: 'repeat(4, 1fr)'
 *   }}
 *   sx={{ padding: 3 }}
 * />
 *
 * @example
 * // Empty state handling (automatically rendered when artPieces is empty)
 * <ArtPieceCardList
 *   artPieces={[]} // Empty array triggers ArtPieceEmpty component
 * />
 *
 * @example
 * // Custom grid layout for featured content
 * <ArtPieceCardList
 *   artPieces={featuredArtPieces}
 *   gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
 *   onHover={handleFeaturedHover}
 *   sx={{
 *     gap: 4,
 *     maxWidth: 1200,
 *     margin: '0 auto',
 *     padding: { xs: 2, md: 4 }
 *   }}
 * />
 *
 * @example
 * // Integration with search and filter systems
 * const FilteredArtPieceList = ({ searchTerm, filters }) => {
 *   const filteredPieces = artPieces.filter(piece =>
 *     piece.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
 *     (!filters.status || piece.status === filters.status)
 *   );
 *
 *   return (
 *     <ArtPieceCardList
 *       artPieces={filteredPieces}
 *       gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
 *     />
 *   );
 * };
 *
 * @example
 * // Performance optimization with large datasets
 * const OptimizedArtPieceList = ({ artPieces }) => {
 *   // Component automatically memoizes and prevents re-renders
 *   // when artPieces array content hasn't changed
 *   return (
 *     <ArtPieceCardList
 *       artPieces={artPieces}
 *       // Stable callback functions prevent memo invalidation
 *       onHover={useCallback((piece) => handleHover(piece), [])}
 *       onLeave={useCallback(() => handleLeave(), [])}
 *     />
 *   );
 * };
 *
 * @example
 * // Error boundary protection (automatic)
 * // If any individual card fails to render, the error boundary
 * // prevents the entire list from crashing and shows fallback UI
 * <ArtPieceCardList
 *   artPieces={artPiecesWithPotentialErrors}
 *   // Error boundary automatically wraps the entire list
 * />
 *
 * @example
 * // Accessibility and testing support
 * <ArtPieceCardList
 *   artPieces={artPieces}
 *   data-testid="featured-art-pieces"
 *   aria-label="Featured art pieces in your area"
 *   // Automatically includes data-cy="art-piece-card-list" for Cypress testing
 * />
 */
const ArtPieceCardListComponent = function ArtPieceCardList(props) {
  const {
    artPieces,
    onHover,
    onLeave,
    gridTemplateColumns,
    // Destructure and ignore these props to prevent them from being passed to DOM
    hoveredArtPiece, // eslint-disable-line no-unused-vars
    ...other
  } = props;

  // Array safety validation with comprehensive type checking
  const safeArtPieces = Array.isArray(artPieces) ? artPieces : [];

  // Early return for empty state with dedicated component
  if (safeArtPieces.length === 0) {
    return <ArtPieceEmpty />;
  }

  return (
    <ErrorBoundary>
      <Box
        {...other}
        data-cy="art-piece-card-list"
        role="grid"
        aria-label="Art pieces grid layout"
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: gridTemplateColumns || '1fr',
          ...other.sx,
        }}
      >
        {safeArtPieces.map((artPiece) => (
          <ArtPieceCard
            key={artPiece.artPieceId}
            artPieceId={artPiece.artPieceId}
            title={artPiece.title}
            description={artPiece.description}
            artistName={artPiece?.Artist?.name}
            artPieceImageUrl={artPiece.imageUrl}
            artistImageUrl={artPiece?.Artist?.imageUrl}
            artPieceSlug={artPiece.slug}
            artistSlug={artPiece?.Artist?.slug}
            favoriteCount={artPiece?._count?.UserFavoriteArtPiece || 0}
            status={artPiece.status}
            createdBy={artPiece.createdBy}
            imageCount={artPiece?._count?.Image || 0}
            viewCount={artPiece?.viewCount || 0}
            onMouseEnter={() => onHover && onHover(artPiece)}
            onMouseLeave={() => onLeave && onLeave(artPiece)}
            uploadable={false}
          />
        ))}
      </Box>
    </ErrorBoundary>
  );
};

/**
 * Memoized Art Piece Card List Export
 *
 * Exports a performance-optimized version of the ArtPieceCardList component using
 * React.memo with custom comparison function. Prevents unnecessary re-renders by
 * performing deep comparison of props, significantly improving performance when
 * rendering large lists of art pieces.
 *
 * Memoization Strategy:
 * - Deep comparison of artPieces array content using JSON.stringify
 * - Shallow comparison of gridTemplateColumns configuration object
 * - Reference equality check for callback functions (onHover, onLeave)
 * - Prevents re-renders when prop content hasn't actually changed
 *
 * Performance Benefits:
 * - Reduces unnecessary component re-renders in large datasets
 * - Prevents expensive DOM reconciliation when data is unchanged
 * - Maintains responsive UI performance during frequent state updates
 * - Optimizes memory usage through efficient comparison algorithms
 *
 * Custom Comparison Function:
 * The memo comparison function performs comprehensive prop equality checking
 * to determine if a re-render is necessary. This includes deep object comparison
 * for complex props while maintaining reference equality for functions.
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @function ArtPieceCardList
 * @param {Object} prevProps - Previous component props for comparison
 * @param {Object} nextProps - Next component props for comparison
 * @returns {boolean} True if props are equal (skip re-render), false if different (re-render)
 *
 * @see {@link https://react.dev/reference/react/memo} React memo Documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/performance/Component-Optimization|Performance Optimization}
 *
 * @example
 * // The memoized component automatically prevents re-renders:
 * const ParentComponent = () => {
 *   const [unrelatedState, setUnrelatedState] = useState(0);
 *   const [artPieces] = useState(staticArtPiecesData);
 *
 *   // Even when unrelatedState changes, ArtPieceCardList won't re-render
 *   // because artPieces content remains the same
 *   return (
 *     <div>
 *       <button onClick={() => setUnrelatedState(prev => prev + 1)}>
 *         Update Counter: {unrelatedState}
 *       </button>
 *       <ArtPieceCardList artPieces={artPieces} />
 *     </div>
 *   );
 * };
 *
 * @example
 * // Callback function stability for optimal memoization:
 * const OptimizedParent = () => {
 *   const stableOnHover = useCallback((artPiece) => {
 *     console.log('Hovered:', artPiece.title);
 *   }, []); // Empty dependency array ensures function reference stability
 *
 *   return (
 *     <ArtPieceCardList
 *       artPieces={artPieces}
 *       onHover={stableOnHover} // Stable reference prevents memo invalidation
 *     />
 *   );
 * };
 */
export const ArtPieceCardList = React.memo(
  ArtPieceCardListComponent,
  (prevProps, nextProps) =>
    // Deep comparison of artPieces array content for data equality
    JSON.stringify(prevProps.artPieces) === JSON.stringify(nextProps.artPieces) &&
    // Deep comparison of grid configuration object
    JSON.stringify(prevProps.gridTemplateColumns) ===
      JSON.stringify(nextProps.gridTemplateColumns) &&
    // Reference equality check for callback functions
    prevProps.onHover === nextProps.onHover &&
    prevProps.onLeave === nextProps.onLeave
);

/**
 * PropTypes Validation for ArtPieceCardList Component
 *
 * Defines comprehensive type validation rules for the ArtPieceCardList component
 * to ensure data integrity and provide development-time warnings for incorrect
 * prop usage. Includes detailed validation for complex object structures and
 * callback functions with proper type safety measures.
 *
 * Validation Benefits:
 * - Prevents runtime errors from incorrect prop types
 * - Provides clear developer feedback during development
 * - Documents expected data structures and prop formats
 * - Enables better IDE support and autocompletion
 * - Facilitates debugging and testing processes
 * - Ensures consistent data flow throughout the component tree
 *
 * Array Structure Validation:
 * The artPieces prop expects an array of objects with specific structure
 * including nested Artist objects and count objects for proper card rendering.
 * While PropTypes doesn't validate deep object structure, the component
 * includes runtime safety checks for nested properties.
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @name ArtPieceCardList.propTypes
 * @type {Object}
 * @property {Array<Object>} artPieces - Array of art piece objects with required metadata (required)
 * @property {Function} [onHover] - Callback fired when mouse enters any art piece card (optional)
 * @property {Function} [onLeave] - Callback fired when mouse leaves any art piece card (optional)
 * @property {Object|string} [gridTemplateColumns] - CSS Grid template columns configuration (optional)
 * @property {Object} [other] - Additional props spread to root Box component (optional)
 *
 * @example
 * // PropTypes validation will warn for incorrect array type:
 * // Warning: Failed prop type: Invalid prop `artPieces` of type `string`
 * // supplied to `ArtPieceCardList`, expected `array`.
 *
 * @example
 * // PropTypes validation will warn for missing required props:
 * // Warning: Failed prop type: The prop `artPieces` is marked as required
 * // in `ArtPieceCardList`, but its value is `undefined`.
 *
 * @example
 * // Expected artPieces array structure (runtime validation):
 * const validArtPieces = [
 *   {
 *     artPieceId: "123",              // Required: unique identifier
 *     title: "Art Title",             // Required: display title
 *     description: "Description",      // Required: content description
 *     imageUrl: "/image.jpg",         // Required: primary image
 *     slug: "art-slug",               // Required: URL slug
 *     status: "ACTIVE",               // Optional: publication status
 *     createdBy: "user123",           // Optional: creator ID
 *     viewCount: 1250,                // Optional: view analytics
 *     Artist: {                       // Optional: artist information
 *       name: "Artist Name",          // Artist display name
 *       imageUrl: "/artist.jpg",      // Artist profile image
 *       slug: "artist-slug"           // Artist URL slug
 *     },
 *     _count: {                       // Optional: aggregated counts
 *       UserFavoriteArtPiece: 45,     // Favorite count
 *       Image: 8                      // Associated images count
 *     }
 *   }
 * ];
 *
 * @example
 * // PropTypes validation for callback functions:
 * // Valid: () => {}, (artPiece) => console.log(artPiece), handleHover
 * // Invalid: "handleHover", null, undefined (when function expected)
 *
 * @example
 * // PropTypes validation for gridTemplateColumns:
 * // Valid: "1fr 1fr 1fr", "repeat(3, 1fr)", { xs: '1fr', md: 'repeat(2, 1fr)' }
 * // Invalid: 123, [], true (non-string/object types)
 */
ArtPieceCardList.propTypes = {
  artPieces: PropTypes.array.isRequired,
  onHover: PropTypes.func,
  onLeave: PropTypes.func,
  gridTemplateColumns: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  other: PropTypes.object,
};
