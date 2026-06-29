import React, { useState, useEffect } from 'react';
import { Eye, Briefcase, FileText, MessageSquare, ArrowUpRight, Activity, TrendingUp, Users, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const mockChartData = [
  { name: 'Mon', visits: 400, applications: 240 },
  { name: 'Tue', visits: 300, applications: 139 },
  { name: 'Wed', visits: 450, applications: 280 },
  { name: 'Thu', visits: 278, applications: 190 },
  { name: 'Fri', visits: 589, applications: 480 },
  { name: 'Sat', visits: 239, applications: 180 },
  { name: 'Sun', visits: 349, applications: 230 },
];

const MetricCard = ({ title, value, icon: Icon, trend, bgClass, textClass, delay }) => (
  <div 
    className="relative group bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
    style={{ animation: `fadeInUp 0.6s ease-out ${delay}ms both` }}
  >
    {/* Decorative background blob */}
    <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full ${bgClass} opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
    
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div>
        <h3 className="text-slate-500 font-medium text-sm mb-2">{title}</h3>
        <div className="text-4xl font-black text-slate-800 tracking-tight">{value}</div>
      </div>
      <div className={`w-14 h-14 rounded-2xl ${bgClass} flex items-center justify-center rotate-3 group-hover:-rotate-3 group-hover:scale-110 transition-transform duration-500 shadow-md`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
    </div>
    
    <div className="relative z-10 flex items-center mt-4 pt-4 border-t border-slate-100/80">
      <div className="flex items-center text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold tracking-wide">
        <TrendingUp className="w-3.5 h-3.5 mr-1" />
        {trend}
      </div>
      <span className="text-xs text-slate-400 ml-2 font-medium">vs last month</span>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [timeRange, setTimeRange] = useState('weekly');

  useEffect(() => {
    // Add custom keyframes to document head for this page only
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/dashboard/stats?range=${timeRange}`);
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    fetchStats();
    
    return () => { document.head.removeChild(style); };
  }, [timeRange]);

  return (
    <div className="space-y-8 pb-10">
      
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#0B1120] to-[#1E293B] rounded-3xl p-8 overflow-hidden shadow-xl" style={{ animation: `fadeInUp 0.6s ease-out 0ms both` }}>
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-light opacity-20 blur-[80px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Good Morning, Admin 👋</h1>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard title="Total Visits" value={stats ? stats.counts.visits : 0} icon={Eye} trend="12.5%" bgClass="bg-blue-500" textClass="text-blue-500" delay={100} />
        <MetricCard title="Total Jobs" value={stats ? stats.counts.jobs : 0} icon={Briefcase} trend="8.2%" bgClass="bg-violet-500" textClass="text-violet-500" delay={200} />
        <MetricCard title="Applications" value={stats ? stats.counts.applications : 0} icon={FileText} trend="24.1%" bgClass="bg-emerald-500" textClass="text-emerald-500" delay={300} />
        <MetricCard title="Contact Forms" value={stats ? stats.counts.contacts : 0} icon={MessageSquare} trend="3.4%" bgClass="bg-amber-500" textClass="text-amber-500" delay={400} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Chart Area */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100" style={{ animation: `fadeInUp 0.6s ease-out 500ms both` }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
             <div>
               <h2 className="text-xl font-bold text-slate-800 tracking-tight">Performance Overview</h2>
               <p className="text-sm text-slate-500 mt-1 font-medium">Platform traffic and engagements</p>
             </div>
             <div className="flex items-center bg-slate-50 p-1 rounded-xl mt-4 sm:mt-0 border border-slate-100">
               <button onClick={() => setTimeRange('weekly')} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${timeRange === 'weekly' ? 'bg-white shadow-sm text-slate-800 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}>Weekly</button>
               <button onClick={() => setTimeRange('monthly')} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${timeRange === 'monthly' ? 'bg-white shadow-sm text-slate-800 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}>Monthly</button>
               <button onClick={() => setTimeRange('yearly')} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${timeRange === 'yearly' ? 'bg-white shadow-sm text-slate-800 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}>Yearly</button>
             </div>
          </div>
          <div className="h-[360px] w-full pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats ? stats.chartData : []} margin={{ top: 10, right: 0, left: -20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#44c7f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#44c7f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 500}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 500}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                  itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                  labelStyle={{ color: '#64748b', marginBottom: '8px', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="visits" stroke="#44c7f6" strokeWidth={4} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
