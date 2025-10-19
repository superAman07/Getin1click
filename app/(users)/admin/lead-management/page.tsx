'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Loader2, Search, Filter, X, ChevronDown,
  Users, Briefcase, MapPin, Clock, User,
  Check, AlertCircle, ChevronRight, Star,
  Phone, Mail, RefreshCw,
  DollarSign
} from 'lucide-react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

// Accordion components
const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={className}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={`flex flex-1 items-center justify-between font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 ${className}`}
      {...props}
    >
      {children}
      <ChevronDown
        className="h-4 w-4 shrink-0 transition-transform duration-200"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={className}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

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
    <div className="h-screen overflow-hidden bg-slate-50">
      {/* Main Content: Leads List and Filters */}
      <main className='h-full overflow-y-auto pb-24'>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Lead Management</h1>
            <p className="text-slate-600 mt-2">Assign leads to professionals and track their status</p>
          </div>
          {/* <div className="flex justify-between items-center mb-8">
                    </div> */}

          {/* Search and Filter Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
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
      <aside className={`fixed inset-y-0 right-0 w-full md:max-w-lg bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedLead && (

          <div className="h-full flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
              <div>
                <h2 className="font-bold text-slate-800 text-lg">Lead Details</h2>
                <p className="text-sm text-slate-500 truncate">
                  {selectedLead.title}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsPanelOpen(false);
                  setTimeout(() => setSelectedLead(null), 300);
                }}
                className="p-2 text-slate-500 hover:text-slate-700 cursor-pointer rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Panel Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-0">
              {/* Content sections in collapsible accordions */}
              <Accordion type="single" collapsible defaultValue="details" className="w-full">
                {/* Lead Details Section */}
                <AccordionItem value="details">
                  <AccordionTrigger className="px-6 py-4 border-b cursor-pointer text-slate-800 hover:bg-slate-50">
                    Lead & Customer Details
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-slate-50 space-y-4">
                    {/* Lead Details */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Lead Information</h4>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <Briefcase size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-800">{selectedLead.service.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-800">{selectedLead.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-800">{selectedLead.budget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-800">{selectedLead.urgency}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Customer Information</h4>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-800">
                            {selectedLead.customer.name || selectedLead.customer.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-600">{selectedLead.customer.email}</span>
                        </div>
                        {selectedLead.customer.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-slate-400" />
                            <span className="text-sm text-slate-600">{selectedLead.customer.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Feedback Section (Only shows when applicable) */}
                {selectedLead.status === 'COMPLETED' && selectedLead.reviews && selectedLead.reviews.length > 0 && (
                  <AccordionItem value="feedback">
                    <AccordionTrigger className="px-6 py-4 cursor-pointer border-b text-green-700 hover:bg-green-50">
                      Customer Feedback
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 bg-green-50">
                      {selectedLead.reviews.map((review, index) => (
                        <div key={index} className="p-3 mb-2 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm text-green-800">
                              {review.professional.name || review.professional.email}
                            </span>
                            <div className="flex items-center text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-slate-700 italic">"{review.comment || 'No comment provided.'}"</p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Issue Section (Only shows when applicable) */}
                {selectedLead.status === 'ISSUE_REPORTED' && selectedLead.customerSupport && selectedLead.customerSupport.length > 0 && (
                  <AccordionItem value="issue">
                    <AccordionTrigger className="px-6 py-4 cursor-pointer border-b text-red-700 hover:bg-red-50">
                      Reported Issue
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 bg-red-50">
                      <div className="p-3 bg-white rounded-lg border border-red-200">
                        <p className="text-sm text-slate-700">{selectedLead.customerSupport[0].issue}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                          Status: {selectedLead.customerSupport[0].status}
                        </span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Assigned Professionals */}
                <AccordionItem value="assigned">
                  <AccordionTrigger className="px-6 py-4 cursor-pointer border-b text-slate-800 hover:bg-slate-50">
                    Assigned Professionals ({selectedLead.assignments?.length || 0})
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4">
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedLead.assignments && selectedLead.assignments.length > 0 ? (
                        selectedLead.assignments.map((assignment) => (
                          <div key={assignment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:bg-slate-50">
                            <div>
                              <p className="font-medium text-sm text-slate-800">{assignment.professional.name || assignment.professional.email}</p>
                              {assignment.professional.professionalProfile?.phoneNumber && (
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                  <Phone size={12} />
                                  {assignment.professional.professionalProfile.phoneNumber}
                                </p>
                              )}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${assignment.status === 'ACCEPTED' ? 'text-green-700 bg-green-100' :
                                assignment.status === 'REJECTED' ? 'text-red-700 bg-red-100' :
                                  'text-yellow-700 bg-yellow-100'
                              }`}>
                              {assignment.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-sm text-slate-500 py-4">No professionals assigned yet</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Find & Assign Professionals Section */}
              <div className="p-6 border-t border-slate-200">
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

                {/* Professionals List - Scrollable */}
                <div className="max-h-64 overflow-y-auto pr-1">
                  {isLoadingProfessionals ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 size={24} className="animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="space-y-2">
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
                                {isAssigning === prof.id ? <Loader2 size={14} className="animate-spin mr-1" /> : (buttonAction === 'Re-assign' ? <RefreshCw size={14} className="mr-1" /> : <Check size={14} className="mr-1" />)}
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
            </div>
          </div>
        )}
      </aside>

      {/* Backdrop overlay */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-10 backdrop-blur-[2px] z-30"
          onClick={() => {
            setIsPanelOpen(false);
            setTimeout(() => setSelectedLead(null), 300);
          }}
        />
      )}
    </div>
  );
}