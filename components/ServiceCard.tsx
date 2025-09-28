'use client';

import React, { useState, useEffect } from 'react';
import ToggleSwitch from './ToggleSwitch';

interface Service {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  category: {
    name: string;
  };
}

const ServiceCard: React.FC<{ service: Service; onToggle: (id: string) => void }> = ({ service, onToggle }) => {
  const defaultImage = 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop';

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={service.imageUrl || defaultImage}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 text-lg mb-1">{service.name}</h3>
            <p className="text-slate-600 text-sm">{service.category.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${service.isActive ? 'text-green-600' : 'text-slate-500'}`}>
              {service.isActive ? 'Active' : 'Inactive'}
            </span>
            <ToggleSwitch
              isOn={service.isActive}
              onToggle={() => onToggle(service.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
    <div className="aspect-video w-full bg-slate-200" />
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 bg-slate-200 rounded w-12" />
          <div className="h-6 w-11 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const toggleService = (id: string) => {
    setServices(services.map(service =>
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ));
    // Here you would also make an API call to update the service status in the database
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-slate-900">No services found</h3>
        <p className="text-slate-600 mt-2">Get started by adding your first service.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loading ? (
        Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
      ) : (
        services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onToggle={toggleService}
          />
        ))
      )}
    </div>
  );
}