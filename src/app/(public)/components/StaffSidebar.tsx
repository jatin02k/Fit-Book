"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, List, Home, Sparkles, UserPlus } from "lucide-react";
import { Button } from "./ui/button"; 

export function StaffSidebar() {
  const pathname = usePathname();
  const staffNavItems = [
    {
      href: "/admin/dashboard",
      label: "Appointments Calendar",
      icon: Calendar,
      gradient: "from-orange-500 to-pink-500",
    },
    // This is an implied feature, mapping it to a logical route
    {
      href: "/admin/dashboard/bookings",
      label: "Manual Booking",
      icon: UserPlus,
      gradient: "from-cyan-500 to-blue-500",
    },
    // Lists all appointments, part of (A-3)
    {
      href: "/admin/dashboard/appointments",
      label: "Upcoming Appointments",
      icon: List,
      gradient: "from-green-500 to-emerald-500",
    },
    // Corresponds to /api/admin/services (A-2, B6)
    {
      href: "/admin/dashboard/services",
      label: "Services & Hours",
      icon: Users,
      gradient: "from-purple-500 to-blue-500",
    },
    {
      href: "/",
      label: "Back to Customer Site",
      icon: Home,
      gradient: "from-gray-600 to-gray-800",
    },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 h-screen fixed left-0 top-0 shadow-xl">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Staff Dashboard
          </h2>
          <Sparkles className="h-4 w-4 text-orange-400" />
        </div>
        <p className="text-sm text-gray-400">FitBook Gym Management</p>
      </div>
      
      <nav className="p-4 space-y-2">

        {staffNavItems.map((item) => {
          const Icon = item.icon; // Check if the current URL path matches the item's href
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              passHref
            >
              <Button 
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start transition-all duration-300 group ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg hover:shadow-xl hover:scale-105`
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon
                  className={`mr-3 h-4 w-4 ${
                    isActive ? "" : "group-hover:scale-110 transition-transform"
                  }`}
                />
                <span className="text-sm">{item.label}</span>
              </Button>
            </Link>
          );
        })}

      </nav>
      <div className="absolute bottom-6 left-4 right-4 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-lg p-4">
        <p className="text-xs text-gray-400 text-center">
          Manage your gym with ease ✨
        </p>
      </div>
    </div>
  );
}
