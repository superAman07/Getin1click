"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Briefcase,
  CheckSquare,
  DollarSign,
  Star,
  Bell,
  ChevronRight,
  MessageSquare,
  User,
  Edit,
  AlertTriangle,
  Loader2,
  Calendar,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { format, formatDistanceToNow } from "date-fns";

type DashboardData = {
  metrics: {
    totalCompletedJobs: number;
    totalEarnings: number;
    averageRating: number;
    totalLeads: number;
  };
  recentJobs: {
    id: string;
    title: string;
    status: 'completed' | 'in-progress' | 'pending';
    customerName: string;
    date: string;
    amount: number;
  }[];
  notifications: {
    id: string;
    type: 'message' | 'lead' | 'payment' | 'system';
    message: string;
    createdAt: string;
    read: boolean;
  }[];
};

const MetricCard = ({ icon, title, value, gradient, children }: { icon: React.ReactNode, title: string, value: string, gradient: string, children?: React.ReactNode }) => (
    <div className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg`}>
        <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-bl ${gradient} opacity-20`}></div>
        <div className="relative z-10">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}>
                {icon}
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
            {children}
        </div>
    </div>
);

const JobStatusBadge = ({ status }: { status: 'completed' | 'in-progress' | 'pending' | string }) => {
    const statusInfo = {
        completed: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
        'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
        pending: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
    }[status] || { bg: 'bg-slate-100', text: 'text-slate-800', dot: 'bg-slate-500' };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${statusInfo.dot}`}></span>
            {status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, " ")}
        </span>
    );
};

const NotificationIcon = ({ type }: { type: 'message' | 'lead' | 'payment' | 'system' }) => {
    const iconMap: { [key: string]: React.ReactNode } = {
        message: <MessageSquare className="h-5 w-5 text-blue-600" />,
        lead: <Briefcase className="h-5 w-5 text-purple-600" />,
        payment: <DollarSign className="h-5 w-5 text-green-600" />,
        system: <Bell className="h-5 w-5 text-slate-600" />,
    };
    const bgMap: { [key: string]: string } = {
        message: 'bg-blue-50',
        lead: 'bg-purple-50',
        payment: 'bg-green-50',
        system: 'bg-slate-50',
    };
    return (
        <div className={`flex-shrink-0 flex items-center justify-center mr-4 w-10 h-10 rounded-full ${bgMap[type] || bgMap.system}`}>
            {iconMap[type] || iconMap.system}
        </div>
    );
};

const DashboardSkeleton = () => (
    <div className="bg-slate-50 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-pulse">
            <div className="mb-8 md:mb-12">
                <div className="h-9 w-3/5 bg-slate-200 rounded-lg"></div>
                <div className="h-6 w-2/5 bg-slate-200 rounded mt-3"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm"><div className="w-12 h-12 rounded-xl bg-slate-200 mb-4"></div><div className="h-4 w-24 bg-slate-200 rounded mb-2"></div><div className="h-8 w-16 bg-slate-200 rounded"></div></div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 space-y-4">
                    <div className="h-6 w-32 bg-slate-200 rounded"></div>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center py-2"><div className="space-y-2"><div className="h-5 w-48 bg-slate-200 rounded"></div><div className="h-4 w-32 bg-slate-200 rounded"></div></div><div className="h-6 w-24 bg-slate-200 rounded-full"></div></div>
                    ))}
                </div>
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 h-72"><div className="h-6 w-28 bg-slate-200 rounded mb-4"></div><div className="space-y-3"><div className="h-12 w-full bg-slate-200 rounded"></div><div className="h-12 w-full bg-slate-200 rounded"></div><div className="h-12 w-full bg-slate-200 rounded"></div></div></div>
                    <div className="bg-slate-200 rounded-2xl h-48 p-6"><div className="h-6 w-3/4 bg-slate-300 rounded mb-4"></div><div className="h-4 w-full bg-slate-300 rounded mb-4"></div><div className="h-10 w-full bg-slate-300 rounded-lg mt-6"></div></div>
                </div>
            </div>
        </main>
    </div>
);

const ErrorDisplay = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
    <div className="flex justify-center items-center h-[calc(100vh-100px)] bg-slate-50 px-4">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Oops! Something went wrong.</h3>
            <p className="mt-2 text-slate-500">{message}</p>
            <button
                onClick={onRetry}
                className="mt-8 w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2.5 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm transition-colors"
            >
                Try Again
            </button>
        </div>
    </div>
);

const safeFormatDistanceToNow = (dateInput: string | Date) => {
  try {
    const date = new Date(dateInput);
    if (isValid(date)) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    return "Invalid date";
  } catch (error) {
    return "Invalid date";
  }
};

export default function ProfessionalDashboard() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (status !== "authenticated") {
        if (status === "unauthenticated") setLoading(false);
        return;
    };
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get("/api/professional/dashboard");
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (status === "loading" || loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchDashboardData} />;
  }

  if (!session) {
    return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <div className="text-center">
                <p className="text-slate-600 text-lg">Please sign in to view your dashboard.</p>
                {/* You would typically have a sign-in button here */}
            </div>
        </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-xl md:text-4xl font-bold text-slate-600 tracking-tight">
            Welcome back, <span className="text-gray-800">{session?.user?.name || "Professional"}</span>!
          </h1>
          <p className="text-slate-500 mt-2 text-base md:text-lg">
            Here's a summary of your activity and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard title="Completed Jobs" value={dashboardData?.metrics.totalCompletedJobs.toString() || '0'} icon={<CheckSquare size={24} />} gradient="from-cyan-400 to-blue-500" />
            <MetricCard title="Total Earnings" value={`$${dashboardData?.metrics.totalEarnings.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}`} icon={<DollarSign size={24} />} gradient="from-emerald-400 to-green-500" />
            <MetricCard title="Average Rating" value={dashboardData?.metrics.averageRating?.toFixed(1) || 'N/A'} icon={<Star size={24} />} gradient="from-amber-400 to-orange-500" />
            <MetricCard title="Active Leads" value={dashboardData?.metrics.totalLeads.toString() || '0'} icon={<Briefcase size={24} />} gradient="from-violet-400 to-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="p-6 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-600">Recent Jobs</h2>
                <Link href="/professional/leads" className="text-sm text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {dashboardData?.recentJobs && dashboardData.recentJobs.length > 0 ? (
                dashboardData.recentJobs.map((job) => (
                  <div key={job.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${job.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'}`}>
                          {job.status === 'completed' ? <CheckSquare className="w-5 h-5 text-green-600" /> : <Briefcase className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <Link 
                            href={`/professional/leads?leadId=${job.id}`}
                            className="font-semibold text-sm text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            {job.title}
                          </Link>
                          <p className="text-xs text-slate-500">with {job.customerName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-slate-600">₹{job.amount.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">{job.date}</p>
                      </div>
                    </div>
                ))
              ) : (
                <div className="p-12 text-center">
                    <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-2 text-sm font-medium text-slate-800">No recent jobs</h3>
                    <p className="mt-1 text-sm text-slate-500">New jobs will appear here once you accept them.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="p-6 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-slate-600">Notifications</h2>
                  <Link href="/professional/notifications" className="text-sm text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors">
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {dashboardData?.notifications && dashboardData.notifications.length > 0 ? (
                  dashboardData.notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="p-4 flex items-start">
                      <NotificationIcon type={notification.type} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-800">{notification.message}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {safeFormatDistanceToNow(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>}
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <Bell className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-2 text-sm font-medium text-slate-800">No new notifications</h3>
                    <p className="mt-1 text-sm text-slate-500">You're all caught up!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8 text-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                <div className="flex items-center mb-4">
                    <div className="bg-white/20 p-3 rounded-xl mr-4">
                        <Edit className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold">Keep Your Profile Fresh</h2>
                </div>
                <p className="text-sm text-blue-100 mb-6">
                    A detailed and up-to-date profile helps you win more jobs and stand out from the competition.
                </p>
                <Link
                    href="/professional/dashboard/update-profile"
                    className="w-full block text-center bg-white text-blue-600 font-semibold rounded-lg px-6 py-3 shadow-md hover:bg-gray-100 transition-all duration-200"
                >
                    Update Your Profile
                </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function isValid(date: Date): boolean {
  return !isNaN(date.getTime());
}
