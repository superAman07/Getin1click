"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, User, BellDot, Settings, Menu, X, ChevronDown, LogOut, Plus, Coins, Star } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import ProfessionalNotifications from "./ProfessionalNotifications"
import PlatformReviewModal from "./PlatformReviewModal"

export function NavbarProfessional() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [isReviewModalOpen, setReviewModalOpen] = useState(false)

  const userBtnRef = useRef<HTMLButtonElement | null>(null)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  const navItems = [
    { href: "/professional/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/professional/leads", label: "Leads", icon: FileText },
    { href: "/professional/dashboard/update-profile", label: "Settings", icon: Settings },
  ]

  useEffect(() => {
    setMobileOpen(false)
    setUserOpen(false)
  }, [pathname])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        userOpen &&
        userBtnRef.current &&
        userMenuRef.current &&
        !userBtnRef.current.contains(e.target as Node) &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [userOpen])

  useEffect(() => {
    if (userOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setUserOpen(false)
      }
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [userOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Desktop Nav */}
            <div className="flex items-center gap-3 md:gap-6">
              {/* Mobile menu toggle */}
              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors duration-200 ease-out cursor-pointer"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo */}
              <Link href="/professional/dashboard" className="font-bold text-xl text-blue-700">
                <img src="/logo.png" alt="Logo" className="h-14" />
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-out cursor-pointer",
                        active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                      ].join(" ")}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      {active && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-2 -bottom-[2px] h-[2px] rounded-full bg-blue-600"
                        />
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/professional/wallet" className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer">
                <Coins className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-slate-800 hidden sm:inline">{session?.user?.credits ?? 0}</span>
                <span className="bg-slate-300 hover:bg-slate-400 p-0.5 rounded-full">
                  <Plus className="w-3 h-3 text-slate-600" />
                </span>
              </Link>
              {/* Notifications */}
              <ProfessionalNotifications />

              {/* User */}
              <div className="relative flex items-center">
                <button
                  ref={userBtnRef}
                  onClick={() => setUserOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={userOpen}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors duration-200 ease-out cursor-pointer"
                >
                  <span className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </span>
                  <ChevronDown className="hidden md:block w-4 h-4 text-slate-500" />
                </button>

                {userOpen && (
                  <div
                    ref={userMenuRef}
                    role="menu"
                    className="absolute right-0 top-[110%] min-w-[220px] rounded-lg border border-slate-200 bg-white shadow-lg p-1.5 md:p-2 animate-in fade-in-0 zoom-in-95"
                  >
                    <div className="px-2.5 py-2 hidden md:block">
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {session?.user?.name || "Account"}
                      </div>
                      <div className="text-xs text-slate-500 truncate">{session?.user?.email || ""}</div>
                    </div>
                    <button
                      onClick={() => setReviewModalOpen(true)}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-200 ease-out cursor-pointer"
                    >
                      <Star className="w-4 h-4" />
                      Give Feedback
                    </button>
                    <div className="w-full h-px bg-slate-100 my-1"></div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 ease-out cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
        )}

        <div
          id="mobile-menu"
          aria-hidden={!mobileOpen}
          className={[
            "md:hidden fixed left-0 right-0 top-16 z-50 origin-top",
            // smoother, fully-hidden closed state so it doesn't appear always-open
            "transition-all duration-200 ease-out will-change-transform",
            mobileOpen ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-4 pointer-events-none",
          ].join(" ")}
        >
          <div className="mx-4 rounded-lg border border-slate-200 bg-white shadow-md overflow-hidden">
            <div className="p-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{session?.user?.name || "Account"}</div>
                  <div className="text-xs text-slate-500 truncate">{session?.user?.email || ""}</div>
                </div>
              </div>

              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-out cursor-pointer",
                        active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100",
                      ].join(" ")}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  )
                })}

                {/* Mobile Sign out */}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="mt-1 flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 ease-out cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <PlatformReviewModal isOpen={isReviewModalOpen} onClose={() => setReviewModalOpen(false)} />
    </>
  )
}

export default NavbarProfessional
