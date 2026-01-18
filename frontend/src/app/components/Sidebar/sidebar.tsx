'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navigationItems = [
 { label: "Home", href: "/dashboard" },
  { label: "Profile", href: "/profile" },
  { label: "Events", href: "/events" },
  { label: "Feedback", href: "/feedback" },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();


  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

 
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBack = () => {
    router.back();
  };

  return (
    <>
     
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

     
      <aside
        className={`
          lg:hidden fixed top-0 left-0 h-full w-64 bg-[#17002487] backdrop-blur-md text-white z-50
          shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
    
          <div className="flex items-center justify-between p-4 border-b border-[#170024]">
            <h2 className="text-lg font-semibold">Eaten</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

      
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-accent hover:text-black transition-colors text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>
          </div>

         
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="flex flex-col gap-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        block px-4 py-3 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${isActive 
                          ? 'bg-secondary text-white shadow-lg' 
                          : 'text-gray-300 hover:bg-accent hover:text-black'
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

         
        </div>
      </aside>
    </>
  );
}