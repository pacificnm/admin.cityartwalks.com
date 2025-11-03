/**
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Utils.StorageAvailable
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Storage-Available-Utils} - Complete documentation
 */

/**
 * Checks if localStorage is available and functional in the current environment.
 *
 * @function localStorageAvailable
 * @memberof CityArtWalks.Utils.StorageAvailable
 * @returns {boolean} True if localStorage is available, false otherwise.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Storage-Available-Utils} - Complete documentation
 */
export function localStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const key = '__some_random_key_you_are_not_going_to_use__';
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves a string value from localStorage by key.
 *
 * @function localStorageGetItem
 * @memberof CityArtWalks.Utils.StorageAvailable
 * @param {string} key - The key to retrieve from localStorage.
 * @param {string} [defaultValue=''] - The default value to return if the key does not exist or localStorage is unavailable.
 * @returns {string} The value from localStorage, or the default value.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Storage-Available-Utils} - Complete documentation
 */
export function localStorageGetItem(key, defaultValue = '') {
  if (!localStorageAvailable()) return defaultValue;
  const value = window.localStorage.getItem(key);
  return value !== null ? value : defaultValue;
}

/**
 * Retrieves a JSON-parsed value from localStorage by key.
 *
 * @function localStorageGetJSON
 * @memberof CityArtWalks.Utils.StorageAvailable
 * @param {string} key - The key to retrieve from localStorage.
 * @param {*} [defaultValue=null] - The default value to return if the key does not exist, parsing fails, or localStorage is unavailable.
 * @returns {*} The parsed value from localStorage, or the default value.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Storage-Available-Utils} - Complete documentation
 */
export function localStorageGetJSON(key, defaultValue = null) {
  if (!localStorageAvailable()) return defaultValue;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch {
    return defaultValue;
  }
}
