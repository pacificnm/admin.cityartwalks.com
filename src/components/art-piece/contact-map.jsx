/**
 * @todo Fix this 



import Map from 'react-map-gl';
import { useState } from 'react';
import PropTypes from 'prop-types';

import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

import { MAPBOX_API } from 'src/config-global';

import { MapPopup, MapMarker, MapControl } from 'src/components/map';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  zIndex: 0,
  width: 'inherit',
  height: 'inherit',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

// ----------------------------------------------------------------------

export default function ContactMap({ contacts, latitude, longitude }) {
  const theme = useTheme();
  const lightMode = theme.palette.mode === 'light';
  const [popupInfo, setPopupInfo] = useState(null);

  return (
    <Box sx={{ height: '100vh', width: '300' }}>
      <StyledRoot>
        <Map
          initialViewState={{
            latitude: latitude,
            longitude: longitude,
            zoom: 14,
          }}
          mapStyle={`mapbox://styles/mapbox/${lightMode ? 'light': 'dark'}-v10`}
          mapboxAccessToken={MAPBOX_API}
        >
          <MapControl />

          {contacts.map((country, index) => (
            <MapMarker
              key={`marker-${index}`}
              latitude={country.latlng[0]}
              longitude={country.latlng[1]}
              onClick={(event) => {
                event.originalEvent.stopPropagation();
                setPopupInfo(country);
              }}
            />
          ))}

          {popupInfo && (
            <MapPopup
              longitude={popupInfo.latlng[1]}
              latitude={popupInfo.latlng[0]}
              onClose={() => setPopupInfo(null)}
              sx={{
                '& .mapboxgl-popup-content': { bgcolor: 'common.white' },
                '&.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip': {
                  borderTopColor: '#FFF',
                },
                '&.mapboxgl-popup-anchor-top .mapboxgl-popup-tip': {
                  borderBottomColor: '#FFF',
                },
              }}
            >
              <Typography component="div" variant="caption">
                {popupInfo.artistName}
              </Typography>

              <Typography
                component="div"
                variant="caption"
                sx={{ mt: 1, display: 'flex', alignItems: 'center' }}
              >
                {popupInfo.name}
              </Typography>
            </MapPopup>
          )}
        </Map>
      </StyledRoot>
    </Box>
  );
}

ContactMap.propTypes = {
  contacts: PropTypes.array,
};
 */
