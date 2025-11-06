'use client';

import ToggleSwitch from '@/components/ToggleSwitch';
import axios from 'axios';
import { Users, Briefcase, UserCheck, FileText, Loader2, TrendingUp, Calendar, Activity ,CheckSquare, UserPlus, RotateCcw} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface DashboardData {
  metrics: {
    totalCustomers: number;
    totalProfessionals: number;
    newCustomersLast30Days: number;
    newProfessionalsLast30Days: number;
    newLeadsToAssign: number;
    leadsPendingProfessionalAcceptance: number;
    activeJobsInProgress: number;
    completedJobs: number;
  };
  recentUsers: {
    id: string;
    name: string | null;
    email: string;
    role: 'CUSTOMER' | 'PROFESSIONAL' | 'ADMIN';
    createdAt: string;
  }[];
  signupChartData: {
    date: string;
    Customers: number;
    Professionals: number;
  }[];
}

const StatCard = ({
  title,
  value,
  icon,
  gradient
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
}) => (
  <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    <div className="relative p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">{value.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-semibold">Active</span>
          </div>
        </div>
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
    <div className={`h-1 bg-gradient-to-r ${gradient}`} />
  </div>
);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-900 mb-2">{payload[0].payload.date}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-bold text-slate-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function TrustScoreManager() {
    const [settings, setSettings] = useState({ isVisible: false, baseRating: 4.0, baseCount: 100 });
    const [initialSettings, setInitialSettings] = useState({ isVisible: false, baseRating: 4.0, baseCount: 100 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/admin/configuration/trust-score').then(response => {
            setSettings(response.data);
            setInitialSettings(response.data);
            setIsLoading(false);
        });
    }, []);

    const handleSave = async () => {
        const toastId = toast.loading('Saving settings...');
        try {
            await axios.post('/api/admin/configuration/trust-score', settings);
            setInitialSettings(settings);
            toast.success('Settings saved!', { id: toastId });
        } catch (error) {
            toast.error('Failed to save settings.', { id: toastId });
        }
    };

    // This function now fetches real data and populates the form
    const handleResetToOrganic = async () => {
        const toastId = toast.loading('Fetching live review data...');
        try {
            const { data } = await axios.get('/api/admin/configuration/trust-score/organic');
            setSettings(s => ({
                ...s,
                baseRating: data.organicRating,
                baseCount: data.organicCount,
            }));
            toast.success('Form updated with live data. Click Save to apply.', { id: toastId });
        } catch (error) {
            toast.error('Could not fetch live data.', { id: toastId });
        }
    };

    const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

    if (isLoading) {
        return <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse h-64"></div>;
    }

    return (
        <div className="bg-white md:min-w-2xl  rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">TrustScore Settings</h2>
                    <p className="text-sm text-slate-500 mt-1">Control the public-facing review score.</p>
                </div>
                <ToggleSwitch
                    isOn={settings.isVisible}
                    onToggle={() => setSettings(s => ({ ...s, isVisible: !s.isVisible }))}
                />
            </div>
            {hasUnsavedChanges && (
                <div className="text-center bg-amber-50 text-amber-700 text-xs font-semibold p-2 rounded-md mb-4 border border-amber-200">
                    You have unsaved changes. Please save your new settings.
                </div>
            )}
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-700">Base Rating</label>
                    <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={settings.baseRating}
                        onChange={(e) => setSettings(s => ({ ...s, baseRating: parseFloat(e.target.value) || 0 }))}
                        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-700">Base Review Count</label>
                    <input
                        type="number"
                        step="1"
                        min="0"
                        value={settings.baseCount}
                        onChange={(e) => setSettings(s => ({ ...s, baseCount: parseInt(e.target.value, 10) || 0 }))}
                        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                </div>
                <div className="flex items-center gap-3 pt-2">
                    <button 
                        onClick={handleResetToOrganic} 
                        className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset to Live Data
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={!hasUnsavedChanges}
                        className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <Activity className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-6 text-slate-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-red-50 to-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Unable to Load Dashboard</h3>
          <p className="text-slate-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Customers',
      value: data?.metrics.totalCustomers ?? 0,
      icon: <Users className="w-7 h-7 text-white" />,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Professionals',
      value: data?.metrics.totalProfessionals ?? 0,
      icon: <Briefcase className="w-7 h-7 text-white" />,
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'New Leads (To Assign)',
      value: data?.metrics.newLeadsToAssign ?? 0,
      icon: <FileText className="w-7 h-7 text-white" />,
      gradient: 'from-amber-500 to-amber-600'
    },
    {
      title: 'Completed Jobs',
      value: data?.metrics.completedJobs ?? 0,
      icon: <CheckSquare className="w-7 h-7 text-white" />,
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      title: 'New Customers (30d)',
      value: `+${data?.metrics.newCustomersLast30Days ?? 0}`,
      icon: <UserPlus className="w-7 h-7 text-white" />,
      gradient: 'from-sky-500 to-sky-600'
    },
    {
      title: 'New Professionals (30d)',
      value: `+${data?.metrics.newProfessionalsLast30Days ?? 0}`,
      icon: <UserPlus className="w-7 h-7 text-white" />,
      gradient: 'from-violet-500 to-violet-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
            <p className="text-slate-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Signups Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">New User Signups</h2>
                  <p className="text-sm text-slate-500 mt-1">Last 7 days activity</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-slate-600">Customers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-slate-600">Professionals</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={data?.signupChartData} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
                    <Bar
                      dataKey="Customers"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={60}
                    />
                    <Bar
                      dataKey="Professionals"
                      fill="#10b981"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={60}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Recent Signups</h2>
              <p className="text-sm text-slate-500 mt-1">Latest user registrations</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {data?.recentUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className="group flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${
                      user.role === 'CUSTOMER'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                        : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                    }`}>
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        user.role === 'CUSTOMER' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {user.name || user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                          user.role === 'CUSTOMER'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {user.role.toLowerCase()}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <TrustScoreManager />
        </div>
      </div>
    </div>
  );
}
