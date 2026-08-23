import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { X, CheckCircle2, ShieldCheck } from 'lucide-react';

const MilkPassModal = ({ isOpen, onClose, batchId, txHash }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsRendered(true));
    } else {
      setIsRendered(false);
    }
  }, [isOpen]);

  if (!isOpen && !isRendered) return null;

  // Change to a URL so phone cameras instantly recognize it as a scannable link during the pitch
  const displayHash = txHash || '0x8f3c71a39b4d11a29a12c4b5e6f7a8b9c0d1';
  
  // Use window.location.origin so it works correctly if they host it or use local IP
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://farmguard.network';
  const verificationPayload = `${baseUrl}/?verify=${batchId}&tx=${displayHash}`;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'opacity-100 bg-[#E2E8F0]/80 backdrop-blur-md' : 'opacity-0 bg-transparent pointer-events-none'}`}>
      <div 
        className={`relative w-full max-w-sm bg-white rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isRendered ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-12 scale-95 opacity-0'}`}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100 z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="pt-10 pb-8 px-6 flex flex-col items-center bg-gradient-to-b from-[#F4F4F5] to-white">
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] mb-8 flex justify-center border border-gray-100">
          <a href={verificationPayload} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform cursor-pointer block">
            <QRCode 
              value={verificationPayload}
              size={180}
              level="H"
              bgColor="#ffffff"
              fgColor="#18181B"
            />
          </a>
        </div>
          <h3 className="font-serif font-bold text-2xl text-[#18181B] mb-2 tracking-tight text-center">Batch Cleared</h3>
          <p className="text-xs font-mono text-[#8EA397] font-semibold uppercase tracking-widest">{batchId}</p>
        </div>
        
        <div className="bg-[#8EA397]/10 p-6 border-y border-[#8EA397]/20 flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-[#3A5343] shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#18181B]">Zero-Residue Certified</p>
            <p className="text-xs text-[#52525B] leading-relaxed mt-1">Smart contract verified 0 liters of withdrawal milk present in this batch.</p>
          </div>
        </div>

        <div className="p-6 bg-[#F4F4F5] flex items-center gap-3">
           <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0" />
           <div className="overflow-hidden">
             <p className="text-[0.65rem] text-gray-500 font-bold uppercase tracking-wider mb-1">Blockchain Receipt</p>
             <p className="text-xs font-mono text-gray-800 truncate">{displayHash}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MilkPassModal;
