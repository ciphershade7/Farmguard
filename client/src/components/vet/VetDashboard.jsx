import React, { useState, useEffect } from 'react';
import { Stethoscope, ClipboardList, AlertTriangle, Users, MessageSquare } from 'lucide-react';

const VetDashboard = ({ data, setActiveTab, currentUser, onTagClick }) => {
  const [requests, setRequests] = useState([]);

  if (!data) return null;

  const { ledger } = data;
  
  // Extract recent treatments from ledger
  const recentTreatments = (ledger || [])
    .filter(entry => entry.action.includes('Treatment') || entry.action.includes('Antibiotic'))
    .slice(0, 5);

  useEffect(() => {
    // Fetch requests for the logged-in vet
    const vetId = currentUser?.entityId || 'VET-800';
    fetch(`http://localhost:3000/api/consultations?vetId=${vetId}`)
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error("Failed to fetch vet requests", err));
  }, [currentUser]);

  return (
    <div className="p-8 max-w-7xl mx-auto relative z-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pr-rise" style={{ animationDelay: '0ms' }}>
        <div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-none">Veterinarian Portal</h2>
          <p className="text-primary/60 text-sm mt-3 max-w-xl">Manage treatments, approve clearance, and monitor assigned farms across the network.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        
        {/* Active Patients - Hero Card */}
        <div className="md:col-span-4 bg-primary rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-xl shadow-primary/10 pr-rise group" style={{ animationDelay: '100ms' }}>
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none mix-blend-overlay">
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
          </div>
          <div className="relative z-10 flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-sm font-bold text-primary-foreground/80 uppercase tracking-widest">Active Patients</h3>
            </div>
          </div>
          <div className="relative z-10 flex items-baseline gap-4 mt-6">
            <div className="text-6xl font-serif font-bold text-primary-foreground tracking-tighter">14</div>
          </div>
        </div>

        {/* Pending Clearances */}
        <div className="md:col-span-4 bg-card border border-border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm pr-rise group" style={{ animationDelay: '150ms' }}>
          <div className="paper-grain absolute inset-0 opacity-50"></div>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply flex items-center justify-center">
            <svg width="200%" height="200%" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0,20 Q25,5 50,20 T100,20" fill="none" stroke="currentColor" strokeWidth="0.5" />
               <path d="M0,40 Q25,25 50,40 T100,40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="relative z-10 flex justify-between items-start mb-6">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 border border-blue-500/20">
                 <ClipboardList className="w-4 h-4" />
               </div>
               <h3 className="text-xs font-bold text-primary/60 uppercase tracking-widest">Pending Clearances</h3>
             </div>
          </div>
          <div className="relative z-10 mt-6">
            <div className="text-5xl font-serif font-bold text-primary tracking-tight">3</div>
          </div>
        </div>

        {/* Critical Cases - Dark Themed */}
        <div className="md:col-span-4 bg-[#163828] text-white border border-[#204735] rounded-2xl p-6 flex flex-col justify-between shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] pr-rise group hover:border-[#204735]/80 transition-colors relative overflow-hidden" style={{ animationDelay: '250ms' }}>
          <div className="absolute right-0 bottom-0 opacity-[0.07] pointer-events-none transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
            <svg width="250" height="250" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
              <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10 flex justify-between items-start mb-6">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-white/10 rounded-lg text-brand-terracotta-badge border border-white/20">
                 <AlertTriangle className="w-4 h-4" />
               </div>
               <h3 className="text-xs font-bold text-white/70 uppercase tracking-widest">Critical Cases</h3>
             </div>
             <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/30 border border-white/10 backdrop-blur-md">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-terracotta-badge animate-pulse"></div>
               <span className="text-[10px] font-mono text-white/80 tracking-wider">ACTION REQ</span>
             </div>
          </div>
          <div className="relative z-10 mt-6">
            <div className="text-5xl font-serif font-bold text-brand-terracotta-badge tracking-tight">1</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 pr-rise" style={{ animationDelay: '300ms' }}>
        
        {/* Inbox / Requests */}
        <div className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm relative">
          <div className="p-6 border-b border-border bg-secondary/30 relative z-10 flex justify-between items-center">
            <h3 className="font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-forest" /> Incoming Requests
            </h3>
          </div>
          <div className="p-0 overflow-auto max-h-[400px] custom-scrollbar bg-background/50 relative z-10">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-primary/50 text-sm">No incoming requests.</div>
            ) : (
              <ul className="divide-y divide-border/50">
                {requests.map(req => (
                  <li key={req.id} className="p-6 hover:bg-secondary/40 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${req.type === 'Visit Request' ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20' : 'bg-green-500/10 text-green-700 border border-green-500/20'}`}>
                          {req.type}
                        </span>
                        <span className="text-xs font-mono font-medium text-primary/60 bg-primary/5 px-2 py-1 rounded border border-primary/10">{req.farmId}</span>
                      </div>
                      <span className="text-xs font-mono text-primary/40">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-primary/90 mt-2 font-medium">{req.content}</p>
                    {req.status === 'Pending' && (
                      <div className="mt-4 flex gap-2">
                        <button 
                          onClick={() => setActiveTab('vet_consultations')}
                          className="px-4 py-2 bg-brand-forest text-white text-xs font-semibold rounded-lg border border-transparent hover:bg-white hover:text-brand-forest hover:border-brand-forest transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                        >
                          Reply / Schedule
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Network Treatments */}
        <div className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm relative">
          <div className="absolute right-0 bottom-0 opacity-[0.02] pointer-events-none transform translate-x-1/4 translate-y-1/4">
             <Stethoscope className="w-64 h-64 text-primary" />
          </div>
          <div className="p-6 border-b border-border bg-secondary/30 relative z-10 flex justify-between items-center">
            <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Recent Network Treatments</h3>
          </div>
          <div className="p-0 overflow-auto max-h-[400px] custom-scrollbar bg-background/50 relative z-10">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-background/80 sticky top-0 backdrop-blur-md z-10 border-b border-border/50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-primary/50">Farm</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-primary/50">Animal ID</th>
                  <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-primary/50">Drug & Dosage</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border/50">
                {recentTreatments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-primary/40 text-sm">
                      No recent treatments in the network ledger.
                    </td>
                  </tr>
                ) : (
                  recentTreatments.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-secondary/40 transition-colors group">
                      <td className="px-6 py-4 font-medium text-primary whitespace-nowrap">{tx.farmId}</td>
                      <td className="px-6 py-4">
                        <span 
                          onClick={() => {
                            const tagMatch = tx.details.match(/Tag #(\d+)/i) || tx.details.match(/animal (\S+)/i);
                            const tagId = tagMatch ? (tagMatch[1].startsWith('TAG') ? tagMatch[1] : `TAG-${tagMatch[1]}`) : 'Unknown';
                            if (onTagClick) onTagClick(tagId);
                          }}
                          className="inline-block whitespace-nowrap font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors"
                        >
                          {tx.details.match(/Tag #(\d+)/i) ? `TAG-${tx.details.match(/Tag #(\d+)/i)[1]}` : (tx.details.match(/animal (\S+)/i) ? tx.details.match(/animal (\S+)/i)[1] : 'Unknown')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-primary">{tx.action}</div>
                        <div className="text-xs text-primary/50 mt-0.5 font-mono">{tx.details}</div>
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

export default VetDashboard;
