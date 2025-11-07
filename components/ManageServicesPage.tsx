'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import ToggleSwitch from './ToggleSwitch';
import { Edit, MoreVertical, Trash2, Search, Filter, Home, ChevronRight, Package, Grid3x3, Calendar, Plus, Briefcase, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Service } from '@/types/servicesTypes';
import { useServiceContext } from '@/contexts/ServiceContext';
import Link from 'next/link';
import { startOfMonth } from 'date-fns';

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
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-slate-200 mt-8">
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

const Breadcrumb: React.FC = () => {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6">
      <Home className="w-4 h-4" />
      <Link href="/admin/dashboard" className="hover:text-slate-900 cursor-pointer transition-colors">
        <span className="hover:text-slate-900 cursor-pointer transition-colors">Dashboard</span>
      </Link>
      <ChevronRight className="w-4 h-4 text-slate-400" />
      <span className="text-slate-900 font-medium">Services</span>
    </nav>
  );
};

export default function ManageServicesPage({onEdit}: {onEdit?: (service: Service)=> void}) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { openFormForCreate, openFormForEdit } = useServiceContext();

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

    const { filteredServices, activeServices, inactiveServices, addedThisMonth } = useMemo(() => {
    const startOfThisMonth = startOfMonth(new Date());

    const filtered = services.filter((service: Service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = 
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && service.isActive) ||
        (statusFilter === 'INACTIVE' && !service.isActive);

      return matchesSearch && matchesFilter;
    });

    const active = services.filter(s => s.isActive).length;
    const inactive = services.length - active;
    const thisMonth = services.filter(s => s.createdAt && new Date(s.createdAt) >= startOfThisMonth).length;

    return {
      filteredServices: filtered,
      activeServices: active,
      inactiveServices: inactive,
      addedThisMonth: thisMonth,
    };
  }, [services, searchTerm, statusFilter]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12 px-8">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  // if (services.length === 0) {
  //   return (
  //     <div className="text-center py-16">
  //       <h3 className="text-xl font-semibold text-slate-900">No services found</h3>
  //       <p className="text-slate-600 mt-2">Get started by adding your first service.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb />
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Services</h1>
            <p className="text-slate-600">Create and manage your service offerings</p>
          </div>

          <button
            onClick={openFormForCreate}
            className="bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer px-6 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-200 hover:shadow-lg active:scale-95 self-start lg:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add New Service</span>
            <span className="sm:hidden">Add Service</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Services</p>
                <p className="text-2xl font-bold text-slate-900">{services.length}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Services</p>
                <p className="text-2xl font-bold text-slate-900">{activeServices}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Categories Used</p>
                <p className="text-2xl font-bold text-slate-900">
                  {new Set(services.map(s => s.category.id)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Grid3x3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Added This Month</p>
                <p className="text-2xl font-bold text-slate-900">+{addedThisMonth}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onToggle={toggleService}
                onDelete={deleteService}
                onEdit={editService}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchTerm || statusFilter !== 'ALL' ? 'No services found' : 'No services yet'}
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'ALL'
                ? 'Try adjusting your search terms or filters.'
                : 'Get started by creating your first service.'}
            </p>
            {!searchTerm && statusFilter === 'ALL' && (
              <button
                onClick={openFormForCreate}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                Create Your First Service
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}