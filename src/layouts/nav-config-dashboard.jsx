/**
 * Dashboard Navigation Configuration - Administrative Interface Navigation Structure
 *
 * This configuration module defines the comprehensive navigation structure for the City Art Walks
 * dashboard and administrative interface. It provides role-based navigation with hierarchical
 * organization of content management, user a      {
        title: 'Application Docs',
        path: '/docs/index.html',
        target: '_blank',
        icon: ICONS.file,
        info: ICONS.external,
      },tration, moderation tools, and development
 * resources. The navigation supports role-based access control, nested menu structures, and
 * external link integration for comprehensive administrative functionality.
 *
 * @fileoverview Dashboard navigation configuration with role-based access and administrative features
 * @version 1.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Layouts.NavConfig
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Dashboard-Navigation|Dashboard Navigation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Admin-Interface|Admin Interface}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Role-Based-Access|Role-Based Access Control}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Content-Management|Content Management}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Navigation-Icons|Navigation Icons}
 */

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

/**
 * Icon generator function for dashboard navigation
 *
 * Creates SVG icon components from the navbar icon assets directory for consistent
 * visual representation across the dashboard navigation interface.
 *
 * @memberof CityArtWalks.Layouts.NavConfig.Dashboard
 * @function icon
 * @param {string} name - The icon filename without extension
 * @returns {React.ReactNode} SVG icon component
 * @private
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Navigation-Icons|Navigation Icons}
 */
const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

/**
 * Dashboard navigation icons collection
 *
 * Comprehensive collection of SVG icons used throughout the dashboard navigation
 * interface. Each icon corresponds to specific administrative functions and content
 * areas, providing consistent visual identification for navigation items.
 *
 * @memberof CityArtWalks.Layouts.NavConfig.Dashboard
 * @type {Object<string, React.ReactNode>}
 * @property {React.ReactNode} job - Job management icon
 * @property {React.ReactNode} blog - Blog and content management icon
 * @property {React.ReactNode} chat - Communication and messaging icon
 * @property {React.ReactNode} mail - Email system management icon
 * @property {React.ReactNode} user - User administration icon
 * @property {React.ReactNode} file - File and document management icon
 * @property {React.ReactNode} lock - Security and permissions icon
 * @property {React.ReactNode} tour - Tour and path management icon
 * @property {React.ReactNode} order - Order and transaction management icon
 * @property {React.ReactNode} label - Labeling and categorization icon
 * @property {React.ReactNode} blank - Placeholder and template icon
 * @property {React.ReactNode} kanban - Project management icon
 * @property {React.ReactNode} folder - File organization icon
 * @property {React.ReactNode} course - Educational content icon
 * @property {React.ReactNode} params - Configuration and settings icon
 * @property {React.ReactNode} banking - Financial management icon
 * @property {React.ReactNode} booking - Reservation management icon
 * @property {React.ReactNode} invoice - Billing and invoicing icon
 * @property {React.ReactNode} product - Product management icon
 * @property {React.ReactNode} calendar - Scheduling and events icon
 * @property {React.ReactNode} disabled - Disabled state indicator icon
 * @property {React.ReactNode} external - External link indicator icon
 * @property {React.ReactNode} subpaths - Nested navigation icon
 * @property {React.ReactNode} menuItem - Menu configuration icon
 * @property {React.ReactNode} ecommerce - E-commerce management icon
 * @property {React.ReactNode} analytics - Analytics and reporting icon
 * @property {React.ReactNode} dashboard - Main dashboard icon
 * @static
 * @private
 */
