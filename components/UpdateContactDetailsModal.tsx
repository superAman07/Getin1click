"use client";

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Phone, MapPin, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateContactDetailsModal({ onClose, onSuccess }: Props) {
  const { data: session } = useSession();
  const [phoneNumber, setPhoneNumber] = useState(session?.user?.phoneNumber || '');
  const [address, setAddress] = useState(session?.user?.address || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error("Phone number is required.");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Saving your details...');

    try {
      await axios.put('/api/customer/profile', { phoneNumber, address });
      toast.success('Details saved successfully!', { id: toastId });
      onSuccess();
    } catch (error) {
      toast.error('Failed to save details. Please try again.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 animate-in zoom-in-95 slide-in-from-bottom-10">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Complete Your Profile</h2>
          <p className="text-sm text-slate-500 mt-1">Please provide your contact details to connect with professionals.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Your 10-digit mobile number"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-2">
                Address (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your full address"
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-200 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save and Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}