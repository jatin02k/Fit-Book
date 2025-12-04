'use client';

import Link from "next/link"; // <-- IMPORT LINK
import { usePathname } from 'next/navigation'; // <-- IMPORT usePathname
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

// interface NavigationProps { currentPage: string; onPageChange: (page: string) => void; } 
// <-- NO LONGER NEEDED

export function Navigation() {
  const pathname = usePathname(); // Get the current path

  // Map your links to your folder structure (e.g., create /services/page.js)
  const navItems = [
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' }, 
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

            {/* Admin Login Link (A-1) */}
            <Link href="/admin/login" className="text-gray-600 hover:text-black transition-colors text-sm">
                Admin Dashboard
            </Link>
          </div>

          {/* Book Now Button (Goes to services) */}
          <Link href="/services" passHref>
            <Button
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
            >
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}