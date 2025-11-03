import { mergeClasses } from 'minimal-shared/utils';
import ReactLightbox, { useLightboxState } from 'yet-another-react-lightbox';

import Box from '@mui/material/Box';

import { Iconify } from '../iconify';
import { getPlugins } from './utils';
import { lightboxClasses } from './classes';

// ----------------------------------------------------------------------

export function Lightbox({
  slides,
  disableZoom,
  disableVideo,
  disableTotal,
  disableCaptions,
  disableSlideshow,
  disableThumbnails,
  disableFullscreen,
  onGetCurrentIndex,
  className,
  ...other
}) {
  const totalItems = slides ? slides.length : 0;

  return (
    <ReactLightbox
      slides={slides}
      animation={{ swipe: 240 }}
      carousel={{ finite: totalItems < 5 }}
      controller={{ closeOnBackdropClick: true }}
      plugins={getPlugins({
        disableZoom,
        disableVideo,
        disableCaptions,
        disableSlideshow,
        disableThumbnails,
        disableFullscreen,
      })}
      on={{
        view: ({ index }) => {
          if (onGetCurrentIndex) {
            onGetCurrentIndex(index);
          }
        },
      }}
      toolbar={{
        buttons: [
          <DisplayTotal key={0} totalItems={totalItems} disableTotal={disableTotal} />,
          'close',
        ],
      }}
      render={{
        iconClose: () => <Iconify width={24} icon="solar:close-bold" />,
        iconZoomIn: () => <Iconify width={24} icon="solar:magnifer-bold" />,
        iconZoomOut: () => <Iconify width={24} icon="solar:magnifer-bold" />,
        iconSlideshowPlay: () => <Iconify width={24} icon="solar:play-circle-bold" />,
        iconSlideshowPause: () => <Iconify width={24} icon="solar:play-circle-bold" />,
        iconPrev: () => <Iconify width={32} icon="solar:arrow-left-bold" />,
        iconNext: () => <Iconify width={32} icon="solar:arrow-right-bold" />,
        iconExitFullscreen: () => (
          <Iconify width={24} icon="solar:quit-full-screen-square-outline" />
        ),
        iconEnterFullscreen: () => <Iconify width={24} icon="solar:full-screen-square-outline" />,
      }}
      className={mergeClasses([lightboxClasses.root, className])}
      {...other}
    />
  );
}

// ----------------------------------------------------------------------

function DisplayTotal({ totalItems, disableTotal }) {
  const { currentIndex } = useLightboxState();

  if (disableTotal) {
    return null;
  }

  return (
    <Box
      component="span"
      className="yarl__button"
      sx={{
        typography: 'body2',
        alignItems: 'center',
        display: 'inline-flex',
        justifyContent: 'center',
      }}
    >
      <strong> {currentIndex + 1} </strong> / {totalItems}
    </Box>
  );
}
