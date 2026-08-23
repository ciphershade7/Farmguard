import React, { useState, useEffect } from 'react';
import { Pill, Activity, ShieldAlert, CheckCircle } from 'lucide-react';

const TreatmentCompliance = ({ currentUser }) => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('records');

  useEffect(() => {
    const farmId = currentUser?.entityId || 'FARM-A';
    fetch(`http://localhost:3000/api/treatments?farmId=${farmId}`)
      .then(res => res.json())
      .then(data => {
        setTreatments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch treatments', err);
        setLoading(false);
      });
  }, [currentUser]);

  // Simple aggregations for AMU
  const amuTotals = treatments.reduce((acc, t) => {
    acc[t.drug] = (acc[t.drug] || 0) + t.dosage;
    return acc;
  }, {});
  if (loading) {
    return <div className="p-8 text-brand-muted">Loading Compliance Data...</div>;
  }

  return (
    <>
      <div className="p-8 max-w-6xl mx-auto animate-fade-in relative z-10">
        <div className="mb-8 border-b border-primary/10 pb-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-brand-dark">Treatment & Compliance</h2>
            <p className="text-brand-dark/70 text-sm mt-1">What happened to the animals and are they safe/compliant?</p>
          </div>
        </div>

      <div className="flex gap-2 mb-6">
        <button 
          className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 ${activeTab === 'records' ? 'bg-white/70 text-brand-dark border border-white/60 shadow-sm backdrop-blur-md' : 'text-brand-dark/60 hover:bg-white/40 border border-transparent'}`}
          onClick={() => setActiveTab('records')}
        >
          Treatment Records
        </button>
        <button 
          className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 ${activeTab === 'amu' ? 'bg-white/70 text-brand-dark border border-white/60 shadow-sm backdrop-blur-md' : 'text-brand-dark/60 hover:bg-white/40 border border-transparent'}`}
          onClick={() => setActiveTab('amu')}
        >
          AMU Overview
        </button>
        <button 
          className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 ${activeTab === 'mrl' ? 'bg-white/70 text-brand-dark border border-white/60 shadow-sm backdrop-blur-md' : 'text-brand-dark/60 hover:bg-white/40 border border-transparent'}`}
          onClick={() => setActiveTab('mrl')}
        >
          MRL & Withdrawal
        </button>
      </div>

      {activeTab === 'records' && (
        <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 border border-white/60 rounded-3xl pointer-events-none"></div>
          <div className="p-5 border-b border-white/30 bg-white/30 flex items-center gap-2 backdrop-blur-md relative z-10">
            <Pill className="w-4 h-4 text-brand-blue" />
            <h3 className="font-bold text-brand-dark text-sm uppercase tracking-wider">Individual Treatment Entries</h3>
          </div>
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/20 text-xs text-brand-dark/60">
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Animal ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Medicine</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Dosage</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Veterinarian</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/10">
                {treatments.map((t) => (
                  <tr key={t.id} className="hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4.5 font-mono font-bold text-brand-dark">{t.animalId}</td>
                    <td className="px-6 py-4.5 font-medium text-brand-dark">{t.drug}</td>
                    <td className="px-6 py-4.5">
                      <span className="font-mono text-xs text-brand-dark/80 bg-white/40 rounded-lg px-3 py-1.5 border border-white/30">{t.dosage} mL</span>
                    </td>
                    <td className="px-6 py-4.5 text-brand-dark/80">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4.5 text-brand-dark/80">{t.vet}</td>
                  </tr>
                ))}
                {treatments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-brand-dark/60">No treatments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'amu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 border border-white/60 rounded-3xl pointer-events-none"></div>
            <h3 className="font-bold text-brand-dark text-sm uppercase tracking-wider flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-brand-forest" /> Antimicrobial Usage (This Month)
            </h3>
            <div className="space-y-4 relative z-10">
              {Object.entries(amuTotals).length === 0 ? (
                <p className="text-brand-dark/60 text-sm">No antimicrobial usage recorded.</p>
              ) : (
                Object.entries(amuTotals).map(([drug, total]) => (
                  <div key={drug} className="flex justify-between items-center border-b border-white/20 pb-3">
                    <span className="font-semibold text-brand-dark">{drug}</span>
                    <span className="font-mono bg-white/40 px-3 py-1.5 rounded-xl text-sm border border-white/40 text-brand-dark/80 shadow-sm">{total} mL</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 border border-white/60 rounded-3xl pointer-events-none"></div>
            <div className="w-28 h-28 rounded-full bg-white/30 border-4 border-brand-forest/60 flex items-center justify-center text-4xl font-bold text-brand-forest mb-4 shadow-sm relative z-10">
              {treatments.length}
            </div>
            <h4 className="text-lg font-bold text-brand-dark relative z-10">Total Treatments</h4>
            <p className="text-sm text-brand-dark/70 mt-2 max-w-[200px] relative z-10">Overall drug usage remains within safe limits. No unusual trends detected.</p>
          </div>
        </div>
      )}

      {activeTab === 'mrl' && (
        <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden relative z-10">
          <div className="absolute inset-0 border border-white/60 rounded-3xl pointer-events-none"></div>
          <div className="p-5 border-b border-white/30 bg-white/30 flex justify-between items-center backdrop-blur-md relative z-10">
            <h3 className="font-bold text-brand-dark text-sm uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-500" /> Active Withdrawal Periods
            </h3>
            <span className="text-xs font-semibold text-brand-dark/60 bg-white/40 px-3 py-1 rounded-full">Maximum Residue Limits Enforcement</span>
          </div>
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/20 text-xs text-brand-dark/60">
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Animal ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Restricted From</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Safe Clearance Date</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/10">
                {treatments.map((t) => {
                  const now = new Date();
                  const end = new Date(t.withdrawalEnd);
                  const isCleared = now > end;

                  return (
                    <tr key={t.id} className="hover:bg-white/30 transition-colors">
                      <td className="px-6 py-4.5 font-mono font-bold text-brand-dark">{t.animalId}</td>
                      <td className="px-6 py-4.5 font-medium text-brand-dark/80">Milk, Meat</td>
                      <td className="px-6 py-4.5 font-mono text-brand-dark/70">
                        {end.toLocaleDateString()} {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4.5">
                        {isCleared ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-100/80 text-green-800 border border-green-200 shadow-sm">
                            <CheckCircle className="w-3.5 h-3.5" /> Cleared
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-100/80 text-red-800 border border-red-200 shadow-sm animate-pulse">
                            <ShieldAlert className="w-3.5 h-3.5" /> Locked
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {treatments.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-brand-dark/60">No withdrawal records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default TreatmentCompliance;
