'use client';
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { UserIcon, Cog6ToothIcon, QuestionMarkCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Navp() {
  const { data: session, status } = useSession();
  const profileRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Outside click to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === 'loading') return null; // wait until session loads

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 z-50" style={{ height: "74px" }}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-full">
        {/* Logo */}
        <Link href="/Home">
          <img src="/logo.png" alt="Logo" className="h-8" />
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex space-x-6 font-medium text-gray-800 justify-center items-center flex-1">
          <Link href="/Home" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/About" className="hover:text-blue-600 transition">About</Link>
          <Link href="/Career" className="hover:text-blue-600 transition">Career</Link>
          <Link href="/Blog" className="hover:text-blue-600 transition">Blog</Link>
        </div>

        {/* Right: Auth/Profile */}
        <div className="flex items-center space-x-4 relative">
          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {status === 'unauthenticated' && (
            <div className="hidden md:flex space-x-2">
              <Link href="/auth/login" className="hover:text-blue-600 font-medium transition mt-2">Login</Link>
              <Link
                href="/joinasprofessional"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium shadow-sm transition"
              >
                Join as a Professional
              </Link>
            </div>
          )}

          {true && (
  <div className="relative" ref={profileRef}>
    <button
      onClick={() => setProfileOpen(!profileOpen)}
      className="w-12 h-12 rounded-full  flex items-center justify-center text-black font-bold text-lg hover:bg-blue-600 transition shadow-md"
    >
      <UserIcon className="w-6 h-6" />
    </button>
    {profileOpen && (
      <div className="absolute right-0 mt-2 w-60 bg-white border rounded-lg shadow-lg py-4 z-50 animate-slide-down">
        <div className="px-4 pb-2 border-b text-gray-700 font-semibold">User Profile</div>
        <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
          <UserIcon className="w-5 h-5" /> Profile
        </Link>
      </div>
    )}
  </div>
)}


        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 px-4 pb-4 space-y-2 bg-white shadow-md rounded-md">
          <Link href="/Home" className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">Home</Link>
          <Link href="/About" className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">About</Link>
          <Link href="/Career" className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">Career</Link>
          <Link href="/Blog" className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">Blog</Link>

          {status === 'unauthenticated' && (
            <>
              <Link href="/auth/login" className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">Login</Link>
              <Link href="/joinasprofessional" className="block py-2 px-2 text-white bg-blue-500 hover:bg-blue-600 rounded font-medium text-center transition">Join as a Professional</Link>
            </>
          )}

        </div>
      )}

      <style jsx>{`
        .animate-slide-down {
          animation: slideDown 0.2s ease-out;
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}
