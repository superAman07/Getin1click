'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Service } from '@/types/servicesTypes';

interface ServiceContextType {
  editingService: Service | null;
  isFormOpen: boolean;
  openFormForEdit: (service: Service) => void;
  openFormForCreate: () => void;
  closeForm: () => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openFormForEdit = (service: Service) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const openFormForCreate = () => {
    setEditingService(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingService(null);
  };

  return (
    <ServiceContext.Provider value={{ 
      editingService, 
      isFormOpen,
      openFormForEdit,
      openFormForCreate,
      closeForm
    }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServiceContext() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServiceContext must be used within a ServiceProvider');
  }
  return context;
}