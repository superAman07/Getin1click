'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Search,
  Users,
  X,
  Check,
  Building2,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  CreditCard,
  ChevronDown
} from 'lucide-react';

// Define interfaces for the data we'll be handling
interface ProfessionalSummary {
    id: string;
    name: string | null;
    email: string;
    status: string;
    onboardingComplete: boolean;
    createdAt: string;
    professionalProfile: {
        credits: number;
        companyName: string | null;
        phoneNumber?: string | null;
        locations?: string[] | null;
        services?: string[] | null;
    } | null;
}

interface ProfessionalDetails extends ProfessionalSummary {
    // Add more detailed fields that will be fetched for a single professional
    // This can be expanded based on the GET [id] endpoint
}

export default function ManageProfessionalsPage() {
    const [professionals, setProfessionals] = useState<ProfessionalSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalDetails | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [newCredits, setNewCredits] = useState<number>(0);
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    const fetchProfessionals = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/admin/professionals');
            setProfessionals(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfessionals();
    }, [fetchProfessionals]);

    const handleViewDetails = async (professionalId: string) => {
        setIsUpdating(true);
        try {
            const response = await axios.get(`/api/admin/professionals/${professionalId}`);
            setSelectedProfessional(response.data);
            setNewCredits(response.data.professionalProfile?.credits || 0);
            setSelectedStatus(response.data.status);
            setIsDetailsModalOpen(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateStatus = async (professionalId: string, newStatus: string) => {
        try {
            await axios.put(`/api/admin/professionals/${professionalId}`, { status: newStatus });
            fetchProfessionals();
            if (selectedProfessional?.id === professionalId) {
                handleViewDetails(professionalId);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateCredits = async (professionalId: string, newCreditAmount: number) => {
        if (isNaN(newCreditAmount) || newCreditAmount < 0) {
            return;
        }
        try {
            await axios.put(`/api/admin/professionals/${professionalId}`, { credits: newCreditAmount });
            fetchProfessionals();
            if (selectedProfessional?.id === professionalId) {
                handleViewDetails(professionalId);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredProfessionals = professionals.filter(prof => {
        const matchesSearch =
            prof.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prof.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prof.professionalProfile?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || prof.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleDeleteProfessional = async (professionalId: string) => {
        
        if (!window.confirm('Are you sure you want to permanently delete this professional? This action cannot be undone.')) {
            return;
        }

        const toastId = toast.loading('Deleting professional...');
        try {
            await axios.delete(`/api/admin/professionals/${professionalId}`);
            toast.success('Professional deleted successfully.', { id: toastId });
            setIsDetailsModalOpen(false); 
            fetchProfessionals(); 
        } catch (error) {
            toast.error('Failed to delete professional.', { id: toastId });
            console.error(error);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors = {
            ACTIVE: 'bg-green-100 text-green-800 border-green-200',
            SUSPENDED: 'bg-red-100 text-red-800 border-red-200',
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Manage Professionals</h1>
                    <p className="text-slate-600">View and manage professional accounts</p>
                </div>

                {/* Toolbar */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white cursor-pointer min-w-[180px]"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="ACTIVE">Active</option>
                                <option value="SUSPENDED">Suspended</option>
                                <option value="PENDING">Pending</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Professionals Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {isLoading ? (
                        // Loading Skeleton
                        <div className="animate-pulse">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Professional</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Company</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Credits</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Onboarding</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Joined</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...Array(5)].map((_, i) => (
                                            <tr key={i} className="border-b border-slate-100">
                                                <td className="px-6 py-4">
                                                    <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                                                    <div className="h-3 bg-slate-200 rounded w-48"></div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="h-4 bg-slate-200 rounded w-16"></div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="h-5 w-5 bg-slate-200 rounded"></div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="h-9 bg-slate-200 rounded w-28"></div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : filteredProfessionals.length === 0 ? (
                        // Empty State
                        <div className="text-center py-16">
                            <Users className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No professionals found</h3>
                            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        // Professionals Table
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Professional</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Credits</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Onboarding</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredProfessionals.map((professional) => (
                                        <tr
                                            key={professional.id}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                        {professional.name?.charAt(0)?.toUpperCase() || professional.email.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {professional.name || 'No name'}
                                                        </div>
                                                        <div className="text-sm text-slate-500">
                                                            {professional.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-900">
                                                {professional.professionalProfile?.companyName || '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-sm font-medium text-slate-900">
                                                    <CreditCard className="w-4 h-4 mr-1.5 text-slate-400" />
                                                    {professional.professionalProfile?.credits || 0}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={professional.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                {professional.onboardingComplete ? (
                                                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                                                        <Check className="h-5 w-5 text-green-600" />
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-100">
                                                        <span className="text-slate-400 text-xs">—</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {formatDate(professional.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleViewDetails(professional.id)}
                                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Details Side Panel */}
            {isDetailsModalOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                        onClick={() => setIsDetailsModalOpen(false)}
                    ></div>

                    {/* Side Panel */}
                    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
                        {isUpdating ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : selectedProfessional && (
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-200">
                                    <div className="flex items-center">
                                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
                                            {selectedProfessional.name?.charAt(0)?.toUpperCase() || selectedProfessional.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">
                                                {selectedProfessional.name || 'Professional Details'}
                                            </h2>
                                            <p className="text-slate-500">{selectedProfessional.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsDetailsModalOpen(false)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <X className="h-6 w-6 text-slate-600" />
                                    </button>
                                </div>

                                {/* User Information */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <Users className="w-5 h-5 mr-2 text-blue-600" />
                                        User Information
                                    </h3>
                                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-3 text-slate-400" />
                                            <span className="text-sm text-slate-600 w-24">Email:</span>
                                            <span className="text-sm font-medium text-slate-900">{selectedProfessional.email}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 mr-3"></div>
                                            <span className="text-sm text-slate-600 w-24">Status:</span>
                                            <StatusBadge status={selectedProfessional.status} />
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-3 text-slate-400" />
                                            <span className="text-sm text-slate-600 w-24">Joined:</span>
                                            <span className="text-sm font-medium text-slate-900">{formatDate(selectedProfessional.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Check className="w-4 h-4 mr-3 text-slate-400" />
                                            <span className="text-sm text-slate-600 w-24">Onboarding:</span>
                                            <span className="text-sm font-medium text-slate-900">
                                                {selectedProfessional.onboardingComplete ? 'Complete' : 'Incomplete'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Details */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                                        Profile Details
                                    </h3>
                                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                        <div className="flex items-start">
                                            <Building2 className="w-4 h-4 mr-3 text-slate-400 mt-0.5" />
                                            <span className="text-sm text-slate-600 w-32">Company:</span>
                                            <span className="text-sm font-medium text-slate-900 flex-1">
                                                {selectedProfessional.professionalProfile?.companyName || '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <Phone className="w-4 h-4 mr-3 text-slate-400 mt-0.5" />
                                            <span className="text-sm text-slate-600 w-32">Phone:</span>
                                            <span className="text-sm font-medium text-slate-900 flex-1">
                                                {selectedProfessional.professionalProfile?.phoneNumber || '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <MapPin className="w-4 h-4 mr-3 text-slate-400 mt-0.5" />
                                            <span className="text-sm text-slate-600 w-32">Locations:</span>
                                            <span className="text-sm font-medium text-slate-900 flex-1">
                                                {selectedProfessional.professionalProfile?.locations?.map(l => l.locationName).join(', ') || '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <Briefcase className="w-4 h-4 mr-3 text-slate-400 mt-0.5" />
                                            <span className="text-sm text-slate-600 w-32">Services:</span>
                                            <span className="text-sm font-medium text-slate-900 flex-1">
                                                {selectedProfessional.professionalProfile?.services?.map(s => s.name).join(', ') || '—'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Management */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                                        Account Management
                                    </h3>

                                    {/* Update Status */}
                                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Update Status
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => {
                                                    setSelectedStatus(e.target.value);
                                                    handleUpdateStatus(selectedProfessional.id, e.target.value);
                                                }}
                                                className="w-full appearance-none pl-4 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white cursor-pointer"
                                            >
                                                <option value="ACTIVE">Active</option>
                                                <option value="SUSPENDED">Suspended</option>
                                                <option value="PENDING">Pending</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Update Credits */}
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Update Credits
                                        </label>
                                        <div className="flex gap-3">
                                            <input
                                                type="number"
                                                min="0"
                                                value={newCredits}
                                                onChange={(e) => setNewCredits(Number(e.target.value))}
                                                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                                placeholder="Enter credits"
                                            />
                                            <button
                                                onClick={() => handleUpdateCredits(selectedProfessional.id, newCredits)}
                                                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                                            >
                                                Save Credits
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">
                                            Current balance: {selectedProfessional.professionalProfile?.credits || 0} credits
                                        </p>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-200">
                                        <h3 className="text-base font-semibold text-red-600 mb-2">Danger Zone</h3>
                                        <button
                                            onClick={() => handleDeleteProfessional(selectedProfessional.id)}
                                            className="w-full px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Delete Professional Account
                                        </button>
                                        <p className="text-xs text-slate-500 mt-2 text-center">This action is permanent and cannot be undone.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            <style jsx>{`
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
