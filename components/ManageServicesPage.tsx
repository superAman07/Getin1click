'use client';

import React, { useState, useEffect, useRef } from 'react';
import ToggleSwitch from './ToggleSwitch';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Service } from '@/types/servicesTypes';
import { useServiceContext } from '@/contexts/ServiceContext';

interface ServiceCardProps {
  service: Service;
  onToggle: (id: string, currentState: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onToggle, onDelete, onEdit }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const defaultImage = 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-slate-200">
      <div className="aspect-video w-full overflow-hidden relative">
        <img
          src={service.imageUrl || defaultImage}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="p-1.5 bg-white/70 cursor-pointer backdrop-blur-sm rounded-full text-slate-700 hover:bg-white transition-colors">
            <MoreVertical size={18} />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border z-10 animate-in fade-in duration-150">
              <button onClick={() => { onEdit(service); setDropdownOpen(false); }} className="w-full text-left cursor-pointer flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                <Edit size={14} /> Edit
              </button>
              <button onClick={() => { onDelete(service.id); setDropdownOpen(false); }} className="w-full text-left cursor-pointer flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
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
              onToggle={() => onToggle(service.id, service.isActive)}
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

export default function ManageServicesPage({onEdit}: {onEdit?: (service: Service)=> void}) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { openFormForEdit } = useServiceContext();

  useEffect(() => {
    console.log("ManageServicesPage received onEdit:", !!onEdit);
  }, [onEdit]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not fetch services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const toggleService = async (id: string, currentState: boolean) => {
    const originalServices = [...services];
    setServices(services.map(s => s.id === id ? { ...s, isActive: !currentState } : s));

    try {
      const response = await axios.put(`/api/admin/services/${id}`, {
        isActive: !currentState,
      });
      if (response.status !== 200) throw new Error('Failed to update status');
      toast.success('Service status updated!');
    } catch (error) {
      toast.error('Update failed. Reverting changes.');
      setServices(originalServices);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;

    const originalServices = [...services];
    setServices(services.filter(s => s.id !== id));
    const toastId = toast.loading('Deleting service...');

    try {
      const response = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (response.status !== 204) throw new Error('Failed to delete service');
      toast.success('Service deleted.', { id: toastId });
    } catch (error) {
      toast.error('Deletion failed. Reverting changes.', { id: toastId });
      setServices(originalServices);
    }
  };

  const editService = (service: Service) => {
    console.log("editService called, onEdit exists:", !!onEdit);
    openFormForEdit(service);
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
            onDelete={deleteService}
            onEdit={editService}
          />
        ))
      )}
    </div>
  );
}