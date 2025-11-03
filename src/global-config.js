/**
 * Global Application Configuration for City Art Walks
 *
 * This module provides centralized configuration management for the entire City Art Walks
 * application, including environment variables, authentication settings, third-party service
 * configurations, and application constants. It serves as the single source of truth for
 * all configurable aspects of the application.
 *
 * Features: * - Environment variable management and validation
 * - Multi-provider authentication configuration (Auth0)
 * - Third-party service integration (Mapbox, reCAPTCHA, Office 365, Microsoft Graph)
 * - Development and production environment detection
 * - Static export build configuration
 * - Email service configuration with multiple providers
 * - Debug and monitoring settings (Sentry integration)
 * - Map visualization settings and styling
 *
 * @fileoverview Centralized configuration management for City Art Walks application
 * @version 1.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Config
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Debug|Debug Documentation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Documentation|API Documentation}
 */

// ----------------------------------------------------------------------

/**
 * Global application configuration object containing all environment variables,
 * authentication settings, third-party service configurations, and application constants.
 *
 * This configuration is used throughout the City Art Walks application to access
 * various settings and credentials in a centralized manner. All environment variables
 * are properly typed and documented for development clarity and maintenance.
 *
 * @memberof CityArtWalks.Config
 * @constant {Object} CONFIG
 * @property {string} [debug] - Debug mode flag for development logging
 * @property {string} [sentry] - Sentry integration flag for error monitoring
 * @property {string} appName - Application display name
 * @property {string} appVersion - Current application version from package.json
 * @property {string} serverUrl - Base URL for API requests
 * @property {string} assetsDir - Static assets directory path or CDN URL
 * @property {boolean} isStaticExport - Static export build flag for SSG
 * @property {string} geoIPKey - Geo IP service API key
 * @property {string} openAIKey - OpenAI API key (server-side only)
 * @property {string} dateFormatLong - Long date format pattern
 * @property {string} pathLineColor - Map path line color (hex)
 * @property {number} pathLineWidht - Map path line width in pixels
 * @property {string} vercelToken - Vercel API authentication token
 * @property {string} vercelBlobToken - Vercel Blob storage token
 * @property {string} mapboxApiKey - Mapbox API key for mapping services
 * @property {Object} auth - Authentication configuration
 * @property {Object} recaptcha - Google reCAPTCHA configuration
 * @property {Object} office365 - Office 365 email service configuration
 * @property {Object} microsoftGraph - Microsoft Graph API configuration
 * @property {Object} auth0 - Auth0 authentication configuration
 *
 */
import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

