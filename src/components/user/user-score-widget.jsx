/**
 * @namespace CityArtWalks.Components.User.UserScoreWidget
 * @version 1.0.0
 * @author CityArtWalks Development Team
 * @memberof CityArtWalks.Components.User
 * @description User score widget component that displays user's total points and scoring metrics.
 * Shows total points, level progress, recent activity, and achievement badges.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserScore-Model} - UserScore documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Model} - User documentation
 */

'use client';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

import { fToNow } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

import { useGetUserScoreById } from 'src/actions/user-score/hooks';

import { StarIcon } from 'src/components/icons';
import { AwardIcon } from 'src/components/icons/award-icon';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Components.User.UserScoreWidget
 * @function UserScoreWidget
 * @description Displays a comprehensive user scoring widget with points, level, and achievements.
 *
 * @param {Object} props - Component props
 * @param {string|number} props.userId - The user ID to fetch scoring data for
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {string} [props.variant='outlined'] - Card variant: 'outlined', 'elevation'
 * @param {boolean} [props.compact=false] - Compact layout for smaller spaces
 * @param {boolean} [props.showProgress=true] - Whether to show level progress bar
 * @param {boolean} [props.showLastActivity=true] - Whether to show last activity timestamp
 * @returns {JSX.Element} The rendered UserScoreWidget component
 */
export function UserScoreWidget(props) {
  const {
    userId,
    sx,
    variant = 'outlined',
    compact = false,
    showProgress = true,
    showLastActivity = true,
    ...other
  } = props;

  const theme = useTheme();
  const { accessToken } = useAuthContext();

  // Fetch user score data using the hook
  const { userScore, userScoreLoading, userScoreError } = useGetUserScoreById(userId, accessToken);

  // Calculate level and progress from total points
  const levelData = useMemo(() => {
    if (!userScore?.totalPoints) {
      return { level: 1, pointsInLevel: 0, pointsToNext: 100, progressPercent: 0 };
    }

    const totalPoints = userScore.totalPoints;

    // Simple level calculation: 100 points per level, exponential growth
    // Level 1: 0-99 points, Level 2: 100-299 points, Level 3: 300-699 points, etc.
    let level = 1;
    let pointsRequired = 100;
    let totalRequired = 0;

    while (totalPoints >= totalRequired + pointsRequired) {
      totalRequired += pointsRequired;
      level += 1;
      pointsRequired = Math.floor(pointsRequired * 1.5); // 50% increase each level
    }

    const pointsInLevel = totalPoints - totalRequired;
    const pointsToNext = pointsRequired - pointsInLevel;
    const progressPercent = (pointsInLevel / pointsRequired) * 100;

    return {
      level,
      pointsInLevel,
      pointsToNext,
      progressPercent: Math.min(100, Math.max(0, progressPercent)),
      totalRequired,
      nextLevelTotal: totalRequired + pointsRequired,
    };
  }, [userScore?.totalPoints]);

  // Generate level title based on points
  const levelTitle = useMemo(() => {
    const titles = [
      'Newcomer', // Level 1
      'Explorer', // Level 2
      'Enthusiast', // Level 3
      'Collector', // Level 4
      'Connoisseur', // Level 5
      'Expert', // Level 6
      'Master', // Level 7
      'Legend', // Level 8
      'Champion', // Level 9
      'Art Virtuoso', // Level 10+
    ];

    const index = Math.min(levelData.level - 1, titles.length - 1);
    return titles[index] || 'Art Virtuoso';
  }, [levelData.level]);

  // Format last activity
  const lastActivity = useMemo(() => {
    if (!userScore?.lastActivity) return null;
    return fToNow(userScore.lastActivity);
  }, [userScore?.lastActivity]);

  // Handle loading state
  if (userScoreLoading) {
    return (
      <Card variant={variant} sx={[{ p: 2 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
        <CardContent sx={{ p: compact ? 1 : 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: compact ? 48 : 56,
                height: compact ? 48 : 56,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant={compact ? 'h6' : 'h5'} sx={{ color: 'text.disabled' }}>
                Loading...
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                Fetching scoring data
              </Typography>
            </Box>
          </Box>
          {showProgress && <LinearProgress sx={{ opacity: 0.3 }} />}
        </CardContent>
      </Card>
    );
  }

  // Handle error or no data
  if (userScoreError || !userScore) {
    return (
      <Card variant={variant} sx={[{ p: 2 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
        <CardContent sx={{ p: compact ? 1 : 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: compact ? 48 : 56,
                height: compact ? 48 : 56,
                bgcolor: alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <AwardIcon size={compact ? 24 : 28} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant={compact ? 'h6' : 'h5'} sx={{ color: 'text.disabled' }}>
                No Score Data
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                Start exploring to earn points!
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      variant={variant}
      sx={[
        {
          position: 'relative',
          overflow: 'visible',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Level badge in top right */}
      <Chip
        label={`Level ${levelData.level}`}
        color="primary"
        size="small"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1,
          fontWeight: 'bold',
        }}
      />

      <CardContent sx={{ p: compact ? 2 : 3 }}>
        {/* Header with avatar and main score */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: compact ? 48 : 64,
              height: compact ? 48 : 64,
              bgcolor: theme.palette.primary.main,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }}
          >
            <AwardIcon
              size={compact ? 24 : 32}
              sx={{ color: theme.palette.primary.contrastText }}
            />
          </Avatar>{' '}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={compact ? 'h5' : 'h4'}
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                lineHeight: 1,
              }}
            >
              {fNumber(userScore.totalPoints)}
            </Typography>
            <Typography
              variant={compact ? 'subtitle2' : 'subtitle1'}
              sx={{ color: 'text.secondary', lineHeight: 1.2 }}
            >
              Total Points
            </Typography>
          </Box>
        </Box>

        {/* Level title and rank */}
        <Box sx={{ mb: showProgress ? 2 : 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <StarIcon size={18} sx={{ color: 'warning.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
              {levelTitle}
            </Typography>
          </Stack>

          {userScore.currentRank && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Rank #{fNumber(userScore.currentRank)} globally
            </Typography>
          )}
        </Box>

        {/* Level progress bar */}
        {showProgress && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Level {levelData.level} Progress
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {fNumber(levelData.pointsToNext)} to next level
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={levelData.progressPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.grey[500], 0.12),
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        )}

        {!compact && (
          <>
            <Divider sx={{ my: 2 }} />

            {/* Additional metrics */}
            <Stack direction="row" spacing={3}>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {fNumber(userScore.totalCreatedContent || 0)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Content Created
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem />

              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                  {fNumber(userScore.totalInteractions || 0)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Interactions
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem />

              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {fNumber(userScore.bonusPoints || 0)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Bonus Points
                </Typography>
              </Box>
            </Stack>
          </>
        )}

        {/* Last activity */}
        {showLastActivity && lastActivity && (
          <Box
            sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.grey[500], 0.12)}` }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Last activity: {lastActivity}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
