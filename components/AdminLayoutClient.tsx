"use client";

import React, { useState } from 'react';
import { Menu, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import AddServiceForm from './AddServiceFormPage';
import AdminSidebar from './AdminSidebar';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    const path = pathname.split('/').pop() || 'dashboard';
    return path.replace(/-/g, ' ');
  };

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

              {pathname.includes('/services') && (
                <button
                  onClick={() => setShowAddServiceForm(true)} // Open the modal
                  className="bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add New Service</span>
                  <span className="sm:hidden">Add</span>
                </button>
              )}
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      {showAddServiceForm && (
        <AddServiceForm
          onClose={() => setShowAddServiceForm(false)}
          onSave={() => {
            window.location.reload();
          }}
        />
      )}
    </>
  );
}