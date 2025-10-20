"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types/servicesTypes";
import axios from "axios";
import { Loader2, X, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface PincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

export default function PincodeModal({
  isOpen,
  onClose,
  service,
}: PincodeModalProps) {
  const [postcode, setPostcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setPostcode("");
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleCheckAvailability = async () => {
    if (!postcode.trim()) {
      setError("Please enter a postcode.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Using the existing search API endpoint with the service name as query
      const response = await axios.get(
        `/api/services/search?query=${service?.name || ""}&postcode=${postcode}`
      );

      // Check if the returned services contain our service ID
      const isAvailable = response.data.some(
        (s: Service) => s.id === service?.id
      );

      if (isAvailable) {
        router.push(`/customer/post-a-job?serviceId=${service?.id}`);
        onClose();
      } else {
        setError(`Sorry, this service is not available in the postcode '${postcode}'.`);
      }
    } catch (err) {
      setError("Failed to check availability. Please try again later.");
      console.error("Availability check failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCheckAvailability();
    }
  };

  if (!isOpen || !service) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-md animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition-all duration-200"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
          <MapPin size={28} className="text-white" />
        </div>

        {/* Header */}
        <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Check Availability
        </h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Enter your postcode to see if <span className="font-semibold text-slate-900">'{service.name}'</span> is available in your area.
        </p>

        {/* Form */}
        <div className="space-y-5">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g., SW1A 1AA"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-slate-900 placeholder:text-slate-400 font-medium disabled:bg-slate-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-100 rounded-xl animate-shake">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <p className="text-red-700 text-sm leading-relaxed">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleCheckAvailability}
            disabled={isLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Checking availability...</span>
              </>
            ) : (
              <>
                <span>Check Availability</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
