import React from "react";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="professional-layout">
      <main>{children}</main>
    </div>
  );
}