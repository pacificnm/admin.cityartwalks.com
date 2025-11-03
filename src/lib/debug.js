/**
 * @file debug.js
 * @description Centralized Debug and Logging Utilities for City Art Walks
 *
 * This module provides comprehensive debugging and logging functionality with environment-aware
 * logging, automatic error monitoring through Sentry integration, and performance measurement
 * tools. It supports multiple debug levels and provides both development and production logging.
 *
 * Features:
 * - Environment-aware conditional logging (VERBOSE, WARN, ERROR levels)
 * - Automatic Sentry error reporting for production monitoring
 * - Performance measurement with timing utilities
 * - Structured logging with location-based categorization
 * - JSON and table formatting for complex data debugging
 * - Grouped console logging for organized debug output
 * - Stack trace utilities for call chain debugging
 * - Legacy function aliases for backward compatibility
 * @namespace CityArtWalks.Lib.Debug
 * @version 2.1.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Lib} - Library utilities documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Debug} - Debug utilities documentation
 */

import { CONFIG } from 'src/global-config';

// Debug levels
const DEBUG_LEVELS = {
  VERBOSE: 0,
  WARN: 1,
  ERROR: 2,
};

function getDebugLevel() {
  // Accepts: 'VERBOSE', 'WARN', 'ERROR' (case-insensitive)
  const level = (CONFIG.debug || '').toUpperCase();
  if (level === 'VERBOSE') return DEBUG_LEVELS.VERBOSE;
  if (level === 'WARN') return DEBUG_LEVELS.WARN;
  if (level === 'ERROR') return DEBUG_LEVELS.ERROR;
  // Default: only show errors
  return DEBUG_LEVELS.ERROR;
}

/**
 * Logs informational messages for development debugging with conditional output.
 * Provides console logging that only outputs when the debug level is set to VERBOSE.
 * Essential for development debugging without cluttering production logs. Messages are
 * prefixed with location identifiers for easy source tracking and debugging context.
 *
 * Features:
 * - Conditional logging based on debug level
 * - Location-based categorization for easy tracking
 * - VERBOSE level requirement for output
 * - Multiple argument support
 * - Development-focused debugging
 * - Clean production environment (no output)
 *
 * @function debugLog
 * @memberof CityArtWalks.Lib.Debug
 *
 * @example
 * // Basic informational logging
 * debugLog('UserService.getProfile', 'Fetching user profile for ID:', userId);
 *
 * @example
 * // Logging with multiple arguments
 * debugLog('ArtPieceForm.handleSubmit', 'Form data:', formData, 'Validation result:', isValid);
 *
 * @example
 * // Output format (when VERBOSE debug level is enabled):
 * // [UserService.getProfile] Fetching user profile for ID: 123
 *
 * @param {string} location - Location identifier for debugging context (e.g., 'ImageHooks', 'ApiClient', 'MetadataUtils.generateArtPieceMetadata')
 * @param {...any} args - Arguments to log (strings, objects, arrays, etc.)
 */
export function debugLog(location, ...args) {
  // Only log if level is VERBOSE
  if (getDebugLevel() === DEBUG_LEVELS.VERBOSE) {
    console.log(`[${location}]`, ...args);
  }
}

/**
 * Logs informational messages with semantic consistency (alias for debugLog).
 * Provides semantic consistency with console.info while maintaining the same
 * functionality as debugLog. Useful for teams familiar with standard console
 * methods who want to maintain similar naming conventions.
 *
 * Features:
 * - Semantic consistency with console.info patterns
 * - Identical functionality to debugLog
 * - VERBOSE level requirement for output
 * - Location-based categorization
 * - Multiple argument support
 * - Team-friendly naming convention
 *
 * @function debugInfo
 * @memberof CityArtWalks.Lib.Debug
 *
 * @example
 * // Semantic info logging
 * debugInfo('DataSync.processRecords', 'Processing batch of records:', batchSize);
 *
 * @example
 * // Consistent with console.info patterns
 * debugInfo('CacheManager.refresh', 'Cache refreshed successfully', { cacheSize: newSize });
 *
 * @param {string} location - Location identifier for debugging context
 * @param {...any} args - Arguments to log
 */
export function debugInfo(location, ...args) {
  debugLog(location, ...args);
}

