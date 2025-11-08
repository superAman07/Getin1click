'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { Service } from '@/types/servicesTypes';

interface ServiceSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onServiceSelect: (service: Service) => void;
  services: Service[];
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function ServiceSearchInput({
  value,
  onChange,
  onServiceSelect,
  services,
  placeholder = "Search services...",
  className = "",
  autoFocus = false
}: ServiceSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  // Filter services based on input
  useEffect(() => {
    if (value.trim()) {
      const filtered = services
        .filter(service =>
          service.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 7); // Limit to 7 suggestions
      setFilteredServices(filtered);
      setIsOpen(true);
      setActiveIndex(-1);
    } else {
      setFilteredServices([]);
      setIsOpen(false);
    }
  }, [value, services]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeItem = listRef.current.children[activeIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!filteredServices.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev =>
          prev < filteredServices.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev > -1 ? prev - 1 : -1);
        break;

      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          onServiceSelect(filteredServices[activeIndex]);
          setIsOpen(false);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl 
            focus:border-purple-500 focus:ring-4 focus:ring-purple-100 
            transition-all duration-200 ${className}`}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="service-list"
          aria-activedescendant={activeIndex >= 0 ? `service-${filteredServices[activeIndex].id}` : ''}
        />
      </div>

      {/* Dropdown */}
      {isOpen && filteredServices.length > 0 && (
        <div
          ref={listRef}
          id="service-list"
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 
            rounded-xl shadow-2xl max-h-80 overflow-y-auto"
        >
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              id={`service-${service.id}`}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => {
                onServiceSelect(service);
                setIsOpen(false);
              }}
              onMouseEnter={() => setActiveIndex(index)}
              className={`p-4 cursor-pointer transition-colors duration-150
                flex items-center gap-3 border-b last:border-0 border-gray-100
                ${index === activeIndex
                  ? 'bg-purple-50 text-purple-900'
                  : 'hover:bg-gray-50'}`}
            >
              <Search className={`w-4 h-4 ${index === activeIndex ? 'text-purple-500' : 'text-gray-400'}`} />
              <div>
                <div className="font-medium">{service.name}</div>
                {service.description && (
                  <div className="text-sm text-gray-500 line-clamp-1">{service.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}