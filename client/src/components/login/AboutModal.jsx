import React, { useEffect, useState } from 'react';
import { X, Network, Leaf, ShieldCheck } from 'lucide-react';

export function AboutModal({ isOpen, onClose }) {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsRendered(true));
    } else {
      setIsRendered(false);
    }
  }, [isOpen]);

  if (!isOpen && !isRendered) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'opacity-100 bg-black/20 backdrop-blur-sm' : 'opacity-0 bg-transparent pointer-events-none'}`}>
      <div 
        className={`relative w-full max-w-4xl bg-[#F4F4F5] rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col md:flex-row ${isRendered ? 'translate-y-0 scale-100' : 'translate-y-12 scale-95 opacity-0'}`}
      >
        {/* Abstract Art Side */}
        <div className="md:w-[45%] bg-[#E5E7EB] relative overflow-hidden flex items-end justify-center min-h-[250px]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F4F4F5]/50 to-transparent z-10 pointer-events-none" />
          
          {/* Abstract SVG Landscape matching reference vibe */}
          <svg viewBox="0 0 400 500" className="w-full h-full object-cover" preserveAspectRatio="xMidYMax slice">
            <defs>
              <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F4F4F5" />
                <stop offset="100%" stopColor="#E2E8F0" />
              </linearGradient>
            </defs>
            <rect width="400" height="500" fill="url(#sky)" />
            
            {/* Sun */}
            <circle cx="300" cy="280" r="60" fill="#D98C6C" />
            
            {/* Distant Hills */}
            <path d="M0,350 Q100,300 200,330 T400,310 L400,500 L0,500 Z" fill="#B2C2B8" />
            
            {/* Mid Hill */}
            <path d="M-50,420 Q150,280 300,380 T500,380 L500,500 L-50,500 Z" fill="#8EA397" />
            
            {/* Front Hill */}
            <path d="M-20,500 Q150,380 350,450 T500,450 L500,500 L-20,500 Z" fill="#698576" />
            
            {/* Minimalist Barn */}
            <g transform="translate(80, 310)">
              <rect x="0" y="30" width="30" height="60" fill="#3A5343" rx="15" ry="15" />
              <rect x="0" y="45" width="30" height="45" fill="#3A5343" />
              <polygon points="30,45 60,20 120,20 120,45" fill="#C9947E" />
              <rect x="30" y="45" width="90" height="45" fill="#D9A08A" />
              <rect x="55" y="65" width="20" height="25" fill="#2E4034" />
            </g>

            {/* Simple Cow Silhouettes */}
            <g transform="translate(240, 430) scale(0.6)" fill="#2E4034">
              <path d="M0,20 Q5,10 15,10 L35,10 Q45,15 45,25 L45,35 L40,35 L40,25 L30,25 L30,45 L25,45 L25,25 L10,25 L10,45 L5,45 Z" />
              <circle cx="45" cy="15" r="5" />
            </g>
            <g transform="translate(180, 450) scale(0.4)" fill="#2E4034">
              <path d="M0,20 Q5,10 15,10 L35,10 Q45,15 45,25 L45,35 L40,35 L40,25 L30,25 L30,45 L25,45 L25,25 L10,25 L10,45 L5,45 Z" />
              <circle cx="45" cy="15" r="5" />
            </g>
          </svg>
        </div>

        {/* Content Side */}
        <div className="md:w-[55%] p-10 md:p-14 flex flex-col justify-center relative">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mb-4 inline-flex items-center justify-center p-3 bg-[#E2E8F0] text-[#3A5343] rounded-2xl w-12 h-12">
            <Network className="w-6 h-6" />
          </div>
          
          <h2 className="text-4xl font-serif text-[#18181B] tracking-tight mb-6">About FarmGuard</h2>
          
          <div className="space-y-6 text-[#52525B] leading-relaxed">
            <p className="text-[0.95rem]">
              FarmGuard is a decentralized traceability ledger designed to enforce antibiotic withdrawal periods in dairy supply chains. 
            </p>
            <div className="h-px w-12 bg-gray-300"></div>
            <p className="text-[0.95rem]">
              By logging veterinary treatments on an immutable blockchain, processors can mathematically verify that milk batches are zero-residue and safe for human consumption, solving the critical SIH problem statement.
            </p>
          </div>
          
          <div className="mt-10 flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#3A5343] uppercase">
              <Leaf className="w-4 h-4" /> Immutable
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#3A5343] uppercase">
              <ShieldCheck className="w-4 h-4" /> Verifiable
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
