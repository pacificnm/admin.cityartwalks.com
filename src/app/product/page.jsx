import { CONFIG } from 'src/global-config';

import { ProductHomeView } from 'src/sections/product/product-home-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Dashboard - Products - ${CONFIG.appName}`,
};

export default function Page() {
  return <ProductHomeView />;
}
