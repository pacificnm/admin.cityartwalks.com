//import axios from 'src/lib/axios';
//import { endpoints } from 'src/endpoints';
import { CONFIG } from 'src/global-config';

import { ProductEditView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Product edit | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {

  return <ProductEditView  />;
}

