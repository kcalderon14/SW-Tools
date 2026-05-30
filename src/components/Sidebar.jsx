import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function RedirectsIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 7h10v10" />
      <path d="M7 17L17 7" />
      <path d="M17 17H7V7" />
    </svg>
  );
}

function TestingIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function HtmlHelpersIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M16 18l6-6-6-6" />
      <path d="M8 6l-6 6 6 6" />
    </svg>
  );
}

function LinkBuilderIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ListGeneratorIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <rect x="3" y="4" width="4" height="4" rx="0.5" />
      <rect x="3" y="10" width="4" height="4" rx="0.5" />
      <rect x="3" y="16" width="4" height="4" rx="0.5" />
    </svg>
  );
}

function BuilderIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IndexCardIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <line x1="6" y1="8" x2="18" y2="8" />
      <line x1="6" y1="12" x2="14" y2="12" />
      <line x1="6" y1="16" x2="10" y2="16" />
    </svg>
  );
}

function PokerIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="4" width="10" height="14" rx="1" transform="rotate(-5 7 11)" />
      <rect x="12" y="4" width="10" height="14" rx="1" transform="rotate(5 17 11)" />
      <text x="7" y="13" fontSize="6" fill="currentColor" stroke="none" textAnchor="middle">♠</text>
    </svg>
  );
}

function NavItemLink({ to, icon, label, isCollapsed }) {
  const baseClasses = 'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full';
  const activeClasses = 'border-l-4 border-teal text-teal bg-dark-bg';
  const defaultClasses = 'text-text-secondary hover:bg-bg-primary';

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : defaultClasses} ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`
      }
      title={isCollapsed ? label : undefined}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </NavLink>
  );
}

function NavGroup({ icon, label, isCollapsed, children, defaultOpen, basePath }) {
  const location = useLocation();
  const [open, setOpen] = useState(defaultOpen || false);

  // Auto-open if any child route is active
  const isChildActive = basePath ? location.pathname.startsWith(basePath) : false;
  const isOpen = open || isChildActive;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full ${
          isChildActive ? 'text-teal' : 'text-text-secondary hover:bg-bg-primary'
        } ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
        title={isCollapsed ? label : undefined}
      >
        {icon}
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{label}</span>
            <svg
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </>
        )}
      </button>
      {isOpen && !isCollapsed && (
        <div className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isCollapsed, onToggle, theme, onThemeToggle }) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = typeof isCollapsed === 'boolean' ? isCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
      return;
    }
    setInternalCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={`bg-bg-surface border-r border-border transition-all duration-200 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="flex h-full flex-col p-3">
        <button
          type="button"
          onClick={handleToggle}
          className="mb-4 flex items-center justify-center rounded-md border border-teal px-3 py-2 text-teal hover:bg-teal hover:text-white"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {collapsed ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
          </svg>
        </button>

        <nav className="space-y-2">
          <NavGroup icon={<RedirectsIcon />} label="Redirects" isCollapsed={collapsed} basePath="/redirects">
            <NavItemLink to="/redirects" icon={<RedirectsIcon />} label="Redirects" isCollapsed={collapsed} />
            <NavItemLink to="/redirects/testing" icon={<TestingIcon />} label="Redirect Testing" isCollapsed={collapsed} />
          </NavGroup>
          <NavGroup icon={<HtmlHelpersIcon />} label="HTML Helpers" isCollapsed={collapsed} basePath="/html-helpers">
            <NavItemLink to="/html-helpers/link-builder" icon={<LinkBuilderIcon />} label="Link Builder" isCollapsed={collapsed} />
            <NavItemLink to="/html-helpers/list-generator" icon={<ListGeneratorIcon />} label="List Generator" isCollapsed={collapsed} />
          </NavGroup>
          <NavGroup icon={<BuilderIcon />} label="Builder" isCollapsed={collapsed} basePath="/builder">
            <NavItemLink to="/builder/resource-center-index-card" icon={<IndexCardIcon />} label="RC Index Card" isCollapsed={collapsed} />
          </NavGroup>
          <NavItemLink to="/Point-Poker" icon={<PokerIcon />} label="Point Poker" isCollapsed={collapsed} />

          <div className="mt-4 border-t border-border pt-4">
            <button
              type="button"
              onClick={onThemeToggle}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full ${collapsed ? 'justify-center px-2' : 'justify-start'} text-text-secondary hover:bg-bg-primary`}
              title={collapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
              {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}
