/**
 * @file owner-content-filter.jsx
 * @description Filter component for content owners to filter reviews by owned content
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Components.Review.OwnerContentFilter
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Model} - Review model documentation
 */

'use client';

import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

import { debugLog } from 'src/lib/debug';

import { Iconify } from 'src/components/iconify';
import { CloseIcon, SearchIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Review.OwnerContentFilter
 * @description Entity type configurations for filtering
 * @constant {Object} ENTITY_TYPES
 */
const ENTITY_TYPES = {
  '': { label: 'All Content', icon: 'solar:gallery-bold-duotone' },
  ARTIST: { label: 'Artists', icon: 'solar:user-bold-duotone' },
  ART_PIECE: { label: 'Art Pieces', icon: 'solar:painting-bold-duotone' },
  IMAGE: { label: 'Images', icon: 'solar:camera-bold-duotone' },
  PATH: { label: 'Paths', icon: 'solar:route-bold-duotone' },
  PATH_MAP: { label: 'Path Maps', icon: 'solar:map-bold-duotone' },
};

/**
 * @memberof CityArtWalks.Components.Review.OwnerContentFilter
 * @description Content item display component
 * @function ContentItem
 * @param {Object} props - Component props
 * @param {Object} props.item - Content item data
 * @param {string} props.type - Entity type
 * @param {boolean} props.selected - Selection state
 * @param {Function} props.onClick - Click handler
 * @returns {JSX.Element} Content item component
 */
function ContentItem({ item, type, selected, onClick }) {
  const getItemData = useCallback(() => {
    switch (type) {
      case 'ARTIST':
        return {
          id: item.artistId,
          name: item.name,
          image: item.profileImage,
          subtitle: `${item._count?.artPieces || 0} art pieces`,
        };
      case 'ART_PIECE':
        return {
          id: item.artPieceId,
          name: item.title,
          image: item.mainImage,
          subtitle: item.Artist?.name || 'Unknown Artist',
        };
      case 'IMAGE':
        return {
          id: item.imageId,
          name: item.title || 'Untitled Image',
          image: item.imageUrl,
          subtitle: item.description ? item.description.substring(0, 50) + '...' : 'No description',
        };
      case 'PATH':
        return {
          id: item.pathId,
          name: item.title,
          image: item.coverImage,
          subtitle: `${item._count?.artPieces || 0} art pieces`,
        };
      case 'PATH_MAP':
        return {
          id: item.pathMapId,
          name: item.title,
          image: item.coverImage,
          subtitle: item.description ? item.description.substring(0, 50) + '...' : 'No description',
        };
      default:
        return {
          id: item.id,
          name: item.name || item.title || 'Unknown',
          image: null,
          subtitle: 'Unknown type',
        };
    }
  }, [item, type]);

  const itemData = getItemData();

  return (
    <Box
      onClick={() => onClick(itemData.id)}
      sx={{
        p: 2,
        cursor: 'pointer',
        borderRadius: 1,
        border: 1,
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? 'primary.lighter' : 'background.paper',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'primary.lighter',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar src={itemData.image} variant="rounded" sx={{ width: 48, height: 48 }}>
          <Iconify icon={ENTITY_TYPES[type]?.icon || 'solar:gallery-bold-duotone'} width={24} />
        </Avatar>
        <Box flex={1} minWidth={0}>
          <Typography variant="subtitle2" noWrap>
            {itemData.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {itemData.subtitle}
          </Typography>
        </Box>
        {selected && <Iconify icon="solar:check-circle-bold" sx={{ color: 'primary.main' }} />}
      </Box>
    </Box>
  );
}

/**
 * @memberof CityArtWalks.Components.Review.OwnerContentFilter
 * @description Main content filter component for owner dashboard
 * @function OwnerContentFilter
 * @param {Object} props - Component props
 * @param {Object} props.content - Owner content data
 * @param {Object} props.summary - Content summary
 * @param {boolean} [props.loading] - Loading state
 * @param {Error} [props.error] - Error state
 * @param {Function} props.onFilterChange - Filter change handler
 * @param {Object} [props.currentFilter] - Current filter state
 * @returns {JSX.Element} Owner content filter component
 */
export function OwnerContentFilter({
  content = {},
  summary = {},
  loading = false,
  error = null,
  onFilterChange,
  currentFilter = {},
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntityType, setSelectedEntityType] = useState(currentFilter.entityType || '');
  const [selectedEntityId, setSelectedEntityId] = useState(currentFilter.entityId || '');

  // Handle entity type change
  const handleEntityTypeChange = useCallback(
    (event) => {
      const newEntityType = event.target.value;
      debugLog(
        'CityArtWalks.Components.Review.OwnerContentFilter.handleEntityTypeChange',
        `Entity type: ${newEntityType}`
      );

      setSelectedEntityType(newEntityType);
      setSelectedEntityId(''); // Reset entity selection

      onFilterChange({
        entityType: newEntityType,
        entityId: '',
      });
    },
    [onFilterChange]
  );

  // Handle specific entity selection
  const handleEntitySelect = useCallback(
    (entityId) => {
      debugLog(
        'CityArtWalks.Components.Review.OwnerContentFilter.handleEntitySelect',
        `Entity ID: ${entityId}`
      );

      const newEntityId = selectedEntityId === entityId ? '' : entityId;
      setSelectedEntityId(newEntityId);

      onFilterChange({
        entityType: selectedEntityType,
        entityId: newEntityId,
      });
    },
    [selectedEntityType, selectedEntityId, onFilterChange]
  );

  // Handle search
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    debugLog(
      'CityArtWalks.Components.Review.OwnerContentFilter.handleClearFilters',
      'Clearing all filters'
    );

    setSelectedEntityType('');
    setSelectedEntityId('');
    setSearchTerm('');

    onFilterChange({
      entityType: '',
      entityId: '',
    });
  }, [onFilterChange]);

  // Get filtered content based on search and type
  const filteredContent = useMemo(() => {
    if (!selectedEntityType || !content[selectedEntityType.toLowerCase() + 's']) {
      return [];
    }

    let items = content[selectedEntityType.toLowerCase() + 's'] || [];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      items = items.filter((item) => {
        const searchableText = [item.name, item.title, item.description, item.Artist?.name]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableText.includes(search);
      });
    }

    return items;
  }, [content, selectedEntityType, searchTerm]);

  // Show loading skeleton
  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" />
        <Stack spacing={2} sx={{ mt: 2 }}>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={60} />
          ))}
        </Stack>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return <Alert severity="error">Failed to load content: {error.message}</Alert>;
  }

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filter by Content
      </Typography>

      <Stack spacing={3}>
        {/* Summary Stats */}
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Your Content Summary
          </Typography>
          <Stack spacing={1}>
            {Object.entries(ENTITY_TYPES)
              .slice(1)
              .map(([type, config]) => {
                const count = content[type.toLowerCase() + 's']?.length || 0;
                return (
                  <Box key={type} display="flex" justifyContent="space-between">
                    <Typography variant="caption">{config.label}:</Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {count}
                    </Typography>
                  </Box>
                );
              })}
          </Stack>
          <Divider sx={{ mt: 2 }} />
        </Box>

        {/* Entity Type Filter */}
        <FormControl fullWidth size="small">
          <InputLabel>Content Type</InputLabel>
          <Select value={selectedEntityType} onChange={handleEntityTypeChange} label="Content Type">
            {Object.entries(ENTITY_TYPES).map(([value, config]) => (
              <MenuItem key={value} value={value}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Iconify icon={config.icon} width={20} />
                  {config.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Search */}
        {selectedEntityType && (
          <TextField
            size="small"
            placeholder={`Search ${ENTITY_TYPES[selectedEntityType]?.label.toLowerCase()}...`}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        )}

        {/* Active Filters */}
        {(selectedEntityType || selectedEntityId) && (
          <Box>
            <Box display="flex" alignItems="center" justifyContent="between" mb={1}>
              <Typography variant="caption" color="text.secondary">
                Active Filters
              </Typography>
              <Button
                size="small"
                color="inherit"
                onClick={handleClearFilters}
                startIcon={<CloseIcon />}
              >
                Clear
              </Button>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {selectedEntityType && (
                <Chip
                  size="small"
                  label={ENTITY_TYPES[selectedEntityType]?.label}
                  onDelete={() => handleEntityTypeChange({ target: { value: '' } })}
                />
              )}
              {selectedEntityId && (
                <Chip
                  size="small"
                  label="Specific item selected"
                  onDelete={() => handleEntitySelect(selectedEntityId)}
                />
              )}
            </Stack>
          </Box>
        )}

        {/* Content List */}
        {selectedEntityType && (
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Select Specific {ENTITY_TYPES[selectedEntityType]?.label}
            </Typography>

            {filteredContent.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                {searchTerm
                  ? 'No matching content found'
                  : `No ${ENTITY_TYPES[selectedEntityType]?.label.toLowerCase()} found`}
              </Typography>
            ) : (
              <Stack spacing={1} sx={{ maxHeight: 400, overflow: 'auto' }}>
                {filteredContent.map((item) => {
                  const itemId =
                    item.artistId ||
                    item.artPieceId ||
                    item.imageId ||
                    item.pathId ||
                    item.pathMapId;
                  return (
                    <ContentItem
                      key={itemId}
                      item={item}
                      type={selectedEntityType}
                      selected={selectedEntityId === itemId}
                      onClick={handleEntitySelect}
                    />
                  );
                })}
              </Stack>
            )}
          </Box>
        )}
      </Stack>
    </Card>
  );
}

export default OwnerContentFilter;
