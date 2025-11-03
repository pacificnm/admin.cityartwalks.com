/**
 * @namespace CityArtWalks.Components.Icons.NotificationIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Notification icon component using Material-UI SvgIcon for alerts and notifications.
 */

import SvgIcon from '@mui/material/SvgIcon';

/**
 * @memberof CityArtWalks.Components.Icons.NotificationIcon
 * @function NotificationIcon
 * @description Renders a notification bell icon using the Material-UI SvgIcon component.
 * Commonly used for notification alerts, message indicators, and user communication.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered NotificationIcon component.
 *
 * @example
 * <NotificationIcon size={16} />
 * <NotificationIcon size={24} sx={{ color: 'warning.main' }} />
 */
export function NotificationIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgIcon width={size} sx={{ width: size, height: size, ...sx }} {...props}>
      {/* https://icon-sets.iconify.design/solar/bell-bing-bold-duotone/ */}
      <path
        fill="currentColor"
        d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.794 25.794 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.393 4.393 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"
        opacity="0.5"
      />
      <path
        fill="currentColor"
        d="M12.75 6a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0zM7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"
      />
    </SvgIcon>
  );
}
