'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(pathname === '/auth/signup');
  
  useEffect(() => {
    setIsActive(pathname === '/auth/signup');
  }, [pathname]);
  
  return (
    <div className='flex justify-center items-center min-h-screen bg-[#25252b]'>
      <div className={`container ${isActive ? 'active' : ''}`}>
        <div className="curved-shape"></div>
        <div className="curved-shape2"></div>
        {children}
      </div>
    </div>
  );
}