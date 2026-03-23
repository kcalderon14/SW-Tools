import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function DashboardIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

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

function SettingsIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.24.5.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.27.39-1.51 1z" />
    </svg>
  );
}

function NavItemLink({ to, icon, label, isCollapsed }) {
  const baseClasses = 'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full';
  const activeClasses = 'border-l-4 border-teal text-teal bg-dark-bg';
  const defaultClasses = 'text-gray-300 hover:bg-dark-bg';

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

function NavItemDisabled({ icon, label, isCollapsed }) {
  const baseClasses = 'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full';
  const disabledClasses = 'text-gray-500 cursor-not-allowed';

  return (
    <button
      type="button"
      className={`${baseClasses} ${disabledClasses} ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
      disabled
      title={isCollapsed ? label : undefined}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </button>
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
          isChildActive ? 'text-teal' : 'text-gray-300 hover:bg-dark-bg'
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
        <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isCollapsed, onToggle }) {
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
      className={`bg-dark-surface border-r border-gray-800 transition-all duration-200 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
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
          <NavItemDisabled icon={<DashboardIcon />} label="Dashboard" isCollapsed={collapsed} />
          <NavGroup icon={<RedirectsIcon />} label="Redirects" isCollapsed={collapsed} basePath="/redirects">
            <NavItemLink to="/redirects" icon={<RedirectsIcon />} label="Redirects" isCollapsed={collapsed} />
            <NavItemLink to="/redirects/testing" icon={<TestingIcon />} label="Redirect Testing" isCollapsed={collapsed} />
          </NavGroup>
          <NavGroup icon={<HtmlHelpersIcon />} label="HTML Helpers" isCollapsed={collapsed} basePath="/html-helpers">
            <NavItemLink to="/html-helpers/link-builder" icon={<LinkBuilderIcon />} label="Link Builder" isCollapsed={collapsed} />
            <NavItemLink to="/html-helpers/list-generator" icon={<ListGeneratorIcon />} label="List Generator" isCollapsed={collapsed} />
          </NavGroup>
          <NavItemDisabled icon={<SettingsIcon />} label="Settings" isCollapsed={collapsed} />
        </nav>
      </div>
    </aside>
  );
}
