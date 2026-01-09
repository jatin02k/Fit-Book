'use client';

import Link from "next/link"; // <-- IMPORT LINK
import { usePathname } from 'next/navigation'; // <-- IMPORT usePathname
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { useState } from "react";

// interface NavigationProps { currentPage: string; onPageChange: (page: string) => void; } 
// <-- NO LONGER NEEDED

export default function Navigation() {
  const pathname = usePathname(); // Get the current path
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Map your links to your folder structure (e.g., create /services/page.js)
  const navItems = [
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/#contact' }, 
    { name: 'FAQ', href: '/faq' },
  ];
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Home Link */}
          <Link href="/" className="cursor-pointer group">
            <h2 className="text-black tracking-tight flex items-center gap-2 text-2xl">
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Fit</span>
              <span>Book</span>
              <Sparkles className="h-4 w-4 text-orange-500 group-hover:animate-pulse" />
            </h2>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} passHref>
                <span 
                  className={`hover:text-black transition-colors relative group cursor-pointer ${
                    pathname === item.href ? 'text-black font-semibold' : 'text-gray-600'
                  }`}
                >
                  {item.name}
                  {(pathname === item.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500"></span>
                  )}
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </span>
              </Link>
            ))}
            
            {/* Book Now Button (Goes to services) */}
             <Link href="/services" passHref>
              <Button
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
              >
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-black focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.href 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
             <div className="pt-4 pb-2">
                <Link href="/services" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                    Book Now
                  </Button>
                </Link>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
}