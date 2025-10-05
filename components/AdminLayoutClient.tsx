"use client";

import React, { useEffect, useRef, useState } from 'react';
import { LogOut, Menu, Plus, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import AddServiceForm from './AddServiceFormPage';
import AdminSidebar from './AdminSidebar';
import { ServiceProvider, useServiceContext } from '@/contexts/ServiceContext';
import { signOut, useSession } from 'next-auth/react';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const {
    isFormOpen,
    editingService,
    openFormForCreate,
    closeForm
  } = useServiceContext();

  const { data: session } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const getPageTitle = () => {
    const path = pathname.split('/').pop() || 'dashboard';
    return path.replace(/-/g, ' ');
  };
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
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <AdminSidebar
          isCollapsed={sidebarCollapsed}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:block cursor-pointer text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>

                <div>
                  <h1 className="text-2xl font-bold text-slate-900 capitalize">{getPageTitle()}</h1>
                  <p className="text-slate-600 text-sm">Manage your {getPageTitle()} efficiently</p>
                </div>
              </div>
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

          <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
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