import { paths } from 'src/routes/paths';

import {
  HomeIcon,
  SettingsIcon,
  ProfileHomeIcon,
} from 'src/components/icons';
// ----------------------------------------------------------------------

export const _account = [
  {
    role: ['public', 'USER', 'MEMBER', 'ADMIN'],
    label: 'Home',
    href: paths.home,
    icon: <HomeIcon />,
  },
  {
    role: ['USER', 'MEMBER', 'ADMIN'],
    label: 'Profile',
    href: paths.profile.home,
    icon: <ProfileHomeIcon />,
  },
  {
    role: ['USER', 'MEMBER', 'ADMIN'],
    label: 'Account settings',
    href: paths.profile.settings,
    icon: <SettingsIcon />,
  },
];
