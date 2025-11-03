/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Sections.Artist.View.ArtistListHelp
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
 * @memberof CityArtWalks.Sections.Artist.View.ArtistListHelp
 * @function ArtistListHelp
 * @description Help content component for the Artist Home functionality.
 * Provides comprehensive guidance on how to browse artists, search functionality,
 * artist profiles, and other features.
 *
 * @component
 * @returns {JSX.Element} The rendered help content
 *
 * @example
 * <HelpDrawer open={isOpen} onClose={handleClose}>
 *   <ArtistListHelp />
 * </HelpDrawer>
 */
export function ArtistListHelp() {
  return (
    <Stack spacing={3}>
      {/* Introduction */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome to Artists
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Discover talented artists in your area and explore their amazing artwork. Browse artist
          profiles, learn about their backgrounds, and find their art pieces throughout the city.
        </Typography>
      </Card>

      {/* Browsing Artists */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:users-group-rounded-bold" sx={{ mr: 1 }} />
          Browsing Artists
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <ViewIcon size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Artist Cards"
              secondary="Each card shows the artist's name, profile image, and basic information"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:cursor-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Click to View Profile"
              secondary="Click on any artist card to view their detailed profile and artwork"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:gallery-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Art Pieces"
              secondary="View all art pieces created by each artist in their profile"
            />
          </ListItem>
        </List>
      </Card>

      {/* Search and Filters */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:magnifer-bold" sx={{ mr: 1 }} />
          Search Artists
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:document-text-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Search by Name"
              secondary="Type an artist's name in the search box to find specific artists"
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
              secondary="Clear the search box to see all artists again"
            />
          </ListItem>
        </List>
      </Card>

      {/* Navigation */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:map-arrow-right-bold" sx={{ mr: 1 }} />
          Navigation
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:arrow-left-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Previous/Next Pages"
              secondary="Use pagination controls at the bottom to browse through all artists"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:list-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Items Per Page"
              secondary="Change how many artists are shown per page (6, 12, 24, or 48)"
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

      {/* Artist Profiles */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:user-circle-bold" sx={{ mr: 1 }} />
          Artist Profiles
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:info-circle-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Artist Information"
              secondary="View detailed information about each artist including their bio and background"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:gallery-wide-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Artist's Artwork"
              secondary="Browse all art pieces created by the artist with images and descriptions"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:map-point-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Art Locations"
              secondary="See where the artist's work is located throughout the city"
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
              <StarIcon size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Follow Favorite Artists"
              secondary="Click on artist profiles to learn more and potentially follow their work"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:map-bold" size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Plan Art Walks"
              secondary="Use artist profiles to discover art pieces and plan walking routes"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ShareIcon size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Share Discoveries"
              secondary="Share interesting artist profiles and their artwork with friends"
            />
          </ListItem>
        </List>
      </Card>

      <Divider />

      {/* Footer */}
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Need more help? Contact our support team for assistance.
        </Typography>
      </Box>
    </Stack>
  );
}
