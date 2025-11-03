/**
 * @file owner-dashboard.jsx
 * @description Main dashboard view for content owners to manage reviews of their content
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Components.Review.OwnerDashboard
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Model} - Review model documentation
 */

'use client';

import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { debugLog, debugError } from 'src/lib/debug';
import { useOwnerStats, useOwnerContent, useOwnerReviews } from 'src/actions/review/hooks';

import { PermissionGate } from 'src/components/auth/permission-gate';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { OwnerReviewStats } from 'src/components/review/owner-review-stats';
import { OwnerReviewTable } from 'src/components/review/owner-review-table';
import ReviewErrorBoundary from 'src/components/review/review-error-boundary';
import { ReviewTrendsChart } from 'src/components/review/review-trends-chart';
import { OwnerContentFilter } from 'src/components/review/owner-content-filter';
import { OwnerReviewFilters } from 'src/components/review/owner-review-filters';

/**
 * @memberof CityArtWalks.Components.Review.OwnerDashboard
 * @description Tab configuration for the owner dashboard
 * @constant {Array<Object>} DASHBOARD_TABS
 */
const DASHBOARD_TABS = [
  { value: 'overview', label: 'Overview', icon: 'solar:chart-2-bold-duotone' },
  { value: 'reviews', label: 'My Reviews', icon: 'solar:star-bold-duotone' },
  { value: 'content', label: 'My Content', icon: 'solar:gallery-bold-duotone' },
];

/**
 * @memberof CityArtWalks.Components.Review.OwnerDashboard
 * @description Main dashboard component for content owners to manage reviews
 * @function OwnerDashboard
 * @returns {JSX.Element} Owner dashboard interface
 */
