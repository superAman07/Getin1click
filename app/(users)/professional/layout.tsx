import React from "react";
import { NavbarProfessional } from "@/components/NavbarProfessional";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarProfessional />
    
      <main className="">
        {children}
      </main>

      {/* Toaster components can be placed here if needed */}
      {/* <Toaster /> */}
      {/* <Sonner /> */}
    </div>
  );
}