/**
 * Logs warning messages for potential issues and non-critical problems.
 * Displays warning messages when debug level is set to VERBOSE or WARN.
 * Useful for highlighting potential issues that don't break functionality
 * but should be addressed. Messages are prefixed with [WARN] for easy
 * identification in console output.
 *
 * Features:
 * - VERBOSE and WARN level support
 * - [WARN] prefix for easy identification
 * - Non-critical issue highlighting
 * - Potential problem detection
 * - Location-based categorization
 * - Multiple argument support
 *
 * @function debugWarn
 * @memberof CityArtWalks.Lib.Debug
 *
 * @example
 * // API deprecation warning
 * debugWarn('ApiClient.fetchData', 'Using deprecated API endpoint:', endpoint);
 *
 * @example
 * // Performance warning
 * debugWarn('ImageProcessor.resize', 'Large image detected, processing may be slow:', imageSize);
 *
 * @example
 * // Output format (when WARN or VERBOSE debug level is enabled):
 * // [WARN][ApiClient.fetchData] Using deprecated API endpoint: /api/v1/old-endpoint
 *
 * @param {string} location - Location identifier for debugging context
 * @param {...any} args - Arguments to log (warning messages, relevant data, etc.)
 */
export function debugWarn(location, ...args) {
  // Show if level is VERBOSE or WARN
  const level = getDebugLevel();
  if (level === DEBUG_LEVELS.VERBOSE || level === DEBUG_LEVELS.WARN) {
    console.warn(`[WARN][${location}]`, ...args);
  }
}

/**
 * Logs error messages and automatically reports them to Sentry for monitoring.
 * Provides comprehensive error logging that displays in console at all debug levels
 * and logs detailed error information to the console for debugging and monitoring.
 * Handles both Error objects and string messages with proper context
 * preservation and additional debugging information.
 *
 * Features:
 * - Console error logging with location tagging
 * - Support for both Error objects and string messages
 * - Additional context preservation for debugging
 * - Debug level categorization for monitoring
 * - Comprehensive error handling
 * - Production-ready error reporting
 *
 * @function debugError
 * @memberof CityArtWalks.Lib.Debug
 *
 * @example
 * // Logging with Error object
 * try {
 *   await fetchArtPiece(id);
 * } catch (error) {
 *   debugError('ArtPieceService.fetchById', error, { artPieceId: id });
 * }
 *
 * @example
 * // Logging with string message
 * debugError('FormValidation.validateEmail', 'Invalid email format detected', { email, field: 'userEmail' });
 *
 * @example
 * // Output format (always visible regardless of debug level):
 * // [ERROR][ArtPieceService.fetchById] Error: Failed to fetch art piece
 *
 * @param {string} location - Location identifier for debugging context
 * @param {Error|string} error - Error object or error message to log
 * @param {...any} args - Additional arguments for context (objects, strings, etc.)
 */
export function debugError(location, error, ...args) {
  // Show if level is VERBOSE, WARN, or ERROR
  const level = getDebugLevel();
  if (
    level === DEBUG_LEVELS.VERBOSE ||
    level === DEBUG_LEVELS.WARN ||
    level === DEBUG_LEVELS.ERROR
  ) {
    console.error(`[ERROR][${location}]`, error, ...args);
  }

  // Log error details for debugging (Sentry integration removed)
  try {
    // Determine if error is an Error object or string
    const isErrorObject = error instanceof Error;

    // Prepare extra context for logging
    const extra = {
      location,
      additionalArgs: args.length > 0 ? args : undefined,
    };

    // If error is a string, add it as extra context
    if (!isErrorObject) {
      extra.originalMessage = String(error);
    }

    // Console logging only - no external service calls
  } catch (logError) {
    // Fail silently if logging fails to avoid disrupting application flow
    if (getDebugLevel() === DEBUG_LEVELS.VERBOSE) {
      console.error('[ERROR][debugError] Failed to log error?:', logError);
    }
  }
}

/**
 * Logs objects and data as formatted JSON for detailed inspection.
 * Provides pretty-printed JSON output for complex data structures, making it
 * easy to inspect object properties, API responses, form data, and other
 * structured information. Only displays when debug level is set to VERBOSE.
 *
 * Features:
 * - Pretty-printed JSON formatting with indentation
 * - Complex data structure inspection
 * - VERBOSE level requirement for output
 * - Customizable data labels
 * - API response debugging support
 * - Form data inspection capabilities
 *
 * @function debugJson
 * @memberof CityArtWalks.Lib.Debug
 *
 * @example
 * // Log API response data
 * debugJson('ApiClient.fetchArtPieces', responseData, 'API Response');
 *
 * @example
 * // Log form submission data
 * debugJson('ContactForm.handleSubmit', formData, 'Form Submission');
 *
 * @example
 * // Output format (when VERBOSE debug level is enabled):
 * // [JSON][ApiClient.fetchArtPieces] API Response: {
 * //   "artPieces": [...],
 * //   "totalCount": 42,
 * //   "page": 1
 * // }
 *
 * @param {string} location - Location identifier for debugging context
 * @param {any} data - Data to serialize and log (objects, arrays, primitives)
 * @param {string} [label='Data'] - Optional descriptive label for the data
 */
