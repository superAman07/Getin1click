"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Service } from "@/types/servicesTypes";
import { Loader as Loader2, Search, Circle as XCircle, CircleAlert as AlertCircle, Sparkles } from "lucide-react";
import PincodeModal from "./PincodeModal";

interface CategoryWithServices {
  id: string;
  name: string;
  services: Service[];
}

interface HomePageData {
  featuredServices: Service[];
  categoriesWithServices: CategoryWithServices[];
}

export default function HeroPage() {
  const [data, setData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);

  const router = useRouter();
  const [serviceQuery, setServiceQuery] = useState("");
  const [postcode, setPostcode] = useState("");
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [allServices, setAllServices] = useState<Service[]>([]);
  const [recommendedServices, setRecommendedServices] = useState<Service[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(-1);
  const resultsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleSearch = async () => {
    if (!serviceQuery.trim() || !postcode.trim()) {
      alert("Please enter a service and postcode.");
      return;
    }
    setIsLoading(true);
    setSearched(true);
    setShowResults(false);
    try {
      const response = await axios.get(
        `/api/services/search?query=${serviceQuery}&postcode=${postcode}`
      );
      setSearchResults(response.data);
      setTimeout(() => setShowResults(true), 100);
    } catch (error) {
      console.error("Search failed", error);
      setSearchResults([]);
      setTimeout(() => setShowResults(true), 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectService = (serviceId: string) => {
    router.push(`/customer/post-a-job?serviceId=${serviceId}&postcode=${postcode}`);
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setIsPincodeModalOpen(true);
    // We will build the modal in the next step.
    // For now, let's log to the console.
    console.log("Selected service:", service);
  };

  const handleCloseModal = () => {
    setIsPincodeModalOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isDropdownOpen && recommendedServices.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prevIndex =>
          prevIndex === recommendedServices.length - 1 ? 0 : prevIndex + 1
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prevIndex =>
          prevIndex <= 0 ? recommendedServices.length - 1 : prevIndex - 1
        );
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0) {
          e.preventDefault();
          handleRecommendationClick(recommendedServices[activeIndex].name);
        } else {
          handleSearch();
        }
      } else if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    } else if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeResponse, servicesResponse] = await Promise.all([
          axios.get<HomePageData>("/api/home"),
          axios.get<Service[]>("/api/admin/services")
        ]);
        setData(homeResponse.data);
        setAllServices(servicesResponse.data);
      } catch (error) {
        console.error("Failed to fetch home page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (serviceQuery.trim()) {
      const filtered = allServices
        .filter(service => service.name.toLowerCase().includes(serviceQuery.toLowerCase()))
        .slice(0, 7); // Limit to 7 recommendations
      setRecommendedServices(filtered);
      setIsDropdownOpen(true);
      setActiveIndex(-1);
    } else {
      setRecommendedServices([]);
      setIsDropdownOpen(false);
    }
  }, [serviceQuery, allServices]);

  useEffect(() => {
    if (activeIndex >= 0 && resultsRef.current[activeIndex]) {
      resultsRef.current[activeIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRecommendationClick = (serviceName: string) => {
    setServiceQuery(serviceName);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative lg:mt-10">
      <div className="w-full bg-gradient-to-b from-blue-50 via-white to-white py-16 px-4 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles size={16} className="animate-pulse" />
            <span>Find trusted professionals in your area</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4 animate-slide-up">
            Find the perfect <br className="hidden sm:block" />
            <span className="text-blue-600">professional</span> for you
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-gray-600 mb-10 animate-slide-up animation-delay-100">
            Get free quotes within minutes from verified experts
          </p>

          <div ref={searchContainerRef} className="mt-10 bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-100 animate-slide-up animation-delay-200">
            <div className="flex flex-col sm:flex-row items-stretch justify-center w-full gap-3">
              <div className="flex-1 relative group">
                <input
                  type="text"
                  placeholder="What service are you looking for?"
                  value={serviceQuery}
                  onChange={(e) => setServiceQuery(e.target.value)}
                  onFocus={() => setIsDropdownOpen(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-gray-300"
                />
                {isDropdownOpen && recommendedServices.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-80 overflow-y-auto">
                    {recommendedServices.map((service, index) => (
                      <div
                        key={service.id}
                        ref={el => { resultsRef.current[index] = el }}
                        onClick={() => handleRecommendationClick(service.name)}
                        className={`p-4 cursor-pointer transition-colors flex items-center gap-3 ${
                          index === activeIndex ? 'bg-blue-100' : 'hover:bg-blue-50'
                        }`}
                      >
                        <Search size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-800">{service.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full sm:w-40 relative group">
                <input
                  type="text"
                  placeholder="Postcode"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-gray-300"
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  <Search size={22} />
                )}
                <span className="font-semibold">Search</span>
              </button>
            </div>

            {data && data.featuredServices.length > 0 && !searched && (
              <div className="mt-6 text-sm text-gray-500 animate-fade-in">
                <span className="font-medium text-gray-700">Popular:</span>{" "}
                {data.featuredServices.slice(0, 3).map((service, index) => (
                  <React.Fragment key={service.id}>
                    <button
                      onClick={() => {
                        setServiceQuery(service.name);
                      }}
                      className="text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer font-medium"
                    >
                      {service.name}
                    </button>
                    {index < Math.min(2, data.featuredServices.length - 1) &&
                      ", "}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {searched && (
            <div
              className={`mt-8 transition-all duration-500 ${showResults
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
                }`}
            >
              {isLoading ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                    <p className="text-lg font-medium text-gray-700">
                      Searching for professionals...
                    </p>
                    <p className="text-sm text-gray-500">
                      Finding the best match in your area
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-32 bg-gray-100 rounded-xl animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-10 w-1 bg-blue-600 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Available Services in Your Area
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Found {searchResults.length} professional
                    {searchResults.length !== 1 ? "s" : ""} ready to help
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((service, index) => (
                      <div
                        key={service.id}
                        onClick={() => handleSelectService(service.id)}
                        className="group border-2 border-gray-200 p-6 rounded-xl cursor-pointer hover:border-blue-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                            <Search
                              size={24}
                              className="text-blue-600 group-hover:text-white transition-colors duration-300"
                            />
                          </div>
                          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {service.name}
                        </h4>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <span className="font-medium">
                            {service.category.name}
                          </span>
                        </p>
                        <div className="mt-4 pt-4 border-t border-gray-200 group-hover:border-blue-200 transition-colors">
                          <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                            Click to post a job →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-8 sm:p-12 text-center shadow-lg">
                  <div className="inline-flex items-center justify-center h-20 w-20 bg-yellow-100 rounded-full mb-6">
                    <XCircle className="text-yellow-600" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No Professionals Found
                  </h3>
                  <p className="text-gray-700 mb-2 text-lg">
                    We couldn't find professionals for "
                    <span className="font-semibold text-gray-900">
                      {serviceQuery}
                    </span>
                    " in your area.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <AlertCircle size={18} />
                      <span className="text-sm">Try a different service</span>
                    </div>
                    <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <AlertCircle size={18} />
                      <span className="text-sm">Check your postcode</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSearched(false);
                      setServiceQuery("");
                      setPostcode("");
                    }}
                    className="mt-8 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Try New Search
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative bg-gray-50 py-8 overflow-hidden">
        <div className="flex animate-marquee space-x-6">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-72 sm:w-96 h-48 sm:h-64 rounded-2xl flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"
              ></div>
            ))
          ) : (
            data?.featuredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="relative w-72 sm:w-96 h-48 sm:h-64 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg hover:shadow-2xl transition-shadow duration-300 group cursor-pointer"
              >
                <Image
                  src={service.imageUrl || "/placeholder.svg"}
                  alt={service.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-xl mb-1">
                    {service.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {service.category.name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      ) : (
        data?.categoriesWithServices.map((category) => (
          <section
            key={category.id}
            className="px-4 sm:px-8 lg:px-28 py-12 sm:py-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {category.name}
                </h2>
                <div className="h-1 w-20 bg-blue-600 rounded-full mt-2"></div>
              </div>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1 group">
                <span>View All</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.services.map((service, index) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image
                      src={service.imageUrl || "/placeholder.svg"}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Trusted professionals available
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      <section className="w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 flex flex-col items-center px-4">
        <div className="relative w-full max-w-6xl flex justify-center flex-wrap gap-4 sm:gap-6 mb-12">
          {[
            { src: "/1.png", size: "w-16 h-16 sm:w-20 sm:h-20" },
            { src: "/2.png", size: "w-16 h-16 sm:w-20 sm:h-20" },
            { src: "/3.png", size: "w-16 h-16 sm:w-20 sm:h-20" },
            { src: "/1.png", size: "w-24 h-24 sm:w-28 sm:h-28" },
            { src: "/2.png", size: "w-16 h-16 sm:w-20 sm:h-20" },
            { src: "/1.png", size: "w-16 h-16 sm:w-20 sm:h-20" },
            { src: "/3.png", size: "w-16 h-16 sm:w-20 sm:h-20" },
            { src: "/1.png", size: "w-16 h-16 sm:w-20 sm:h-20" },
          ].map((avatar, i) => (
            <div
              key={i}
              className={`${avatar.size} rounded-full overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 ring-4 ring-white animate-fade-in cursor-pointer`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <img
                src={avatar.src}
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="text-center max-w-3xl px-6">
          <div className="inline-block mb-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-6 h-6 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 leading-relaxed mb-6">
            "I have used Bark twice now for two completely different services
            and I've had a fantastic experience both times!"
          </p>
          <p className="text-lg font-bold text-gray-800 mb-2">Jayne</p>
          <p className="text-sm text-gray-500">Verified Customer</p>
        </div>

        <div className="flex mt-8 space-x-2">
          {[1, 2, 3, 4, 5].map((dot, i) => (
            <button
              key={dot}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === 0
                  ? "bg-blue-600 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
                }`}
            ></button>
          ))}
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
      <PincodeModal
        isOpen={isPincodeModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
    </div>
  );
}
