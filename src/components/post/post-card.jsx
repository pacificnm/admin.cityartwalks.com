/**
 * @namespace CityArtWalks.Components.Post.PostCard
 * @version 1.0.0
 * @author Claude Code
 */

'use client';

import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';

import { useAuthContext } from 'src/auth/hooks';

import { PostCardMeta } from './post-card-meta';
import { PostCardTitle } from './post-card-title';
import ErrorBoundary from '../error/error-boundary';
import { PostCardAvatar } from './post-card-avatar';
import { PostCardFooter } from './post-card-footer';
import { PostCardStatus } from './post-card-status';
import { PostCardFeatured } from './post-card-featured';
import { PostCardDescription } from './post-card-description';

/**
 * @memberof CityArtWalks.Components.Post.PostCard
 * @function PostCard
 * @description Renders a post card component for public-accessible post display.
 * Combines the post's featured image, title, excerpt, metadata, and engagement metrics
 * into a styled card suitable for all users without authentication requirements.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.postId - The unique ID of the post.
 * @param {string} props.title - The title of the post.
 * @param {string} [props.excerpt] - A short excerpt or preview of the post content.
 * @param {string} [props.content] - The full content of the post (used if excerpt not available).
 * @param {string} [props.featuredImage] - The URL of the post's featured image.
 * @param {string} props.slug - The unique slug of the post used for navigation.
 * @param {string} [props.category] - The post category.
 * @param {Array<string>} [props.tags] - Array of post tags.
 * @param {boolean} [props.featured=false] - Whether the post is featured.
 * @param {string} [props.status='PUBLISHED'] - The post status.
 * @param {Object} [props.author] - The post author information.
 * @param {string} [props.author.name] - The author's name.
 * @param {string} [props.author.displayName] - The author's display name.
 * @param {string} [props.author.email] - The author's email.
 * @param {string} [props.author.image] - The author's profile image URL.
 * @param {string} [props.publishedAt] - The publication date.
 * @param {string} [props.createdAt] - The creation date.
 * @param {number} [props.createdBy] - The user ID who created the post.
 * @param {Object} [props._count] - Count of related entities.
 * @param {number} [props._count.comments=0] - Number of active comments.
 * @param {number} [props.viewCount=0] - Number of post views.
 * @param {Function} [props.onMouseEnter] - Callback function triggered when the card is hovered.
 * @param {Function} [props.onMouseLeave] - Callback function triggered when the card hover ends.
 * @param {Object} [props.other] - Additional props to pass to the outer `Card` component.
 * @returns {JSX.Element} The rendered PostCard component.
 *
 * @example
 * // Basic usage
 * import { PostCard } from './PostCard';
 *
 * function App() {
 *   return (
 *     <PostCard
 *       postId={123}
 *       title="Understanding Modern Art Trends"
 *       excerpt="Explore the latest movements in contemporary art and their impact on society."
 *       slug="understanding-modern-art-trends"
 *       category="Art Education"
 *       tags={["modern-art", "trends", "education"]}
 *       featured={true}
 *       author={{ name: "Jane Doe", email: "jane@example.com" }}
 *       publishedAt="2024-01-15T10:30:00Z"
 *       _count={{ comments: 12 }}
 *       viewCount={150}
 *       featuredImage="/images/modern-art-banner.jpg"
 *     />
 *   );
 * }
 */
function PostCard({
  postId,
  title,
  excerpt,
  content,
  featuredImage,
  slug,
  category,
  tags = [],
  featured = false,
  status = 'PUBLISHED',
  author,
  publishedAt,
  createdAt,
  createdBy,
  _count,
  viewCount = 0,
  onMouseEnter,
  onMouseLeave,
  ...other
}) {
  const { user } = useAuthContext();

  // Extract comment count from _count object
  const commentCount = _count?.comments || 0;

  // Check if current user is the owner of the post
  const isOwner = user?.userId === createdBy;

  // For public display, only show published posts (unless owner viewing own content)
  if (status !== 'PUBLISHED' && !isOwner) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Box onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...other}>
        <Card sx={{ textAlign: 'center', mb: 3, position: 'relative' }} data-cy="post-card">
          <PostCardFeatured featured={featured} />
          <PostCardStatus status={status} createdBy={createdBy} />

          <PostCardAvatar
            title={title}
            featuredImage={featuredImage}
            slug={slug}
            featured={featured}
            authorName={author?.name || author?.displayName || 'Unknown Author'}
            authorImageUrl={author?.image || ''}
          />

          <PostCardTitle title={title} slug={slug} />

          <PostCardMeta
            category={category}
            tags={tags}
            author={author}
            publishedAt={publishedAt}
            createdAt={createdAt}
          />

          <PostCardDescription excerpt={excerpt} content={content} />

          <Divider sx={{ borderStyle: 'dashed' }} />

          <PostCardFooter
            slug={slug}
            commentCount={commentCount}
            viewCount={viewCount}
            title={title}
          />
        </Card>
      </Box>
    </ErrorBoundary>
  );
}

export { PostCard };

/**
 * @memberof CityArtWalks.Components.Post.PostCard
 * @prop {number} postId - The unique ID of the post. This prop is required.
 * @prop {string} title - The title of the post. This prop is required.
 * @prop {string} [excerpt] - A short excerpt or preview of the post content. This prop is optional.
 * @prop {string} [content] - The full content of the post (used if excerpt not available). This prop is optional.
 * @prop {string} [featuredImage] - The URL of the post's featured image. This prop is optional.
 * @prop {string} slug - The unique slug of the post used for navigation. This prop is required.
 * @prop {string} [category] - The post category. This prop is optional.
 * @prop {Array<string>} [tags] - Array of post tags. This prop is optional.
 * @prop {boolean} [featured] - Whether the post is featured. This prop is optional.
 * @prop {string} [status] - The post status. This prop is optional.
 * @prop {Object} [author] - The post author information. This prop is optional.
 * @prop {string} [publishedAt] - The publication date. This prop is optional.
 * @prop {string} [createdAt] - The creation date. This prop is optional.
 * @prop {number} [createdBy] - The user ID who created the post. This prop is optional.
 * @prop {Object} [_count] - Count of related entities. This prop is optional.
 * @prop {number} [viewCount] - Number of post views. This prop is optional.
 * @prop {Function} [onMouseEnter] - Callback function triggered when the card is hovered. This prop is optional.
 * @prop {Function} [onMouseLeave] - Callback function triggered when the card hover ends. This prop is optional.
 * @prop {Object} [other] - Additional props to pass to the outer `Card` component. This prop is optional.
 */
PostCard.propTypes = {
  postId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  excerpt: PropTypes.string,
  content: PropTypes.string,
  featuredImage: PropTypes.string,
  slug: PropTypes.string.isRequired,
  category: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  featured: PropTypes.bool,
  status: PropTypes.oneOf(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED']),
  author: PropTypes.shape({
    name: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
  }),
  publishedAt: PropTypes.string,
  createdAt: PropTypes.string,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  _count: PropTypes.shape({
    comments: PropTypes.number,
  }),
  viewCount: PropTypes.number,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};
