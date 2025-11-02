'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Service } from '@/types/servicesTypes';
import { Loader2, X, Search, MapPin, Briefcase } from 'lucide-react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostJobModal({ isOpen, onClose }: PostJobModalProps) {
  const router = useRouter();
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceQuery, setServiceQuery] = useState('');
  const [postcode, setPostcode] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/admin/services');
        setAllServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (serviceQuery) {
      setFilteredServices(
        allServices.filter(s => s.name.toLowerCase().includes(serviceQuery.toLowerCase()))
      );
    } else {
      setFilteredServices([]);
    }
  }, [serviceQuery, allServices]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setServiceQuery(service.name);
    setIsDropdownOpen(false);
  };

  const handleFindProfessional = async () => {
    if (!selectedService) {
      setError("Please select a service from the list.");
      return;
    }
    if (!postcode.trim() || postcode.length !== 6) {
      setError("Please enter a valid 6-digit postcode.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/services/search?query=${selectedService.name}&postcode=${postcode}`
      );
      const isAvailable = response.data.some((s: Service) => s.id === selectedService.id);

      if (isAvailable) {
        router.push(`/customer/post-a-job?serviceId=${selectedService.id}&postcode=${postcode}`);
        onClose();
      } else {
        setError(`Sorry, no professionals for '${selectedService.name}' are available in your area.`);
      }
    } catch (err) {
      setError("Failed to check availability. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative animate-in zoom-in-95 duration-200" ref={dropdownRef}>
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer">
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Post a New Job</h2>
        <p className="text-gray-600 mb-6">Find the right professional for your needs.</p>

        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="What service are you looking for?"
                value={serviceQuery}
                onChange={(e) => { setServiceQuery(e.target.value); setIsDropdownOpen(true); setSelectedService(null); }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {isDropdownOpen && filteredServices.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 mt-1 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {filteredServices.map(service => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="p-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3"
                  >
                    <Briefcase size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-800">{service.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter 6-digit postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        <div className="mt-6">
          <button
            onClick={handleFindProfessional}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:bg-blue-400"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Find a Professional'}
          </button>
        </div>
      </div>
    </div>
  );
}