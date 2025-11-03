import { varAlpha } from 'minimal-shared/utils';

import { createTheme } from '@mui/material/styles';

import { grey, common } from './palette';

// ----------------------------------------------------------------------

function updateShadowColor(shadow, colorChannel) {
  return shadow.replace(/rgba\(\d+,\d+,\d+,(.*?)\)/g, (_, alpha) => {
    // Convert decimal alpha to percentage string if needed
    let alphaValue = alpha.trim();
    if (/^\d*\.?\d+$/.test(alphaValue)) {
      // Convert decimal to percentage
      alphaValue = `${Math.round(parseFloat(alphaValue) * 100)}%`;
    }
    return varAlpha(colorChannel, alphaValue);
  });
}

function createShadows(colorChannel) {
  // Get default MUI shadows
  const { shadows: defaultShadows } = createTheme();

  return defaultShadows.map((shadow) => updateShadowColor(shadow, colorChannel));
}

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
export const shadows = {
  light: createShadows(grey['500Channel']),
  dark: createShadows(common.blackChannel),
};
