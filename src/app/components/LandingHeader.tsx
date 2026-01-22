"use client";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function LandingHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="cursor-pointer group">
            <h2 className="tracking-tight flex items-center gap-2 text-2xl font-bold">
              <Image src="/logo.png" alt="Appointor" width={24} height={24} className="object-contain" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Appointor</span>
            </h2>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/admin/login">
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-md shadow-violet-500/20 transition-all hover:scale-105">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
