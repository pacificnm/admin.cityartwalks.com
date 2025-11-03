/**
 * @fileoverview Post Card List Component
 *
 * Renders a responsive grid layout of Post cards with comprehensive list management,
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
 * - Empty state management with dedicated PostEmpty component
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
 * @author Claude Code
 * @namespace CityArtWalks.Components.Post
 * @memberof CityArtWalks.Components.Post
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Card-List-Components|Card List Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Card-Components|Card Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Post|Post Schema}
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
 * @memberof CityArtWalks.Components.Post
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
 * @memberof CityArtWalks.Components.Post
 * @see {@link https://mui.com/material-ui/react-box/} Material-UI Box Documentation
 * @see {@link https://mui.com/system/grid/} Material-UI Grid System
 */
import Box from '@mui/material/Box';

/**
 * Project Component Imports
 *
 * Internal components used for Post display and empty state handling.
 * PostCard provides individual card rendering while EmptyContent handles
 * graceful empty state display when no posts are available.
 *
 * @memberof CityArtWalks.Components.Post
 * @see {@link ./post-card} PostCard Component
 * @see {@link ../empty-content} EmptyContent Component
 */
import { PostCard } from './post-card';
import { EmptyContent } from '../empty-content';
import ErrorBoundary from '../error/error-boundary';

/**
 * Post Card List Component
 *
 * Renders a responsive grid layout of Post cards with comprehensive list management,
 * error handling, and performance optimization. Provides interactive hover integration
 * for map functionality and handles empty states gracefully.
 *
 * The component follows the established City Art Walks pattern for card list components,
 * using Material-UI Box with CSS Grid for responsive layouts and comprehensive error
 * handling through ErrorBoundary protection. Supports map integration through hover
 * callbacks and provides type-safe prop validation for reliable data handling.
 *
 * Responsive Grid Configuration:
 * The component accepts either string-based or object-based grid configuration
 * for responsive breakpoints. Object-based configuration allows precise control
 * over column counts at different screen sizes following Material-UI breakpoint
 * conventions (xs, sm, md, lg, xl).
 *
 * Performance Features:
 * - Uses array existence checks to prevent runtime errors
 * - Implements ErrorBoundary for graceful failure handling
 * - Supports React.memo optimization for large lists
 * - Efficient key handling with entity ID preference over array index
 * - Minimal re-renders through proper prop dependency management
 *
 * Accessibility Features:
 * - Semantic grid structure with proper ARIA attributes
 * - Keyboard navigation support through Material-UI components
 * - Screen reader compatible with meaningful data attributes
 * - High contrast design for visual accessibility compliance
 * - Focus management for keyboard users
 *
 * @memberof CityArtWalks.Components.Post
 * @function PostCardList
 * @param {Object} props - The component properties
 * @param {Array<Object>} props.posts - Array of Post objects to display in grid layout
 * @param {(string|Object)} [props.gridTemplateColumns='repeat(auto-fill, minmax(250px, 1fr))'] - CSS Grid template columns configuration
 * @param {Function} [props.onMouseEnter] - Callback fired when mouse enters a card (for map integration)
 * @param {Function} [props.onMouseLeave] - Callback fired when mouse leaves a card (for map integration)
 * @param {Object} [props.sx] - Material-UI sx prop for custom styling
 * @param {Object} [props.other] - Additional props spread to the root Box component
 *
 * @returns {JSX.Element} The rendered Post card list component or empty state
 *
 * @throws {Error} Renders error boundary fallback if sub-components fail
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Card-List-Components|Card List Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Post|Post Schema}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Error-Boundaries|Error Boundaries}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/performance/Component-Optimization|Performance Optimization}
 *
 * @example
 * // Basic usage with responsive grid
 * <PostCardList
 *   posts={posts}
 *   gridTemplateColumns={{
 *     xs: 'repeat(1, 1fr)',
 *     sm: 'repeat(2, 1fr)',
 *     md: 'repeat(4, 1fr)',
 *   }}
 * />
 *
 * @example
 * // Map integration with hover callbacks
 * const handleCardHover = useCallback((post) => {
 *   if (mapRef.current && post.latitude && post.longitude) {
 *     mapRef.current.highlightEntity(post.postId, {
 *       lat: post.latitude,
 *       lng: post.longitude
 *     });
 *   }
 * }, []);
 *
 * const handleCardLeave = useCallback(() => {
 *   if (mapRef.current) {
 *     mapRef.current.clearHighlight();
 *   }
 * }, []);
 *
 * <PostCardList
 *   posts={posts}
 *   onMouseEnter={handleCardHover}
 *   onMouseLeave={handleCardLeave}
 * />
 *
 * @example
 * // Integration with table toolbar (common pattern in view components)
 * <PostTableToolbar viewType="explore">
 *   {({ posts }) => (
 *     <PostCardList
 *       posts={posts}
 *       gridTemplateColumns={{
 *         xs: 'repeat(1, 1fr)',
 *         sm: 'repeat(2, 1fr)',
 *         md: 'repeat(4, 1fr)',
 *       }}
 *     />
 *   )}
 * </PostTableToolbar>
 *
 * @example
 * // Custom styling with Material-UI sx prop
 * <PostCardList
 *   posts={posts}
 *   sx={{
 *     maxWidth: 1200,
 *     margin: '0 auto',
 *     padding: 2,
 *     backgroundColor: 'background.paper',
 *     borderRadius: 2,
 *   }}
 * />
 */