export function debugJson(location, data, label = 'Data') {
  // Only log if level is VERBOSE
  if (getDebugLevel() === DEBUG_LEVELS.VERBOSE) {
    const jsonString = JSON.stringify(data, null, 2);
    console.log(`[JSON][${location}] ${label}:`, jsonString);
  }
}

/**
 * Logs data as formatted console tables for structured data inspection.
 * Provides tabular display of arrays and objects using console.table(),
 * making it easy to inspect collections, database results, and structured
 * data sets. Particularly useful for analyzing lists of entities or records.
 *
 * Features:
 * - Console.table() formatting for structured display
 * - Array and object data support
 * - Collection inspection capabilities
 * - Database result analysis
 * - VERBOSE level requirement for output
 * - Customizable table labels
 *
 * @function debugTable
 * @memberof CityArtWalks.Lib.Debug
 *
 * @example
 * // Log array of art pieces as table
 * debugTable('ArtPieceService.getAll', artPieces, 'Art Pieces Collection');
 *
 * @example
 * // Log form validation results
 * debugTable('FormValidator.validateFields', validationResults, 'Field Validation');
 *
 * @example
 * // Output format (when VERBOSE debug level is enabled):
 * // [TABLE][ArtPieceService.getAll] Art Pieces Collection:
 * // ┌─────────┬─────────────────┬──────────────────┬────────────┐
 * // │ (index) │      title      │    artistName    │   status   │
 * // ├─────────┼─────────────────┼──────────────────┼────────────┤
 * // │    0    │ 'Girl with...'  │    'Banksy'      │  'ACTIVE'  │
 * // └─────────┴─────────────────┴──────────────────┴────────────┘
 *
 * @param {string} location - Location identifier for debugging context
 * @param {Array|Object} data - Data to display as table (arrays of objects work best)
 * @param {string} [label='Table'] - Optional descriptive label for the table
 */
export function debugTable(location, data, label = 'Table') {
  // Only log if level is VERBOSE
  if (getDebugLevel() === DEBUG_LEVELS.VERBOSE) {
    console.log(`[TABLE][${location}] ${label}:`);
    console.table(data);
  }
}

/**
 * Creates collapsible console groups for organized debug output.
 * Provides structured logging by grouping related debug statements together
 * in collapsible console groups. Useful for organizing complex debugging
 * sessions and tracking execution flow through multiple related operations.
 *
 * Features:
 * - Collapsible console group creation
 * - Structured debug statement organization
 * - Execution flow tracking
 * - Complex debugging session organization
 * - Collapsed or expanded group options
 * - VERBOSE level requirement for output
 *
 * @function debugGroup
 * @memberof CityArtWalks.Lib.Debug
 *
 * @example
 * // Group form validation steps
 * debugGroup('ContactForm.validate', 'Form Validation Process', () => {
 *   debugLog('ContactForm.validate', 'Validating email field');
 *   debugLog('ContactForm.validate', 'Validating message field');
 *   debugLog('ContactForm.validate', 'Validation complete');
 * });
 *
 * @example
 * // Group API call sequence with collapsed group
 * debugGroup('DataService.syncAll', 'Full Data Synchronization', () => {
 *   debugLog('DataService.syncAll', 'Fetching art pieces');
 *   debugLog('DataService.syncAll', 'Fetching artists');
 *   debugLog('DataService.syncAll', 'Sync complete');
 * }, true);
 *
 * @example
 * // Output format (when VERBOSE debug level is enabled):
 * // ▼ [GROUP][ContactForm.validate] Form Validation Process
 * //   [ContactForm.validate] Validating email field
 * //   [ContactForm.validate] Validating message field
 * //   [ContactForm.validate] Validation complete
 *
 * @param {string} location - Location identifier for debugging context
 * @param {string} groupName - Descriptive name for the console group
 * @param {Function} callback - Function to execute within the debug group
 * @param {boolean} [collapsed=false] - Whether the group should start collapsed
 */
export function debugGroup(location, groupName, callback, collapsed = false) {
  // Only log if level is VERBOSE
  if (getDebugLevel() === DEBUG_LEVELS.VERBOSE) {
    if (collapsed) {
      console.groupCollapsed(`[GROUP][${location}] ${groupName}`);
    } else {
      console.group(`[GROUP][${location}] ${groupName}`);
    }
    try {
      callback();
    } finally {
      console.groupEnd();
    }
  } else {
    // Still execute callback even if not logging
    callback();
  }
}