const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  params: icon('ic-params'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  subpaths: icon('ic-subpaths'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
};

// ----------------------------------------------------------------------

/**
 * Dashboard navigation data structure
 *
 * Comprehensive navigation configuration for the administrative dashboard interface.
 * Organized into logical sections with role-based access control, nested menu structures,
 * and external resource integration. Each navigation item includes appropriate icons,
 * paths, and access permissions for secure administrative functionality.
 *
 * @memberof CityArtWalks.Layouts.NavConfig.Dashboard
 * @type {Array<Object>}
 * @property {string} subheader - Section title for navigation grouping
 * @property {Array<Object>} items - Navigation items within the section
 * @property {string} items.title - Display name for the navigation item
 * @property {string} items.path - URL path for the navigation destination
 * @property {React.ReactNode} items.icon - Icon component for visual representation
 * @property {React.ReactNode} [items.info] - Additional information or indicators
 * @property {Array<string>} [items.allowedRoles] - Roles permitted to access the item
 * @property {string} [items.caption] - Additional description text
 * @property {Array<Object>} [items.children] - Nested navigation items
 * @property {boolean} [items.disabled] - Whether the item is disabled
 * @property {boolean} [items.deepMatch] - Whether to match nested paths
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Dashboard-Navigation|Dashboard Navigation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Role-Based-Access|Role-Based Access Control}
 * @example
 * // Navigation sections:
 * // 1. Overview - Main dashboard and analytics
 * // 2. Applications - Content management (Artists, Art Pieces, Locations, etc.)
 * // 3. Management - Business operations (Products, Blog, File management)
 * // 4. Development - Development tools and external resources
 *
 * @example
 * // Role-based access examples:
 * // - ADMIN: Full access to all sections including email and moderation
 * // - MODERATOR: Access to content moderation and review features
 * // - USER: Limited access based on permissions
 *
 * @example
 * // Navigation item structure:
 * {
 *   title: 'Section Name',
 *   path: '/dashboard/section',
 *   icon: ICONS.sectionIcon,
 *   allowedRoles: ['ADMIN', 'MODERATOR'],
 *   children: [
 *     { title: 'Sub Item', path: '/dashboard/section/sub' }
 *   ]
 * }
 */
/**
 * Input nav data is an array of navigation section items used to define the structure and content of a navigation bar.
 * Each section contains a subheader and an array of items, which can include nested children items.
 *
 * Each item can have the following properties:
 * - `title`: The title of the navigation item.
 * - `path`: The URL path the item links to.
 * - `icon`: An optional icon component to display alongside the title.
 * - `info`: Optional additional information to display, such as a label.
 * - `allowedRoles`: An optional array of roles that are allowed to see the item.
 * - `caption`: An optional caption to display below the title.
 * - `children`: An optional array of nested navigation items.
 * - `disabled`: An optional boolean to disable the item.
 * - `deepMatch`: An optional boolean to indicate if the item should match subpaths.
 */
export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [{ title: 'App', path: paths.home, icon: ICONS.dashboard }],
  },
  {
    subheader: 'Applications',
    items: [
      {
        title: 'Artists',
        path: paths.artist.home,
        icon: ICONS.user,
        children: [
          { title: 'List', path: paths.artist.home },
          { title: 'Create', path: paths.artist.create },
        ],
      },
      {
        title: 'Art Pieces',
        path: paths.artPiece.home,
        icon: ICONS.file,
        children: [
          { title: 'List', path: paths.artPiece.home },
          { title: 'Create', path: paths.artPiece.create },
          { title: 'Art Piece Materials', path: paths.artPieceMaterial.home },
          { title: 'Art Piece Types', path: paths.artPieceType.home },
          { title: 'Art Piece Tags', path: paths.artPieceTags.home },
        ],
      },
      {
        title: 'Locations',
        path: paths.location.home,
        icon: ICONS.file,
        children: [
          { title: 'Countries', path: paths.location.country },
          { title: 'States', path: paths.location.state },
          { title: 'Cities', path: paths.location.city },
        ],
      },
      {
        title: 'Paths',
        path: paths.paths.home,
        icon: ICONS.file,
        children: [
          { title: 'List', path: paths.paths.home },
          { title: 'Create', path: paths.paths.create },
        ],
      },
      {
        title: 'User',
        path: paths.user.root,
        icon: ICONS.user,
        children: [{ title: 'List', path: paths.user.list }],
      },
      {
        title: 'Images',
        path: paths.image.home,
        icon: <Iconify icon="solar:gallery-bold" />,
        children: [
          { title: 'All Images', path: paths.image.home },
          {
            title: 'Moderation',
            path: paths.image.moderation,
            allowedRoles: ['ADMIN'],
            info: <Iconify icon="solar:shield-warning-bold" sx={{ color: 'warning.main' }} />,
          },
        ],
      },
      {
        title: 'Review Moderation',
        path: paths.moderation.root,
        icon: <Iconify icon="solar:shield-check-bold" />,
        allowedRoles: ['ADMIN', 'MODERATOR'],
        children: [
          { title: 'Dashboard', path: paths.moderation.root },
          { title: 'Queue', path: paths.moderation.queue },
        ],
      },
      {
        title: 'Email System',
        path: paths.email,
        icon: <Iconify icon="solar:letter-bold" />,
        allowedRoles: ['ADMIN'],
        children: [
          { title: 'Dashboard', path: paths.email },
          { title: 'User Communications', path: paths.email.users },
          { title: 'Email Management', path: paths.email.management },
          { title: 'Templates', path: paths.email.emailTemplates },
          { title: 'Create Template', path: paths.email.createTemplate },
        ],
      },
      {
        title: 'Art Harvesting',
        path: paths.harvesting.home,
        icon: <Iconify icon="solar:database-bold" />,
        allowedRoles: ['ADMIN'],
        children: [
          { title: 'Dashboard', path: paths.harvesting.home },
          { title: 'Queue', path: paths.harvesting.queue },
          { title: 'Batches', path: paths.harvesting.batches },
          { title: 'Logs', path: paths.harvesting.logs },
        ],
      },
      {
        title: 'IndexNow SEO',
        path: paths.indexNow.root,
        icon: <Iconify icon="solar:share-bold" />,
        allowedRoles: ['ADMIN'],
        children: [
          { title: 'Submissions', path: paths.indexNow.list },
          { title: 'Statistics', path: paths.indexNow.stats },
          { title: 'Process Queue', path: paths.indexNow.process },
        ],
      },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Product',
        path: paths.product.root,
        icon: ICONS.product,
        children: [
          { title: 'List', path: paths.product.root },
          { title: 'Create', path: paths.product.create },
        ],
      },
      {
        title: 'Blog',
        path: paths.post.root,
        icon: ICONS.blog,
        children: [
          { title: 'List', path: paths.post.root },
          { title: 'Create', path: paths.post.create },
        ],
      },

      { title: 'File manager', path: paths.fileManager, icon: ICONS.folder },
    ],
  },
  /**
   * Development stuff goes here
   */
  {
    subheader: 'Development',
    items: [
      // Application documentation
      {
        title: 'Application Docs',
        path: '/docs/index.html',
        icon: ICONS.file,
        info: <Iconify width={18} icon="solar:link-bold" />,
      },
      // Links to dev tools
      {
        title: 'Vercel Dashboard',
        path: 'https://vercel.com/pdxartwalks-projects/cityartwalks-com',
        icon: ICONS.external,
        info: <Iconify width={18} icon="solar:link-bold" />,
      },
      {
        title: 'Neon Database',
        path: 'https://console.neon.tech/app/projects/withered-hat-58322541?branchId=br-dark-tooth-a6i0yn4y',
        icon: ICONS.external,
        info: <Iconify width={18} icon="solar:link-bold" />,
      },
      {
        title: 'GitHub Repository',
        path: 'https://github.com/pacificnm/cityartwalks.com',
        icon: ICONS.external,
        info: <Iconify width={18} icon="solar:link-bold" />,
      },
      {
        title: 'Auth0 Dashboard',
        path: 'https://manage.auth0.com/dashboard/us/pdxartwalks/',
        icon: ICONS.external,
        info: <Iconify width={18} icon="solar:link-bold" />,
      },
    ],
  },
];
