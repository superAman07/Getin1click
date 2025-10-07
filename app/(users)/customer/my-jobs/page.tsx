'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Edit, Trash2, Plus, X, MoreVertical, Users, Briefcase, MapPin, DollarSign, Clock, AlertCircle } from 'lucide-react';
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

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/customer/leads');
            setLeads(response.data);
        } catch (error) {
            toast.error('Failed to load your jobs.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (activeMenu && !(e.target as Element).closest('.menu-container')) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [activeMenu]);

    const handleDelete = async (leadId: string) => {
        const toastId = toast.loading('Deleting job...');
        try {
            await axios.delete(`/api/customer/leads/${leadId}`);
            toast.success('Job deleted successfully', { id: toastId });
            setDeleteConfirm(null);
            setActiveMenu(null);
            fetchLeads();
        } catch (error) {
            toast.error('Failed to delete job', { id: toastId });
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
            fetchLeads();
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
            <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 min-h-screen">
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
                                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                                                lead.status === 'OPEN'
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
                                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={editingLead.location}
                                        onChange={e => setEditingLead({ ...editingLead, location: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                                        placeholder="City, State"
                                        required
                                    />
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
