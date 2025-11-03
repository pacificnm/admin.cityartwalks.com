/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Sections.ArtPiece.View.ArtPieceListHelp
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
import { StarIcon, ShareIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

/**
 * @memberof CityArtWalks.Sections.ArtPiece.View.ArtPieceListHelp
 * @function ArtPieceListHelp
 * @description Help content component for the Art Piece List functionality.
 * Provides comprehensive guidance on how to browse art pieces, search functionality,
 * art piece details, locations, and other features.
 *
 * @component
 * @returns {JSX.Element} The rendered help content
 *
 * @example
 * <HelpDrawer open={isOpen} onClose={handleClose}>
 *   <ArtPieceListHelp />
 * </HelpDrawer>
 */
export function ArtPieceListHelp() {
  return (
    <Stack spacing={3}>
      {/* Introduction */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome to Art Pieces
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Discover amazing public art pieces in your city and explore detailed information about
          each artwork. Browse sculptures, murals, installations, and other art forms located
          throughout your area.
        </Typography>
      </Card>

      {/* Browsing Art Pieces */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:gallery-wide-bold" sx={{ mr: 1 }} />
          Browsing Art Pieces
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:gallery-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Art Piece Cards"
              secondary="Each card shows the artwork's image, title, artist, and location information"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:cursor-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Click to View Details"
              secondary="Click on any art piece card to view detailed information, images, and location"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:user-circle-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Artist Information"
              secondary="View information about the artist who created each piece"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:map-point-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Location Details"
              secondary="See exactly where each art piece is located in your city"
            />
          </ListItem>
        </List>
      </Card>

      {/* Search and Filters */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:magnifer-bold" sx={{ mr: 1 }} />
          Search Art Pieces
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:document-text-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Search by Title"
              secondary="Type an art piece title in the search box to find specific artworks"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:user-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Search by Artist"
              secondary="Search for art pieces by entering the artist's name"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:map-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Search by Location"
              secondary="Find art pieces in specific areas or neighborhoods"
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
        </List>
      </Card>

      {/* Art Piece Types */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:palette-bold" sx={{ mr: 1 }} />
          Types of Art Pieces
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:figma-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Sculptures"
              secondary="Three-dimensional artworks including statues, monuments, and installations"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:palette-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Murals & Wall Art"
              secondary="Large-scale paintings and artwork on buildings and walls"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:hand-stars-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Interactive Installations"
              secondary="Art pieces you can interact with or experience in unique ways"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:buildings-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Architectural Art"
              secondary="Artistic elements integrated into buildings and structures"
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
              secondary="Use pagination controls at the bottom to browse through all art pieces"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:list-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Items Per Page"
              secondary="Change how many art pieces are shown per page (6, 12, 24, or 48)"
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
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:widget-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Grid Layout"
              secondary="Art pieces are displayed in a responsive grid that adapts to your screen size"
            />
          </ListItem>
        </List>
      </Card>

      {/* Art Piece Details */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Iconify icon="solar:info-circle-bold" sx={{ mr: 1 }} />
          Art Piece Information
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:gallery-wide-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="High-Quality Images"
              secondary="View multiple high-resolution photos of each art piece from different angles"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:document-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Detailed Descriptions"
              secondary="Read about the artwork's history, meaning, materials, and creation process"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:calendar-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Creation Date"
              secondary="Learn when the art piece was created and installed"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:atom-bold" size={20} />
            </ListItemIcon>
            <ListItemText
              primary="Materials & Techniques"
              secondary="Discover what materials were used and the techniques employed"
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
              <Iconify icon="solar:route-bold" size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Plan Art Walking Routes"
              secondary="Use the location information to plan walking routes between multiple art pieces"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="solar:camera-bold" size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Take Photos"
              secondary="Capture your own photos when visiting art pieces and compare with the gallery images"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ShareIcon size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Share Discoveries"
              secondary="Share interesting art pieces with friends and family to spread art appreciation"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <StarIcon size={20} color="primary.main" />
            </ListItemIcon>
            <ListItemText
              primary="Rate & Review"
              secondary="Leave reviews and ratings to help other art enthusiasts discover great pieces"
            />
          </ListItem>
        </List>
      </Card>

      <Divider />

      {/* Footer */}
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Need more help? Contact our support team for assistance with finding art pieces.
        </Typography>
      </Box>
    </Stack>
  );
}
