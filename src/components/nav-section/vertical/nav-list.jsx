import { useBoolean } from 'minimal-shared/hooks';
import { useRef, useEffect, useCallback } from 'react';
import { isActiveLink, isExternalLink } from 'minimal-shared/utils';

import { usePathname } from 'src/routes/hooks';

import { NavItem } from './nav-item';
import { navSectionClasses } from '../styles';
import { NavUl, NavLi, NavCollapse } from '../components';

// ----------------------------------------------------------------------

export function NavList({ data, depth, render, slotProps, checkPermissions, enabledRootRedirect }) {
  const pathname = usePathname();
  const navItemRef = useRef(null);

  // Ensure data.path is a string, fallback to empty string if undefined/null
  const itemPath = typeof data.path === 'string' ? data.path : '';
  
  // Log warning for missing paths in development
  if (process.env.NODE_ENV === 'development' && !data.path) {
    console.warn(`Navigation item "${data.title}" has undefined path`);
  }
  
  const isActive = isActiveLink(pathname, itemPath, data.deepMatch ?? !!data.children);

  const { value: open, onFalse: onClose, onToggle } = useBoolean(isActive);

  useEffect(() => {
    if (!isActive) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggleMenu = useCallback(() => {
    if (data.children) {
      onToggle();
    }
  }, [data.children, onToggle]);

  const renderNavItem = () => (
    <NavItem
      ref={navItemRef}
      // slots
      path={itemPath}
      icon={data.icon}
      info={data.info}
      title={data.title}
      caption={data.caption}
      // state
      open={open}
      active={isActive}
      disabled={data.disabled}
      // options
      depth={depth}
      render={render}
      hasChild={!!data.children}
      externalLink={isExternalLink(itemPath)}
      enabledRootRedirect={enabledRootRedirect}
      // styles
      slotProps={depth === 1 ? slotProps?.rootItem : slotProps?.subItem}
      // actions
      onClick={handleToggleMenu}
    />
  );

  const renderCollapse = () =>
    !!data.children && (
      <NavCollapse mountOnEnter unmountOnExit depth={depth} in={open} data-group={data.title}>
        <NavSubList
          data={data.children}
          render={render}
          depth={depth}
          slotProps={slotProps}
          checkPermissions={checkPermissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      </NavCollapse>
    );

  // Hidden item by role
  if (data.allowedRoles && checkPermissions && checkPermissions(data.allowedRoles)) {
    return null;
  }

  return (
    <NavLi
      disabled={data.disabled}
      sx={{
        ...(!!data.children && {
          [`& .${navSectionClasses.li}`]: {
            '&:first-of-type': { mt: 'var(--nav-item-gap)' },
          },
        }),
      }}
    >
      {renderNavItem()}
      {renderCollapse()}
    </NavLi>
  );
}

// ----------------------------------------------------------------------

function NavSubList({ data, render, depth = 0, slotProps, checkPermissions, enabledRootRedirect }) {
  return (
    <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
      {data.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={depth + 1}
          slotProps={slotProps}
          checkPermissions={checkPermissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  );
}
