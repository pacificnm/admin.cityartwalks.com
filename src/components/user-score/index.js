/**
 * User Score System - Components and Hooks Exports
 *
 * This module provides easy access to all user scoring components and hooks.
 * Use this for convenient imports of scoring-related functionality.
 *
 * @namespace CityArtWalks.Components.UserScore
 * @fileoverview Centralized exports for user scoring system
 * @author CityArtWalks Development Team
 * @version 1.0.0
 *
 * @example
 * // Import the score widget component
 * import { UserScoreWidget } from 'src/components/user-score';
 *
 * // Import specific hooks
 * import { useGetUserScoreById, useUserScoreMutations } from 'src/components/user-score';
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserScore-Model} - UserScore documentation
 */

// Component exports
export { UserScoreWidget } from '../user/user-score-widget';

// Hook exports for convenience
export {
  useAdjustUserScore,
  useAwardBonusPoints,
  useGetUserScoreById,
  useRebuildUserScore,
  useUserScoreMutations,
  useGetUserScoreHistory,
  useGetPaginatedUserScores,
} from '../../actions/user-score/hooks';

// Example usage documentation in JSDoc
/**
 * @example
 * // Basic usage in a profile page
 * import { UserScoreWidget } from 'src/components/user-score';
 *
 * function ProfilePage({ userId }) {
 *   return (
 *     <Box>
 *       <UserScoreWidget userId={userId} />
 *     </Box>
 *   );
 * }
 *
 * @example
 * // Compact version for sidebar
 * import { UserScoreWidget } from 'src/components/user-score';
 *
 * function UserSidebar({ userId }) {
 *   return (
 *     <UserScoreWidget
 *       userId={userId}
 *       compact
 *       showProgress={false}
 *       showLastActivity={false}
 *     />
 *   );
 * }
 *
 * @example
 * // Using hooks directly for custom components
 * import { useGetUserScoreById } from 'src/components/user-score';
 *
 * function CustomScoreDisplay({ userId }) {
 *   const { userScore, userScoreLoading } = useGetUserScoreById(userId);
 *
 *   if (userScoreLoading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <h3>{userScore?.totalPoints || 0} Points</h3>
 *       <p>Rank: #{userScore?.currentRank}</p>
 *     </div>
 *   );
 * }
 */
