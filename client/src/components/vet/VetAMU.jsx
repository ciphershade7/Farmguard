import React from 'react';
import { Activity, TrendingDown, ShieldCheck, Download, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const VetAMU = ({ data: _data }) => {
  const handleExport = () => {
    window.print();
  };

  const trendData = [
    { name: 'Week 1', amoxicillin: 120, oxytetracycline: 80, ceftiofur: 40 },
    { name: 'Week 2', amoxicillin: 100, oxytetracycline: 90, ceftiofur: 35 },
    { name: 'Week 3', amoxicillin: 140, oxytetracycline: 70, ceftiofur: 45 },
    { name: 'Week 4', amoxicillin: 90,  oxytetracycline: 110, ceftiofur: 30 },
  ];

  return (
    <>
      <div className="p-8 max-w-7xl mx-auto relative z-10 print:hidden">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pr-rise" style={{ animationDelay: '0ms' }}>
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-none">AMU Analytics</h2>
            <p className="text-primary/60 text-sm mt-3 max-w-xl">Antimicrobial Usage trends and compliance reporting across all monitored herds.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              className="px-5 py-2.5 bg-card border border-border text-primary font-medium text-sm rounded-lg hover:bg-secondary transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4" /> Export PDF Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pr-rise" style={{ animationDelay: '100ms' }}>
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <h3 className="text-xs font-bold text-primary/50 uppercase tracking-widest">Total AMU (Last 30 Days)</h3>
              <div className="p-2 bg-brand-forest/10 rounded-md">
                <Activity className="w-5 h-5 text-brand-forest" />
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between relative z-10">
              <span className="text-4xl font-serif font-bold text-brand-forest">450 mL</span>
              <span className="text-xs font-bold text-green-700 flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-md mb-1 border border-green-500/20">
                <TrendingDown className="w-3 h-3" /> 12%
              </span>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <h3 className="text-xs font-bold text-primary/50 uppercase tracking-widest">Compliance Rate</h3>
              <div className="p-2 bg-blue-500/10 rounded-md">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="text-4xl font-serif font-bold text-primary mt-6 relative z-10">100%</div>
          </div>

          <div className="bg-card border border-brand-terracotta-badge/30 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-terracotta-badge/50"></div>
            <div className="flex justify-between items-start relative z-10">
              <h3 className="text-xs font-bold text-brand-terracotta-badge uppercase tracking-widest">High Usage Farms</h3>
              <div className="p-2 bg-brand-terracotta-badge/10 rounded-md">
                <AlertTriangle className="w-5 h-5 text-brand-terracotta-badge" />
              </div>
            </div>
            <div className="text-4xl font-serif font-bold text-brand-terracotta-badge mt-6 relative z-10">1</div>
            <p className="text-[10px] text-brand-terracotta-badge/70 mt-2 font-mono relative z-10 bg-brand-terracotta-badge/10 px-2 py-0.5 rounded border border-brand-terracotta-badge/20 w-fit">FARM-B EXCEEDS BENCHMARK</p>
          </div>
        </div>

        {/* --- TREND CHART --- */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-8 pr-rise" style={{ animationDelay: '150ms' }}>
          <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center">
            <h3 className="font-bold text-primary text-sm uppercase tracking-wider">
              Antimicrobial Usage Trends (30 Days)
            </h3>
            <div className="flex gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-forest"></div> Amoxicillin</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-terracotta-badge"></div> Oxytetracycline</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Ceftiofur</div>
            </div>
          </div>
          <div className="p-6 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#204735" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#204735" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOxy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E25C3E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E25C3E" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCef" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.87 0.02 120 / 0.5)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(0.33 0.058 156 / 0.6)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(0.33 0.058 156 / 0.6)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'oklch(0.982 0.011 88)', borderRadius: '12px', border: '1px solid oklch(0.87 0.02 120)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="amoxicillin" stroke="#204735" strokeWidth={3} fillOpacity={1} fill="url(#colorAmx)" />
                <Area type="monotone" dataKey="oxytetracycline" stroke="#E25C3E" strokeWidth={3} fillOpacity={1} fill="url(#colorOxy)" />
                <Area type="monotone" dataKey="ceftiofur" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCef)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pr-rise" style={{ animationDelay: '200ms' }}>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
            <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center">
              <h3 className="font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-2">
                Usage by Farm
              </h3>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-center gap-8 bg-background/50">
              <div>
                <div className="flex justify-between text-xs font-bold text-primary/70 mb-3">
                  <span>FARM-A</span>
                  <span>120 mL</span>
                </div>
                <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                  <div className="h-3 rounded-full bg-brand-forest shadow-[0_0_10px_rgba(45,212,191,0.5)]" style={{ width: '30%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-bold text-primary/70 mb-3">
                  <span>FARM-B <span className="text-brand-terracotta-badge ml-2 border border-brand-terracotta-badge/30 px-2 py-0.5 rounded text-[10px] uppercase bg-brand-terracotta-badge/10">High</span></span>
                  <span>280 mL</span>
                </div>
                <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                  <div className="h-3 rounded-full bg-brand-terracotta-badge shadow-[0_0_10px_rgba(226,92,62,0.5)]" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-primary/70 mb-3">
                  <span>FARM-C</span>
                  <span>50 mL</span>
                </div>
                <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                  <div className="h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
            <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center">
              <h3 className="font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-2">
                Common Antibiotics Prescribed
              </h3>
            </div>
            <div className="p-0 overflow-auto bg-background/50 h-full">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-background/80 sticky top-0 backdrop-blur-md z-10 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Drug Class</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50">Specific Drug</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-primary/50 text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr className="hover:bg-secondary/40 transition-colors">
                    <td className="px-6 py-5 font-medium text-primary">Penicillins</td>
                    <td className="px-6 py-5 text-primary/70">Amoxicillin</td>
                    <td className="px-6 py-5 text-right font-bold text-brand-forest">45%</td>
                  </tr>
                  <tr className="hover:bg-secondary/40 transition-colors">
                    <td className="px-6 py-5 font-medium text-primary">Tetracyclines</td>
                    <td className="px-6 py-5 text-primary/70">Oxytetracycline</td>
                    <td className="px-6 py-5 text-right font-bold text-brand-forest">35%</td>
                  </tr>
                  <tr className="hover:bg-secondary/40 transition-colors">
                    <td className="px-6 py-5 font-medium text-primary">Cephalosporins</td>
                    <td className="px-6 py-5 text-primary/70">Ceftiofur</td>
                    <td className="px-6 py-5 text-right font-bold text-brand-forest">20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* --- PRINT ONLY LAYOUT --- */}
      <div className="hidden print:block print:bg-white print:text-black print:p-10 font-serif">
        <div className="border-b-2 border-black pb-6 mb-8 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">FarmGuard</h1>
          <h2 className="text-2xl font-bold text-gray-700">Official AMU Analytics Report</h2>
          <p className="text-gray-500 font-sans text-sm mt-2">Generated on: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 uppercase tracking-widest text-gray-600">Executive Summary</h3>
          <div className="grid grid-cols-2 gap-8 font-sans">
            <div className="border border-gray-300 p-4 rounded bg-gray-50">
              <div className="text-gray-500 text-sm uppercase font-bold mb-1">Total AMU (Last 30 Days)</div>
              <div className="text-3xl font-bold text-black">450 mL <span className="text-sm font-normal text-gray-600">(↓ 12% YoY)</span></div>
            </div>
            <div className="border border-gray-300 p-4 rounded bg-gray-50">
              <div className="text-gray-500 text-sm uppercase font-bold mb-1">Compliance Rate</div>
              <div className="text-3xl font-bold text-black">100%</div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 uppercase tracking-widest text-gray-600">Usage By Facility</h3>
          <table className="w-full text-left font-sans border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b border-gray-300 font-bold uppercase text-sm">Farm ID</th>
                <th className="p-3 border-b border-gray-300 font-bold uppercase text-sm text-right">Volume (mL)</th>
                <th className="p-3 border-b border-gray-300 font-bold uppercase text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-gray-300">FARM-A</td>
                <td className="p-3 border-b border-gray-300 text-right">120 mL</td>
                <td className="p-3 border-b border-gray-300">Normal</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border-b border-gray-300 font-bold">FARM-B</td>
                <td className="p-3 border-b border-gray-300 text-right font-bold text-red-600">280 mL</td>
                <td className="p-3 border-b border-gray-300 text-red-600 font-bold">Exceeds Benchmark</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-gray-300">FARM-C</td>
                <td className="p-3 border-b border-gray-300 text-right">50 mL</td>
                <td className="p-3 border-b border-gray-300">Normal</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-16">
          <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 uppercase tracking-widest text-gray-600">Prescription Breakdown</h3>
          <table className="w-full text-left font-sans border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b border-gray-300 font-bold uppercase text-sm">Drug Class</th>
                <th className="p-3 border-b border-gray-300 font-bold uppercase text-sm">Specific Drug</th>
                <th className="p-3 border-b border-gray-300 font-bold uppercase text-sm text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-gray-200">Penicillins</td>
                <td className="p-3 border-b border-gray-200">Amoxicillin</td>
                <td className="p-3 border-b border-gray-200 text-right">45%</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border-b border-gray-200">Tetracyclines</td>
                <td className="p-3 border-b border-gray-200">Oxytetracycline</td>
                <td className="p-3 border-b border-gray-200 text-right">35%</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-gray-200">Cephalosporins</td>
                <td className="p-3 border-b border-gray-200">Ceftiofur</td>
                <td className="p-3 border-b border-gray-200 text-right">20%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-300 flex justify-between font-sans">
          <div className="text-center w-64">
            <div className="border-b-2 border-black mb-2 h-10"></div>
            <p className="text-sm font-bold uppercase">Veterinarian Signature</p>
            <p className="text-xs text-gray-500 mt-1">Dr. R. Verma (ID: VET-800)</p>
          </div>
          <div className="text-center w-64">
            <div className="border-b-2 border-black mb-2 h-10"></div>
            <p className="text-sm font-bold uppercase">Official Stamp / Seal</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VetAMU;


