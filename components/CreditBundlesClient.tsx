'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Loader2 } from 'lucide-react';

// Define the type for a credit bundle based on our schema
interface CreditBundle {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    credits: number;
    isActive: boolean;
}

const CreditBundlesClient: React.FC = () => {
    const [bundles, setBundles] = useState<CreditBundle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBundle, setEditingBundle] = useState<CreditBundle | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        credits: '',
        isActive: true,
    });

    const fetchBundles = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/credit-bundles');
            setBundles(response.data);
        } catch (error) {
            toast.error('Failed to fetch credit bundles.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBundles();
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
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBundle(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
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
            toast.error('An error occurred.', { id: toastId });
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this bundle?')) {
            const toastId = toast.loading('Deleting bundle...');
            try {
                await axios.delete(`/api/admin/credit-bundles/${id}`);
                toast.success('Bundle deleted.', { id: toastId });
                fetchBundles();
            } catch (error) {
                toast.error('Failed to delete bundle.', { id: toastId });
            }
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl">All Bundles</h2>
                <button onClick={() => handleOpenModal()} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
                    <Plus size={18} /> Add New Bundle
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center p-8">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Price</th>
                            <th className="text-left p-2">Credits</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bundles.map((bundle) => (
                            <tr key={bundle.id} className="border-b">
                                <td className="p-2">{bundle.name}</td>
                                <td className="p-2">₹{bundle.price}</td>
                                <td className="p-2">{bundle.credits}</td>
                                <td className="p-2">{bundle.isActive ? 'Active' : 'Inactive'}</td>
                                <td className="p-2">
                                    <button onClick={() => handleOpenModal(bundle)} className="text-blue-500 mr-2">Edit</button>
                                    <button onClick={() => handleDelete(bundle.id)} className="text-red-500">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">{editingBundle ? 'Edit' : 'Create'} Bundle</h3>
                        <form onSubmit={handleSave}>
                            <div className="mb-4">
                                <label className="block mb-1">Name</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded"></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Price (INR)</label>
                                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full p-2 border rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Credits</label>
                                <input type="number" value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: e.target.value })} className="w-full p-2 border rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="mr-2" />
                                    Active
                                </label>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={handleCloseModal} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreditBundlesClient;