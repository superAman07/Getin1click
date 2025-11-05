'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Search, Grid, Loader2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  services: Service[];
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('/api/services/categories');
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleServiceClick = (serviceId: string) => {
    router.push(`/customer/post-a-job?serviceId=${serviceId}`);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    services: category.services.filter(service => 
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.services.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-lg text-gray-600">Find the perfect service for your needs</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="space-y-16">
            {filteredCategories.map((category) => (
              <div key={category.id} className="space-y-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                  <div className="h-1 flex-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {category.services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleServiceClick(service.id)}
                      className="group bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-purple-500 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      <div className="aspect-video relative">
                        <Image
                          src={service.imageUrl || '/placeholder.jpg'}
                          alt={service.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {service.name}
                        </h3>
                        {service.description && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}