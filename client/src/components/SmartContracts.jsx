import React, { useState } from 'react';
import ContractSourceModal from './ContractSourceModal';

const SmartContracts = () => {
  const [selectedContract, setSelectedContract] = useState(null);
  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in relative z-10">
      <div className="mb-8 pb-4 border-b border-primary/10">
        <h2 className="text-3xl font-serif font-bold text-primary tracking-tight">Active Smart Contracts</h2>
        <p className="text-primary/70 text-sm mt-1">Manage deployed compliance contracts on the farm node.</p>
      </div>
      
      <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-5 border-b border-primary/10 bg-white/40 flex justify-between items-center">
            <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Deployed Contracts</h3>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/40 text-xs text-primary/60 border-b border-primary/10 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Contract Name</th>
                <th className="px-6 py-4 font-semibold">Address</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5 text-sm">
              <tr className="hover:bg-white/40 transition-colors">
                <td className="px-6 py-4 font-bold text-primary">Withdrawal Period Enforcer</td>
                <td className="px-6 py-4 font-mono text-xs text-primary/50">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</td>
                <td className="px-6 py-4"><span className="bg-green-500/10 text-green-700 border border-green-500/20 px-2 py-1 text-xs font-bold rounded-md">ACTIVE</span></td>
                <td className="px-6 py-4"><button onClick={() => setSelectedContract('Withdrawal Period Enforcer')} className="text-brand-terracotta hover:underline text-xs font-semibold cursor-pointer transition-colors">View Source</button></td>
              </tr>
              <tr className="hover:bg-white/40 transition-colors">
                <td className="px-6 py-4 font-bold text-primary">Batch Certifier (Zero-Residue)</td>
                <td className="px-6 py-4 font-mono text-xs text-primary/50">0x111122223333444455556666777788889999aAaa</td>
                <td className="px-6 py-4"><span className="bg-green-500/10 text-green-700 border border-green-500/20 px-2 py-1 text-xs font-bold rounded-md">ACTIVE</span></td>
                <td className="px-6 py-4"><button onClick={() => setSelectedContract('Batch Certifier')} className="text-brand-terracotta hover:underline text-xs font-semibold cursor-pointer transition-colors">View Source</button></td>
              </tr>
              <tr className="hover:bg-white/40 transition-colors">
                <td className="px-6 py-4 font-bold text-primary">Quality Metrics Auditor</td>
                <td className="px-6 py-4 font-mono text-xs text-primary/50">0x0000000000000000000000000000000000000000</td>
                <td className="px-6 py-4"><span className="bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2 py-1 text-xs font-bold rounded-md">DEPLOYING</span></td>
                <td className="px-6 py-4"><button className="text-primary/30 text-xs font-semibold cursor-not-allowed">Pending</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <ContractSourceModal 
        isOpen={!!selectedContract} 
        onClose={() => setSelectedContract(null)} 
        contractTitle={selectedContract || ''} 
      />
    </div>
  );
};

export default SmartContracts;
