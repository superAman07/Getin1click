'use client';

import React, { useState, useEffect } from 'react';
import { useRouter , useSearchParams} from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Service } from '@/types/servicesTypes';
import { Briefcase, MapPin, DollarSign, Clock, AlertTriangle, Loader2 } from 'lucide-react';

export default function PostAJobPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialServiceId = searchParams.get('serviceId');
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        serviceId: initialServiceId || '',
        location: '',
        budget: '',
        urgency: 'MEDIUM',
    });

    useEffect(() => {
        // Fetch all available services to populate the dropdown
        const fetchServices = async () => {
            try {
                const response = await axios.get('/api/professional/services');
                setServices(response.data);
            } catch (error) {
                toast.error('Could not load services.');
            }
        };
        fetchServices();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Posting your job...');

        try {
            await axios.post('/api/leads', formData);
            toast.success('Your job has been posted successfully!', { id: toastId });
            // Redirect to customer dashboard or a success page
            router.push('/customer/dashboard');
        } catch (error) {
            toast.error('Failed to post job. Please try again.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-2">Post a New Job</h1>
                <p className="text-center text-gray-600 mb-8">Describe your project and get matched with professionals.</p>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Needed</label>
                    <select name="serviceId" value={formData.serviceId} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-white" required>
                        <option value="" disabled>Select a service...</option>
                        {services.map(service => (
                            <option key={service.id} value={service.id}>{service.name}</option>
                        ))}
                    </select>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Full Kitchen Renovation" className="w-full p-3 border rounded-lg" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Needed</label>
                        <select name="serviceId" value={formData.serviceId} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-white" required>
                            <option value="" disabled>Select a service...</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={5} placeholder="Describe the work in detail..." className="w-full p-3 border rounded-lg" required></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location / Pincode</label>
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Mumbai, 400001" className="w-full p-3 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Budget (Optional)</label>
                            <input type="text" name="budget" value={formData.budget} onChange={handleInputChange} placeholder="e.g., ₹50,000 - ₹75,000" className="w-full p-3 border rounded-lg" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                        <select name="urgency" value={formData.urgency} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-white" required>
                            <option value="LOW">Flexible</option>
                            <option value="MEDIUM">Within a few weeks</option>
                            <option value="HIGH">Urgently</option>
                        </select>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-blue-400">
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Post Job'}
                    </button>
                </form>
            </div>
        </div>
    );
}