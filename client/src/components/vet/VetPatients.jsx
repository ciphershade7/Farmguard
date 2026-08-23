import React, { useState } from 'react';
import { Users, Filter, Search, Tag, Activity, ArrowUpRight } from 'lucide-react';

const VetPatients = ({ data, onTagClick, setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-8 max-w-7xl mx-auto relative z-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pr-rise" style={{ animationDelay: '0ms' }}>
        <div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-none">Patients / Herd</h2>
          <p className="text-primary/60 text-sm mt-3 max-w-xl">Overview of all active livestock across your assigned network of farms.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 text-primary/40 absolute left-3 top-1/2 transform -translate-y-1/2 group-hover:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search Tag ID or Farm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest transition-all w-64 shadow-sm"
            />
          </div>
          <button className="px-4 py-2 bg-card border border-border text-primary font-medium text-sm rounded-lg hover:bg-secondary transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pr-rise" style={{ animationDelay: '100ms' }}>
        <div className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm relative">
          <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center relative z-10">
            <h3 className="font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-forest" /> Active Roster
            </h3>
          </div>
          <div className="p-0 overflow-auto custom-scrollbar bg-background/50 relative z-10">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-background/80 sticky top-0 backdrop-blur-md z-10 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Farm / Owner</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Tag ID</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Breed / Type</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Health Status</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Last Checkup</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {/* Demo Data Row 1 */}
                <tr className="hover:bg-secondary/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-primary">FARM-A</div>
                    <div className="text-xs text-primary/50 mt-0.5">John Doe</div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      onClick={() => onTagClick('TAG-104')}
                      className="inline-block whitespace-nowrap font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors"
                    >TAG-104</span>
                  </td>
                  <td className="px-6 py-4 text-primary/80">Holstein</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-700 border border-green-500/20 text-xs font-bold tracking-wide">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Healthy
                    </span>
                  </td>
                  <td className="px-6 py-4 text-primary/60 font-mono text-xs">Aug 12, 2026</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setActiveTab('vet_treatment')} className="text-brand-forest hover:text-brand-forest/70 font-semibold text-xs flex items-center gap-1 ml-auto cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                      View History <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>

                {/* Demo Data Row 2 */}
                <tr className="hover:bg-secondary/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-primary">FARM-B</div>
                    <div className="text-xs text-primary/50 mt-0.5">Jane Smith</div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      onClick={() => onTagClick('TAG-042')}
                      className="inline-block whitespace-nowrap font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors"
                    >TAG-042</span>
                  </td>
                  <td className="px-6 py-4 text-primary/80">Jersey</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-700 border border-orange-500/20 text-xs font-bold tracking-wide">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div> Observation
                    </span>
                  </td>
                  <td className="px-6 py-4 text-primary/60 font-mono text-xs">Aug 20, 2026</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setActiveTab('vet_treatment')} className="text-brand-forest hover:text-brand-forest/70 font-semibold text-xs flex items-center gap-1 ml-auto cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                      View History <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
                
                {/* Demo Data Row 3 */}
                <tr className="hover:bg-secondary/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-primary">FARM-A</div>
                    <div className="text-xs text-primary/50 mt-0.5">John Doe</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10">TAG-077</span>
                  </td>
                  <td className="px-6 py-4 text-primary/80">Holstein</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-700 border border-blue-500/20 text-xs font-bold tracking-wide">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Treatment
                    </span>
                  </td>
                  <td className="px-6 py-4 text-primary/60 font-mono text-xs">Aug 21, 2026</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setActiveTab('vet_treatment')} className="text-brand-forest hover:text-brand-forest/70 font-semibold text-xs flex items-center gap-1 ml-auto cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                      View History <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetPatients;