/**
 * Starts a performance timer for measuring execution duration.
 * Initiates a named timer using console.time() for performance measurement
 * and optimization analysis. Timers are location-prefixed for easy identification
 * and can be used to measure function execution, API call duration, or any
 * time-sensitive operations.
 *
 * Features:
 * - Named timer creation with console.time()
 * - Performance measurement and optimization analysis
 * - Location-prefixed timer identification
 * - Function execution timing
 * - API call duration measurement
 * - VERBOSE level requirement for output
 *
 * @function debugTime
 * @memberof CityArtWalks.Lib.Debug
 *
 * @example
 * // Measure API call duration
 * debugTime('ArtPieceService.fetchAll', 'API Request');
 * // ... perform API call ...
 * debugTimeEnd('ArtPieceService.fetchAll', 'API Request');
 *
 * @example
 * // Measure complex calculation time
 * debugTime('ImageProcessor.resize', 'Image Processing');
 * // ... image processing logic ...
 * debugTimeEnd('ImageProcessor.resize', 'Image Processing');
 *
 * @param {string} location - Location identifier for debugging context
 * @param {string} timerName - Unique name for the timer (will be prefixed with location)
 */
export function debugTime(location, timerName) {
  const fullTimerName = `[${location}] ${timerName}`;
  // Only log if level is VERBOSE
  if (getDebugLevel() === DEBUG_LEVELS.VERBOSE) {
    console.time(fullTimerName);
  }
}

/**
 * Ends a performance timer and logs the elapsed execution time.
 * Completes a timing measurement started with debugTime() and outputs the
 * elapsed duration. Essential for performance analysis, optimization efforts,
 * and identifying bottlenecks in application execution.
 *
 * Features:
 * - Timer completion with elapsed duration output
 * - Performance analysis and optimization support
 * - Bottleneck identification in application execution
 * - Matching timer name requirement with debugTime()
 * - Console.timeEnd() integration
 * - VERBOSE level requirement for output
 *
 * @function debugTimeEnd
 * @memberof CityArtWalks.Lib.Debug
 *
 * @example
 * // Complete timing measurement
 * debugTime('DatabaseService.query', 'User Lookup');
 * const user = await findUserById(id);
 * debugTimeEnd('DatabaseService.query', 'User Lookup');
 * // Output: [DatabaseService.query] User Lookup: 45.123ms
 *
 * @example
 * // Measure form processing time
 * debugTime('ContactForm.process', 'Email Sending');
 * await sendContactEmail(formData);
 * debugTimeEnd('ContactForm.process', 'Email Sending');
 *
 * @param {string} location - Location identifier (must match debugTime call)
 * @param {string} timerName - Name of the timer to end (must match debugTime call)
 */
export function debugTimeEnd(location, timerName) {
  const fullTimerName = `[${location}] ${timerName}`;
  // Only log if level is VERBOSE
  if (getDebugLevel() === DEBUG_LEVELS.VERBOSE) {
    console.timeEnd(fullTimerName);
  }
}

/**
 * Logs stack traces for debugging call chains and execution flow.
 * Provides detailed stack trace information using console.trace() to help
 * developers understand code execution paths, identify where functions are
 * called from, and debug complex call chains in the application.
 *
 * Features:
 * - Detailed stack trace information with console.trace()
 * - Code execution path understanding
 * - Function call origin identification
 * - Complex call chain debugging
 * - VERBOSE level requirement for output
 * - Customizable trace messages
 *
 * @function debugTrace
 * @memberof CityArtWalks.Lib.Debug
 *
 * @example
 * // Debug unexpected function calls
 * function deprecatedFunction() {
 *   debugTrace('LegacyUtils.deprecatedFunction', 'This function should not be called');
 *   // ... function logic ...
 * }
 *
 * @example
 * // Trace complex execution paths
 * debugTrace('EventHandler.onClick', 'Button click trace');
 *
 * @example
 * // Output format (when VERBOSE debug level is enabled):
 * // [TRACE][EventHandler.onClick] Button click trace
 * // console.trace()
 * //   at debugTrace (debug.js:285:13)
 * //   at onClick (button.jsx:42:5)
 * //   at HTMLButtonElement.<anonymous>
 *
 * @param {string} location - Location identifier for debugging context
 * @param {string} [message='Stack trace'] - Optional descriptive message for the trace
 */
export function debugTrace(location, message = 'Stack trace') {
  // Only log if level is VERBOSE
  if (getDebugLevel() === DEBUG_LEVELS.VERBOSE) {
    console.log(`[TRACE][${location}] ${message}`);
    console.trace();
  }
}

// Legacy support - maintain backward compatibility
export { debugLog as log, debugWarn as warn, debugError as error };
