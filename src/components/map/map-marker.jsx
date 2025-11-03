'use client';

import React from 'react';
import Image from 'next/image';
import { Popup, Marker } from 'react-map-gl/mapbox';

import { isFallbackImage, getValidImageUrl } from 'src/utils/image-url-validator';

const SIZE = 48; // Marker size

export function MapMarker({
  latitude,
  longitude,
  imageUrl,
  title,
  hoveredArtPiece,
  onHover,
  onLeave,
  onClick,
}) {
  const isHovered =
    hoveredArtPiece?.latitude === latitude && hoveredArtPiece?.longitude === longitude;

  const validImageUrl = getValidImageUrl(imageUrl);

  return (
    <>
      {/* Marker Component */}
      <Marker
        latitude={latitude}
        longitude={longitude}
        onClick={(event) => {
          event.originalEvent.stopPropagation(); // Prevent interference with map click
          onClick && onClick(); // Trigger the click handler
        }}
      >
        <div
          style={{
            width: `${SIZE}px`,
            height: `${SIZE}px`,
            position: 'absolute',
            cursor: 'pointer',
            transform: `translate(-50%, -100%)`,
          }}
          onMouseEnter={() => onHover && onHover({ latitude, longitude, imageUrl, title })}
          onMouseLeave={() => onLeave && onLeave()}
        >
          {/* SVG Marker */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#52B03F"
            style={{ width: '100%', height: '100%' }}
          >
            <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.75A2.75 2.75 0 1 1 12 6a2.75 2.75 0 0 1 0 5.5z" />
          </svg>
        </div>
      </Marker>

      {/* Popup for hovered marker */}
      {isHovered && validImageUrl && !isFallbackImage(validImageUrl) && (
        <Popup
          latitude={latitude}
          longitude={longitude}
          closeButton={false}
          closeOnClick={false}
          offsetTop={-SIZE}
          anchor="top"
        >
          <Image
            src={validImageUrl}
            alt={title || 'Art piece'}
            height={200}
            width={300}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
            }}
          />
        </Popup>
      )}
    </>
  );
}
