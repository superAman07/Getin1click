"use client"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { Bell, Briefcase, PlusCircle, UserIcon } from "lucide-react"
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

  const guestLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/career", label: "Career" },
    { href: "/how-it-works", label: "How It Works" },
  ];

  const customerLinks = [
    { href: "/customer/dashboard", label: "Dashboard" },
    { href: "/customer/my-jobs", label: "My Jobs" },
    { href: "/customer/post-a-job", label: "Post a Job" },
  ];

  const mainNavLinks = status === 'authenticated' && session.user.role === 'CUSTOMER' ? customerLinks : guestLinks;
  
  return (
    <nav className="w-full fixed top-0 z-50 bg-white shadow-md" style={{ height: "74px" }}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-full">
        {/* Logo */}
        <Link href="/Home" aria-label="Go to Home" className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 font-medium text-gray-800 justify-center items-center flex-1">
          {mainNavLinks.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-blue-600 transition">
              {link.label}
            </Link>
          ))}
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

          {/* {status === "authenticated" && (
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
          )} */}
          {status === "authenticated" && session.user.role === 'CUSTOMER' && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-11 h-11 rounded-full flex items-center cursor-pointer justify-center text-black hover:bg-blue-50 transition shadow-sm border border-gray-200"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <UserIcon className="w-6 h-6" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 animate-slide-down">
                  <div className="px-2 py-2 border-b border-gray-100">
                    <div className="font-semibold text-gray-800 truncate">{session.user.name || 'Customer'}</div>
                    <div className="text-sm text-gray-500 truncate">{session.user.email}</div>
                  </div>
                  <div className="mt-1">
                    <Link href="/customer/my-jobs" className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition" role="menuitem">
                      <Briefcase className="w-5 h-5" /> My Jobs
                    </Link>
                    <Link href="/customer/post-a-job" className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition" role="menuitem">
                      <PlusCircle className="w-5 h-5" /> Post a Job
                    </Link>
                    <Link href="/customer/notifications" className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition" role="menuitem">
                      <Bell className="w-5 h-5" /> Notifications
                    </Link>
                  </div>
                  <div className="mt-1 pt-1 border-t border-gray-100">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-red-600 hover:bg-red-50 transition rounded-lg"
                      role="menuitem"
                    >
                      <HiArrowRightOnRectangle className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-4 mb-4 px-4 pb-4 pt-2 space-y-2 bg-white shadow-md rounded-md">
          <Link href="/" className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">
            Home
          </Link>
          <Link
            href="/about"
            className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition"
          >
            About
          </Link>
          <Link
            href="/career"
            className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition"
          >
            Career
          </Link>
          <Link href="/blog" className="block py-2 px-2 text-gray-700 font-medium hover:bg-gray-100 rounded transition">
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