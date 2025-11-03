//import axios from 'src/lib/axios';
//import { endpoints } from 'src/endpoints';
import { CONFIG } from 'src/global-config';

import { ProductDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Product details | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {


  return <ProductDetailsView  />;
}

// ----------------------------------------------------------------------

/**
 * Static Exports in Next.js
 *
 * 1. Set `isStaticExport = true` in `next.config.{mjs|ts}`.
 * 2. This allows `generateStaticParams()` to pre-render dynamic routes at build time.
 *
 * For more details, see:
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 *
 * NOTE: Remove all "generateStaticParams()" functions if not using static exports.

export async function generateStaticParams() {
  const res = await axios.get(endpoints.product.list.path);
  const data = CONFIG.isStaticExport ? res.data.products: res.data.products.slice(0, 1);

  return data.map((product) => ({
    id: product.id,
  }));
}
   */
