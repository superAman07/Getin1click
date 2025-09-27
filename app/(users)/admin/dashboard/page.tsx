import { BarChart, Users, Briefcase } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Services', value: '75', icon: <Briefcase className="w-8 h-8 text-blue-500" /> },
    { title: 'Active Professionals', value: '120', icon: <Users className="w-8 h-8 text-green-500" /> },
    { title: 'Pending Approvals', value: '5', icon: <BarChart className="w-8 h-8 text-yellow-500" /> },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-6">
            {stat.icon}
            <div>
              <p className="text-slate-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
        <p className="text-slate-600 mt-4">Activity feed coming soon...</p>
      </div>
    </div>
  );
}