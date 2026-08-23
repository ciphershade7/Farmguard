import React, { useState, useEffect } from 'react';
import { Search, MapPin, Activity, ShieldAlert, CheckCircle2, ChevronRight, Warehouse, AlertTriangle, Filter } from 'lucide-react';

const mockFarms = [
  { id: 'FARM-A', name: 'Green Valley Dairy', location: 'North Region', status: 'Healthy', animals: 154, alerts: 0, compliance: 100 },
  { id: 'FARM-B', name: 'Sunrise Pastures', location: 'East Region', status: 'Warning', animals: 201, alerts: 2, compliance: 88 },
  { id: 'FARM-C', name: 'Oakwood Farms', location: 'West Region', status: 'Healthy', animals: 89, alerts: 0, compliance: 100 },
  { id: 'FARM-D', name: 'Riverbend Dairy', location: 'North Region', status: 'Quarantine', animals: 312, alerts: 5, compliance: 64 },
];

const FarmMonitor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredFarms = mockFarms.filter(f => 
    f.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto relative z-10 animate-fade-in">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pr-rise" style={{ animationDelay: '0ms' }}>
        <div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-none">Farm Monitor</h2>
          <p className="text-primary/60 text-sm mt-3 max-w-xl">Live status, compliance, and alerts across all registered facilities.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-primary/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search farms..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card border border-border text-sm rounded-lg focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest w-64 shadow-sm"
            />
          </div>
          <button className="px-4 py-2 bg-card border border-border text-primary font-medium text-sm rounded-lg hover:bg-secondary transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pr-rise" style={{ animationDelay: '100ms' }}>
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <h3 className="text-xs font-bold text-primary/50 uppercase tracking-widest">Active Facilities</h3>
            <div className="p-2 bg-blue-500/10 rounded-md">
              <Warehouse className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-6 flex items-end justify-between relative z-10">
            <span className="text-4xl font-serif font-bold text-primary">24</span>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <h3 className="text-xs font-bold text-primary/50 uppercase tracking-widest">Active Alerts</h3>
            <div className="p-2 bg-orange-500/10 rounded-md">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="mt-6 flex items-end justify-between relative z-10">
            <span className="text-4xl font-serif font-bold text-orange-500">7</span>
          </div>
        </div>
        
        <div className="bg-card border border-brand-terracotta-badge/30 p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-terracotta-badge/50"></div>
          <div className="flex justify-between items-start relative z-10">
            <h3 className="text-xs font-bold text-brand-terracotta-badge uppercase tracking-widest">Quarantined Farms</h3>
            <div className="p-2 bg-brand-terracotta-badge/10 rounded-md animate-pulse">
              <ShieldAlert className="w-5 h-5 text-brand-terracotta-badge" />
            </div>
          </div>
          <div className="text-4xl font-serif font-bold text-brand-terracotta-badge mt-6 relative z-10">1</div>
          <p className="text-[10px] text-brand-terracotta-badge/70 mt-2 font-mono relative z-10 bg-brand-terracotta-badge/10 px-2 py-0.5 rounded border border-brand-terracotta-badge/20 w-fit">FARM-D ISOLATED</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden pr-rise" style={{ animationDelay: '200ms' }}>
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-secondary/30 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/60">Facility</th>
              <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/60">Location</th>
              <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/60">Status</th>
              <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/60">Headcount</th>
              <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/60 text-right">Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredFarms.map((farm, idx) => (
              <tr key={farm.id} className="hover:bg-secondary/40 transition-colors cursor-pointer group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-serif font-bold border border-primary/10">
                      {farm.id.split('-')[1]}
                    </div>
                    <div>
                      <div className="font-bold text-primary">{farm.name}</div>
                      <div className="text-xs text-primary/50 font-mono mt-0.5">{farm.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-primary/70">
                    <MapPin className="w-3.5 h-3.5" />
                    {farm.location}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {farm.status === 'Healthy' ? (
                    <span className="px-2.5 py-1 bg-green-500/10 text-green-700 text-xs font-bold rounded-md border border-green-500/20 flex items-center gap-1.5 w-fit">
                      <CheckCircle2 className="w-3 h-3" /> Healthy
                    </span>
                  ) : farm.status === 'Warning' ? (
                    <span className="px-2.5 py-1 bg-orange-500/10 text-orange-600 text-xs font-bold rounded-md border border-orange-500/20 flex items-center gap-1.5 w-fit">
                      <AlertTriangle className="w-3 h-3" /> Warning
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-brand-terracotta-badge/10 text-brand-terracotta-badge text-xs font-bold rounded-md border border-brand-terracotta-badge/20 flex items-center gap-1.5 w-fit animate-pulse">
                      <ShieldAlert className="w-3 h-3" /> Quarantine
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-primary">{farm.animals}</div>
                  <div className="text-[10px] text-primary/50 uppercase tracking-wider mt-0.5">Livestock</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-primary">{farm.compliance}%</span>
                      <div className="w-24 h-1.5 bg-border rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${farm.compliance > 90 ? 'bg-green-500' : farm.compliance > 70 ? 'bg-orange-500' : 'bg-brand-terracotta-badge'}`}
                          style={{ width: `${farm.compliance}%` }}
                        ></div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-primary/30 group-hover:text-primary transition-colors ml-2" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmMonitor;
