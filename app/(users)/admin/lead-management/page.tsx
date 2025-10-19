'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Loader2, Search, Filter, X, ChevronDown,
    Users, Briefcase, MapPin, Clock, User,
    Check, AlertCircle, ChevronRight,
    Star,
    Phone
} from 'lucide-react';

interface Professional {
    id: string;
    name: string | null;
    email: string;
    professionalProfile: {
        companyName: string | null;
        credits: number;
        phoneNumber?: string | null;
    } | null;
}

interface Assignment {
    id: string;
    status: string;
    professional: {
        id: string;
        name: string | null;
        email: string;
        professionalProfile?: {
            companyName?: string | null;
            phoneNumber?: string | null;
        } | null;
    };
}

interface Review {
    rating: number;
    comment: string | null;
    professional: {
        name: string | null;
        email: string;
    };
}

interface CustomerSupportTicket {
    issue: string;
    status: string;
}

interface Lead {
    id: string;
    title: string;
    description: string;
    location: string;
    budget: string;
    urgency: string;
    status: string;
    createdAt: string;
    serviceId: string;
    service: { name: string };
    customer: { name: string | null; email: string; phoneNumber?: string | null };
    reviews: Review[];
    customerSupport: CustomerSupportTicket[];
    assignments: Assignment[];
}

interface Service {
    id: string;
    name: string;
}

