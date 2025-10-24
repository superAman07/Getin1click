'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Edit, Trash2, Plus, X, MoreVertical, Users, Briefcase, MapPin, DollarSign, Clock, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface Lead {
    id: string;
    title: string;
    description: string;
    location: string;
    budget: string;
    urgency: string;
    status: string;
    createdAt: string;
    service: { name: string };
    _count: { purchasedBy: number };
}

const JobCardSkeleton = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <div className="h-6 w-3/4 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
        </div>
        <div className="mt-5 pt-5 border-t border-gray-100 flex gap-4">
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-28 bg-gray-200 rounded-lg"></div>
            <div className="h-6 w-24 bg-gray-200 rounded-lg"></div>
        </div>
    </div>
);

export default function MyJobsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const [feedbackModal, setFeedbackModal] = useState<{ isOpen: boolean; leadId: string | null; isPositive: boolean }>({
        isOpen: false,
        leadId: null,
        isPositive: false
    });
    const [rating, setRating] = useState<number>(5);
    const [feedback, setFeedback] = useState<string>("");
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const jobsPerPage = 5;

    const handleJobStatusUpdate = (lead: Lead, isCompleted: boolean) => {
        setFeedbackModal({
            isOpen: true,
            leadId: lead.id,
            isPositive: isCompleted
        });
        setRating(5);
        setFeedback("");
    };

    const handleSubmitFeedback = async () => {
        if (!feedbackModal.leadId) return;

        setIsSubmittingFeedback(true);
        const toastId = toast.loading(feedbackModal.isPositive ? "Marking job as completed..." : "Reporting issue...");

        try {
            await axios.put(`/api/customer/leads/${feedbackModal.leadId}/status`, {
                status: feedbackModal.isPositive ? 'COMPLETED' : 'ISSUE_REPORTED',
                rating: feedbackModal.isPositive ? rating : null,
                feedback
            });

            // Update leads in the UI
            setLeads(prevLeads => prevLeads.map(lead => {
                if (lead.id === feedbackModal.leadId) {
                    return {
                        ...lead,
                        status: feedbackModal.isPositive ? 'COMPLETED' : 'ISSUE_REPORTED'
                    };
                }
                return lead;
            }));

            toast.success(
                feedbackModal.isPositive
                    ? "Job marked as completed! Thank you for your feedback."
                    : "Issue reported. We'll look into it.",
                { id: toastId }
            );
            setFeedbackModal({ isOpen: false, leadId: null, isPositive: false });
        } catch (error) {
            toast.error("Failed to update job status.", { id: toastId });
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const normalizeUrgency = (urgency: string): string => {
        const lowerCase = urgency.toLowerCase();
        return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
    };

    const fetchLeads = useCallback(async (page: number) => {
        setLoading(true);
        try {
            // const response = await axios.get('/api/customer/leads');
            // const normalizedLeads = response.data.map((lead: any) => ({
            //     ...lead,
            //     urgency: normalizeUrgency(lead.urgency)
            // }));
            // setLeads(normalizedLeads);
            const response = await axios.get(`/api/customer/leads?page=${page}&limit=${jobsPerPage}`);
            const { leads: fetchedLeads, totalLeads } = response.data;

            const normalizedLeads = fetchedLeads.map((lead: any) => ({
                ...lead,
                urgency: normalizeUrgency(lead.urgency)
            }));

            setLeads(normalizedLeads);
            setTotalPages(Math.ceil(totalLeads / jobsPerPage));
        } catch (error) {
            toast.error('Failed to load your jobs.');
        } finally {
            setLoading(false);
        }
    }, []);

    // useEffect(() => {
    //     fetchLeads();
    // }, [fetchLeads]);
    useEffect(() => {
        fetchLeads(currentPage);
    }, [currentPage, fetchLeads]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (activeMenu && !(e.target as Element).closest('.menu-container')) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [activeMenu]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingLead) return;
        setIsSubmitting(true);
        try {
            await axios.put(`/api/customer/leads/${editingLead.id}`, {
                title: editingLead.title,
                description: editingLead.description,
                budget: editingLead.budget,
                urgency: editingLead.urgency,
            });
            toast.success('Job updated successfully!');
            setEditingLead(null);
            fetchLeads(currentPage);
        } catch (error) {
            toast.error('Failed to update job.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (leadId: string) => {
        const toastId = toast.loading('Deleting job...');
        try {
            await axios.delete(`/api/customer/leads/${leadId}`);
            toast.success('Job deleted successfully', { id: toastId });
            setDeleteConfirm(null);
            setActiveMenu(null);
            fetchLeads(currentPage);
        } catch (error) {
            toast.error('Failed to delete job', { id: toastId });
        }
    };

    const handleModalPincodeChange = async (newPincode: string) => {
        if (!editingLead) return;
        const currentLocationName = editingLead.location.split(', ')[1] || '';
        setEditingLead({ ...editingLead, location: `${newPincode}, ${currentLocationName}` });

        if (newPincode.length === 6) {
            try {
                const res = await axios.get(`https://api.postalpincode.in/pincode/${newPincode}`);
                if (res.data && res.data[0].Status === 'Success') {
                    const postOffice = res.data[0].PostOffice[0];
                    const locationName = `${postOffice.District}, ${postOffice.State}`;
                    setEditingLead({ ...editingLead, location: `${newPincode}, ${locationName}` });
                } else {
                    setEditingLead({ ...editingLead, location: `${newPincode}, Invalid Pincode` });
                }
            } catch (error) {
                setEditingLead({ ...editingLead, location: `${newPincode}, Could not verify` });
            }
        }
    };

    const handleEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingLead) return;
        setIsSubmitting(true);
        const toastId = toast.loading('Saving changes...');
        try {
            await axios.put(`/api/customer/leads/${editingLead.id}`, editingLead);
            toast.success('Job updated successfully', { id: toastId });
            setEditingLead(null);
            fetchLeads(currentPage);
        } catch (error) {
            toast.error('Failed to update job', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getUrgencyColor = (urgency: string) => {
        const colors = {
            'Low': 'bg-blue-50 text-blue-700 border-blue-200',
            'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'High': 'bg-orange-50 text-orange-700 border-orange-200',
            'Urgent': 'bg-red-50 text-red-700 border-red-200'
        };
        return colors[urgency as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    return (
        <>
            <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 min-h-screen mt-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                                My Posted Jobs
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600">
                                Manage your active and past job requests
                            </p>
                        </div>
                        <Link
                            href="/customer/post-a-job"
                            className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 cursor-pointer font-semibold"
                        >
                            <Plus size={20} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>Post New Job</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-5">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    style={{
                                        animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`
                                    }}
                                >
                                    <JobCardSkeleton />
                                </div>
                            ))}
                        </div>
                    ) : leads.length === 0 ? (
                        <div
                            className="text-center py-20 sm:py-28"
                            style={{ animation: 'fadeInUp 0.5s ease-out' }}
                        >
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 mb-6 shadow-inner">
                                <Briefcase size={40} className="text-blue-600" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                                No jobs posted yet
                            </h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                                Ready to find a professional? Post your first job today and get matched with qualified experts.
                            </p>
                            <Link
                                href="/customer/post-a-job"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 cursor-pointer font-semibold text-lg"
                            >
                                <Plus size={22} strokeWidth={2.5} />
                                <span>Post Your First Job</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {leads.map((lead, index) => (
                                <div
                                    key={lead.id}
                                    className="group bg-white p-6 sm:p-7 rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1.5 transition-all duration-300 cursor-default"
                                    style={{
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-3 mb-3">
                                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words flex-1 group-hover:text-blue-600 transition-colors duration-300">
                                                    {lead.title}
                                                </h2>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
                                                <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                                                    {lead.service.name}
                                                </span>
                                                <span className="text-gray-400">•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    Posted {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed line-clamp-2">
                                                {lead.description}
                                            </p>
                                            {lead._count.purchasedBy > 0 && (
                                                <div className="mt-4 border-t border-gray-100 pt-4">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className="text-sm font-medium text-gray-700">Professional response{lead._count.purchasedBy !== 1 ? 's' : ''}: </span>
                                                            <span className="font-semibold text-blue-700">{lead._count.purchasedBy}</span>
                                                        </div>

                                                        {lead.status === 'ASSIGNED' && (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleJobStatusUpdate(lead, true)}
                                                                    className="px-3 py-1.5 bg-green-100 text-green-700 cursor-pointer border border-green-200 hover:bg-green-200 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
                                                                >
                                                                    <CheckCircle2 size={16} />
                                                                    Mark Complete
                                                                </button>
                                                                <button
                                                                    onClick={() => handleJobStatusUpdate(lead, false)}
                                                                    className="px-3 py-1.5 bg-red-50 text-red-700 border cursor-pointer border-red-200 hover:bg-red-100 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
                                                                >
                                                                    <AlertCircle size={16} />
                                                                    Report Issue
                                                                </button>
                                                            </div>
                                                        )}

                                                        {lead.status === 'COMPLETED' && (
                                                            <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                                                                <CheckCircle2 size={16} />
                                                                <span className="text-sm font-medium">Completed</span>
                                                            </div>
                                                        )}

                                                        {lead.status === 'ISSUE_REPORTED' && (
                                                            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                                                                <AlertCircle size={16} />
                                                                <span className="text-sm font-medium">Issue Reported</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {lead._count.purchasedBy > 0 && (() => {
                                                switch (lead.status) {
                                                    case 'COMPLETED':
                                                        return (
                                                            <div className="mt-3 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                                        <CheckCircle2 size={18} className="text-green-600" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium text-green-800">Job Completed</div>
                                                                        <div className="text-xs text-green-600">Thank you for your feedback!</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    case 'ISSUE_REPORTED':
                                                        return (
                                                            <div className="mt-3 bg-gradient-to-r from-amber-50 to-red-50 border border-amber-200 rounded-lg p-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                                                        <AlertCircle size={18} className="text-amber-600" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium text-amber-800">Issue Reported</div>
                                                                        <div className="text-xs text-amber-600">Our support team will review this shortly.</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    case 'ASSIGNED':
                                                        return (
                                                            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                        <Users size={18} className="text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium text-blue-800">Professional will contact you soon</div>
                                                                        <div className="text-xs text-blue-600">{lead._count.purchasedBy} professional ready to help</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    default:
                                                        return null;
                                                }
                                            })()}
                                        </div>

                                        <div className="relative menu-container flex-shrink-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenu(activeMenu === lead.id ? null : lead.id);
                                                }}
                                                className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer hover:scale-110"
                                                aria-label="More options"
                                            >
                                                <MoreVertical size={20} className="text-gray-600" />
                                            </button>

                                            {activeMenu === lead.id && (
                                                <div
                                                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden"
                                                    style={{
                                                        animation: 'menuFadeIn 0.2s ease-out'
                                                    }}
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setEditingLead(lead);
                                                            setActiveMenu(null);
                                                        }}
                                                        className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 cursor-pointer"
                                                    >
                                                        <Edit size={16} />
                                                        <span>Edit Job</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setDeleteConfirm(lead.id);
                                                            setActiveMenu(null);
                                                        }}
                                                        className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer border-t border-gray-100"
                                                    >
                                                        <Trash2 size={16} />
                                                        <span>Delete Job</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center gap-3">
                                        <span
                                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${lead.status === 'OPEN'
                                                ? 'bg-green-100 text-green-800 border border-green-200'
                                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                                                }`}
                                        >
                                            {lead.status}
                                        </span>
                                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-3.5 py-1.5 rounded-lg border border-gray-200">
                                            <Users size={16} className="text-gray-600" />
                                            <span className="font-bold text-gray-900">{lead._count.purchasedBy}</span>
                                            <span className="hidden sm:inline">Response{lead._count.purchasedBy !== 1 ? 's' : ''}</span>
                                            <span className="sm:hidden">Resp.</span>
                                        </span>
                                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-3.5 py-1.5 rounded-lg border border-gray-200">
                                            <MapPin size={16} className="text-gray-600" />
                                            <span>{lead.location}</span>
                                        </span>
                                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-3.5 py-1.5 rounded-lg border border-gray-200">
                                            <DollarSign size={16} className="text-gray-600" />
                                            <span>{lead.budget}</span>
                                        </span>
                                        <span className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border ${getUrgencyColor(lead.urgency)}`}>
                                            <AlertCircle size={14} />
                                            <span>{lead.urgency}</span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {totalPages > 0 && (
                        <div className="mt-10 flex justify-center items-center gap-4">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {editingLead && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-start sm:items-center p-4 z-50 overflow-y-auto"
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                    onClick={() => setEditingLead(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8"
                        style={{ animation: 'slideUpFadeIn 0.3s ease-out' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Edit Job</h3>
                                <p className="text-sm text-gray-600 mt-1">Update your job details</p>
                            </div>
                            <button
                                onClick={() => setEditingLead(null)}
                                className="p-2 rounded-xl hover:bg-white transition-all duration-200 cursor-pointer hover:scale-110"
                                aria-label="Close"
                            >
                                <X size={22} className="text-gray-600" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSave} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    value={editingLead.title}
                                    onChange={e => setEditingLead({ ...editingLead, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                                    placeholder="e.g., Kitchen Renovation"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={editingLead.description}
                                    onChange={e => setEditingLead({ ...editingLead, description: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                    placeholder="Describe what you need..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Location
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={editingLead.location.split(',')[0].trim()}
                                        onChange={e => handleModalPincodeChange(e.target.value)}
                                        maxLength={6}
                                        className="w-full mt-1 p-2 border rounded"
                                        required
                                    />
                                    <p className="text-xs mt-1 text-gray-500">{editingLead.location.split(', ').slice(1).join(', ')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Budget
                                    </label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={editingLead.budget}
                                            onChange={e => setEditingLead({ ...editingLead, budget: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                                            placeholder="e.g., $5,000 - $10,000"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Urgency
                                    </label>
                                    <div className="relative">
                                        <AlertCircle size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                                        <select
                                            value={editingLead.urgency}
                                            onChange={e => setEditingLead({ ...editingLead, urgency: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer font-medium appearance-none bg-white"
                                            required
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Urgent">Urgent</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingLead(null)}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center gap-2 disabled:from-blue-400 disabled:to-blue-500 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold cursor-pointer shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
                                >
                                    {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                                    <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center p-4 z-50"
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                    onClick={() => setDeleteConfirm(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                        style={{ animation: 'slideUpFadeIn 0.3s ease-out' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash2 size={26} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Delete Job</h3>
                                <p className="text-sm text-gray-600">
                                    Are you sure you want to delete this job? This action cannot be undone and all responses will be lost.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold cursor-pointer shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40"
                            >
                                Delete Job
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {feedbackModal.isOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-150 relative">
                        <button
                            onClick={() => setFeedbackModal({ isOpen: false, leadId: null, isPositive: false })}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6">
                            <div className="text-center mb-6">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${feedbackModal.isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {feedbackModal.isPositive ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {feedbackModal.isPositive ? 'Confirm Job Completion' : 'Report an Issue'}
                                </h3>
                                <p className="text-gray-600 mt-1">
                                    {feedbackModal.isPositive
                                        ? 'Did the professional successfully complete the job?'
                                        : 'Please let us know what went wrong'}
                                </p>
                            </div>

                            {feedbackModal.isPositive && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate the service</label>
                                    <div className="flex justify-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                                            >
                                                <span className={star <= rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {feedbackModal.isPositive ? 'Leave feedback (optional)' : 'Describe the issue'}
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={feedbackModal.isPositive
                                        ? "Share your experience with the professional..."
                                        : "Please describe what went wrong..."}
                                    required={!feedbackModal.isPositive}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmitFeedback}
                                    disabled={isSubmittingFeedback || (!feedbackModal.isPositive && !feedback.trim())}
                                    className={`flex-1 py-3 font-medium cursor-pointer rounded-lg flex items-center justify-center gap-2 ${feedbackModal.isPositive
                                        ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400'
                                        : 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400'
                                        } disabled:cursor-not-allowed`}
                                >
                                    {isSubmittingFeedback && <Loader2 size={18} className="animate-spin" />}
                                    {feedbackModal.isPositive ? 'Confirm Completion' : 'Submit Report'}
                                </button>
                                <button
                                    onClick={() => setFeedbackModal({ isOpen: false, leadId: null, isPositive: false })}
                                    disabled={isSubmittingFeedback}
                                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer font-medium rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUpFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes menuFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-12px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </>
    );
}
