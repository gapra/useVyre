/**
 * @usevyre/react — Sidebar & App Layout
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────┐
 * │ Layout hierarchy:                                            │
 * │                                                              │
 * │ AppLayout              — root, manages collapsed state       │
 * │ ├── Sidebar            — left column                        │
 * │ │   ├── SidebarHeader  — logo + app name                    │
 * │ │   ├── SidebarContent — scrollable nav area                │
 * │ │   │   └── SidebarSection → SidebarItem                   │
 * │ │   └── SidebarFooter  — pinned bottom area                 │
 * │ └── AppShell           — right column (flex: 1)             │
 * │     ├── AppBar         — optional top bar                   │
 * │     │   └── SidebarTrigger — collapse toggle button         │
 * │     └── PageContent    — scrollable page content            │
 * │                                                              │
 * │ Import: import { AppLayout, AppShell, AppBar,               │
 * │           PageContent, SidebarTrigger,                      │
 * │           Sidebar, SidebarHeader, SidebarContent,           │
 * │           SidebarSection, SidebarItem, SidebarFooter }      │
 * │         from "@usevyre/react"                                  │
 * │                                                              │
 * │ AppLayout props:                                             │
 * │   defaultCollapsed = boolean (uncontrolled default)         │
 * │   collapsed  = boolean (controlled)                         │
 * │   onCollapsedChange = (v: boolean) => void                  │
 * │   className = string                                        │
 * │                                                              │
 * │ Sidebar props:                                               │
 * │   variant = "default" | "floating"                          │
 * │   className = string                                        │
 * │                                                              │
 * │ SidebarItem props:                                           │
 * │   active  = boolean                                         │
 * │   icon    = ReactNode                                       │
 * │   badge   = string | number                                 │
 * │   href    = string                                          │
 * │   onClick = () => void                                      │
 * └──────────────────────────────────────────────────────────────┘
 *
 * @example
 * <AppLayout>
 *   <Sidebar>
 *     <SidebarHeader title="Workspace" logo={<AppLogo />} />
 *     <SidebarContent>
 *       <SidebarSection label="Main">
 *         <SidebarItem icon={<HomeIcon />} active href="/">Dashboard</SidebarItem>
 *         <SidebarItem icon={<UsersIcon />} href="/users">Users</SidebarItem>
 *       </SidebarSection>
 *     </SidebarContent>
 *     <SidebarFooter>
 *       <SidebarItem icon={<SettingsIcon />} href="/settings">Settings</SidebarItem>
 *     </SidebarFooter>
 *   </Sidebar>
 *   <AppShell>
 *     <AppBar>
 *       <SidebarTrigger />
 *       <Breadcrumb>...</Breadcrumb>
 *     </AppBar>
 *     <PageContent>
 *       <h1>Dashboard</h1>
 *     </PageContent>
 *   </AppShell>
 * </AppLayout>
 */

import React, { createContext, useCallback, useContext, useState } from "react";
import { cn } from "../../utils/cn";

// ── Context ───────────────────────────────────────────────────

interface AppLayoutCtx {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const AppLayoutContext = createContext<AppLayoutCtx>({
  collapsed: false,
  toggleCollapsed: () => {},
});

export const useAppLayout = () => useContext(AppLayoutContext);

// ── AppLayout ─────────────────────────────────────────────────

export interface AppLayoutProps {
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (v: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

export const AppLayout = React.forwardRef<HTMLDivElement, AppLayoutProps>(
  ({ defaultCollapsed = false, collapsed: controlledCollapsed, onCollapsedChange, className, children }, ref) => {
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
    const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

    const toggleCollapsed = useCallback(() => {
      const next = !collapsed;
      setInternalCollapsed(next);
      onCollapsedChange?.(next);
    }, [collapsed, onCollapsedChange]);

    return (
      <AppLayoutContext.Provider value={{ collapsed, toggleCollapsed }}>
        <div ref={ref} className={cn("vyre-app-layout", className)}>
          {children}
        </div>
      </AppLayoutContext.Provider>
    );
  }
);
AppLayout.displayName = "VyreAppLayout";

// ── Sidebar ───────────────────────────────────────────────────

export interface SidebarProps {
  variant?: "default" | "floating";
  className?: string;
  children?: React.ReactNode;
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ variant = "default", className, children }, ref) => {
    const { collapsed } = useAppLayout();
    return (
      <aside
        ref={ref}
        className={cn(
          "vyre-sidebar",
          collapsed && "vyre-sidebar--collapsed",
          variant === "floating" && "vyre-sidebar--floating",
          className,
        )}
        data-collapsed={collapsed || undefined}
      >
        {children}
      </aside>
    );
  }
);
Sidebar.displayName = "VyreSidebar";

// ── SidebarHeader ─────────────────────────────────────────────

export interface SidebarHeaderProps {
  logo?: React.ReactNode;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ logo, title, className, children }, ref) => (
    <div ref={ref} className={cn("vyre-sidebar__header", className)}>
      {logo && <span className="vyre-sidebar__logo">{logo}</span>}
      {title && <span className="vyre-sidebar__title">{title}</span>}
      {children}
    </div>
  )
);
SidebarHeader.displayName = "VyreSidebarHeader";

