'use client'

import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Loader2, Home, ChevronRight, Grid3x3, Search, Filter, MoreVertical, Calendar, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Link from 'next/link';

interface Category {
    id: string;
    name: string;
    description: string | null;
    createdAt?: string;
    servicesCount?: number;
    _count?: {
        services: number
    }
}

const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
                <div className="w-8 h-8 bg-slate-200 rounded-lg" />
            </div>
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="h-4 bg-slate-200 rounded w-20" />
                <div className="flex gap-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                    <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

const CategoryCard: React.FC<{
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}> = ({ category, onEdit, onDelete }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <Tag className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 text-lg truncate group-hover:text-cyan-600 transition-colors">
                                    {category.name}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10 animate-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={() => {
                                        onEdit(category);
                                        setShowDropdown(false);
                                    }}
                                    className="w-full px-4 py-3 text-left cursor-pointer text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors first:rounded-t-lg"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Category
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete(category.id);
                                        setShowDropdown(false);
                                    }}
                                    className="w-full px-4 py-3 text-left cursor-pointer text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors last:rounded-b-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Category
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {category.description || 'No description provided for this category.'}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        {category.createdAt && (
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                            </div>
                        )}
                        {category.servicesCount !== undefined && (
                            <div className="flex items-center gap-1">
                                <Grid3x3 className="w-3 h-3" />
                                <span>{category.servicesCount} services</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onEdit(category)}
                            className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 cursor-pointer rounded-lg transition-all duration-200"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(category.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-all duration-200"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Breadcrumb: React.FC = () => {
    return (
        <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6">
            <Home className="w-4 h-4" />
            <Link href="/admin/dashboard" className="hover:text-slate-900 cursor-pointer transition-colors">
                <span className="hover:text-slate-900 cursor-pointer transition-colors">Dashboard</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-medium">Categories</span>
        </nav>
    );
};

export default function ManageCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/admin/categories');
            const enhancedCategories = response.data.map((cat: Category) => ({
                ...cat,
                createdAt: cat.createdAt || new Date().toISOString(),
                servicesCount: cat._count?.services || 0,
            }));
            setCategories(enhancedCategories);
        } catch (error) {
            toast.error('Could not fetch categories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openModal = (category: Category | null = null) => {
        if (category) {
            setIsEditing(category);
            setCategoryName(category.name);
            setCategoryDescription(category.description || '');
        } else {
            setIsEditing(null);
            setCategoryName('');
            setCategoryDescription('');
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading(isEditing ? 'Updating category...' : 'Creating category...');

        const url = isEditing ? `/api/admin/categories/${isEditing.id}` : '/api/admin/categories';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            if (method === "POST") {
                const response = await axios.post(url, { name: categoryName, description: categoryDescription });
                if (response.status !== 201) {
                    throw new Error('Failed to create category');
                }
            } else if (method === "PUT") {
                const response = await axios.put(url, { name: categoryName, description: categoryDescription });
                if (response.status !== 200) {
                    throw new Error('Failed to update category');
                }
            }
            toast.success(`Category ${isEditing ? 'updated' : 'created'}!`, { id: toastId });
            fetchCategories();
            closeModal();
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category? This cannot be undone.')) return;

        const toastId = toast.loading('Deleting category...');
        try {
            const response = await axios.delete(`/api/admin/categories/${id}`);
            if (response.status !== 204) {
                toast.error(response.data.message || 'Failed to delete category', { id: toastId });
                return;
            }
            toast.success('Category deleted.', { id: toastId });
            fetchCategories();
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <Breadcrumb />
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Categories</h1>
                        <p className="text-slate-600">Organize your services with custom categories</p>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer px-6 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-200 hover:shadow-lg active:scale-95 self-start lg:self-auto"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Add New Category</span>
                        <span className="sm:hidden">Add Category</span>
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
                        <Filter className="w-5 h-5 text-slate-500" />
                        <span className="text-slate-700">Filter</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Total Categories</p>
                                <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                                <Tag className="w-6 h-6 text-cyan-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Active Services</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {categories.reduce((sum, cat) => sum + (cat.servicesCount || 0), 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Grid3x3 className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Most Popular</p>
                                <p className="text-lg font-bold text-slate-900 truncate">
                                    {categories.length > 0 ? categories[0]?.name : 'N/A'}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">This Month</p>
                                <p className="text-2xl font-bold text-slate-900">+{Math.floor(categories.length * 0.3)}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Plus className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : filteredCategories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCategories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onEdit={openModal}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Tag className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            {searchTerm ? 'No categories found' : 'No categories yet'}
                        </h3>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            {searchTerm
                                ? 'Try adjusting your search terms or create a new category.'
                                : 'Get started by creating your first category to organize your services.'
                            }
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => openModal()}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
                            >
                                Create Your First Category
                            </button>
                        )}
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                    {isEditing ? 'Edit Category' : 'Add New Category'}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Category Name
                                        </label>
                                        <input
                                            type="text"
                                            value={categoryName}
                                            onChange={(e) => setCategoryName(e.target.value)}
                                            placeholder="Enter category name..."
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 group-hover:border-slate-400"
                                            required
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={categoryDescription}
                                            onChange={(e) => setCategoryDescription(e.target.value)}
                                            placeholder="Describe this category (optional)..."
                                            rows={4}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 group-hover:border-slate-400 resize-none"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="flex-1 px-6 py-3 rounded-xl cursor-pointer text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !categoryName.trim()}
                                            className="flex-1 px-6 py-3 rounded-xl cursor-pointer bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-cyan-300 font-medium transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                            {isEditing ? 'Save Changes' : 'Create Category'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}