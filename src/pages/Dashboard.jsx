import React, { useState, useEffect } from 'react';
import { Eye, Briefcase, FileText, MessageSquare, ArrowUpRight } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-brand-dark">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex items-center text-emerald-500 bg-emerald-50 px-2 py-1 rounded text-sm font-medium">
        <ArrowUpRight className="w-4 h-4 mr-1" />
        {trend}
      </div>
    </div>
    <h3 className="text-slate-500 font-medium">{title}</h3>
    <div className="text-3xl font-bold text-slate-800 mt-1">{value}</div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/stats');
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back, Admin. Here is what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Visits" value={stats ? stats.counts.visits : 0} icon={Eye} trend="All Time" />
        <MetricCard title="Total Jobs" value={stats ? stats.counts.jobs : 0} icon={Briefcase} trend="Active" />
        <MetricCard title="Applications" value={stats ? stats.counts.applications : 0} icon={FileText} trend="Received" />
        <MetricCard title="Contact Forms" value={stats ? stats.counts.contacts : 0} icon={MessageSquare} trend="Leads" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {stats && stats.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center py-3 border-b border-slate-50 last:border-0">
                <div className={`w-2 h-2 rounded-full ${activity.type === 'Application' ? 'bg-brand-light' : 'bg-emerald-500'} mr-4`}></div>
                <div>
                  <p className="text-slate-800 font-medium">{activity.message}</p>
                  <p className="text-sm text-slate-500">{new Date(activity.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No recent activity found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
