/**
 * @file details.jsx
 * @description Artist details view component with tabbed interface
 * @namespace CityArtWalks.Sections.Artist
 * @version 2.0.0
 * @author Jaimie Garner
 */

"use client";

import { useState } from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { ArtistForm } from "src/forms/artist";
import { useGetArtist } from "src/actions/artist/hooks";
import { DashboardContent } from "src/layouts/dashboard";

import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

// ----------------------------------------------------------------------

/**
 * @description Artist Detail View component
 * @memberof CityArtWalks.Sections.Artist
 * @function ArtistDetailView
 * @param {Object} props - Component props
 * @param {string} props.id - The artist ID
 * @returns {JSX.Element} The Artist Detail View component.
 */
export function ArtistDetailView({ id }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const { artist, artistLoading, artistError } = useGetArtist(id);

  const handleSuccess = () => {
    // Navigate back to artist list after successful update
    router.push(paths.artist.home);
  };

  const handleCancel = () => {
    // Navigate back without saving
    router.push(paths.artist.home);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { label: "Details", value: 0 },
    { label: "Art Pieces", value: 1 },
    { label: "Images", value: 2 },
    { label: "Reviews", value: 3 },
  ];

  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading="Artist Details"
        links={[
          { name: "Dashboard", href: paths.root },
          { name: "Artists", href: paths.artist.home },
          { name: artist?.name || "Loading..." },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {artistLoading && (
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 5,
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </Card>
      )}

      {artistError && (
        <Card sx={{ p: 5 }}>
          <Box sx={{ textAlign: "center", color: "error.main" }}>
            <p>Error loading artist: {artistError.message}</p>
            <Button
              component={RouterLink}
              href={paths.artist.home}
              variant="contained"
              size="large"
            >
              Back to Artists
            </Button>
          </Box>
        </Card>
      )}

      {artist && !artistLoading && (
        <Card>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              px: { xs: 2, sm: 3 },
            }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} />
            ))}
          </Tabs>

          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {activeTab === 0 && (
              <ArtistForm
                initialData={artist}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            )}

            {activeTab === 1 && (
              <Box sx={{ py: 5, textAlign: "center", color: "text.secondary" }}>
                <p>Art Pieces tab content coming soon...</p>
              </Box>
            )}

            {activeTab === 2 && (
              <Box sx={{ py: 5, textAlign: "center", color: "text.secondary" }}>
                <p>Images tab content coming soon...</p>
              </Box>
            )}

            {activeTab === 3 && (
              <Box sx={{ py: 5, textAlign: "center", color: "text.secondary" }}>
                <p>Reviews tab content coming soon...</p>
              </Box>
            )}
          </Box>
        </Card>
      )}
    </DashboardContent>
  );
}
