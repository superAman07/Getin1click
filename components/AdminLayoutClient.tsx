"use client";

import React, { useEffect, useRef, useState } from 'react';
import { LogOut, Menu, Plus, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import AddServiceForm from './AddServiceFormPage';
import AdminSidebar from './AdminSidebar';
import { ServiceProvider, useServiceContext } from '@/contexts/ServiceContext';
import { signOut, useSession } from 'next-auth/react';
import AdminNotifications from './AdminNotifications';
import Link from 'next/link';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const {
    isFormOpen,
    editingService,
    openFormForCreate,
    closeForm
  } = useServiceContext();

  const { data: session } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuRef]);

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Main Layout */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
            <div className="flex h-18 items-center justify-between px-4 lg:px-8">
              {/* Left section */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>

                <Link href="/admin/dashboard" className="flex items-center gap-2">
                  <img src="/logo.png" alt="Logo" className="h-12" />
                </Link>

                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:block text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              {/* Right section */}
              <div className="flex items-center gap-4">
                {pathname.includes('/services') && (
                  <button
                    onClick={openFormForCreate}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add New Service</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                )}
                <AdminNotifications />
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="w-10 h-10 bg-slate-200 cursor-pointer rounded-full flex items-center justify-center text-slate-600 font-bold">
                    {session?.user?.name?.charAt(0).toUpperCase() || <User size={20} />}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-20">
                      <div className="p-3 border-b">
                        <p className="font-semibold text-sm text-slate-800">{session?.user?.name}</p>
                        <p className="text-xs text-slate-500">{session?.user?.email}</p>
                      </div>
                      <button
                        onClick={() => signOut({ callbackUrl: '/auth/login' })}
                        className="w-full text-left flex items-center cursor-pointer gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 flex relative">
            <AdminSidebar
              isCollapsed={sidebarCollapsed}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
            
            <main className={`flex-1 p-4 lg:p-0 overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
              {children}
            </main>
          </div>
        </div>
      </div>

      {/* Service Form Modal */}
      {isFormOpen && (
        <AddServiceForm
          onClose={closeForm}
          onSave={() => {
            window.location.reload();
          }}
          serviceToEdit={editingService}
        />
      )}
    </>
  );
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ServiceProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ServiceProvider>
  );
}