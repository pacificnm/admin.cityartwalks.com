/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Sections.ArtPiece.View.ArtPieceDetailHelp
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
import { ViewIcon, ShareIcon, FavoriteIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

/**
 * @memberof CityArtWalks.Sections.ArtPiece.View.ArtPieceDetailHelp
 * @function ArtPieceDetailHelp
 * @description Help content component for the Art Piece Detail page functionality.
 * Provides comprehensive guidance on how to view art piece details, interact with features,
 * navigate tabs, and use various tools available on the detail page.
 *
 * @component
 * @returns {JSX.Element} The rendered help content
 *
 * @example
 * <HelpDrawer open={isOpen} onClose={handleClose}>
 *   <ArtPieceDetailHelp />
 * </HelpDrawer>
 */
export function ArtPieceDetailHelp() {
  return (
    <Stack spacing={3}>
      {/* Introduction */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome to Art Piece Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Explore detailed information about art pieces, discover the artists behind them, and
          interact with various features to enhance your art exploration experience.
        </Typography>
      </Card>

      {/* Navigation Tabs */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:widget-2-bold" sx={{ mr: 1 }} />
          Navigation Tabs
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:gallery-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Art Piece Tab"
              secondary="View detailed information about the art piece including description, location, materials, and tags"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:user-circle-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Artist Tab"
              secondary="Learn about the artist's biography, birth/death dates, and other background information"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:gallery-wide-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Art Collection Tab"
              secondary="Browse other art pieces created by the same artist"
            />
          </ListItem>
        </List>
      </Card>

      {/* Art Piece Features */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:palette-bold" sx={{ mr: 1 }} />
          Art Piece Features
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <FavoriteIcon filled size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Add to Favorites"
              secondary="Click the heart icon to save this art piece to your personal favorites"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:map-arrow-right-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Add to Path"
              secondary="Include this art piece in your walking path collection for route planning"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ViewIcon size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Full Screen View"
              secondary="View the art piece in full screen mode for a detailed examination"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:camera-add-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Upload Images"
              secondary="Contribute additional photos of the art piece from different angles or times"
            />
          </ListItem>
        </List>
      </Card>

      {/* Location and Map */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:map-point-bold" sx={{ mr: 1 }} />
          Location Information
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:map-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Interactive Map"
              secondary="View the exact location of the art piece on an interactive map"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:gps-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Coordinates"
              secondary="Access precise latitude and longitude coordinates for navigation"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:routing-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Directions"
              secondary="Get directions to the art piece location using your preferred map application"
            />
          </ListItem>
        </List>
      </Card>

      {/* Artist Information */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:users-group-rounded-bold" sx={{ mr: 1 }} />
          Artist Information
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:book-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Biography"
              secondary="Read about the artist's life, background, and artistic journey"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:calendar-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Life Dates"
              secondary="View birth and death dates (if applicable) for historical context"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:gallery-minimalistic-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Other Works"
              secondary="Explore other art pieces by the same artist in the collection"
            />
          </ListItem>
        </List>
      </Card>

      {/* Interactive Features */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:widget-3-bold" sx={{ mr: 1 }} />
          Interactive Features
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:tag-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Tags & Categories"
              secondary="Browse tags and categories to find related art pieces"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:layers-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Materials"
              secondary="Learn about the materials and techniques used to create the art piece"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:chart-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Statistics"
              secondary="View popularity statistics including view count and favorite count"
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
              <Iconify icon="solar:camera-bold" size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Take Notes"
              secondary="Use the description and details to plan your visit and know what to look for"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:clock-circle-bold" size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Best Viewing Times"
              secondary="Check the location details for optimal viewing times and lighting conditions"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ShareIcon size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Share & Contribute"
              secondary="Share your experiences and contribute photos to help other art enthusiasts"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:bookmark-bold" size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Build Collections"
              secondary="Use favorites and paths to create personal art collections and routes"
            />
          </ListItem>
        </List>
      </Card>

      {/* Artist & Contributor Features */}
      <Card sx={{ p: 3, bgcolor: 'success.lighter' }}>
        <Typography variant="h6" gutterBottom color="success.main">
          <Iconify icon="solar:palette-bold" sx={{ mr: 1 }} />
          For Artists & Contributors
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Logged-in members can contribute to the art community by adding and updating art pieces.
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:pen-new-square-bold" size={20} color="success.main" />
            </ListItemIcon>
            <ListItemText
              primary="Add Your Art"
              secondary="Share your own artworks or document public art you discover in your community"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:magic-stick-3-bold" size={20} color="success.main" />
            </ListItemIcon>
            <ListItemText
              primary="AI Writing Assistant"
              secondary="Get help writing compelling descriptions for your art pieces using AI-powered suggestions"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:map-point-wave-bold" size={20} color="success.main" />
            </ListItemIcon>
            <ListItemText
              primary="Location Mapping"
              secondary="Automatically create location maps to help visitors find your art pieces easily"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:gallery-edit-bold" size={20} color="success.main" />
            </ListItemIcon>
            <ListItemText
              primary="Photo Gallery Management"
              secondary="Upload multiple photos, replace outdated images, and showcase your work from different angles"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:user-hands-bold" size={20} color="success.main" />
            </ListItemIcon>
            <ListItemText
              primary="Artist Profiles"
              secondary="Connect your work to artist profiles and discover collaborations with other creators"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:document-add-bold" size={20} color="success.main" />
            </ListItemIcon>
            <ListItemText
              primary="Detailed Documentation"
              secondary="Record materials, techniques, dimensions, and installation details for art preservation"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:check-circle-bold" size={20} color="success.main" />
            </ListItemIcon>
            <ListItemText
              primary="Community Review"
              secondary="Submit your contributions for community feedback to ensure quality and accuracy"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:history-2-bold" size={20} color="success.main" />
            </ListItemIcon>
            <ListItemText
              primary="Update History"
              secondary="Keep track of changes and improvements made to art piece information over time"
            />
          </ListItem>
        </List>
      </Card>

      <Divider />

      {/* Footer */}
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Need more help? Contact our support team for assistance with art piece details.
        </Typography>
      </Box>
    </Stack>
  );
}
