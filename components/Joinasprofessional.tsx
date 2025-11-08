'use client';
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Service } from "@/types/servicesTypes";
import { Star } from "lucide-react";
import Link from "next/link";

interface TrustScoreData {
  isVisible: boolean;
  trustScore?: string;
  reviewCount?: number;
}

const features = [
    {
      icon: "⚡",
      title: "Get Quality Leads",
      items: ["View leads locally or nationwide", "Review leads for free", "Get leads sent to you in real time"],
      cta: "How it works",
      gradient: "from-blue-500 to-cyan-500",
      href: "/how-it-works"
    },
    {
      icon: "💼",
      title: "Win New Clients",
      items: ["Pick the best leads for your business", "Unlock verified contact details", "Call or email them to win the job"],
      cta: "See an example lead",
      gradient: "from-purple-500 to-pink-500",
      href: "/how-it-works#example-lead"
    },
    {
      icon: "📈",
      title: "Grow Your Business",
      items: ["Keep 100% of what you earn", "No commission or hidden fees", "Get Hired Guarantee on first leads"],
      cta: "See pricing details",
      gradient: "from-indigo-500 to-purple-500",
      href: "/pricing"
    }
  ];

const DynamicStarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const partialStar = rating % 1;

  return (
    <div className="flex text-yellow-400 text-lg sm:text-xl">
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} fill="currentColor" className="w-5 h-5" />)}
      {partialStar > 0 && (
        <div className="relative">
          <Star className="w-5 h-5" />
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${partialStar * 100}%` }}>
            <Star fill="currentColor" className="w-5 h-5" />
          </div>
        </div>
      )}
      {[...Array(totalStars - Math.ceil(rating))].map((_, i) => <Star key={`empty-${i}`} className="w-5 h-5" />)}
    </div>
  );
};

export default function Joinasprofessional() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [trustScoreData, setTrustScoreData] = useState<TrustScoreData | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/admin/services');
        setServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      }
    };
    const fetchTrustScore = async () => {
      try {
        const { data } = await axios.get<TrustScoreData>('/api/trust-score');
        setTrustScoreData(data);
      } catch (error) {
        console.error("Failed to fetch trust score", error);
      }
    };
    fetchServices();
    fetchTrustScore();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGetStarted = () => {
    if (selectedService) {
      router.push(`/professional/onboarding?service=${encodeURIComponent(selectedService)}`);
    } else {
      router.push('/professional/onboarding');
    }
  };

  const handleServiceSelect = (serviceName: string) => {
    setSearchTerm(serviceName);
    setSelectedService(serviceName);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedService(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const filteredServices = searchTerm
    ? services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : services;

  const popularServices = services.slice(0, 8); // Show first 8 as popular

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className={`transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} mt-12`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="grid lg:grid-cols-2 gap-0">

              {/* Content Section */}
              <div className="p-6 sm:p-8 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
                <div className="space-y-6 lg:space-y-8">
                  <div className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                      Secure jobs and
                      <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block sm:inline"> grow your business</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                      Join 1000's of professionals connecting with local and remote clients who need your services
                    </p>
                  </div>

                  {/* Search Section */}
                  <div className="relative w-full max-w-2xl" ref={dropdownRef}>
                    <div className="flex bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="What service do you provide?"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-gray-900 placeholder-gray-500 focus:outline-none text-sm sm:text-base"
                      />
                      <button
                        onClick={handleGetStarted}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 cursor-pointer text-sm sm:text-base"
                      >
                        Get Started
                      </button>
                    </div>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 mt-2 rounded-2xl shadow-2xl z-50 max-h-80 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        <div className="max-h-80 overflow-y-auto">
                          {filteredServices.length > 0 ? (
                            filteredServices.map((service, index) => (
                              <div
                                key={service.id}
                                onClick={() => handleServiceSelect(service.name)}
                                className="p-3 sm:p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-150 border-b border-gray-100 last:border-none hover:border-blue-200"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <div className="font-medium text-gray-900">{service.name}</div>
                                {service.description && (
                                  <div className="text-sm text-gray-500 mt-1">{service.description}</div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-gray-500 text-center">No services found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Popular Services */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Popular Services</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {popularServices.map((service, index) => (
                        <button
                          key={service.id}
                          onClick={() => handleServiceSelect(service.name)}
                          className={`px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 cursor-pointer transform hover:scale-105 animate-in fade-in slide-in-from-bottom-2`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {service.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 order-1 lg:order-2 h-64 sm:h-80 lg:h-auto">
                <div className="absolute inset-2 sm:inset-4 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
                    alt="Professional workspace"
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Overlay Content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="absolute top-4 sm:top-8 left-4 sm:left-8 text-white">
                      <h3 className="text-xl sm:text-2xl font-bold mb-2">Rated Excellent</h3>
                      <div className="flex items-center space-x-2">
                        <DynamicStarRating rating={parseFloat(trustScoreData?.trustScore || '0')} />
                        <span className="text-xs sm:text-sm opacity-90">
                          {trustScoreData?.trustScore} • {trustScoreData?.reviewCount?.toLocaleString()}+ reviews
                        </span>
                      </div>
                    </div>

                    <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl text-white max-w-xs">
                      <div className="font-semibold text-sm sm:text-base">Join thousands of professionals</div>
                      <div className="text-xs sm:text-sm opacity-90">Growing their business with us</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-white/20 group animate-in fade-in slide-in-from-bottom-4`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-xl sm:text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{feature.title}</h3>

                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-gray-600 text-sm sm:text-base">
                      <span className="text-green-500 mr-3 mt-1 flex-shrink-0 font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link href={feature.href} passHref>
                  <div className={`w-full text-center bg-gradient-to-r ${feature.gradient} text-white py-3 px-6 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer text-sm sm:text-base`}>
                    {feature.cta}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}