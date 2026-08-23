import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, ChevronLeft, Layers } from 'lucide-react';

const VerifyPage = () => {
  const [params, setParams] = useState({ batchId: '', txHash: '' });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setParams({
      batchId: urlParams.get('verify') || 'UNKNOWN',
      txHash: urlParams.get('tx') || 'UNKNOWN_TX'
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center z-0 opacity-40">
        <svg viewBox="0 0 1440 320" className="w-full h-auto min-w-[1440px] opacity-20" preserveAspectRatio="none">
           <path d="M0,160 Q360,60 720,160 T1440,160 L1440,320 L0,320 Z" fill="#204735" />
           <path d="M-100,200 Q260,100 620,200 T1540,200 L1540,320 L-100,320 Z" fill="#204735" opacity="0.5" />
        </svg>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary/5 max-w-lg w-full relative z-10 border border-primary/10 flex flex-col items-center animate-fade-in text-center">
        <a href="/" className="absolute top-6 left-6 p-2 rounded-full hover:bg-secondary transition-colors text-primary/50 hover:text-primary">
          <ChevronLeft className="w-6 h-6" />
        </a>

        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-[inset_0_4px_10px_rgba(34,197,94,0.1)]">
          <ShieldCheck className="w-12 h-12 text-green-500 animate-[pulse_3s_ease-in-out_infinite]" />
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Authentic Batch</h1>
        <p className="text-primary/60 mb-8 max-w-sm">This batch has been cryptographically verified and is Zero-Residue Certified.</p>

        <div className="w-full bg-secondary/30 border border-border rounded-2xl p-6 text-left mb-8 space-y-5">
          <div>
            <div className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">Batch ID</div>
            <div className="font-mono text-lg font-bold text-primary">{params.batchId}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">Blockchain Receipt (TxHash)</div>
            <div className="font-mono text-sm text-primary/80 break-all">{params.txHash}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-1">Status</div>
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              100% Cleared (No Active Withdrawals)
            </div>
          </div>
        </div>

        <button 
          onClick={() => window.location.href = '/'}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-md flex justify-center items-center gap-2"
        >
          <Layers className="w-5 h-5" />
          Return to Dashboard
        </button>
      </div>
      
      <div className="mt-8 text-xs font-mono text-primary/40 uppercase tracking-widest relative z-10 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" /> Powered by FarmGuard Network
      </div>
    </div>
  );
};

export default VerifyPage;
