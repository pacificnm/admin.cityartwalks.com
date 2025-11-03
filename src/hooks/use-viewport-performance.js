/**
 * @fileoverview Performance monitoring hook for viewport-based loading
 * @author CityArtWalks Development Team
 * @version 1.0.0
 * @namespace CityArtWalks.Hooks.ViewportPerformance
 */

import { useRef, useCallback } from 'react';

/**
 * @memberof CityArtWalks.Hooks.ViewportPerformance
 * @function useViewportPerformance
 * @description Hook to monitor performance metrics for viewport-based loading
 *
 * @returns {Object} Performance monitoring utilities
 */
export function useViewportPerformance() {
  const metricsRef = useRef({
    viewportChanges: 0,
    apiCalls: 0,
    totalLoadTime: 0,
    lastViewportChange: null,
    lastApiCall: null,
  });

  const startTiming = useCallback((event) => {
    const now = performance.now();
    metricsRef.current.lastViewportChange = now;

    if (event === 'viewport-change') {
      metricsRef.current.viewportChanges += 1;
    }

    return now;
  }, []);

  const endTiming = useCallback((event, startTime) => {
    const now = performance.now();
    const duration = now - startTime;

    if (event === 'api-call') {
      metricsRef.current.apiCalls += 1;
      metricsRef.current.totalLoadTime += duration;
      metricsRef.current.lastApiCall = now;

      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🗺️ Viewport API Call: ${duration.toFixed(2)}ms`);
      }
    }

    return duration;
  }, []);

  const getMetrics = useCallback(
    () => ({
      ...metricsRef.current,
      averageLoadTime:
        metricsRef.current.apiCalls > 0
          ? metricsRef.current.totalLoadTime / metricsRef.current.apiCalls
          : 0,
    }),
    []
  );

  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      viewportChanges: 0,
      apiCalls: 0,
      totalLoadTime: 0,
      lastViewportChange: null,
      lastApiCall: null,
    };
  }, []);

  return {
    startTiming,
    endTiming,
    getMetrics,
    resetMetrics,
  };
}
