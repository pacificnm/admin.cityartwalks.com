/**
 * @namespace CityArtWalks.Components.Icons.InvoiceIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Invoice icon component using SvgColor for billing and financial documents.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.InvoiceIcon
 * @function InvoiceIcon
 * @description Renders an invoice icon using the SvgColor component.
 * Commonly used for billing sections, financial documents, and payment management.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered InvoiceIcon component.
 *
 * @example
 * <InvoiceIcon size={16} />
 * <InvoiceIcon size={24} sx={{ color: 'success.main' }} />
 */
export function InvoiceIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/navbar/ic-invoice.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
