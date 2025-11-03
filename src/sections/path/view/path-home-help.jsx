/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Sections.Path.View.PathHomeHelp
 */

'use client';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Iconify } from 'src/components/iconify';
import { ViewIcon, StarIcon, ShareIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

/**
 * @memberof CityArtWalks.Sections.Path.View.PathHomeHelp
 * @function PathHomeHelp
 * @description Help content component for the Path Home functionality.
 * Provides comprehensive guidance on how to browse walking paths, search functionality,
 * path details, and other features.
 *
 * @component
 * @returns {JSX.Element} The rendered help content
 *
 * @example
 * <HelpDrawer open={isOpen} onClose={handleClose}>
 *   <PathHomeHelp />
 * </HelpDrawer>
 */
export function PathHomeHelp() {
  return (
    <Stack spacing={3}>
      {/* Introduction */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome to Walking Paths
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Discover curated walking paths that guide you through amazing art collections. Browse
          pre-made paths, create your own, and explore art in a structured way throughout the city.
        </Typography>
      </Card>

      {/* Browsing Paths */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:map-arrow-right-bold" sx={{ mr: 1 }} />
          Browsing Walking Paths
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <ViewIcon size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Path Cards"
              secondary="Each card shows the path name, description, art piece count, and estimated duration"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:cursor-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Click to View Details"
              secondary="Click on any path card to view the detailed route with map and art pieces"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:route-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Path Information"
              secondary="View distance, estimated walking time, and difficulty level for each path"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:gallery-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Art Pieces"
              secondary="See all art pieces included in each path with their locations"
            />
          </ListItem>
        </List>
      </Card>

      {/* Search and Filters */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:magnifer-bold" sx={{ mr: 1 }} />
          Search Walking Paths
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:document-text-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Search by Name"
              secondary="Type a path name or description to find specific walking routes"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:refresh-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Real-time Results"
              secondary="Search results update automatically as you type"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:close-circle-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Clear Search"
              secondary="Clear the search box to see all available paths again"
            />
          </ListItem>
        </List>
      </Card>

      {/* Navigation */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:compass-bold" sx={{ mr: 1 }} />
          Navigation
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:arrow-left-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Previous/Next Pages"
              secondary="Use pagination controls at the bottom to browse through all paths"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:list-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Items Per Page"
              secondary="Change how many paths are shown per page using the dropdown"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:home-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Breadcrumb Navigation"
              secondary="Use breadcrumbs at the top to navigate back to home or other sections"
            />
          </ListItem>
        </List>
      </Card>

      {/* Path Types */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:walking-bold" sx={{ mr: 1 }} />
          Types of Paths
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:user-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="User-Created Paths"
              secondary="Paths created by community members sharing their favorite art routes"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <StarIcon size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Curated Paths"
              secondary="Professionally curated paths highlighting themed art collections"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:clock-circle-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Duration Variety"
              secondary="Paths range from quick 15-minute walks to full-day explorations"
            />
          </ListItem>
        </List>
      </Card>

      {/* Creating Your Own Path */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:add-circle-bold" sx={{ mr: 1 }} />
          Creating Your Own Path
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:gallery-add-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Collect Art Pieces"
              secondary="Add art pieces to your cart from the Explore section"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:path-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Generate Path"
              secondary="Use the cart to automatically generate an optimized walking route"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ShareIcon size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Share with Others"
              secondary="Save and share your custom paths with the community"
            />
          </ListItem>
        </List>
      </Card>

      {/* Tips */}
      <Card sx={{ p: 3, bgcolor: 'primary.lighter' }}>
        <Typography variant="h6" gutterBottom color="primary.main">
          <Iconify icon="solar:lightbulb-bold" sx={{ mr: 1 }} />
          Pro Tips
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:map-bold" size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Check Path Details"
              secondary="Always review the path map and distance before starting your walk"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:weather-bold" size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Plan for Weather"
              secondary="Consider weather conditions and dress appropriately for outdoor walks"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:phone-bold" size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Mobile Friendly"
              secondary="All paths work great on mobile devices for navigation while walking"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:bookmark-bold" size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Save Favorites"
              secondary="Bookmark interesting paths to easily find them later"
            />
          </ListItem>
        </List>
      </Card>

      <Divider />

      {/* Footer */}
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Need more help? Contact our support team for assistance with walking paths.
        </Typography>
      </Box>
    </Stack>
  );
}
