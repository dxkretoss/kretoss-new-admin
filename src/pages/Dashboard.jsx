import React from 'react';
import { Users, Eye, ArrowUpRight } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back, Admin. Here is what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Visits" value="12,456" icon={Eye} trend="+12.5%" />
        <MetricCard title="Active Users" value="892" icon={Users} trend="+5.2%" />
        <MetricCard title="Portfolios" value="48" icon={Eye} trend="+2.1%" />
        <MetricCard title="Applications" value="156" icon={Users} trend="+18.4%" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center py-3 border-b border-slate-50 last:border-0">
              <div className="w-2 h-2 rounded-full bg-brand-light mr-4"></div>
              <div>
                <p className="text-slate-800 font-medium">New job application received</p>
                <p className="text-sm text-slate-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
