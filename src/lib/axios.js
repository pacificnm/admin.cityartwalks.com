import axios from 'axios';

import { cleanUrl } from 'src/utils/clean-url';

import { CONFIG } from 'src/global-config';
// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: {
    //'Content-Type': 'application/json',
  },
});

// In-memory token storage
let accessToken = null;

/**
 * Set the token for authenticated requests.
 * @param {string|null} token
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Axios-Lib} - Complete documentation
 */
export function setAccessToken(token) {
  // console.log('[setAccessToken] Setting token?:', token);
  // console.log('[setAccessToken] Token type?:', typeof token);

  // Validate token before setting - reject any falsy values except null
  if (token === null) {
    // Explicitly clear token
    accessToken = null;
    delete axiosInstance.defaults.headers.common.Authorization;
    // console.log('[setAccessToken] Token explicitly cleared');
  } else if (
    token &&
    typeof token === 'string' &&
    token !== 'undefined' &&
    token !== 'null' &&
    token.trim().length > 0
  ) {
    // Set valid token
    accessToken = token;
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    // console.log('[setAccessToken] Valid token set on default headers');
  } else {
    // Invalid token - don't set anything
    console.warn('[setAccessToken] Invalid token provided, ignoring?:', token);
    return;
  }
}

/**
 * Get the currently stored access token.
 * @returns {string|null}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Axios-Lib} - Complete documentation
 */
function getAccessToken() {
  // console.log('[getAccessToken] Checking for token...');
  // console.log('[getAccessToken] In-memory accessToken?:', accessToken);

  // First check in-memory storage
  if (accessToken) {
    // console.log('[getAccessToken] Returning in-memory token?:', accessToken);
    return accessToken;
  }

  // Fallback to checking default headers (set by Auth0 provider)
  const authHeader = axiosInstance.defaults.headers.common.Authorization;
  // console.log('[getAccessToken] Checking default headers?:', authHeader);

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    // console.log('[getAccessToken] Returning token from headers?:', token);
    return token;
  }

  // console.log('[getAccessToken] No token found, returning null');
  return null;
}

// ----------------------------------------------------------------------
// Inject token dynamically into request headers
axiosInstance.interceptors.request.use(
  (config) => {
    // console.log('[Axios] Request interceptor triggered');
    // console.log('[Axios] Current URL?:', config.url);

    // Check if Authorization header is already set
    if (!config.headers.Authorization) {
      const token = getAccessToken();
      //console.log('[Axios] Retrieved token?:', token);
      //console.log('[Axios] Token type?:', typeof token);
      //console.log('[Axios] In-memory accessToken?:', accessToken);
      //console.log('[Axios] Default headers?:', axiosInstance.defaults.headers.common);

      if (
        token &&
        typeof token === 'string' &&
        token !== 'undefined' &&
        token !== 'null' &&
        token.length > 0
      ) {
        config.headers.Authorization = `Bearer ${token}`;
        // console.log('[Axios] Set Authorization header with token');
      } else {
        // console.log('[Axios] No valid token found, skipping Authorization header');
        // console.log('[Axios] Token details - value?:', token, 'type?:', typeof token);
      }
    } else {
      // console.log('[Axios] Authorization header already set?:', config.headers.Authorization);
    }

    // console.log('[Axios] Final headers?:', config.headers);
    return config;
  },
  (error) => {
    console.error('[Axios] Request interceptor error?:', error);
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error?.message || 'Something went wrong!';

    // Safely compute full URL using cleanUrl utility
    const baseURL = typeof error.config?.baseURL === 'string' ? error.config.baseURL : '';
    const url = typeof error.config?.url === 'string' ? error.config.url : '';
    const fullUrl = cleanUrl(baseURL, url);

    // Enhanced error logging for debugging
    if (status === 403) {
      console.error('Authorization error (403):', {
        url: fullUrl || 'Unknown URL',
        method: error.config?.method?.toUpperCase() || 'Unknown method',
        message,
        hasAuthHeader: !!error.config?.headers?.Authorization,
        fullError: error?.response?.data,
      });
    } else {
      // Log all other errors with additional context
      console.error('Axios error?:', {
        status: status || 'Unknown status',
        url: fullUrl || 'Unknown URL',
        method: error.config?.method?.toUpperCase() || 'Unknown method',
        message,
        hasAuthHeader: !!error.config?.headers?.Authorization,
        fullError: error?.response?.data,
      });
    }

    return Promise.reject(new Error(message));
  }
);

// ----------------------------------------------------------------------

/**
 * Universal fetcher for use with SWR.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Axios-Lib} - Complete documentation
 */
export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, config);
  return res.data;
};

export const swrOptions = {
  revalidateOnFocus: false,
  keepPreviousData: true,
  errorRetryCount: 3,
};

export { axiosInstance };
export default axiosInstance;
