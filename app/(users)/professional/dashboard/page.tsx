"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Calendar,
  Briefcase,
  CheckSquare,
  DollarSign,
  Star,
  Bell,
  ChevronRight,
  MessageSquare,
  Clock,
  User,
  Edit
} from "lucide-react";
import { useSession } from "next-auth/react";
import { LoaderIcon } from "react-hot-toast";
import { format } from "date-fns";

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
    status: string;
    customerName: string;
    date: string;
    amount: number;
  }[];
  upcomingAppointments: {
    id: string;
    title: string;
    customerName: string;
    dateTime: string;
    location: string;
  }[];
  notifications: {
    id: string;
    type: string;
    message: string;
    createdAt: string;
    read: boolean;
  }[];
}

export default function ProfessionalDashboard() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (status !== "authenticated") return;

      try {
        setLoading(true);
        const { data } = await axios.get("/api/professional/dashboard");
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <LoaderIcon />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session?.user?.name || "Professional"}!</h1>
        <p className="text-gray-500 mt-1">Here's a summary of your activity.</p>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-50 p-3 rounded-xl mr-4">
              <CheckSquare className="text-blue-600 h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed Jobs</p>
              <h3 className="text-2xl font-bold text-gray-900">{dashboardData?.metrics.totalCompletedJobs || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-50 p-3 rounded-xl mr-4">
              <DollarSign className="text-green-600 h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Earnings</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{dashboardData?.metrics.totalEarnings.toFixed(2) || "0.00"}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-yellow-50 p-3 rounded-xl mr-4">
              <Star className="text-yellow-500 h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <h3 className="text-2xl font-bold text-gray-900">{dashboardData?.metrics.averageRating?.toFixed(1) || "N/A"}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-purple-50 p-3 rounded-xl mr-4">
              <Briefcase className="text-purple-600 h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Leads</p>
              <h3 className="text-2xl font-bold text-gray-900">{dashboardData?.metrics.totalLeads || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
              <Link href="/professional/leads" className="text-sm text-blue-600 font-medium flex items-center hover:text-blue-800">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {dashboardData?.recentJobs && dashboardData.recentJobs.length > 0 ? (
              dashboardData.recentJobs.map((job) => (
                <div key={job.id} className="p-6">
                  <Link href={`/professional/leads?leadId=${job.id}`} className="flex justify-between items-center hover:bg-gray-50 -m-6 p-6 transition-colors duration-150">
                    <div>
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <div className="flex items-center mt-1">
                        <User className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                        <p className="text-sm text-gray-500">{job.customerName}</p>
                        <div className="mx-2 h-1 w-1 bg-gray-300 rounded-full"></div>
                        <p className="text-sm text-gray-500">{job.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p className="text-lg font-semibold text-gray-900">₹{job.amount.toFixed(2)}</p>
                      <span className={`ml-4 px-2.5 py-0.5 text-xs rounded-full ${job.status === "completed" ? "bg-green-100 text-green-800" :
                          job.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 text-gray-800"
                        }`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace(/-/g, " ")}
                      </span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No recent jobs found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Notifications and Appointments */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <Link href="/professional/notifications" className="text-sm text-blue-600 font-medium flex items-center hover:text-blue-800">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {dashboardData?.notifications && dashboardData.notifications.length > 0 ? (
                dashboardData.notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="p-6">
                    <div className="flex">
                      <div className={`flex-shrink-0 mr-4 p-2 rounded-full ${notification.type === "message" ? "bg-blue-50" :
                          notification.type === "lead" ? "bg-purple-50" :
                            notification.type === "payment" ? "bg-green-50" :
                              "bg-gray-50"
                        }`}>
                        {notification.type === "message" ?
                          <MessageSquare className="h-5 w-5 text-blue-600" /> :
                          notification.type === "lead" ?
                            <Briefcase className="h-5 w-5 text-purple-600" /> :
                            notification.type === "payment" ?
                              <DollarSign className="h-5 w-5 text-green-600" /> :
                              <Bell className="h-5 w-5 text-gray-600" />
                        }
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{format(new Date(notification.createdAt), "dd MMM, HH:mm")}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No notifications.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <Edit className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold">Keep Your Profile Fresh</h2>
            </div>
            <p className="text-sm text-blue-100 mb-6">
              A detailed and up-to-date profile with photos and service details helps you win more jobs.
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
    </div>
  );
}