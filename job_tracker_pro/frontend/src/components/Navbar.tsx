import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Briefcase, Menu, Plus, X } from "lucide-react";

const LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/applications", label: "Applications", end: false },
  { to: "/analytics", label: "Analytics", end: false },
  { to: "/ai-analyze", label: "AI Analyzer", end: false },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "bg-indigo-500/10 text-indigo-400" : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-700 bg-gray-950/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-indigo-500" />
          <span className="text-lg font-semibold text-white">Job Tracker Pro</span>
        </NavLink>

        <div className="hidden md:flex md:items-center md:gap-1">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          <NavLink
            to="/add"
            className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4" />
            Add Application
          </NavLink>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gray-700 bg-gray-950 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/add"
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600"
              onClick={() => setOpen(false)}
            >
              <Plus className="h-4 w-4" />
              Add Application
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
