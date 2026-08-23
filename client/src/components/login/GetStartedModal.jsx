import React, { useEffect, useState } from 'react';
import { X, ArrowRight, ShieldCheck, QrCode, PenTool } from 'lucide-react';

export function GetStartedModal({ isOpen, onClose }) {
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
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'opacity-100 bg-[#E2E8F0]/80 backdrop-blur-md' : 'opacity-0 bg-transparent pointer-events-none'}`}>
      <div 
        className={`relative w-full max-w-2xl bg-white rounded-[2rem] p-10 md:p-16 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isRendered ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-16 scale-95 opacity-0'}`}
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-4xl font-serif text-[#18181B] tracking-tight mb-12">How it works</h2>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          
          {/* Step 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-[3px] border-white bg-[#8EA397] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
              <PenTool className="w-4 h-4" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#3A5343] font-bold text-xs uppercase tracking-wider">Step 1</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Register Holding</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Field officers verify and register your farm on the blockchain network, minting your digital identity.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-[3px] border-white bg-[#C9947E] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#C9947E] font-bold text-xs uppercase tracking-wider">Step 2</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Log Treatments</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Vets log antibiotic doses. Smart contracts automatically calculate and enforce safe withdrawal periods.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-[3px] border-white bg-[#52525B] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
              <QrCode className="w-4 h-4" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#52525B] font-bold text-xs uppercase tracking-wider">Step 3</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Generate Passes</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Generate a mathematically verified Zero-Residue QR pass for the processor once the withdrawal period clears.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
