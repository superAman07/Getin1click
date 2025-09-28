"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { Service } from "@/types/servicesTypes";

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
  const defaultImage = 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<HomePageData>('/api/home');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch home page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative ">
      <div className="w-full bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-start">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0c1445] leading-snug">
            Find the perfect <br className="hidden sm:block" /> professional for you
          </h2>
          <h4 className="mt-3 text-base sm:text-lg text-gray-400">
            Get free quotes within minutes
          </h4>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch justify-center w-full gap-2">
            <input
              type="text"
              placeholder="What service are you looking for?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-t-md sm:rounded-l-md sm:rounded-tr-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Postcode"
              className="w-full sm:w-32 px-4 py-3 border border-gray-300 border-t-0 sm:border-t sm:border-l-0 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-b-md sm:rounded-r-md sm:rounded-bl-none shadow-md transition">
              Search
            </button>
          </div>

          {data && data.featuredServices.length > 0 && (
            <p className="mt-6 text-sm text-gray-400">
              Popular:{" "}
              {data.featuredServices.slice(0, 3).map((service, index) => (
                <React.Fragment key={service.id}>
                  <a href="#" className="text-blue-600 hover:underline">{service.name}</a>
                  {index < 2 ? ", " : ""}
                </React.Fragment>
              ))}
            </p>
          )}
        </div>
      </div>
      <div className="relative bg-white py-6">
        <div className="flex animate-marquee space-x-4 sm:space-x-6">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-64 sm:w-80 h-40 sm:h-60 rounded-lg flex-shrink-0 bg-slate-200 animate-pulse"></div>
            ))
          ) : (
            data?.featuredServices.map(service => (
              <div key={service.id} className="relative w-64 sm:w-80 h-40 sm:h-60 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={service.imageUrl || defaultImage}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 text-white font-semibold bg-black/30 px-2 py-1 rounded">
                  {service.name}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        data?.categoriesWithServices.map(category => (
          <section key={category.id} className="px-6 py-8" style={{ padding: '40px 110px' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{category.name}</h2>
              <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                View All
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.services.map(service => (
                <a key={service.id} href="#" className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="relative w-full h-70">
                    <Image
                      src={service.imageUrl || defaultImage}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))
      )}

      {/* testimnoial */}
      <section className="w-full bg-gray-50 py-16 flex flex-col items-center">
        {/* Avatars Row */}
        <div className="relative w-full max-w-6xl flex justify-center flex-wrap gap-6 mb-12">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
            <img src="/1.png" alt="user" className="w-full h-full object-cover" />
          </div>
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
            <img src="/2.png" alt="user" className="w-full h-full object-cover" />
          </div>
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
            <img src="/3.png" alt="user" className="w-full h-full object-cover" />
          </div>
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg">
            <img src="/1.png" alt="user" className="w-full h-full object-cover" />
          </div>
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
            <img src="/2.png" alt="user" className="w-full h-full object-cover" />
          </div>
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
            <img src="/1.png" alt="user" className="w-full h-full object-cover" />
          </div>
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
            <img src="/3.png" alt="user" className="w-full h-full object-cover" />
          </div>
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
            <img src="/1.png" alt="user" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Testimonial Text */}
        <div className="text-center max-w-2xl px-6">
          <p className="text-xl md:text-2xl font-medium text-gray-900">
            “I have used Bark twice now for two completely different services and I’ve had a fantastic experience both times!”
          </p>
          <p className="mt-4 text-lg font-semibold text-gray-800">Jayne</p>
        </div>

        {/* Dots Navigation */}
        <div className="flex mt-6 space-x-2">
          <span className="h-2 w-2 rounded-full bg-blue-600"></span>
          <span className="h-2 w-2 rounded-full bg-gray-300"></span>
          <span className="h-2 w-2 rounded-full bg-gray-300"></span>
          <span className="h-2 w-2 rounded-full bg-gray-300"></span>
          <span className="h-2 w-2 rounded-full bg-gray-300"></span>
        </div>
      </section>

    </div>
  );
}
