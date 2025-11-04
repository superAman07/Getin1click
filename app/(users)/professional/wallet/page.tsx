'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { Loader2, Package, Coins, Wallet, History, CheckCircle, ShoppingCart } from 'lucide-react';
import { BundleTag } from '@prisma/client';
import { format } from 'date-fns';

// Interfaces
interface CreditBundle {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    credits: number;
    tag?: BundleTag | null;
}

interface Transaction {
    id: string;
    createdAt: string;
    amount: number;
    bundle: {
        name: string;
        credits: number;
    } | null;
}

const getTagStyles = (tag?: BundleTag | null) => {
    switch (tag) {
        case 'PREMIUM':
            return {
                badge: 'bg-amber-100 text-amber-800',
                border: 'border-amber-400',
                bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50',
                popular: true,
                label: 'Most Popular'
            };
        case 'PLATINUM':
            return {
                badge: 'bg-slate-200 text-slate-800',
                border: 'border-slate-400',
                bg: 'bg-gradient-to-br from-slate-50 to-slate-100/50',
                popular: false,
                label: 'Best Value'
            };
        case 'STANDARD':
            return {
                badge: 'bg-blue-100 text-blue-800',
                border: 'border-blue-400',
                bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
                popular: false,
                label: 'Standard'
            };
        default:
            return {
                badge: 'bg-gray-100 text-gray-800',
                border: 'border-gray-200',
                bg: 'bg-white',
                popular: false,
                label: 'Basic'
            };
    }
};

export default function WalletPage() {
    const { data: session } = useSession();
    const [bundles, setBundles] = useState<CreditBundle[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchasingId, setPurchasingId] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });

     const filteredTransactions = useMemo(() => {
        if (!dateRange.start && !dateRange.end) return transactions;

        return transactions.filter(tx => {
            const txDate = new Date(tx.createdAt);
            const startDate = dateRange.start ? new Date(dateRange.start) : null;
            const endDate = dateRange.end ? new Date(dateRange.end) : null;

            if (startDate && endDate) {
                return txDate >= startDate && txDate <= endDate;
            } else if (startDate) {
                return txDate >= startDate;
            } else if (endDate) {
                return txDate <= endDate;
            }
            return true;
        });
    }, [transactions, dateRange]);

    const fetchData = useCallback(async () => {
        try {
            const [bundlesRes, historyRes] = await Promise.all([
                axios.get('/api/professional/credit-bundles'),
                axios.get('/api/professional/wallet/history')
            ]);
            setBundles(bundlesRes.data.filter((b: any) => b.isActive));
            setTransactions(historyRes.data);
        } catch (error) {
            toast.error('Failed to load wallet data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePurchase = async (bundleId: string) => {
        setPurchasingId(bundleId);
        const toastId = toast.loading('Redirecting to payment...');
        try {
            const response = await axios.post('/api/professional/wallet/checkout', { bundleId });
            const { paymentUrl } = response.data;
            window.location.href = paymentUrl;
        } catch (error) {
            toast.error('Could not initiate purchase. Please try again.', { id: toastId });
            setPurchasingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)] mt-20">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900">My Wallet</h1>
                        <p className="text-slate-600 mt-2 text-lg">Purchase credits to connect with new customers and grow your business.</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm w-full sm:w-auto">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Current Balance</p>
                            <p className="text-2xl font-bold text-slate-800">{session?.user?.credits || 0} Credits</p>
                        </div>
                    </div>
                </div>

                {/* Credit Bundles Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-semibold text-slate-800 mb-8 flex items-center gap-3">
                        <ShoppingCart className="w-7 h-7 text-blue-600" />
                        Purchase Credits
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {bundles.map((bundle) => {
                            const styles = getTagStyles(bundle.tag);
                            return (
                                <div key={bundle.id} className={`rounded-2xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 relative overflow-hidden border-2 ${styles.border} ${styles.bg}`}>
                                    {styles.popular && (
                                        <div className="absolute top-0 right-0 text-xs bg-amber-500 text-white font-bold px-6 py-1.5 transform rotate-45 translate-x-8 translate-y-4">
                                            Popular
                                        </div>
                                    )}
                                    <div className="p-6 flex-grow">
                                        <span className={`inline-block mb-3 text-xs font-bold uppercase px-2.5 py-1 rounded-full ${styles.badge}`}>
                                            {styles.label}
                                        </span>
                                        <h3 className="text-2xl font-bold text-slate-900">{bundle.name}</h3>
                                        <p className="text-slate-500 text-sm my-3 h-10">{bundle.description}</p>
                                        <div className="flex items-baseline justify-center bg-white p-4 rounded-lg my-6 border">
                                            <span className="text-5xl font-bold text-slate-900">{bundle.credits}</span>
                                            <span className="ml-2 text-lg font-medium text-slate-600">Credits</span>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-white/50 border-t">
                                        <button
                                            onClick={() => handlePurchase(bundle.id)}
                                            disabled={purchasingId === bundle.id}
                                            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-wait flex items-center justify-center gap-2 shadow-sm hover:shadow-lg cursor-pointer"
                                        >
                                            {purchasingId === bundle.id ? <Loader2 className="animate-spin" size={20} /> : `Buy for ₹${bundle.price.toLocaleString()}`}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Purchase History Section */}
                <section>
                    <h2 className="text-3xl font-semibold text-slate-800 mb-8 flex items-center gap-3">
                        <History className="w-7 h-7 text-blue-600" />
                        Transaction History
                    </h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-slate-600">From:</label>
                                    <input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-slate-600">To:</label>
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            {(dateRange.start || dateRange.end) && (
                                <button
                                    onClick={() => setDateRange({ start: '', end: '' })}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
                        {transactions.length === 0 ? (
                            <div className="text-center p-12">
                                <p className="text-slate-500">You have no past transactions.</p>
                            </div>
                        ) : (
                            <div className="max-h-[480px] overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 font-medium">Date</th>
                                            <th scope="col" className="px-6 py-4 font-medium">Bundle</th>
                                            <th scope="col" className="px-6 py-4 font-medium text-center">Credits Added</th>
                                            <th scope="col" className="px-6 py-4 font-medium text-right">Amount Paid</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredTransactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap">
                                                    {format(new Date(tx.createdAt), 'dd MMM, yyyy')}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    {tx.bundle ? tx.bundle.name : <span className="italic text-slate-400">Bundle no longer available</span>}
                                                </td>
                                                <td className="px-6 py-4 text-slate-800 font-semibold text-center">
                                                    {tx.bundle ? tx.bundle.credits : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-slate-800 font-semibold text-right">₹{tx.amount.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}