export const CONFIG = {
  /**
   * Debug mode configuration for development and production environments.
   *
   * Controls debug logging levels and development features throughout the application.
   * Accepts values: 'VERBOSE', 'WARN', 'ERROR' (case-insensitive). When enabled,
   * provides detailed console output for debugging and development purposes.
   *
   * @memberof CityArtWalks.Config
   * @type {string|undefined}
   * @example
   * // Enable verbose logging in development
   * NEXT_PUBLIC_DEBUG=VERBOSE
   *
   * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Debug#debug-levels|Debug Levels Documentation}
   */
  debug: process.env.NEXT_PUBLIC_DEBUG,

  /**
   * Sentry error monitoring and performance tracking integration flag.
   *
   * Enables or disables Sentry.io integration for comprehensive error tracking,
   * performance monitoring, and real-time alerting in production environments.
   * When enabled, automatically captures exceptions and performance metrics.
   *
   * @memberof CityArtWalks.Config
   * @type {string|undefined}
   * @example
   * // Enable Sentry monitoring
   * NEXT_PUBLIC_SENTRY=true
   *
   * @see {@link https://docs.sentry.io/platforms/javascript/nextjs/|Sentry Next.js Documentation}
   */
  sentry: process.env.NEXT_PUBLIC_SENTRY,

  /**
   * Application name constant
   * @type {string}
   * @description The display name of the application
   */
  appName: 'City Art Walks Admin',

  /**
   * Application version from package.json
   * @type {string}
   * @description Current version of the application
   */
  appVersion: packageJson.version,

  /**
   * Server URL for API requests
   * @type {string}
   * @description Base URL for server API calls, defaults to localhost?:3000 for development
   */
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://localhost?:5000',

  /**
   * Assets directory path
   * @type {string}
   * @description Path to static assets, can be CDN URL or relative path
   */
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',

  /**
   * Static export build flag
   * @type {boolean}
   * @description Indicates if the build is for static export (SSG)
   */
  isStaticExport: JSON.parse(process.env.BUILD_STATIC_EXPORT ?? 'false'),

  /**
   * Geo IP service API key
   * @type {string}
   * @description API key for geolocation IP services
   */
  geoIPKey: process.env.NEXT_PUBLIC_GEO_IP ?? '',

  /**
   * OpenAI API key
   * @type {string}
   * @description API key for OpenAI services (server-side only)
   */
  openAIKey: process.env.OPENAI_API_KEY ?? '',

  /**
   * Long date format string
   * @type {string}
   * @description Date format pattern for displaying full dates (e.g., "Jan 15, 2024")
   */
  dateFormatLong: 'MMM DD, YYYY',

  /**
   * Path line color for map visualization
   * @type {string}
   * @description Hex color code for drawing path lines on maps
   */
  pathLineColor: '#90caf9', // light blue

  /**
   * Path line width for map visualization
   * @type {number}
   * @description Width in pixels for drawing path lines on maps
   * @todo Fix typo: should be 'pathLineWidth'
   */
  pathLineWidht: 4,

  /**
   * Vercel API token
   * @type {string}
   * @description Authentication token for Vercel API operations
   */
  vercelToken: process.env.VERCEL_TOKEN ?? '',

  /**
   * Vercel Blob storage token
   * @type {string}
   * @description Authentication token for Vercel Blob storage operations
   */
  vercelBlobToken: process.env.VERCEL_BLOB_TOKEN ?? '',

  /**
   * Authentication system configuration for user management and security.
   *
   * Configures the primary authentication method and post-authentication behavior
   * for the City Art Walks application. Supports multiple authentication providers
   * including Auth0 for flexible deployment.
   *
   * @memberof CityArtWalks.Config
   * @type {Object}
   * @property {'auth0'} method - Authentication provider
   * @property {string} redirectPath - Post-authentication redirect destination
   *
   * @example
   * // Using Auth0 authentication
   * auth: {
   *   method: 'auth0',
   *   redirectPath: '/dashboard'
   * }
   *
   * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth|Authentication Documentation}
   */
  auth: {
    /**
     * Primary authentication method for user management.
     *
     * Determines which authentication provider to use for user registration,
     * login, and session management. Each provider offers different features
     * and integration capabilities for various deployment scenarios.
     *
     * @memberof CityArtWalks.Config
     * @type {'auth0'}
     * @default 'auth0'
     */
    method: 'auth0',

    /**
     * Post-authentication redirect path for successful logins.
     *
     * Defines the application route where users are redirected after
     * successful authentication. Typically points to the main dashboard
     * or home page of the application.
     *
     * @memberof CityArtWalks.Config
     * @type {string}
     * @default paths.home
     */
    redirectPath: paths.home,
  },

  /**
   * Mapbox configuration
   * @type {Object}
   * @description Configuration for Mapbox mapping services
   */
  /**
   * Mapbox API key
   * @type {string}
   * @description API key for Mapbox mapping services and geocoding
   */
  mapboxApiKey: process.env.NEXT_PUBLIC_MAPBOX_API ?? '',

  /**
   * IndexNow SEO service configuration for search engine indexing notifications.
   *
   * Configures IndexNow API integration for automatically notifying search engines
   * (Bing, Yandex, etc.) when content is created, updated, or deleted. This improves
   * SEO performance by ensuring search engines quickly discover content changes.
   *
   * @memberof CityArtWalks.Config
   * @type {Object}
   * @property {string} apiKey - IndexNow API key for authentication
   * @property {string} apiUrl - IndexNow API endpoint URL
   *
   * @example
   * // Environment variables setup
   * INDEXNOW_API_KEY=550e8400-e29b-41d4-a716-446655440000
   * INDEXNOW_API_URL=https://www.bing.com/indexnow
   *
   * @see {@link https://www.bing.com/indexnow|Microsoft Bing IndexNow Documentation}
   */
  indexNow: {
    /**
     * IndexNow API key for search engine notification authentication.
     *
     * UUID v4 string used to authenticate requests to the IndexNow API.
     * This key must also be accessible at the keyLocation URL
     * (typically https://domain.com/indexnow-key.txt) for verification.
     *
     * @memberof CityArtWalks.Config
     * @type {string}
     * @env INDEXNOW_API_KEY
     */
    apiKey: process.env.INDEXNOW_API_KEY ?? '',

    /**
     * IndexNow API endpoint URL for submitting indexing notifications.
     *
     * Microsoft Bing's IndexNow API endpoint where URL indexing notifications
     * are submitted directly to Bing. Using Bing's endpoint ensures faster
     * indexing for Microsoft search services.
     *
     * @memberof CityArtWalks.Config
     * @type {string}
     * @env INDEXNOW_API_URL
     */
    apiUrl: process.env.INDEXNOW_API_URL ?? 'https://www.bing.com/indexnow',
  },

  /**
   * Google reCAPTCHA security service configuration for spam and bot protection.
   *
   * Configures Google reCAPTCHA v2 or v3 for protecting forms and user interactions
   * from automated spam and malicious bot traffic. Includes both client-side widget
   * configuration and server-side verification settings.
   *
   * @memberof CityArtWalks.Config
   * @type {Object}
   * @property {string} siteKey - Public site key for client-side widget rendering
   * @property {string} secretKey - Private secret key for server-side verification
   *
   * @example
   * // Environment variables setup
   * NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   * RECAPTCHA_SECRET_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   *
   * @see {@link https://developers.google.com/recaptcha|Google reCAPTCHA Documentation}
   */
  recaptcha: {
    /**
     * reCAPTCHA public site key for client-side widget integration.
     *
     * Used to render the reCAPTCHA widget on web pages and identify the site
     * to Google's reCAPTCHA service. This key is safe to expose in client-side
     * code and is required for widget initialization.
     *
     * @memberof CityArtWalks.Config
     * @type {string}
     * @env NEXT_PUBLIC_RECAPTCHA_SITE_KEY
     */
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '',

    /**
     * reCAPTCHA secret key for server-side response verification.
     *
     * Private key used to verify reCAPTCHA responses on the server side.
     * Must be kept secure and never exposed in client-side code. Used
     * to validate user responses with Google's verification API.
     *
     * @memberof CityArtWalks.Config
     * @type {string}
     * @env RECAPTCHA_SECRET_KEY
     */
    secretKey: process.env.RECAPTCHA_SECRET_KEY ?? '',
  },

  /**
   * Office 365 email configuration
   * @type {Object}
   * @description Configuration for Office 365 Exchange email sending service
   * @property {string} username - Office 365 username/email for authentication
   * @property {string} password - Office 365 password or app password
   * @property {string} fromEmail - Default sender email address
   * @property {string} adminEmail - Admin email address for notifications
   */
  office365: {
    /**
     * Office 365 username
     * @type {string}
     * @description Username/email for Office 365 SMTP authentication
     */
    username: process.env.OFFICE365_USERNAME ?? '',

    /**
     * Office 365 password
     * @type {string}
     * @description Password or app password for Office 365 SMTP authentication
     */
    password: process.env.OFFICE365_PASSWORD ?? '',

    /**
     * Default sender email address
     * @type {string}
     * @description Email address used as the sender for outgoing emails
     */
    fromEmail: process.env.OFFICE365_FROM_EMAIL ?? 'support@pdxartwalks.com',

    /**
     * Admin notification email address
     * @type {string}
     * @description Email address to receive admin notifications and contact form submissions
     */
    adminEmail: process.env.OFFICE365_ADMIN_EMAIL ?? 'jaimie@pdxartwalks.com',
  },

  /**
   * Microsoft Graph API configuration
   * @type {Object}
   * @description Configuration for Microsoft Graph API email sending service
   * @property {string} clientId - Azure AD application client ID
   * @property {string} clientSecret - Azure AD application client secret
   * @property {string} tenantId - Azure AD tenant ID
   * @property {string} fromEmail - Email address to send from (must exist in tenant)
   * @property {string} adminEmail - Admin email address for notifications
   */
  microsoftGraph: {
    /**
     * Azure AD application client ID
     * @type {string}
     * @description Client ID of the Azure AD app registration
     */
    clientId: process.env.MICROSOFT_GRAPH_CLIENT_ID ?? '',

    /**
     * Azure AD application client secret
     * @type {string}
     * @description Client secret for Azure AD app authentication
     */
    clientSecret: process.env.MICROSOFT_GRAPH_CLIENT_SECRET ?? '',

    /**
     * Azure AD tenant ID
     * @type {string}
     * @description Tenant ID where the application is registered
     */
    tenantId: process.env.MICROSOFT_GRAPH_TENANT_ID ?? '',

    /**
     * From email address
     * @type {string}
     * @description Email address to send from (must be a user in the tenant)
     */
    fromEmail: process.env.MICROSOFT_GRAPH_FROM_EMAIL ?? 'support@cityartwalks.com',

    /**
     * Admin notification email address
     * @type {string}
     * @description Email address to receive admin notifications and contact form submissions
     */
    adminEmail: process.env.MICROSOFT_GRAPH_ADMIN_EMAIL ?? 'jaimie@cityartwalks.com',
  },

  /**
   * Auth0 authentication service configuration for secure user management.
   *
   * Configures Auth0 identity platform integration for comprehensive user
   * authentication, authorization, and user management. Provides enterprise-grade
   * security features including SSO, MFA, and social login capabilities.
   *
   * @memberof CityArtWalks.Config
   * @type {Object}
   * @property {string} clientId - Auth0 application client identifier
   * @property {string} domain - Auth0 tenant domain for authentication
   * @property {string} callbackUrl - Post-authentication callback URL
   * @property {string} audience - Auth0 API audience for token validation
   *
   * @example
   * // Environment variables setup
   * NEXT_PUBLIC_AUTH0_CLIENT_ID=abcd1234567890
   * NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
   * NEXT_PUBLIC_AUTH0_CALLBACK_URL=https://localhost?:3000/api/auth/callback
   * NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.cityartwalks.com
   *
   * @see {@link https://auth0.com/docs/quickstart/spa/nextjs|Auth0 Next.js Documentation}
   */
  auth0: {
    /**
     * Auth0 application client ID for authentication requests.
     *
     * Unique identifier for the Auth0 application registration.
     * Used to identify the application to Auth0's authentication service
     * and configure application-specific settings and permissions.
     *
     * @memberof CityArtWalks.Config
     * @type {string}
     * @env NEXT_PUBLIC_AUTH0_CLIENT_ID
     */
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? '',

    /**
     * Auth0 tenant domain for authentication services.
     *
     * The domain where your Auth0 tenant is hosted (e.g., 'your-tenant.auth0.com').
     * This domain is used for all authentication flows, login pages,
     * and API communications with Auth0 services.
     *
     * @memberof CityArtWalks.Config
     * @type {string}
     * @env NEXT_PUBLIC_AUTH0_DOMAIN
     */
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? '',

    /**
     * Auth0 callback URL for post-authentication redirects.
     *
     * The URL where Auth0 redirects users after successful authentication.
     * Must be registered in Auth0 application settings as an allowed
     * callback URL for security purposes.
     *
     * @memberof CityArtWalks.Config
     * @type {string}
     * @env NEXT_PUBLIC_AUTH0_CALLBACK_URL
     */
    callbackUrl: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL ?? '',

    /**
     * Auth0 API audience identifier for token validation.
     *
     * Specifies the intended audience for JWT tokens issued by Auth0.
     * Used for API authorization and ensuring tokens are intended
     * for your specific API endpoints.
     *
     * @memberof CityArtWalks.Config
     * @type {string}
     * @env NEXT_PUBLIC_AUTH0_AUDIENCE
     */
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE ?? '',
  },
};
