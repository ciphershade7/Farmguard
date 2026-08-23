import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';
const HerdRegistry = ({ currentUser, onTagClick }) => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const farmId = currentUser?.entityId || 'FARM-A';
    fetch(`http://localhost:3000/api/animals?farmId=${farmId}`)
      .then(res => res.json())
      .then(data => {
        setAnimals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch animals', err);
        setLoading(false);
      });
  }, [currentUser]);

  const filteredAnimals = animals.filter(a => 
    a.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.healthStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-brand-muted">Loading Herd Registry...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in relative z-10">
      <div className="mb-8 border-b border-primary/10 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-brand-dark">Herd Registry</h2>
          <p className="text-brand-dark/70 text-sm mt-1">Complete list of animals on the farm.</p>
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search tag or status..." 
            className="pl-10 pr-4 py-2.5 bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-forest focus:bg-white/60 transition-all text-sm w-72 placeholder:text-brand-dark/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 text-brand-dark/50 absolute left-4 top-3" />
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden relative">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 border border-white/60 rounded-3xl pointer-events-none"></div>
        
        <div className="p-5 border-b border-white/30 bg-white/30 flex justify-between items-center backdrop-blur-md relative z-10">
          <h3 className="font-bold text-brand-dark text-sm uppercase tracking-wider">All Animals</h3>
          <button className="flex items-center gap-2 text-xs font-medium text-brand-dark bg-white/50 border border-white/40 px-4 py-2 rounded-xl hover:bg-white/70 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer">
            <Filter className="w-3.5 h-3.5" /> Filter List
          </button>
        </div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-xs text-brand-dark/60">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Animal ID</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Species / Breed</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Age</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Health Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Withdrawal</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/10">
              {filteredAnimals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-brand-dark/60">No animals found.</td>
                </tr>
              ) : (
                filteredAnimals.map((animal) => (
                  <tr key={animal.tagNumber} className="hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4.5">
                      <span 
                        onClick={() => onTagClick?.(animal.tagNumber)}
                        className="font-mono font-bold text-brand-dark bg-white/50 px-2 py-1 rounded-md border border-white/60 cursor-pointer hover:bg-white/80 transition-colors"
                      >
                        {animal.tagNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="font-medium text-brand-dark">{animal.species}</div>
                      <div className="text-xs text-brand-dark/60">{animal.breed}</div>
                    </td>
                    <td className="px-6 py-4.5 text-brand-dark/80">{animal.age} yrs</td>
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm ${
                        animal.healthStatus === 'Healthy' 
                          ? 'bg-green-100/80 text-green-800 border border-green-200' 
                          : animal.healthStatus === 'Quarantine' 
                            ? 'bg-red-100/80 text-red-800 border border-red-200'
                            : 'bg-orange-100/80 text-orange-800 border border-orange-200'
                      }`}>
                        {animal.healthStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      {animal.withdrawalDays > 0 ? (
                        <div className="flex items-center gap-2 text-brand-terracotta-badge font-bold text-xs">
                          <AlertCircle className="w-4 h-4" />
                          {animal.withdrawalDays} days left
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-700 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          Cleared
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HerdRegistry;
