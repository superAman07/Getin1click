"use client"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { UserIcon } from "lucide-react"
import { HiArrowRightOnRectangle } from "react-icons/hi2"

export default function Navbar() {
  const { data: session, status } = useSession()
  const profileRef = useRef<HTMLDivElement>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    window.addEventListener("mousedown", handleClickOutside)
    return () => window.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="w-full fixed top-0 z-50 bg-white shadow-md" style={{ height: "74px" }}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-full">
        {/* Logo */}
        <Link href="/Home" aria-label="Go to Home" className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8" />
        </Link>

        <div className="hidden md:flex space-x-6 font-medium text-gray-800 justify-center items-center flex-1">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition">
            About
          </Link>
          <Link href="/career" className="hover:text-blue-600 transition">
            Career
          </Link>
          <Link href="/blog" className="hover:text-blue-600 transition">
            Blog
          </Link>
        </div>

        {/* Right: Auth/Profile */}
        <div className="flex items-center space-x-4 relative">
          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              role="img"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

          {/* Loading state (from navbar.tsx behavior) */}
          {status === "loading" && (
            <div role="status" aria-live="polite" className="flex items-center justify-center">
              <span className="inline-block h-5 w-5 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
              <span className="sr-only">Loading</span>
            </div>
          )}

          {/* Unauthenticated: Login + Join (from navbar.tsx behavior) */}
          {status === "unauthenticated" && (
            <div className="hidden md:flex space-x-2">
              <Link href="/auth/login" className="hover:text-blue-600 font-medium transition mt-2 text-[#0d1129]">
                Login
              </Link>
              <Link
                href="/joinasprofessional"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium shadow-sm transition"
              >
                Join as a Professional
              </Link>
            </div>
          )}

          {status === "authenticated" && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-11 h-11 rounded-full flex items-center cursor-pointer justify-center text-black hover:bg-blue-50 transition shadow-sm border border-gray-200"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                aria-label="Open profile menu"
              >
                <UserIcon className="w-6 h-6" />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-3 z-50 animate-slide-down"
                  role="menu"
                  aria-label="Profile menu"
                >
                  <div className="px-4 pb-2 border-b">
                    <div className="text-gray-700 font-semibold">Signed in</div>
                    <div className="text-sm text-gray-500 truncate">{session?.user?.email}</div>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    role="menuitem"
                  >
                    <UserIcon className="w-5 h-5" />
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition"
                    role="menuitem"
                  >
                    <HiArrowRightOnRectangle className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-4 mb-4 px-4 pb-4 pt-2 space-y-2 bg-white shadow-md rounded-md">
          <Link href="/Home" className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">
            Home
          </Link>
          <Link
            href="/About"
            className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition"
          >
            About
          </Link>
          <Link
            href="/Career"
            className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition"
          >
            Career
          </Link>
          <Link href="/Blog" className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">
            Blog
          </Link>

          {status === "unauthenticated" && (
            <>
              <Link
                href="/auth/login"
                className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition"
              >
                Login
              </Link>
              <Link
                href="/joinasprofessional"
                className="block py-2 px-2 text-white bg-blue-500 hover:bg-blue-600 rounded font-medium text-center transition"
              >
                Join as a Professional
              </Link>
            </>
          )}

          {status === "authenticated" && (
            <div className="pt-2 border-t">
              <div className="text-sm text-gray-500 px-2 truncate">{session?.user?.email}</div>
              <Link
                href="/profile"
                className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition"
              >
                Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full mt-1 py-2 px-2 text-red-600 font-medium hover:bg-red-50 rounded transition text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .animate-slide-down {
          animation: slideDown 0.18s ease-out;
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  )
}



// 'use client';
// import { useRef, useEffect } from "react";
// import Link from "next/link";
// import { signOut, useSession } from "next-auth/react";

// export default function Navbar() {
//   const { data: session, status } = useSession();
//   const btnRef = useRef<HTMLButtonElement>(null);
//   const menuRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClick = (e: MouseEvent) => {
//       if (
//         btnRef.current &&
//         menuRef.current &&
//         !btnRef.current.contains(e.target as Node) &&
//         !menuRef.current.contains(e.target as Node)
//       ) {
//         menuRef.current.classList.add("hidden");
//       }
//     };
//     window.addEventListener("click", handleClick);
//     return () => window.removeEventListener("click", handleClick);
//   }, []);

//   const toggleMenu = () => {
//     if (menuRef.current) {
//       menuRef.current.classList.toggle("hidden");
//     }
//   };

//   return (
//     <nav className="w-full border-b relative text-white" style={{ backgroundColor: "#", height: "74px" }}>
//       <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
//         {/* Left: Logo + Explore */}
//         <div className="flex items-center space-x-6">
//           {/* Logo */}
//           <div className="flex items-center">
//             <a href="/Home">
//               <img
//                 src="/logo.png"
//                 alt="Logo"
//                 className="h-8"
//               />
//             </a>
//           </div>
//           {/* Explore dropdown */}
//           <div className="relative">
//             <button
//               ref={btnRef}
//               className="text-[#0d1129] font-medium flex items-center hover:text-blue-600"
//               onClick={toggleMenu}
//               type="button"
//             >
//               Explore
//               <svg
//                 className="w-4 h-4 ml-1"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>
//             {/* Dropdown menu */}
//             <div
//               ref={menuRef}
//               className="hidden absolute top-10 left-0 w-72 bg-white border rounded-lg shadow-lg p-4 z-50"
//             >
//               {/* Services */}
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="text-sm font-semibold text-gray-800">Services</h3>
//                 <Link href="#" className="text-sm text-blue-600 hover:underline">
//                   See all
//                 </Link>
//               </div>
//               <ul className="space-y-2 text-gray-700 text-sm">
//                 <li className="flex items-center justify-between cursor-pointer hover:text-blue-600">
//                   <span className="flex items-center space-x-2">
//                     <span>💼</span>
//                     <span>Business</span>
//                   </span>
//                   <span>›</span>
//                 </li>
//                 <li className="flex items-center justify-between cursor-pointer hover:text-blue-600">
//                   <span className="flex items-center space-x-2">
//                     <span>📅</span>
//                     <span>Events & Entertainers</span>
//                   </span>
//                   <span>›</span>
//                 </li>
//                 <li className="flex items-center justify-between cursor-pointer hover:text-blue-600">
//                   <span className="flex items-center space-x-2">
//                     <span>❤️</span>
//                     <span>Health & Wellness</span>
//                   </span>
//                   <span>›</span>
//                 </li>
//                 <li className="flex items-center justify-between cursor-pointer hover:text-blue-600">
//                   <span className="flex items-center space-x-2">
//                     <span>🏠</span>
//                     <span>House & Home</span>
//                   </span>
//                   <span>›</span>
//                 </li>
//                 <li className="flex items-center justify-between cursor-pointer hover:text-blue-600">
//                   <span className="flex items-center space-x-2">
//                     <span>📘</span>
//                     <span>Lessons & Training</span>
//                   </span>
//                   <span>›</span>
//                 </li>
//                 <li className="flex items-center justify-between cursor-pointer hover:text-blue-600">
//                   <span className="flex items-center space-x-2">
//                     <span>⋯</span>
//                     <span>More</span>
//                   </span>
//                   <span>›</span>
//                 </li>
//               </ul>
//               <div className="flex justify-between items-center mt-4 mb-2">
//                 <h3 className="text-sm font-semibold text-gray-800">Popular Services</h3>
//                 <Link href="#" className="text-sm text-blue-600 hover:underline">
//                   See all
//                 </Link>
//               </div>
//               <ul className="space-y-1 text-gray-700 text-sm">
//                 <li className="hover:text-blue-600 cursor-pointer">Dog & Pet Grooming</li>
//                 <li className="hover:text-blue-600 cursor-pointer">Dog Training</li>
//                 <li className="hover:text-blue-600 cursor-pointer">Dog Walking</li>
//                 <li className="hover:text-blue-600 cursor-pointer">Life Coaching</li>
//                 <li className="hover:text-blue-600 cursor-pointer">Limousine Hire</li>
//                 <li className="hover:text-blue-600 cursor-pointer">Magician</li>
//                 <li className="hover:text-blue-600 cursor-pointer">Private Investigators</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center space-x-6">
//           {status === 'loading' && (
//             <div className="loader flex justify-center items-center"></div>
//           )}
//           {status === 'unauthenticated' && (
//             <>
//               <Link href="/auth/login" className="text-[#0d1129] font-medium hover:text-blue-600">
//                 Login
//               </Link>
//               <Link
//                 href="/joinasprofessional"
//                 className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full shadow-sm"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                   className="w-5 h-5"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"
//                   />
//                 </svg>
//                 <span>Join as a Professional</span>
//               </Link>
//             </>
//           )}
//           {status === 'authenticated' && (
//             <>
//               <span className="text-gray-700 hidden sm:block">{session.user?.email}</span>
//               <button
//                 onClick={() => signOut({ callbackUrl: '/' })}
//                 className="bg-red-600 text-white px-4 cursor-pointer py-2 rounded-md hover:bg-red-700"
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }