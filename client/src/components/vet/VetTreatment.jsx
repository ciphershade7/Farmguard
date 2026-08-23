import React, { useState } from 'react';
import { Pill, CheckCircle2, FileText } from 'lucide-react';

const VetTreatment = ({ data, onLogDose, onTagClick }) => {
  const [clearedTags, setClearedTags] = useState([]);

  // Extract recent treatments from ledger
  const recentTreatments = (data?.ledger || [])
    .filter(entry => entry.action.includes('Treatment') || entry.action.includes('Antibiotic') || entry.action.includes('Health'));

  const handleApprove = (tagId) => {
    setClearedTags([...clearedTags, tagId]);
  };


  return (
    <>
      <div className="p-8 max-w-7xl mx-auto relative z-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pr-rise" style={{ animationDelay: '0ms' }}>
        <div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-none">Treatment Management</h2>
          <p className="text-primary/60 text-sm mt-3 max-w-xl">Log new treatments, monitor active cases, and approve animals for clearance.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onLogDose}
            className="px-5 py-2.5 bg-brand-forest text-white font-medium text-sm rounded-lg hover:bg-brand-forest/90 transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Pill className="w-4 h-4" /> Log New Treatment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pr-rise" style={{ animationDelay: '100ms' }}>
        
        {/* Pending Clearances */}
        <div className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm relative">
          <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center relative z-10">
            <h3 className="font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Pending Clearances
            </h3>
          </div>
          <div className="p-0 overflow-auto custom-scrollbar bg-background/50 relative z-10">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-background/80 sticky top-0 backdrop-blur-md z-10 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Tag ID</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Farm</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Medication</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Withdrawal Cleared</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr className="hover:bg-secondary/40 transition-colors group">
                  <td className="px-6 py-4">
                    <span 
                      onClick={() => onTagClick('TAG-104')}
                      className="inline-block whitespace-nowrap font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors"
                    >TAG-104</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-primary whitespace-nowrap">FARM-A</td>
                  <td className="px-6 py-4 text-primary/80">Amoxicillin</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-700 border border-green-500/20 text-xs font-bold tracking-wide">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Cleared (0 hrs)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {clearedTags.includes('TAG-104') ? (
                      <span className="px-4 py-1.5 bg-green-50 text-green-700 border border-green-200 font-medium text-xs rounded-lg flex items-center justify-center gap-1 w-full max-w-[140px] ml-auto">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    ) : (
                      <button onClick={() => handleApprove('TAG-104')} className="px-4 py-1.5 bg-card border border-border text-primary font-medium text-xs rounded-lg hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 w-full max-w-[140px] ml-auto">
                        Approve Clearance
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Network Treatment Log */}
        <div className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm relative pr-rise" style={{ animationDelay: '200ms' }}>
          <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center relative z-10">
            <h3 className="font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-forest" /> Network Treatment Log
            </h3>
          </div>
          <div className="p-0 overflow-auto custom-scrollbar bg-background/50 relative z-10">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-background/80 sticky top-0 backdrop-blur-md z-10 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Tag ID</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Farm</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Medication & Dosage</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Administered By</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentTreatments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-primary/40 text-sm">
                      No treatments found in the network ledger.
                    </td>
                  </tr>
                ) : (
                  recentTreatments.map((tx, idx) => {
                    const tagMatch = tx.details.match(/Tag #(\d+)/i) || tx.details.match(/animal (\S+)/i);
                    const tagId = tagMatch ? (tagMatch[1].startsWith('TAG') ? tagMatch[1] : `TAG-${tagMatch[1]}`) : 'Unknown';
                    const drugMatch = tx.details.match(/([a-zA-Z]+) \(/i) || tx.details.match(/(Amoxicillin|Ceftiofur|Penicillin|Oxytetracycline)/i) || [null, 'Treatment'];
                    const drug = drugMatch[1];

                    return (
                      <tr key={idx} className="hover:bg-secondary/40 transition-colors group">
                        <td className="px-6 py-4">
                          <span 
                            onClick={() => onTagClick(tagId)}
                            className="inline-block whitespace-nowrap font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors"
                          >{tagId}</span>
                        </td>
                        <td className="px-6 py-4 font-medium text-primary whitespace-nowrap">{tx.farmId}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-primary">{tx.action.includes('Treatment Logged') ? drug : tx.action}</div>
                          <div className="text-xs text-primary/50 mt-0.5 font-mono">{tx.details}</div>
                        </td>
                        <td className="px-6 py-4 text-primary/80">{tx.actor}</td>
                        <td className="px-6 py-4 text-primary/60 font-mono text-xs text-right">
                          {new Date(tx.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default VetTreatment;
