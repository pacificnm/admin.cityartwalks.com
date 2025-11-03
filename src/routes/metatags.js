/**
 * @version 1.0.0
 * @author ['Jaimie Garner']
 * @memberof CityArtWalks.Routes
 */

import { CONFIG } from 'src/global-config';

export const metatags = {
  home: {
    title: `Home - ${CONFIG.appName}`,
    description:
      'The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style',
  },
  art: {
    title: `Art - ${CONFIG.appName}`,
    description: `Browse the art ${CONFIG.appName}`,
    keywords: ['Art', 'Paths'],
  },
};