// Main component
export default function LeadManagementPage() {
    // State for leads data
    const [leads, setLeads] = useState<Lead[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [professionals, setProfessionals] = useState<Professional[]>([]);

    // Loading states
    const [isLoadingLeads, setIsLoadingLeads] = useState(true);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const [isLoadingProfessionals, setIsLoadingProfessionals] = useState(false);
    const [isAssigning, setIsAssigning] = useState<string | null>(null);

    // UI state
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // Filter state
    const [leadSearchTerm, setLeadSearchTerm] = useState('');
    const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>('ALL');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
    const [professionalSearchTerm, setProfessionalSearchTerm] = useState('');

    // Filter dropdown states
    const [showServiceDropdown, setShowServiceDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    // Data fetching functions
    const fetchLeads = async () => {
        setIsLoadingLeads(true);
        try {
            let url = '/api/admin/leads';

            // Add query params if filters are active
            const params = new URLSearchParams();
            if (selectedServiceFilter !== 'ALL') params.append('serviceId', selectedServiceFilter);
            if (selectedStatusFilter !== 'ALL') params.append('status', selectedStatusFilter);
            if (leadSearchTerm) params.append('search', leadSearchTerm);

            if (params.toString()) url += `?${params.toString()}`;

            const { data } = await axios.get<Lead[]>(url);
            setLeads(data);
        } catch (error) {
            toast.error('Failed to load leads.');
            console.error(error);
        } finally {
            setIsLoadingLeads(false);
        }
    };

    const fetchServices = async () => {
        setIsLoadingServices(true);
        try {
            const { data } = await axios.get<Service[]>('/api/admin/services');
            setServices(data);
        } catch (error) {
            toast.error('Failed to load services for filtering.');
            console.error(error);
        } finally {
            setIsLoadingServices(false);
        }
    };

    // Initial data loading
    useEffect(() => {
        fetchServices();
        fetchLeads();
    }, []);

    // Refetch leads when filters change
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchLeads();
        }, 500); // Debounce to avoid excessive API calls

        return () => clearTimeout(handler);
    }, [leadSearchTerm, selectedServiceFilter, selectedStatusFilter]);

    // Event handlers
    const handleSelectLead = async (lead: Lead) => {
        const leadWithDefaults = {
            ...lead,
            assignments: lead.assignments || [],
            reviews: lead.reviews || [],
            customerSupport: lead.customerSupport || [],
        };
        setSelectedLead(leadWithDefaults);
        setIsPanelOpen(true);
        setIsLoadingProfessionals(true);
        setProfessionalSearchTerm('');

        try {
            const { data } = await axios.get<Professional[]>(`/api/admin/professionals?serviceId=${lead.serviceId}`);
            setProfessionals(data);
        } catch (error) {
            toast.error(`Failed to load professionals for ${lead.service.name}.`);
            setProfessionals([]);
        } finally {
            setIsLoadingProfessionals(false);
        }
    };

    const handleAssignLead = async (professionalId: string) => {
        if (!selectedLead) return;
        setIsAssigning(professionalId);

        try {
            await axios.post(`/api/admin/leads/${selectedLead.id}/assign`, { professionalId });
            toast.success('Lead assigned successfully!');

            // Refresh leads to show new assignment status
            await fetchLeads();

            // Update the selected lead with the new assignment
            const updatedLead = leads.find(l => l.id === selectedLead.id);
            if (updatedLead) {
                setSelectedLead(updatedLead);
            }
        } catch (error: any) {
            const message = error.response?.data || 'Failed to assign lead.';
            toast.error(message);
        } finally {
            setIsAssigning(null);
        }
    };

    const closePanel = () => {
        setIsPanelOpen(false);
    };

    // Filtered professionals based on search term
    const filteredProfessionals = useMemo(() => {
        return professionals.filter(prof =>
            prof.name?.toLowerCase().includes(professionalSearchTerm.toLowerCase()) ||
            prof.email.toLowerCase().includes(professionalSearchTerm.toLowerCase()) ||
            prof.professionalProfile?.companyName?.toLowerCase().includes(professionalSearchTerm.toLowerCase())
        );
    }, [professionals, professionalSearchTerm]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // UI rendering - this is a skeleton, a UI generation tool will fill in the detailed styling
    return (
        <div className="relative min-h-screen w-full bg-slate-50 overflow-hidden">
            {/* Main Content: Leads List and Filters */}
            <main className={`transition-all duration-300 ease-in-out ${isPanelOpen ? 'pr-[480px]' : 'pr-0'}`}>
                <div className="p-6 max-w-[1600px] mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Lead Management</h1>
                            <p className="text-slate-600">Assign leads to professionals and track their status</p>
                        </div>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search leads by title or description..."
                                value={leadSearchTerm}
                                onChange={(e) => setLeadSearchTerm(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                            />
                        </div>

                        {/* Service Filter */}
                        <div className="relative w-full sm:w-64">
                            <div
                                onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                                className="flex items-center justify-between h-12 px-4 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <Briefcase size={18} className="text-slate-400" />
                                    <span className="text-slate-700 truncate">
                                        {selectedServiceFilter === 'ALL' ? 'All Services' :
                                            services.find(s => s.id === selectedServiceFilter)?.name || 'Select Service'}
                                    </span>
                                </div>
                                <ChevronDown size={18} className="text-slate-400" />
                            </div>

                            {showServiceDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-30 max-h-64 overflow-y-auto">
                                    <div
                                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                        onClick={() => { setSelectedServiceFilter('ALL'); setShowServiceDropdown(false); }}
                                    >
                                        All Services
                                    </div>
                                    {services.map(service => (
                                        <div
                                            key={service.id}
                                            className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                            onClick={() => { setSelectedServiceFilter(service.id); setShowServiceDropdown(false); }}
                                        >
                                            {service.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status Filter */}
                        <div className="relative w-full sm:w-48">
                            <div
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                className="flex items-center justify-between h-12 px-4 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <Filter size={18} className="text-slate-400" />
                                    <span className="text-slate-700">{selectedStatusFilter === 'ALL' ? 'All Status' : selectedStatusFilter}</span>
                                </div>
                                <ChevronDown size={18} className="text-slate-400" />
                            </div>

                            {showStatusDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-30">
                                    {['ALL', 'OPEN', 'ASSIGNED', 'ACCEPTED', 'COMPLETED', 'CLOSED'].map(status => (
                                        <div
                                            key={status}
                                            className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                                            onClick={() => { setSelectedStatusFilter(status); setShowStatusDropdown(false); }}
                                        >
                                            {status === 'ALL' ? 'All Status' : status}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lead List */}
                    {isLoadingLeads ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
                            <p className="text-slate-600">Loading leads...</p>
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
                            <AlertCircle size={40} className="text-slate-400 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No leads found</h3>
                            <p className="text-slate-600">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {leads.map(lead => (
                                <div
                                    key={lead.id}
                                    onClick={() => handleSelectLead(lead)}
                                    className={`bg-white rounded-xl border transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer transform hover:-translate-y-1 ${selectedLead?.id === lead.id
                                            ? 'border-blue-500 ring-2 ring-blue-200'
                                            : 'border-slate-200'
                                        }`}
                                >
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${lead.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                                    lead.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-700' :
                                                        lead.status === 'ACCEPTED' ? 'bg-purple-100 text-purple-700' :
                                                            lead.status === 'COMPLETED' ? 'bg-teal-100 text-teal-700' :
                                                                lead.status === 'ISSUE_REPORTED' ? 'bg-red-100 text-red-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {lead.status}
                                            </span>
                                            <span className="text-xs text-slate-500">{formatDate(lead.createdAt)}</span>
                                        </div>
                                        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{lead.title}</h3>
                                        <div className="flex items-center mb-3">
                                            <User size={14} className="text-slate-400 mr-2" />
                                            <span className="text-sm text-slate-600 truncate">
                                                {lead.customer.name || lead.customer.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center mb-3">
                                            <MapPin size={14} className="text-slate-400 mr-2" />
                                            <span className="text-sm text-slate-600 truncate">{lead.location}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Briefcase size={14} className="text-slate-400 mr-2" />
                                            <span className="text-sm font-medium text-blue-600">{lead.service.name}</span>
                                        </div>
                                    </div>
                                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 rounded-b-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">
                                                {lead.assignments.length > 0 ? (
                                                    `${lead.assignments.length} professional${lead.assignments.length !== 1 ? 's' : ''} assigned`
                                                ) : 'No professionals assigned'}
                                            </span>
                                            <ChevronRight size={16} className="text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Side Panel: Professionals List */}
            <aside className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'} z-20 flex flex-col`}>
                {selectedLead && (
                    <>
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900">Assign Professional</h2>
                                <button onClick={closePanel} className="p-2 rounded-full hover:bg-slate-100 cursor-pointer transition-colors">
                                    <X size={20} className="text-slate-600" />
                                </button>
                            </div>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                                For lead: {selectedLead.title}
                            </p>
                        </div>

                        <div className="p-6 border-b border-slate-200 space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-slate-700">Lead Details</h3>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex gap-3 mb-2">
                                        <Briefcase size={16} className="text-blue-600" />
                                        <span className="text-sm font-medium text-slate-900">{selectedLead.service.name}</span>
                                    </div>
                                    <div className="flex gap-3 mb-2">
                                        <MapPin size={16} className="text-slate-600" />
                                        <span className="text-sm text-slate-700">{selectedLead.location}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <User size={16} className="text-slate-600" />
                                        <span className="text-sm text-slate-700">
                                            {selectedLead.customer.name || selectedLead.customer.email}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-slate-700">Customer Details</h3>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center mb-2">
                                        <User size={14} className="text-slate-400 mr-2" />
                                        <span className="text-sm font-medium text-slate-800">
                                            {selectedLead.customer.name || selectedLead.customer.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone size={14} className="text-slate-400 mr-2" />
                                        <span className="text-sm text-slate-600">
                                            {selectedLead.customer.phoneNumber || 'No phone number'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Final Status: Completed */}
                            {selectedLead.status === 'COMPLETED' && (
                                <div className="p-6 border-b border-slate-100">
                                    <h3 className="text-base font-semibold text-green-700 mb-3">Job Completed: Feedback</h3>
                                    {selectedLead.reviews && selectedLead.reviews.length > 0 ? selectedLead.reviews.map((review, index) => (
                                        <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-sm text-green-800">{review.professional.name || review.professional.email}</span>
                                                <div className="flex items-center text-yellow-500">
                                                    {[...Array(5)].map((_, i) => (<Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} />))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-green-900 italic">"{review.comment || 'No comment provided.'}"</p>
                                        </div>
                                    )) : <p className="text-sm text-slate-500">No feedback was provided.</p>}
                                </div>
                            )}

                            {/* Final Status: Issue Reported */}
                            {selectedLead.status === 'ISSUE_REPORTED' && (
                                <div className="p-6 border-b border-slate-100">
                                    <h3 className="text-base font-semibold text-red-700 mb-3">Issue Reported</h3>
                                    {selectedLead.customerSupport && selectedLead.customerSupport.length > 0 ? (
                                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                            <p className="text-sm text-red-900">{selectedLead.customerSupport[0].issue}</p>
                                            <span className="text-xs font-bold text-red-700 mt-2 inline-block">Status: {selectedLead.customerSupport[0].status}</span>
                                        </div>
                                    ) : <p className="text-sm text-slate-500">No issue details were provided.</p>}
                                </div>
                            )}

                            {/* Section 1: Already Assigned Professionals */}
                            {selectedLead.assignments && selectedLead.assignments.length > 0 && (
                                <div className="p-6 border-b border-slate-100">
                                    <h3 className="text-base font-semibold text-slate-800 mb-4">Assigned Professionals</h3>
                                    <div className="space-y-2">
                                        {selectedLead.assignments.map((assignment) => (
                                            <div key={assignment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-sm text-slate-800">{assignment.professional.name || assignment.professional.email}</p>
                                                    <p className="text-xs text-slate-500">{assignment.professional.professionalProfile?.companyName || 'Individual'}</p>
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${assignment.status === 'ACCEPTED' ? 'text-green-700 bg-green-100' :
                                                        assignment.status === 'REJECTED' ? 'text-red-700 bg-red-100' :
                                                            'text-yellow-700 bg-yellow-100'
                                                    }`}>
                                                    {assignment.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Section 2: Assign / Re-assign Professionals */}
                            <div className="p-6">
                                <h3 className="text-base font-semibold text-slate-800 mb-4">Find & Assign Professionals</h3>
                                <div className="relative mb-4">
                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search professionals..."
                                        value={professionalSearchTerm}
                                        onChange={(e) => setProfessionalSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {isLoadingProfessionals ? (
                                    <div className="flex justify-center items-center py-10"><Loader2 size={24} className="animate-spin text-blue-600" /></div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredProfessionals.length > 0 ? filteredProfessionals.map((prof) => {
                                            const assignment = selectedLead.assignments.find(a => a.professional.id === prof.id);
                                            const buttonAction = assignment?.status === 'REJECTED' ? 'Re-assign' : 'Assign';
                                            const canAssign = !assignment || assignment.status === 'REJECTED';

                                            return (
                                                <div key={prof.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <p className="font-medium text-sm text-slate-800">{prof.name || prof.email}</p>
                                                        <p className="text-xs text-slate-500">{prof.professionalProfile?.companyName || 'Individual'}</p>
                                                    </div>
                                                    {canAssign ? (
                                                        <button
                                                            onClick={() => handleAssignLead(prof.id)}
                                                            disabled={isAssigning === prof.id}
                                                            className={`px-3 py-1.5 text-xs font-semibold cursor-pointer rounded-md flex items-center transition-colors ${buttonAction === 'Re-assign'
                                                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                                                } disabled:opacity-50`}
                                                        >
                                                            {isAssigning === prof.id ? <Loader2 size={14} className="animate-spin mr-1" /> : (buttonAction === 'Re-assign' ? <Check size={14} className="mr-1" /> : <Check size={14} className="mr-1" />)}
                                                            {buttonAction}
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs font-bold text-green-700">ASSIGNED</span>
                                                    )}
                                                </div>
                                            );
                                        }) : <p className="text-center text-sm text-slate-500 py-5">No available professionals found.</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </aside>

            {/* Backdrop overlay */}
            {isPanelOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-10 transition-opacity duration-300"
                    onClick={closePanel}
                />
            )}
        </div>
    );
}