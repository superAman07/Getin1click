'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
    Search,
    Filter,
    Eye,
    Mail,
    Calendar,
    Briefcase,
    AlertTriangle,
    X,
    ChevronDown,
    Users,
    Loader2
} from 'lucide-react';

interface CustomerSummary {
    id: string;
    name: string | null;
    email: string;
    status: string;
    createdAt: string;
    _count: {
        postedLeads: number;
    };
}

interface CustomerDetails extends CustomerSummary {
    postedLeads: {
        id: string;
        title: string;
        status: string;
        createdAt: string;
        service: { name: string };
    }[];
}

export default function ManageCustomersPage() {
    const [customers, setCustomers] = useState<CustomerSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/admin/customers');
            setCustomers(response.data);
        } catch (error) {
            toast.error('Failed to fetch customers.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleViewDetails = async (customerId: string) => {
        setIsUpdating(true);
        try {
            const response = await axios.get(`/api/admin/customers/${customerId}`);
            setSelectedCustomer(response.data);
            setIsDetailsModalOpen(true);
        } catch (error) {
            toast.error('Failed to fetch customer details.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateStatus = async (customerId: string, newStatus: string) => {
        const toastId = toast.loading('Updating status...');
        try {
            await axios.put(`/api/admin/customers/${customerId}`, { status: newStatus });
            toast.success('Status updated successfully.', { id: toastId });
            fetchCustomers();
            if (selectedCustomer?.id === customerId) {
                handleViewDetails(customerId);
            }
        } catch (error) {
            toast.error('Failed to update status.', { id: toastId });
        }
    };

    const handleDeleteCustomer = async (customerId: string) => {
        if (!window.confirm('Are you sure you want to permanently delete this customer and all their jobs? This action cannot be undone.')) {
            return;
        }
        const toastId = toast.loading('Deleting customer...');
        try {
            await axios.delete(`/api/admin/customers/${customerId}`);
            toast.success('Customer deleted successfully.', { id: toastId });
            setIsDetailsModalOpen(false);
            fetchCustomers();
        } catch (error) {
            toast.error('Failed to delete customer.', { id: toastId });
        }
    };

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch =
            customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || customer.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'SUSPENDED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                            <Users className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900">Manage Customers</h1>
                    </div>
                    <p className="text-slate-600 ml-16">View and manage all customer accounts and their activities</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-900 placeholder-slate-400"
                                />
                            </div>

                            <div className="relative sm:w-64">
                                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full pl-12 pr-10 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-900 appearance-none cursor-pointer"
                                >
                                    <option value="ALL">All Statuses</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="SUSPENDED">Suspended</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="p-8">
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="animate-pulse flex gap-4 p-4 bg-slate-50 rounded-xl">
                                            <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
                                            <div className="flex-1 space-y-3">
                                                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                                            </div>
                                            <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : filteredCustomers.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                                    <Users className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No customers found</h3>
                                <p className="text-slate-500">
                                    {searchTerm || statusFilter !== 'ALL'
                                        ? 'Try adjusting your search or filters'
                                        : 'No customers have been registered yet'}
                                </p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Jobs Posted
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Joined Date
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredCustomers.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className="hover:bg-slate-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                                                        {customer.name?.[0]?.toUpperCase() || customer.email[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">
                                                            {customer.name || 'Unnamed User'}
                                                        </div>
                                                        <div className="text-sm text-slate-500 flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />
                                                            {customer.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(customer.status)}`}>
                                                    {customer.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <Briefcase className="w-4 h-4 text-slate-400" />
                                                    <span className="font-medium">{customer._count.postedLeads}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-600 text-sm">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    {formatDate(customer.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleViewDetails(customer.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md cursor-pointer"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {isDetailsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-end">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsDetailsModalOpen(false)}
                    ></div>

                    <div className="relative h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto">
                        {isUpdating ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        ) : selectedCustomer ? (
                            <div className="flex flex-col h-full">
                                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                                                {selectedCustomer.name?.[0]?.toUpperCase() || selectedCustomer.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold">{selectedCustomer.name || 'Unnamed User'}</h2>
                                                <p className="text-blue-100 flex items-center gap-2 mt-1">
                                                    <Mail className="w-4 h-4" />
                                                    {selectedCustomer.email}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsDetailsModalOpen(false)}
                                            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 cursor-pointer"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 p-6 space-y-6">
                                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-blue-600" />
                                            Customer Information
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                                <span className="text-slate-600 font-medium">Name:</span>
                                                <span className="text-slate-900 font-semibold">{selectedCustomer.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                                <span className="text-slate-600 font-medium">Email:</span>
                                                <span className="text-slate-900 font-semibold">{selectedCustomer.email}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                                <span className="text-slate-600 font-medium">Status:</span>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(selectedCustomer.status)}`}>
                                                    {selectedCustomer.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-slate-600 font-medium">Joined Date:</span>
                                                <span className="text-slate-900 font-semibold">{formatDate(selectedCustomer.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-200">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-blue-600" />
                                            Jobs Posted ({selectedCustomer.postedLeads.length})
                                        </h3>
                                        {selectedCustomer.postedLeads.length === 0 ? (
                                            <div className="text-center py-8">
                                                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-3">
                                                    <Briefcase className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <p className="text-slate-500">No jobs posted yet</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {selectedCustomer.postedLeads.map((lead) => (
                                                    <div key={lead.id} className="bg-white rounded-lg p-4 border border-slate-200 hover:border-blue-300 transition-colors duration-200">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h4 className="font-semibold text-slate-900 flex-1">{lead.title}</h4>
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border ${getStatusBadgeClass(lead.status)}`}>
                                                                {lead.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-slate-600">
                                                            <span className="flex items-center gap-1">
                                                                <Briefcase className="w-3 h-3" />
                                                                {lead.service.name}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {formatDate(lead.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4">Account Management</h3>

                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Update Status
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={selectedCustomer.status}
                                                    onChange={(e) => handleUpdateStatus(selectedCustomer.id, e.target.value)}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-900 appearance-none cursor-pointer"
                                                >
                                                    <option value="ACTIVE">Active</option>
                                                    <option value="SUSPENDED">Suspended</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t-2 border-red-200">
                                            <div className="flex items-start gap-3 mb-4">
                                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="text-sm font-bold text-red-900 mb-1">Danger Zone</h4>
                                                    <p className="text-sm text-red-700">
                                                        Permanently delete this customer and all their data. This action cannot be undone.
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                                                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-semibold shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                <AlertTriangle className="w-4 h-4" />
                                                Delete Customer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}