export function OwnerDashboard() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [contentFilter, setContentFilter] = useState({ entityType: '', entityId: '' });
  const [reviewFilters, setReviewFilters] = useState({
    search: '',
    status: '',
    rating: '',
    minRating: '',
    maxRating: '',
    startDate: null,
    endDate: null,
    sort: 'newest',
  });

  // Fetch owner data with error handling
  const {
    content,
    summary: contentSummary,
    isLoading: contentLoading,
    error: contentError,
  } = useOwnerContent({
    entityType: contentFilter.entityType,
    enabled: true,
  });

  const {
    reviews,
    pagination,
    summary: reviewSummary,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useOwnerReviews({
    page: 1,
    limit: 20,
    entityType: contentFilter.entityType,
    status: reviewFilters.status,
    minRating: reviewFilters.minRating,
    maxRating: reviewFilters.maxRating,
    enabled: currentTab === 'reviews',
  });

  const {
    stats,
    performance,
    quality,
    moderation,
    isLoading: statsLoading,
    error: statsError,
  } = useOwnerStats({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    enabled: currentTab === 'overview',
  });

  // Handle tab change
  const handleTabChange = useCallback((_, newValue) => {
    debugLog(
      'CityArtWalks.Components.Review.OwnerDashboard.handleTabChange',
      `Switching to tab: ${newValue}`
    );
    setCurrentTab(newValue);
  }, []);

  // Handle date range change for statistics
  const handleDateRangeChange = useCallback((newDateRange) => {
    debugLog(
      'CityArtWalks.Components.Review.OwnerDashboard.handleDateRangeChange',
      'Date range updated',
      newDateRange
    );
    setDateRange(newDateRange);
  }, []);

  // Handle content filter change
  const handleContentFilterChange = useCallback((newFilter) => {
    debugLog(
      'CityArtWalks.Components.Review.OwnerDashboard.handleContentFilterChange',
      'Content filter updated',
      newFilter
    );
    setContentFilter(newFilter);
  }, []);

  // Handle review filters change
  const handleReviewFiltersChange = useCallback((newFilters) => {
    debugLog(
      'CityArtWalks.Components.Review.OwnerDashboard.handleReviewFiltersChange',
      'Review filters updated',
      newFilters
    );
    setReviewFilters(newFilters);
  }, []);

  // Handle export reviews to CSV
  const handleExportReviews = useCallback(() => {
    debugLog(
      'CityArtWalks.Components.Review.OwnerDashboard.handleExportReviews',
      `Exporting ${reviews.length} reviews`
    );

  }, [reviews]);

  // Compute dashboard title based on current tab
  const dashboardTitle = useMemo(() => {
    const tabConfig = DASHBOARD_TABS.find((tab) => tab.value === currentTab);
    return `Review Dashboard - ${tabConfig?.label || 'Overview'}`;
  }, [currentTab]);

  // Error handling
  if (contentError || reviewsError || statsError) {
    debugError('CityArtWalks.Components.Review.OwnerDashboard', 'Dashboard error', {
      contentError,
      reviewsError,
      statsError,
    });
  }

  return (
    <PermissionGate roles={['MEMBER', 'ADMIN']} showFallback>
      <ReviewErrorBoundary>
        <Container maxWidth="xl">
          <CustomBreadcrumbs
            heading={dashboardTitle}
            links={[
              { name: 'Dashboard', href: '/dashboard' },
              { name: 'Reviews', href: '/dashboard/reviews' },
              { name: 'Owner Dashboard' },
            ]}
            sx={{ mb: 3 }}
          />

          <Grid container spacing={3}>
            {/* Tab Navigation */}
            <Grid item xs={12}>
              <Card>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  sx={{
                    px: 2,
                    bgcolor: 'background.neutral',
                  }}
                >
                  {DASHBOARD_TABS.map((tab) => (
                    <Tab
                      key={tab.value}
                      value={tab.value}
                      label={tab.label}
                      icon={<Box component="span" className={`iconify ${tab.icon}`} />}
                      iconPosition="start"
                    />
                  ))}
                </Tabs>
              </Card>
            </Grid>

            {/* Overview Tab */}
            {currentTab === 'overview' && (
              <>
                <Grid item xs={12}>
                  <OwnerReviewStats
                    stats={stats}
                    performance={performance}
                    quality={quality}
                    moderation={moderation}
                    loading={statsLoading}
                    error={statsError}
                    onDateRangeChange={handleDateRangeChange}
                    dateRange={dateRange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <ReviewTrendsChart
                    trendsData={stats?.trends}
                    loading={statsLoading}
                    error={statsError}
                    title="Review Trends"
                  />
                </Grid>
              </>
            )}

            {/* Reviews Tab */}
            {currentTab === 'reviews' && (
              <>
                <Grid item xs={12}>
                  <OwnerReviewFilters
                    filters={reviewFilters}
                    onFiltersChange={handleReviewFiltersChange}
                    onExport={handleExportReviews}
                    loading={reviewsLoading}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <OwnerContentFilter
                    content={content}
                    summary={contentSummary}
                    loading={contentLoading}
                    error={contentError}
                    onFilterChange={handleContentFilterChange}
                    currentFilter={contentFilter}
                  />
                </Grid>

                <Grid item xs={12} md={9}>
                  <OwnerReviewTable
                    reviews={reviews}
                    pagination={pagination}
                    summary={reviewSummary}
                    loading={reviewsLoading}
                    error={reviewsError}
                    contentFilter={contentFilter}
                    reviewFilters={reviewFilters}
                  />
                </Grid>
              </>
            )}

            {/* Content Tab */}
            {currentTab === 'content' && (
              <Grid item xs={12}>
                <Card>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      My Content Summary
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {contentLoading ? (
                      <Typography variant="body2" color="text.secondary">
                        Loading your content...
                      </Typography>
                    ) : contentError ? (
                      <Typography variant="body2" color="error">
                        Error loading content: {contentError.message}
                      </Typography>
                    ) : (
                      <Stack spacing={2}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Artists:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {content?.artists?.length || 0}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Art Pieces:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {content?.artPieces?.length || 0}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Images:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {content?.images?.length || 0}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Paths:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {content?.paths?.length || 0}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Path Maps:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {content?.pathMaps?.length || 0}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body1" fontWeight="bold">
                            Total Reviews:
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" color="primary">
                            {contentSummary?.totalReviews || 0}
                          </Typography>
                        </Box>
                      </Stack>
                    )}
                  </Box>
                </Card>
              </Grid>
            )}
          </Grid>
        </Container>
      </ReviewErrorBoundary>
    </PermissionGate>
  );
}

export default OwnerDashboard;
