import { CONFIG } from 'src/global-config';

import { ProductCreateView } from 'src/sections/product/product-create-view';
// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - Products - Create ${CONFIG.appName}` };

export default function Page() {
  return <ProductCreateView />;
}
