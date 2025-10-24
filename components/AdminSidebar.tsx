"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Users, Settings, LayoutGrid, UserCheck, X, CreditCard } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isCollapsed, mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { id: 'leads', href: '/admin/lead-management', label: 'Lead Management', icon: Home },
    { id: 'services', href: '/admin/services', label: 'Services', icon: Briefcase },
    { id: 'categories', href: '/admin/categories', label: 'Categories', icon: LayoutGrid },
    { id: 'professionals', href: '/admin/professionals', label: 'Professionals', icon: UserCheck },
    { id: 'credit-bundles', href: '/admin/credit-bundles', label: 'Credit Bundles', icon: CreditCard },
    { id: 'customers', href: '/admin/customers', label: 'Customers', icon: Users },
    // { id: 'settings', href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`fixed lg:static inset-y-0 left-0 z-30 bg-slate-900 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      
      <div className="flex items-center justify-between p-4 border-b border-slate-800 h-[69px]">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-white font-semibold text-lg">GetIn1Click</span>
          )}
        </div>
        
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="mt-8 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-2 transition-all duration-200 group ${
                isActive 
                  ? 'bg-cyan-500 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:text-white'}`} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}