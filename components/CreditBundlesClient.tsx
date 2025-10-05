'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Loader as Loader2, Package, X, CreditCard as Edit2, Trash2, MoveVertical as MoreVertical, Coins, ArrowRight, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreditBundle {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    credits: number;
    isActive: boolean;
}

interface ConversionRate {
    id?: string;
    rupeesPerCredit: number;
}

export default function CreditBundlesClient() {
    const [bundles, setBundles] = useState<CreditBundle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBundle, setEditingBundle] = useState<CreditBundle | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingRate, setIsUpdatingRate] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        credits: '',
        isActive: true,
    });

    const [conversionRate, setConversionRate] = useState<number>(1);
    const [isEditingRate, setIsEditingRate] = useState(false);
    const [tempRate, setTempRate] = useState<string>('1');
    const [converterRupees, setConverterRupees] = useState<string>('');
    const [converterCredits, setConverterCredits] = useState<string>('');
    const [isConverterExpanded, setIsConverterExpanded] = useState(false);

    const fetchBundles = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/credit-bundles');
            setBundles(response.data);
        } catch (error) {
            toast.error('Failed to fetch credit bundles');
        } finally {
            setLoading(false);
        }
    };

    const fetchConversionRate = async () => {
        try {
            const response = await axios.get('/api/admin/configuration/credit_conversion_rate');
            setConversionRate(response.data.rupeesPerCredit || 1);
            setTempRate(String(response.data.rupeesPerCredit || 1));
        } catch (error) {
            console.log('Using default conversion rate');
        }
    };

    const updateConversionRate = async () => {
        const rate = parseFloat(tempRate);
        if (isNaN(rate) || rate <= 0) {
            toast.error('Please enter a valid conversion rate');
            return;
        }

        setIsUpdatingRate(true);
        const toastId = toast.loading('Updating conversion rate...');

        try {
            await axios.post('/api/admin/configuration/credit_conversion_rate', { rupeesPerCredit: rate });
            setConversionRate(rate);
            setIsEditingRate(false);
            toast.success('Conversion rate updated successfully!', { id: toastId });
        } catch (error) {
            toast.error('Failed to update conversion rate', { id: toastId });
        } finally {
            setIsUpdatingRate(false);
        }
    };

    const handleConvert = (fromRupees: boolean) => {
        if (fromRupees) {
            const rupees = parseFloat(converterRupees);
            if (!isNaN(rupees) && rupees >= 0) {
                const credits = rupees / conversionRate;
                setConverterCredits(credits.toFixed(2));
            }
        } else {
            const credits = parseFloat(converterCredits);
            if (!isNaN(credits) && credits >= 0) {
                const rupees = credits * conversionRate;
                setConverterRupees(rupees.toFixed(2));
            }
        }
    };

    useEffect(() => {
        fetchBundles();
        fetchConversionRate();
    }, []);

    const handleOpenModal = (bundle: CreditBundle | null = null) => {
        setEditingBundle(bundle);
        if (bundle) {
            setFormData({
                name: bundle.name,
                description: bundle.description || '',
                price: String(bundle.price),
                credits: String(bundle.credits),
                isActive: bundle.isActive,
            });
        } else {
            setFormData({ name: '', description: '', price: '', credits: '', isActive: true });
        }
        setIsModalOpen(true);
        setActiveDropdown(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBundle(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSaving(true);
        const toastId = toast.loading(editingBundle ? 'Updating bundle...' : 'Creating bundle...');

        const apiEndpoint = editingBundle
            ? `/api/admin/credit-bundles/${editingBundle.id}`
            : '/api/admin/credit-bundles';
        const apiMethod = editingBundle ? 'put' : 'post';

        try {
            await axios[apiMethod](apiEndpoint, formData);
            toast.success(`Bundle ${editingBundle ? 'updated' : 'created'} successfully!`, { id: toastId });
            handleCloseModal();
            fetchBundles();
        } catch (error) {
            toast.error('An error occurred while saving the bundle', { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const handleFormPriceChange = (price: string) => {
        const priceValue = parseFloat(price);
        if(!isNaN(priceValue) && priceValue >= 0 && conversionRate > 0){
            const newCredits = Math.round(priceValue / conversionRate)
            setFormData ({...formData, price, credits: String(newCredits)});
        }else {
            setFormData ({...formData, price, credits: ''});
        }
    }

    const handleFormCreditsChange = (credits: string) => {
        const creditsValue = parseFloat(credits);
        if(!isNaN(creditsValue) && creditsValue>=0 && conversionRate > 0 ){
            const newPrice = creditsValue * conversionRate;
            setFormData ({...formData, credits, price: String(newPrice)});
        }else {
            setFormData ({...formData, credits, price: ''});
        }
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this bundle?')) {
            setIsDeleting(true);
            const toastId = toast.loading('Deleting bundle...');

            try {
                await axios.delete(`/api/admin/credit-bundles/${id}`);
                toast.success('Bundle deleted successfully', { id: toastId });
                fetchBundles();
            } catch (error) {
                toast.error('Failed to delete bundle', { id: toastId });
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const SkeletonCard = () => (
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            </div>
            <div className="space-y-3 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="flex gap-4 pt-4 border-t border-gray-100">
                <div className="h-10 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-8 sm:py-4">
                <div className="mb-8 sm:mb-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Credit Bundles</h1>
                            <p className="text-gray-600">Manage your credit packages and pricing</p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="cursor-pointer inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Plus size={20} />
                            <span>Add New Bundle</span>
                        </button>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
                        <button
                            onClick={() => setIsConverterExpanded(!isConverterExpanded)}
                            className="cursor-pointer w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2.5">
                                    <Settings size={24} className="text-white" />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-xl font-bold text-gray-900">Credit Converter</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-gray-600">Current Rate:</span>
                                        <span className="text-lg font-bold text-blue-600">₹{conversionRate.toFixed(2)}</span>
                                        <span className="text-sm text-gray-600">per credit</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                    {isConverterExpanded ? 'Collapse' : 'Expand'}
                                </span>
                                {isConverterExpanded ? (
                                    <ChevronUp size={20} className="text-gray-500" />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-500" />
                                )}
                            </div>
                        </button>

                        <div
                            className={`transition-all duration-300 ease-in-out ${
                                isConverterExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                            } overflow-hidden`}
                        >
                            <div className="px-6 pb-6 border-t border-gray-200">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-5 border border-blue-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Coins size={16} className="text-blue-600" />
                                                Update Conversion Rate
                                            </h3>
                                            {!isEditingRate && (
                                                <button
                                                    onClick={() => {
                                                        setIsEditingRate(true);
                                                        setTempRate(String(conversionRate));
                                                    }}
                                                    className="cursor-pointer text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>

                                        {isEditingRate ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-600 whitespace-nowrap">₹</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={tempRate}
                                                        onChange={(e) => setTempRate(e.target.value)}
                                                        disabled={isUpdatingRate}
                                                        className="cursor-text flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                                        placeholder="Enter rate"
                                                    />
                                                    <span className="text-sm text-gray-600 whitespace-nowrap">per credit</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={updateConversionRate}
                                                        disabled={isUpdatingRate}
                                                        className="cursor-pointer flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                    >
                                                        {isUpdatingRate && <Loader2 size={16} className="animate-spin" />}
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsEditingRate(false);
                                                            setTempRate(String(conversionRate));
                                                        }}
                                                        disabled={isUpdatingRate}
                                                        className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-gray-900">₹{conversionRate.toFixed(2)}</span>
                                                <span className="text-gray-600">per credit</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-5 border border-green-200">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                            <ArrowRight size={16} className="text-green-600" />
                                            Calculate Conversion
                                        </h3>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex-1">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={converterRupees}
                                                        onChange={(e) => {
                                                            setConverterRupees(e.target.value);
                                                            setConverterCredits('');
                                                        }}
                                                        className="cursor-text w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                        placeholder="Rupees"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handleConvert(true)}
                                                    className="cursor-pointer px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                                                >
                                                    To Credits
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-center">
                                                <div className="h-px flex-1 bg-gray-300"></div>
                                                <span className="px-3 text-xs text-gray-500 font-medium">OR</span>
                                                <div className="h-px flex-1 bg-gray-300"></div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={converterCredits}
                                                    onChange={(e) => {
                                                        setConverterCredits(e.target.value);
                                                        setConverterRupees('');
                                                    }}
                                                    className="cursor-text flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                    placeholder="Credits"
                                                />
                                                <button
                                                    onClick={() => handleConvert(false)}
                                                    className="cursor-pointer px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                                                >
                                                    To Rupees
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : bundles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
                        <div className="bg-gray-100 rounded-full p-6 mb-6">
                            <Package size={48} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No credit bundles found</h3>
                        <p className="text-gray-600 mb-8 text-center max-w-md">Get started by creating your first credit bundle to offer to your users.</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-600/30"
                        >
                            <Plus size={20} />
                            Add New Bundle
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bundles.map((bundle) => (
                            <div
                                key={bundle.id}
                                className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {bundle.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                bundle.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {bundle.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <div className="relative">
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === bundle.id ? null : bundle.id)}
                                                className="cursor-pointer p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <MoreVertical size={18} className="text-gray-500" />
                                            </button>
                                            {activeDropdown === bundle.id && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() => setActiveDropdown(null)}
                                                    ></div>
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20">
                                                        <button
                                                            onClick={() => handleOpenModal(bundle)}
                                                            className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <Edit2 size={16} />
                                                            Edit Bundle
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(bundle.id)}
                                                            disabled={isDeleting}
                                                            className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete Bundle
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-6 min-h-[3rem]">
                                    {bundle.description || 'No description provided'}
                                </p>

                                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                    <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4">
                                        <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">Price</div>
                                        <div className="text-2xl font-bold text-gray-900">₹{bundle.price.toLocaleString()}</div>
                                    </div>
                                    <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-4">
                                        <div className="text-xs font-semibold text-green-600 mb-1 uppercase tracking-wide flex items-center gap-1">
                                            <Coins size={12} />
                                            Credits
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">{bundle.credits}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {editingBundle ? 'Edit Bundle' : 'Create New Bundle'}
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    disabled={isSaving}
                                    className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Bundle Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={isSaving}
                                        className="cursor-text w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="e.g., Starter Pack"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        disabled={isSaving}
                                        className="cursor-text w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        rows={3}
                                        placeholder="Describe this bundle..."
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Price (₹) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pointer-events-none">₹</span>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => handleFormPriceChange(e.target.value)}
                                                disabled={isSaving}
                                                className="cursor-text w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                placeholder="0"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Credits <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.credits}
                                            onChange={(e) => handleFormCreditsChange(e.target.value)}
                                            disabled={isSaving}
                                            className="cursor-text w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                                            Active Status
                                        </label>
                                        <p className="text-xs text-gray-500">Make this bundle available for purchase</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        disabled={isSaving}
                                        className={`cursor-pointer relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                            formData.isActive ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                                formData.isActive ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        disabled={isSaving}
                                        className="cursor-pointer flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="cursor-pointer flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSaving && <Loader2 size={18} className="animate-spin" />}
                                        {editingBundle ? 'Update' : 'Create'} Bundle
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
