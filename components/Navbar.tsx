'use client';
import { useRef, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        btnRef.current &&
        menuRef.current &&
        !btnRef.current.contains(e.target as Node) &&
        !menuRef.current.contains(e.target as Node)
      ) {
        menuRef.current.classList.add("hidden");
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const toggleMenu = () => {
    if (menuRef.current) {
      menuRef.current.classList.toggle("hidden");
    }
  };

  return (
    <nav className="w-full border-b relative text-white"  style={{ backgroundColor: "#", height: "74px"  }}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Left: Logo + Explore */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/Home">
              <img
              src="/logo.png"
              alt="Logo"
              className="h-8"
            />
            </a>
          </div>
          {/* Explore dropdown */}
          <div className="relative">
            <button
              ref={btnRef}
              className="text-[#0d1129] font-medium flex items-center hover:text-blue-600"
              onClick={toggleMenu}
              type="button"
            >
              Explore
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {/* Dropdown menu */}
            <div
              ref={menuRef}
              className="hidden absolute top-10 left-0 w-72 bg-white border rounded-lg shadow-lg p-4 z-50"
            >
              {/* Services */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-800">Services</h3>
                <Link href="#" className="text-sm text-blue-600 hover:underline">
                  See all
                </Link>
              </div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-center justify-between cursor-pointer hover:text-blue-600">
                  <span className="flex items-center space-x-2">
                    <span>💼</span>
                    <span>Business</span>
                  </span>
                  <span>›</span>
                </li>
                <li className="flex items-center justify-between cursor-pointer hover:text-blue-600">
                  <span className="flex items-center space-x-2">
                    <span>📅</span>
                    <span>Events & Entertainers</span>
                  </span>
                  <span>›</span>
                </li>
                <li className="flex items-center justify-between cursor-pointer hover:text-blue-600">
                  <span className="flex items-center space-x-2">
                    <span>❤️</span>
                    <span>Health & Wellness</span>
                  </span>
                  <span>›</span>
                </li>
                <li className="flex items-center justify-between cursor-pointer hover:text-blue-600">
                  <span className="flex items-center space-x-2">
                    <span>🏠</span>
                    <span>House & Home</span>
                  </span>
                  <span>›</span>
                </li>
                <li className="flex items-center justify-between cursor-pointer hover:text-blue-600">
                  <span className="flex items-center space-x-2">
                    <span>📘</span>
                    <span>Lessons & Training</span>
                  </span>
                  <span>›</span>
                </li>
                <li className="flex items-center justify-between cursor-pointer hover:text-blue-600">
                  <span className="flex items-center space-x-2">
                    <span>⋯</span>
                    <span>More</span>
                  </span>
                  <span>›</span>
                </li>
              </ul>
              {/* Popular Services */}
              <div className="flex justify-between items-center mt-4 mb-2">
                <h3 className="text-sm font-semibold text-gray-800">Popular Services</h3>
                <Link href="#" className="text-sm text-blue-600 hover:underline">
                  See all
                </Link>
              </div>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li className="hover:text-blue-600 cursor-pointer">Dog & Pet Grooming</li>
                <li className="hover:text-blue-600 cursor-pointer">Dog Training</li>
                <li className="hover:text-blue-600 cursor-pointer">Dog Walking</li>
                <li className="hover:text-blue-600 cursor-pointer">Life Coaching</li>
                <li className="hover:text-blue-600 cursor-pointer">Limousine Hire</li>
                <li className="hover:text-blue-600 cursor-pointer">Magician</li>
                <li className="hover:text-blue-600 cursor-pointer">Private Investigators</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Right: Login + Join */}
        <div className="flex items-center space-x-6">
          <Link href="/auth" className="text-[#0d1129] font-medium hover:text-blue-600">
            Login
          </Link>
          <Link
            href="/joinasprofessional"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"
              />
            </svg>
            <span>Join as a Professional</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}