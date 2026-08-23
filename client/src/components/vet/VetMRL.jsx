import React, { useState } from 'react';
import { Beaker, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const VetMRL = ({ data, onTagClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in relative z-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pr-rise" style={{ animationDelay: '0ms' }}>
        <div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-none">MRL / Withdrawal</h2>
          <p className="text-primary/60 text-sm mt-3 max-w-xl">Track Maximum Residue Limits and withdrawal periods across all farms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pr-rise" style={{ animationDelay: '100ms' }}>
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-primary/50 uppercase tracking-widest">Active Withdrawals</h3>
            <div className="p-2 bg-orange-500/10 rounded-md">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="text-4xl font-serif font-bold text-orange-500 mt-6">12</div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-primary/50 uppercase tracking-widest">Ending Today</h3>
            <div className="p-2 bg-blue-500/10 rounded-md">
              <AlertTriangle className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="text-4xl font-serif font-bold text-primary mt-6">3</div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-primary/50 uppercase tracking-widest">Cleared This Week</h3>
            <div className="p-2 bg-green-500/10 rounded-md">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="text-4xl font-serif font-bold text-green-500 mt-6">24</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow pr-rise" style={{ animationDelay: '200ms' }}>
        <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center">
          <h3 className="font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-2">
            <Beaker className="w-4 h-4 text-brand-forest" /> Active Withdrawal Tracker
          </h3>
        </div>
        <div className="p-8 bg-background/50">
          <div className="space-y-8">
            {[
              { tag: 'TAG-104', farm: 'FARM-A', drug: 'Amoxicillin', percent: 20, remaining: '14 Days' },
              { tag: 'TAG-088', farm: 'FARM-A', drug: 'Amoxicillin', percent: 95, remaining: '12 Hours' },
              { tag: 'TAG-042', farm: 'FARM-B', drug: 'Oxytetracycline', percent: 60, remaining: '5 Days' },
              { tag: 'TAG-045', farm: 'FARM-C', drug: 'Penicillin G', percent: 100, remaining: 'Cleared Today' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span 
                        onClick={() => onTagClick?.(item.tag)}
                        className="font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors"
                      >{item.tag}</span>
                      <span className="text-[10px] text-primary/50 font-bold uppercase tracking-wider bg-secondary/50 px-2 py-0.5 rounded-md border border-border">{item.farm}</span>
                    </div>
                    <p className="text-xs text-primary/70 mt-1">Treatment: <span className="font-medium text-primary">{item.drug}</span></p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${item.percent === 100 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : item.percent > 90 ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-primary/5 text-primary border border-primary/10'}`}>
                      {item.remaining}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full ${item.percent === 100 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-brand-forest shadow-[0_0_10px_rgba(45,212,191,0.5)]'}`} 
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-primary/40 uppercase mt-2">
                  <span>Day 0</span>
                  <span>{item.percent}% Complete</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetMRL;
