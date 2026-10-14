"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/about", label: "About" },
    { href: "/login", label: "Login" },
  ];

  return (
    <nav className="border-b border-slate-200 dark:border-slate-800">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Desktop Links */}
        <div className="hidden md:flex gap-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-slate-200 dark:bg-slate-800 font-medium"
                    : "hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex w-full justify-end">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-slate-200 dark:bg-slate-800 font-medium"
                    : "hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
