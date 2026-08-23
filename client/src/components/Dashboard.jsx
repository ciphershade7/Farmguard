import React, { useState } from 'react';
import TxReceiptModal from './TxReceiptModal';

const Dashboard = ({ data }) => {
  const [selectedTx, setSelectedTx] = useState(null);

  if (!data || !data.batchStatus) return null;

  const { batchStatus, ledger } = data;

  return (
    <div className="p-8 max-w-7xl mx-auto relative z-10">
      <div className="mb-10 pb-4 border-b border-border pr-rise" style={{ animationDelay: '0ms' }}>
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-clay uppercase mb-3">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          Immutable Ledger
        </p>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-none">Traceability Ledger</h2>
        <p className="text-primary/60 text-sm mt-3 max-w-xl">Immutable records of antimicrobial usage and batch compliance. Validated and synced across nodes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Batch Readiness Panel */}
        <div className="lg:col-span-4 bg-card border border-border p-8 rounded-2xl shadow-sm pr-rise relative overflow-hidden" style={{ animationDelay: '100ms' }}>
          <div className="paper-grain absolute inset-0 opacity-50"></div>
          
          <div className="relative z-10 flex justify-between items-center mb-8">
            <h3 className="font-bold text-primary/60 text-xs uppercase tracking-widest">Current Batch</h3>
            <span className="font-mono text-xs bg-secondary/50 text-primary px-2.5 py-1 rounded-md border border-border">{batchStatus.batchId}</span>
          </div>
          
          <div className="relative z-10 bg-background/50 p-6 rounded-xl border border-border mb-8 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div>
              <div className="text-xs text-primary/50 mb-1 font-mono uppercase tracking-widest">Status</div>
              <div className="text-2xl font-serif font-bold text-green-600 tracking-tight">{batchStatus.status}</div>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          
          <div className="relative z-10 space-y-5">
            <div className="flex justify-between items-end border-b border-border pb-3">
              <span className="text-sm text-primary/70 font-medium">Total Volume</span>
              <span className="font-mono text-sm font-bold text-primary">{batchStatus.totalLiters} L</span>
            </div>
            <div className="flex justify-between items-end border-b border-border pb-3">
              <span className="text-sm text-primary/70 font-medium">Cleared for processing</span>
              <span className="font-mono text-sm font-bold text-green-600">{batchStatus.safeToMilk} Heads</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-sm text-clay font-semibold">Active Withdrawal Lock</span>
              <span className="font-mono text-sm font-bold text-clay bg-clay/10 px-2 py-0.5 rounded border border-clay/20">{batchStatus.inWithdrawal} Locked</span>
            </div>
          </div>
        </div>

        {/* Traceability Ledger */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm pr-rise" style={{ animationDelay: '150ms' }}>
          <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center">
            <h3 className="font-bold text-primary text-sm uppercase tracking-wider">On-Chain Event Ledger</h3>
            <span className="text-xs font-mono text-primary/60 flex items-center gap-2 bg-background px-3 py-1.5 rounded-md border border-border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Auto-syncing...
            </span>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar bg-background/50">
            <table className="w-full text-left border-collapse">
              <thead className="bg-background/80 sticky top-0 backdrop-blur-md z-10 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Tx Hash</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Timestamp</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Event</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50 hidden sm:table-cell">Details</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border/50">
                {ledger.map((entry, i) => (
                  <tr key={i} className="hover:bg-secondary/40 transition-colors group">
                    <td className="px-6 py-5 font-mono text-xs">
                      <button 
                        onClick={() => setSelectedTx(entry)}
                        className="flex items-center gap-1.5 text-primary hover:text-clay transition-colors cursor-pointer text-left font-medium bg-secondary/50 px-2 py-1 rounded border border-border group-hover:border-primary/20"
                      >
                        {entry.txHash}
                        {entry.verified && <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>}
                      </button>
                    </td>
                    <td className="px-6 py-5 font-mono text-xs text-primary/50">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-semibold text-primary">{entry.action}</div>
                      <div className="text-xs text-primary/60 mt-0.5">{entry.actor}</div>
                    </td>
                    <td className="px-6 py-5 text-primary/70 hidden sm:table-cell text-xs max-w-[200px] truncate" title={entry.details}>
                      {entry.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <TxReceiptModal 
        isOpen={!!selectedTx} 
        onClose={() => setSelectedTx(null)} 
        transaction={selectedTx} 
      />
    </div>
  );
};

export default Dashboard;
