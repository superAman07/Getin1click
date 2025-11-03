'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Package, Coins } from 'lucide-react';

interface CreditBundle {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    credits: number;
}

export default function WalletPage() {
    const [bundles, setBundles] = useState<CreditBundle[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchasingId, setPurchasingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchBundles = async () => {
            try {
                const response = await axios.get('/api/professional/credit-bundles');
                setBundles(response.data.filter((b: any) => b.isActive));
            } catch (error) {
                toast.error('Failed to load credit bundles.');
            } finally {
                setLoading(false);
            }
        };
        fetchBundles();
    }, []);

    const handlePurchase = async (bundleId: string) => {
        setPurchasingId(bundleId);
        const toastId = toast.loading('Redirecting to payment...');
        try {
            const response = await axios.post('/api/professional/wallet/checkout', { bundleId });
            const { paymentUrl } = response.data;

            // Redirect the user to the PhonePe payment page
            window.location.href = paymentUrl;

        } catch (error) {
            toast.error('Could not initiate purchase. Please try again.', { id: toastId });
        } finally {
            setPurchasingId(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" size={48} /></div>;
    }

    return (
        <div className="p-4 sm:p-8">
            <div className="max-w-5xl mx-auto mt-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Wallet</h1>
                <p className="text-gray-600 mb-8">Purchase credits to connect with new customers.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bundles.map(bundle => (
                        <div key={bundle.id} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-2">
                                    <Package className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-xl font-bold text-gray-800">{bundle.name}</h2>
                                </div>
                                <p className="text-gray-500 text-sm mb-4">{bundle.description}</p>
                                <div className="flex items-baseline justify-center bg-slate-50 p-4 rounded-lg mb-6">
                                    <span className="text-4xl font-bold text-gray-900">{bundle.credits}</span>
                                    <span className="ml-2 text-lg font-medium text-gray-600">Credits</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handlePurchase(bundle.id)}
                                disabled={purchasingId === bundle.id}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-wait flex items-center justify-center gap-2"
                            >
                                {purchasingId === bundle.id && <Loader2 className="animate-spin" size={20} />}
                                Buy for ₹{bundle.price.toLocaleString()}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}