// ── SidebarContent ────────────────────────────────────────────

export interface SidebarContentProps {
  className?: string;
  children?: React.ReactNode;
}

export const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn("vyre-sidebar__content", className)}>
      {children}
    </div>
  )
);
SidebarContent.displayName = "VyreSidebarContent";

// ── SidebarSection ────────────────────────────────────────────

export interface SidebarSectionProps {
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SidebarSection = React.forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ label, className, children }, ref) => (
    <div ref={ref} className={cn("vyre-sidebar__section", className)}>
      {label && <div className="vyre-sidebar__section-label">{label}</div>}
      {children}
    </div>
  )
);
SidebarSection.displayName = "VyreSidebarSection";

// ── SidebarItem ───────────────────────────────────────────────

export interface SidebarItemProps {
  active?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  href?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  active, icon, badge, href, onClick, className, children,
}) => {
  const { collapsed } = useAppLayout();
  const itemClass = cn("vyre-sidebar__item", active && "vyre-sidebar__item--active", className);
  const content = (
    <>
      {icon && <span className="vyre-sidebar__item-icon">{icon}</span>}
      <span className="vyre-sidebar__item-label">{children}</span>
      {badge !== undefined && <span className="vyre-sidebar__item-badge">{badge}</span>}
    </>
  );

  if (href) {
    return (
      <a href={href} className={itemClass} aria-current={active ? "page" : undefined}
        title={collapsed ? String(children) : undefined}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={itemClass} onClick={onClick} aria-pressed={active}
      title={collapsed ? String(children) : undefined}>
      {content}
    </button>
  );
};
SidebarItem.displayName = "VyreSidebarItem";

// ── SidebarFooter ─────────────────────────────────────────────

export interface SidebarFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn("vyre-sidebar__footer", className)}>
      {children}
    </div>
  )
);
SidebarFooter.displayName = "VyreSidebarFooter";

// ── AppShell ──────────────────────────────────────────────────

export interface AppShellProps {
  className?: string;
  children?: React.ReactNode;
}

export const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn("vyre-app-shell", className)}>
      {children}
    </div>
  )
);
AppShell.displayName = "VyreAppShell";

// ── AppBar ────────────────────────────────────────────────────

export interface AppBarProps {
  className?: string;
  children?: React.ReactNode;
}

export const AppBar = React.forwardRef<HTMLElement, AppBarProps>(
  ({ className, children }, ref) => (
    <header ref={ref} className={cn("vyre-app-bar", className)}>
      {children}
    </header>
  )
);
AppBar.displayName = "VyreAppBar";

// ── SidebarTrigger ────────────────────────────────────────────

export interface SidebarTriggerProps {
  className?: string;
}

export const SidebarTrigger: React.FC<SidebarTriggerProps> = ({ className }) => {
  const { collapsed, toggleCollapsed } = useAppLayout();
  return (
    <button
      type="button"
      className={cn("vyre-sidebar-trigger", className)}
      onClick={toggleCollapsed}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!collapsed}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="12" height="1.5" rx="0.75" fill="currentColor"/>
        <rect x="2" y="7.25" width="8" height="1.5" rx="0.75" fill="currentColor"/>
        <rect x="2" y="10.5" width="12" height="1.5" rx="0.75" fill="currentColor"/>
      </svg>
    </button>
  );
};
SidebarTrigger.displayName = "VyreSidebarTrigger";

// ── PageContent ───────────────────────────────────────────────

export interface PageContentProps {
  className?: string;
  children?: React.ReactNode;
}

export const PageContent = React.forwardRef<HTMLDivElement, PageContentProps>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn("vyre-page-content", className)}>
      {children}
    </div>
  )
);
PageContent.displayName = "VyrePageContent";