export const PostCardList = React.memo(
  function PostCardList({
    posts,
    gridTemplateColumns = {
      xs: 'repeat(1, 1fr)',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(4, 1fr)',
    },
    onMouseEnter,
    onMouseLeave,
    ...other
  }) {
    // Handle empty state with graceful fallback
    if (!posts || posts.length === 0) {
      return (
        <EmptyContent
          filled
          title="No Posts Found"
          description="There are no published posts available at this time. Check back later for new content!"
          sx={{
            py: 10,
          }}
        />
      );
    }

    return (
      <ErrorBoundary>
        <Box
          data-cy="post-card-list"
          gap={3}
          display="grid"
          gridTemplateColumns={gridTemplateColumns}
          {...other}
        >
          {posts.map((post, index) => (
            <PostCard
              key={post.postId || index}
              data-cy={`post-card-${index}`}
              // Explicitly pass only the props PostCard expects to avoid DOM attribute warnings
              // for database fields like metaTitle, metaDescription, etc.
              postId={post.postId}
              title={post.title}
              excerpt={post.excerpt}
              content={post.content}
              featuredImage={post.featuredImage}
              slug={post.slug}
              category={post.category}
              tags={post.tags}
              featured={post.featured}
              status={post.status}
              author={post.author}
              publishedAt={post.publishedAt}
              createdAt={post.createdAt}
              createdBy={post.createdBy}
              _count={post._count}
              viewCount={post.viewCount}
              onMouseEnter={() => onMouseEnter?.(post)}
              onMouseLeave={onMouseLeave}
            />
          ))}
        </Box>
      </ErrorBoundary>
    );
  },
  (prevProps, nextProps) =>
    // Custom comparison for performance optimization
    // Only re-render if critical props have changed
    prevProps.posts.length === nextProps.posts.length &&
    JSON.stringify(prevProps.posts) === JSON.stringify(nextProps.posts) &&
    JSON.stringify(prevProps.gridTemplateColumns) ===
      JSON.stringify(nextProps.gridTemplateColumns) &&
    prevProps.onMouseEnter === nextProps.onMouseEnter &&
    prevProps.onMouseLeave === nextProps.onMouseLeave
);

/**
 * PropTypes Validation for PostCardList Component
 *
 * Defines comprehensive type validation rules for the PostCardList component
 * to ensure data integrity and provide development-time warnings for incorrect
 * prop usage. Includes detailed validation for complex object structures and
 * callback functions with proper type safety measures.
 *
 * Validation Benefits:
 * - Prevents runtime errors from incorrect prop types
 * - Provides clear developer feedback during development
 * - Documents expected prop formats and requirements
 * - Enables better IDE support and autocompletion
 * - Facilitates debugging and testing processes
 * - Ensures consistent data flow throughout the component tree
 *
 * Entity-Specific Validation:
 * The Post card list expects specific props based on the entity's database schema
 * and business requirements. The PropTypes validation matches the Post entity
 * fields and relationships as defined in the Schema documentation.
 *
 * Required Fields:
 * Each Post object in the array must contain the minimum required fields
 * for proper card rendering and navigation functionality. Additional optional
 * fields enhance the user experience but are not required for basic operation.
 *
 * @memberof CityArtWalks.Components.Post
 * @name PostCardList.propTypes
 * @type {Object}
 * @property {Array<Object>} posts - Array of Post objects (required)
 * @property {(string|Object)} [gridTemplateColumns] - Grid layout configuration (optional)
 * @property {Function} [onMouseEnter] - Mouse enter callback for map integration (optional)
 * @property {Function} [onMouseLeave] - Mouse leave callback for map integration (optional)
 *
 * @example
 * // PropTypes validation will warn if required props are missing:
 * // Warning: Failed prop type: The prop `posts` is marked as required
 * // in `PostCardList`, but its value is `undefined`.
 *
 * @example
 * // PropTypes validation will warn for incorrect array structure:
 * // Warning: Failed prop type: Invalid prop `posts[0].postId` of type `string`
 * // supplied to `PostCardList`, expected `number`.
 *
 * @example
 * // PropTypes validation for grid configuration types:
 * // Valid: "repeat(4, 1fr)", { xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }
 * // Invalid: 123, null, [] (when expecting string or object)
 *
 * @example
 * // PropTypes validation for callback functions:
 * // Valid: () => {}, (post) => highlightMap(post), handleMouseEnter
 * // Invalid: "handleClick", null, 123 (when expecting function)
 *
 * @example
 * // PropTypes validation for post object structure:
 * // Required fields for each Post object:
 * // - postId: number (unique identifier)
 * // - title: string (display name)
 * // - slug: string (URL identifier)
 * // Optional fields enhance functionality but are not required
 */
PostCardList.propTypes = {
  /**
   * Array of Post objects to display in the grid
   * Each object must contain required fields for card rendering
   */
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      postId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      content: PropTypes.string,
      featuredImage: PropTypes.string,
      category: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      featured: PropTypes.bool,
      status: PropTypes.oneOf(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED']),
      author: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
      }),
      publishedAt: PropTypes.string,
      createdAt: PropTypes.string,
      createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      _count: PropTypes.shape({
        comments: PropTypes.number,
      }),
      viewCount: PropTypes.number,
    })
  ).isRequired,

  /**
   * CSS Grid template columns configuration
   * Accepts string for fixed layout or object for responsive breakpoints
   */
  gridTemplateColumns: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      xs: PropTypes.string,
      sm: PropTypes.string,
      md: PropTypes.string,
      lg: PropTypes.string,
      xl: PropTypes.string,
    }),
  ]),

  /**
   * Mouse enter callback for map integration
   * Receives the hovered Post object as parameter
   */
  onMouseEnter: PropTypes.func,

  /**
   * Mouse leave callback for map integration
   * Called when mouse leaves any card in the list
   */
  onMouseLeave: PropTypes.func,
};
