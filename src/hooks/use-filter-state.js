/**
 * @file use-filter-state.js
 * @description Reusable hook for managing filter component state that persists across re-renders
 * @namespace CityArtWalks.Hooks.FilterState
 * @version 1.0.0
 * @author Jaimie Garner
 */

import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Base hook for managing filter state that persists across parent re-renders
 * @memberof CityArtWalks.Hooks.FilterState
 * @param {Object} options - Configuration options
 * @param {string} options.filterKey - Unique key for this filter (e.g., 'artistId', 'materialId')
 * @param {*} options.value - Current filter value from parent
 * @param {Function} options.onChange - Parent onChange handler
 * @param {Function} [options.getDisplayValue] - Function to get display value from stored data
 * @param {Function} [options.validateValue] - Function to validate if value matches stored data
 * @returns {Object} Filter state management object
 */
export function useFilterState({
  filterKey,
  value,
  onChange,
  getDisplayValue = null,
  validateValue = null,
}) {
  // Persistent state that survives parent re-renders
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputValue, setInputValue] = useState('');

  // Track if we've initialized from the value prop
  const initializedRef = useRef(false);

  /**
   * Store selected item data for persistence
   */
  const storeSelectedItem = useCallback(
    (item) => {
      setSelectedItem(item);
      if (item && getDisplayValue) {
        setInputValue(getDisplayValue(item));
      }
    },
    [getDisplayValue]
  );

  /**
   * Clear the stored item
   */
  const clearSelectedItem = useCallback(() => {
    setSelectedItem(null);
    setInputValue('');
  }, []);

  /**
   * Handle filter change with item data storage
   */
  const handleFilterChange = useCallback(
    (newValue, itemData = null) => {
      if (newValue && itemData) {
        storeSelectedItem(itemData);
        onChange(filterKey, newValue, itemData);
      } else {
        clearSelectedItem();
        onChange(filterKey, '', null);
      }
    },
    [filterKey, onChange, storeSelectedItem, clearSelectedItem]
  );

  /**
   * Get current display value - either from stored item or fallback
   */
  const getCurrentDisplayValue = useCallback(() => {
    if (selectedItem && getDisplayValue) {
      return getDisplayValue(selectedItem);
    }
    if (value && selectedItem) {
      return inputValue;
    }
    return '';
  }, [selectedItem, getDisplayValue, value, inputValue]);

  /**
   * Check if current value matches stored item
   */
  const isValueMatched = useCallback(() => {
    if (!value || !selectedItem) return !value;
    if (validateValue) {
      return validateValue(value, selectedItem);
    }
    return selectedItem.id?.toString() === value.toString();
  }, [value, selectedItem, validateValue]);

  // Initialize or sync with parent value changes
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      // Don't auto-initialize on first mount to prevent unnecessary state changes
      return;
    }

    // If value changed and we don't have matching stored data, clear our state
    if (!isValueMatched()) {
      if (!value) {
        clearSelectedItem();
      }
      // Note: We don't auto-fetch data here - that's up to the specific filter implementation
    }
  }, [value, isValueMatched, clearSelectedItem]);

  return {
    // State
    selectedItem,
    inputValue,

    // Actions
    storeSelectedItem,
    clearSelectedItem,
    handleFilterChange,
    setInputValue,

    // Computed values
    displayValue: getCurrentDisplayValue(),
    hasValidSelection: isValueMatched(),

    // Utils
    filterKey,
    value,
  };
}

/**
 * Specialized hook for artist filter state management
 * @memberof CityArtWalks.Hooks.FilterState
 * @param {Object} options - Configuration options
 * @param {string} options.value - Current artistId value
 * @param {Function} options.onChange - Parent onChange handler
 * @returns {Object} Artist filter state management
 */
export function useArtistFilterState({ value, onChange }) {
  return useFilterState({
    filterKey: 'artistId',
    value,
    onChange,
    getDisplayValue: (artist) => artist?.name || '',
    validateValue: (val, artist) => {
      const artistId = artist?.artistId || artist?.id;
      return artistId?.toString() === val?.toString();
    },
  });
}

/**
 * Specialized hook for material filter state management
 * @memberof CityArtWalks.Hooks.FilterState
 * @param {Object} options - Configuration options
 * @param {string} options.value - Current materialId value
 * @param {Function} options.onChange - Parent onChange handler
 * @returns {Object} Material filter state management
 */
export function useMaterialFilterState({ value, onChange }) {
  return useFilterState({
    filterKey: 'materialId',
    value,
    onChange,
    getDisplayValue: (material) => material?.name || '',
    validateValue: (val, material) => {
      const materialId = material?.materialId || material?.id;
      return materialId?.toString() === val?.toString();
    },
  });
}

/**
 * Specialized hook for tag filter state management
 * @memberof CityArtWalks.Hooks.FilterState
 * @param {Object} options - Configuration options
 * @param {string} options.value - Current tagId value
 * @param {Function} options.onChange - Parent onChange handler
 * @returns {Object} Tag filter state management
 */
export function useTagFilterState({ value, onChange }) {
  return useFilterState({
    filterKey: 'tagId',
    value,
    onChange,
    getDisplayValue: (tag) => tag?.name || '',
    validateValue: (val, tag) => {
      const tagId = tag?.tagId || tag?.id;
      return tagId?.toString() === val?.toString();
    },
  });
}
