'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Sidebar from "../Sidebar/sidebar";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Profile", href: "/profile" },
  { label: "Events", href: "/events" },
  { label: "Feedback", href: "/feedback" },
];

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <>
     
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      
      <header className="hidden lg:flex sticky top-6 z-30 w-full justify-center lg:hidden">
  <div
    className="
      flex items-center gap-2 px-3 py-2
      bg-white/10 backdrop-blur-xl
      border border-white/20
      rounded-2xl shadow-lg
    "
  >
    {/* Navigation */}
    <nav className="flex items-center gap-1">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              px-4 py-2 text-sm font-medium rounded-xl
              transition-all duration-200
              ${
                isActive
                  ? "bg-white/80 text-black shadow-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>

   
    <div className="w-px h-6 bg-white/20 mx-2" />

   </div>
</header>

      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    </>
  );
}