import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const mockTrendData = [
  { name: 'Mon', compliance: 92, alerts: 4 },
  { name: 'Tue', compliance: 95, alerts: 2 },
  { name: 'Wed', compliance: 91, alerts: 6 },
  { name: 'Thu', compliance: 97, alerts: 1 },
  { name: 'Fri', compliance: 98, alerts: 0 },
  { name: 'Sat', compliance: 99, alerts: 0 },
  { name: 'Sun', compliance: 99, alerts: 1 },
];

const SystemAnalytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/farm-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching system stats", err));
  }, []);

  const totalAnimals = stats?.totalAnimals || 0;
  const compliance = totalAnimals > 0 
    ? ((stats.clearedAnimals / totalAnimals) * 100).toFixed(1)
    : 0;
  const activeFlags = stats?.alerts?.length || 0;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in relative z-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pr-rise" style={{ animationDelay: '0ms' }}>
        <div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-none">System Overview</h2>
          <p className="text-primary/60 text-sm mt-3 max-w-xl">Network-wide analytics and compliance tracking.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 pr-rise" style={{ animationDelay: '100ms' }}>
        <div className="bg-primary text-primary-foreground p-6 rounded-2xl flex flex-col justify-between shadow-xl shadow-primary/10 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none mix-blend-overlay">
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
          </div>
          <div className="flex justify-between items-start relative z-10">
            <h3 className="text-xs font-bold text-primary-foreground/70 uppercase tracking-widest">Active Farms</h3>
            <div className="p-2 bg-white/10 rounded-md border border-white/10 backdrop-blur-md">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          <div className="text-5xl font-serif font-bold text-primary-foreground mt-6 relative z-10 tracking-tight">2</div>
        </div>

        <div className="bg-[#163828] text-white p-6 rounded-2xl flex flex-col justify-between border border-[#204735] shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] relative overflow-hidden group hover:border-[#204735]/80 transition-colors">
          <div className="absolute right-0 bottom-0 opacity-[0.07] pointer-events-none transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
            <svg width="250" height="250" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
              <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex justify-between items-start relative z-10">
            <h3 className="text-xs font-bold text-white/70 uppercase tracking-widest">Total Animals</h3>
            <div className="p-2 bg-white/10 rounded-md border border-white/20 text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-5xl font-serif font-bold text-blue-400 mt-6 relative z-10 tracking-tight">{totalAnimals}</div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="paper-grain absolute inset-0 opacity-50"></div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-green-500 transform origin-left group-hover:scale-y-2 transition-transform"></div>
          <div className="flex justify-between items-start relative z-10">
            <h3 className="text-xs font-bold text-primary/50 uppercase tracking-widest">Global Compliance</h3>
            <div className="p-2 bg-green-500/10 rounded-md border border-green-500/20">
              <ShieldCheck className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="text-5xl font-serif font-bold text-primary mt-6 relative z-10 tracking-tight">{compliance}%</div>
        </div>
        
        <div className="bg-card border border-brand-terracotta-badge/30 p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-terracotta-badge transform origin-left group-hover:scale-y-2 transition-transform"></div>
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-brand-terracotta-badge uppercase tracking-widest">Active Flags</h3>
            <div className="p-2 bg-brand-terracotta-badge/10 rounded-md animate-pulse">
              <AlertTriangle className="w-5 h-5 text-brand-terracotta-badge" />
            </div>
          </div>
          <div className="text-5xl font-serif font-bold text-brand-terracotta-badge mt-6 relative z-10 tracking-tight">{activeFlags}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 pr-rise" style={{ animationDelay: '200ms' }}>
        {/* Compliance Trend Chart */}
        <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary/60" />
            <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Compliance Trend (7 Days)</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.87 0.02 120 / 0.5)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(0.33 0.058 156 / 0.6)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(0.33 0.058 156 / 0.6)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'oklch(0.982 0.011 88)', borderRadius: '12px', border: '1px solid oklch(0.87 0.02 120)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="compliance" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorCompliance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Chart */}
        <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-brand-terracotta-badge" />
            <h3 className="font-bold text-primary text-sm uppercase tracking-wider">System Alerts (7 Days)</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.87 0.02 120 / 0.5)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(0.33 0.058 156 / 0.6)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(0.33 0.058 156 / 0.6)' }} />
                <Tooltip 
                  cursor={{ fill: 'oklch(0.87 0.02 120 / 0.2)' }}
                  contentStyle={{ backgroundColor: 'oklch(0.982 0.011 88)', borderRadius: '12px', border: '1px solid oklch(0.87 0.02 120)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                />
                <Bar dataKey="alerts" fill="#E25C3E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;



