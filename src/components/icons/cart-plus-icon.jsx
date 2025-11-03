/**
 * @namespace CityArtWalks.Components.Icons.CartPlusIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Cart plus icon component for adding items to cart/path functionality.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.CartPlusIcon
 * @function CartPlusIcon
 * @description Renders a cart plus icon using the solar:cart-plus-bold icon.
 * Commonly used for adding items to cart, path, or collection functionality.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered CartPlusIcon component.
 *
 * @example
 * <CartPlusIcon size={16} />
 * <CartPlusIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function CartPlusIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:cart-plus-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
