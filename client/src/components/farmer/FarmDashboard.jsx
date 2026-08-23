import React, { useState, useEffect } from 'react';
import { AlertTriangle, Activity, ShieldCheck, Stethoscope, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { BrandMark } from '../login/BrandMark';

const FarmDashboard = ({ currentUser }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const farmId = currentUser?.entityId || 'FARM-A';
    fetch(`http://localhost:3000/api/farm-stats?farmId=${farmId}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch farm stats', err);
        setLoading(false);
      });
  }, [currentUser]);

  if (loading || !stats) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 pr-rise">
          <Activity className="w-8 h-8 text-primary animate-pulse" />
          <div className="text-sm font-mono tracking-widest text-primary/60 uppercase">Syncing Ledger...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto relative z-10">
      
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pr-rise" style={{ animationDelay: '0ms' }}>
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-clay uppercase mb-3">
            <ShieldCheck className="w-3 h-3" />
            Verified Farm Node
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-none">
            Farm Overview
          </h2>
          <p className="text-primary/60 text-sm mt-3 max-w-xl">
            Real-time telemetry and compliance status for your holding. All data is synced with the immutable ledger.
          </p>
        </div>
      </div>

      {/* Stats Bento Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        
        {/* Total Herd - Hero Card */}
        <div className="md:col-span-8 bg-primary rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-primary/10 pr-rise group" style={{ animationDelay: '100ms' }}>
          {/* Background Illustration */}
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none mix-blend-overlay">
            <img src="/images/farm-scene.png" alt="Farm" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-sm font-bold text-primary-foreground/80 uppercase tracking-widest">Total Herd Size</h3>
            </div>
            <div className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-xs font-mono font-medium flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
              Live
            </div>
          </div>
          <div className="relative z-10 mt-12 md:mt-16 flex items-baseline gap-4">
            <div className="text-7xl md:text-8xl font-serif font-bold text-primary-foreground tracking-tighter">
              {stats.totalAnimals}
            </div>
            <div className="text-primary-foreground/60 text-lg font-medium">Registered Heads</div>
          </div>
        </div>

        {/* Cleared & Safe */}
        <div className="md:col-span-4 bg-card border border-border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm pr-rise group" style={{ animationDelay: '150ms' }}>
          <div className="paper-grain absolute inset-0 opacity-50"></div>
          
          {/* Topographic Background SVG */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply flex items-center justify-center">
            <svg width="200%" height="200%" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0,20 Q25,5 50,20 T100,20" fill="none" stroke="currentColor" strokeWidth="0.5" />
               <path d="M0,40 Q25,25 50,40 T100,40" fill="none" stroke="currentColor" strokeWidth="0.5" />
               <path d="M0,60 Q25,45 50,60 T100,60" fill="none" stroke="currentColor" strokeWidth="0.5" />
               <path d="M0,80 Q25,65 50,80 T100,80" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="relative z-10 flex justify-between items-start mb-6">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-green-500/10 rounded-lg text-green-600 border border-green-500/20">
                 <ShieldCheck className="w-4 h-4" />
               </div>
               <h3 className="text-xs font-bold text-primary/60 uppercase tracking-widest">Cleared & Safe</h3>
             </div>
             <span className="text-[10px] font-mono text-green-600/80 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">VERIFIED</span>
          </div>
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <div className="text-5xl font-serif font-bold text-primary tracking-tight">
                {stats.clearedAnimals}
              </div>
              <div className="mt-2 text-xs text-primary/50 font-medium">Ready for immediate supply</div>
            </div>
            <div className="text-right pb-1">
               <div className="text-green-600 font-mono text-[10px] font-bold tracking-widest bg-green-500/10 px-2 py-1 rounded-md">100% PURE</div>
            </div>
          </div>
        </div>

        {/* Active Treatment */}
        <div className="md:col-span-6 bg-card border border-border rounded-2xl p-6 flex flex-col justify-between shadow-sm pr-rise group hover:border-primary/20 transition-colors relative overflow-hidden" style={{ animationDelay: '200ms' }}>
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          </div>
          
          <div className="relative z-10 flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-primary/5 rounded-lg text-primary border border-primary/10">
                 <Stethoscope className="w-4 h-4" />
               </div>
               <h3 className="text-xs font-bold text-primary/60 uppercase tracking-widest">Active Treatment</h3>
             </div>
             <span className="text-[10px] font-mono text-primary/40 bg-primary/5 px-2 py-1 rounded border border-primary/10">NODE-84A</span>
          </div>
          
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <div className="text-4xl font-serif font-bold text-primary">{stats.treatedAnimals}</div>
              <div className="text-xs text-primary/50 font-medium mt-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                Trending down from last cycle
              </div>
            </div>
            <div className="w-28 h-12 opacity-30 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary w-full h-full">
                <path d="M0 25 Q 15 5 30 20 T 70 10 T 100 25"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* In Withdrawal - Dark Themed */}
        <div className="md:col-span-6 bg-[#163828] text-white border border-[#204735] rounded-2xl p-6 flex flex-col justify-between shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] pr-rise group hover:border-[#204735]/80 transition-colors relative overflow-hidden" style={{ animationDelay: '250ms' }}>
          <div className="absolute right-0 bottom-0 opacity-[0.07] pointer-events-none transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
            <svg width="250" height="250" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
              <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
              <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="2" />
              <line x1="100" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4"/>
              <line x1="100" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4"/>
            </svg>
          </div>
          
          <div className="relative z-10 flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-white/10 rounded-lg text-white border border-white/20">
                 <AlertTriangle className="w-4 h-4" />
               </div>
               <h3 className="text-xs font-bold text-white/70 uppercase tracking-widest">Withdrawal Phase</h3>
             </div>
             <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/30 border border-white/10 backdrop-blur-md">
               <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
               <span className="text-[10px] font-mono text-white/80 tracking-wider">PENDING</span>
             </div>
          </div>
          
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <div className="text-4xl font-serif font-bold text-white">{stats.withdrawalAnimals}</div>
              <div className="text-xs text-white/50 font-medium mt-2 font-mono flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-white/30 rounded-sm"></span>
                ETA TO CLEAR: 48HRS
              </div>
            </div>
            
            {/* Cool circular progress indicator */}
            <div className="relative w-14 h-14 flex items-center justify-center -mr-2 -mb-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path className="text-yellow-400" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div className="absolute text-[9px] font-mono font-bold text-white">75%</div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 pr-rise" style={{ animationDelay: '300ms' }}>
        
        {/* Important Alerts */}
        <div className="xl:col-span-1 bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm relative">
          <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none transform translate-x-1/4 translate-y-1/4">
            <BrandMark className="w-64 h-64 text-primary" />
          </div>
          
          <div className="p-6 border-b border-border bg-secondary/30 relative z-10">
            <h3 className="font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-clay" /> System Alerts
            </h3>
          </div>
          <div className="p-4 flex-1 overflow-auto custom-scrollbar bg-background/50 relative z-10">
            {stats.alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
                <CheckCircle2 className="w-8 h-8 text-green-500 mb-3" />
                <p className="text-sm font-medium text-primary">No active alerts</p>
                <p className="text-xs text-primary/60 mt-1">All systems operating normally</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.alerts.map(alert => (
                  <div key={alert.id} className="p-4 rounded-xl border border-border bg-card text-sm flex items-start gap-3 shadow-sm hover:shadow-md transition-all relative overflow-hidden group hover:border-clay/30">
                    <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${alert.type === 'danger' ? 'bg-clay animate-pulse shadow-[0_0_8px_rgba(214,120,93,0.8)]' : 'bg-[#B85E3E]'}`}></div>
                    <span className="leading-relaxed font-medium text-primary/80 group-hover:text-primary transition-colors">{alert.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Treatments */}
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center">
            <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Treatment Ledger</h3>
            <button className="text-xs font-semibold text-primary/60 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-0 overflow-auto flex-1 max-h-[400px] custom-scrollbar">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-background/80 sticky top-0 backdrop-blur-md z-10 border-b border-border/50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-primary/50">Tag ID</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-primary/50">Medication</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-primary/50 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {stats.recentTreatments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-primary/40 font-medium">No recent treatments recorded in the ledger</td>
                  </tr>
                ) : (
                  stats.recentTreatments.map(t => (
                    <tr key={t.id} className="hover:bg-secondary/40 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10 group-hover:border-primary/20 transition-colors">{t.animalId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-primary">{t.drug}</div>
                        <div className="text-xs text-primary/50 mt-0.5 font-mono">{t.dosage}mL administered</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-primary/40 text-right">
                        {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default FarmDashboard;
