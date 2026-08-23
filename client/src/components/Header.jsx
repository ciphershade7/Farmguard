import React, { useState } from 'react';
import { Globe, Syringe, FileText } from 'lucide-react';

const Header = ({ onLogDose, onGeneratePass, userRole }) => {
  const [language, setLanguage] = useState('EN');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'BN' : 'EN');
  };

  return (
    <header className="bg-[#FAF9F6]/80 backdrop-blur-xl border-b border-primary/10 px-6 py-4 flex justify-between items-center z-10 sticky top-0 shadow-sm relative overflow-hidden">
      {/* Crisp, Minimalist Scenery (Non-distorting) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-end justify-center">
        <svg viewBox="0 0 1440 64" className="w-full h-auto min-w-[1440px] opacity-40" preserveAspectRatio="xMidYMax meet">
           {/* Sun */}
           <circle cx="1200" cy="20" r="24" fill="#B85E3E" opacity="0.15" />
           
           {/* Background Mountains */}
           <path d="M0,64 L200,30 L400,64 Z" fill="#204735" opacity="0.03" />
           <path d="M300,64 L550,20 L800,64 Z" fill="#204735" opacity="0.04" />
           <path d="M700,64 L900,25 L1100,64 Z" fill="#204735" opacity="0.03" />
           <path d="M1000,64 L1250,15 L1500,64 Z" fill="#204735" opacity="0.04" />

           {/* Gentle Rolling Hills */}
           <path d="M0,64 Q360,30 720,64 T1440,50 L1440,64 L0,64 Z" fill="#204735" opacity="0.05" />
           <path d="M-100,64 Q260,40 620,64 T1540,60 L1540,64 L-100,64 Z" fill="#204735" opacity="0.07" />
           
           {/* Flocking Birds */}
           <path d="M1100,30 Q1103,27 1106,30 Q1109,27 1112,30" fill="none" stroke="#163828" strokeWidth="1" opacity="0.2" />
           <path d="M1090,35 Q1094,31 1098,35 Q1102,31 1106,35" fill="none" stroke="#163828" strokeWidth="1" opacity="0.2" />
           <path d="M1120,25 Q1122,23 1124,25 Q1126,23 1128,25" fill="none" stroke="#163828" strokeWidth="1" opacity="0.2" />
        </svg>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Network Connected"></div>
          <div className="text-xs text-primary/70 font-mono hidden md:block">
            Block: #894921
          </div>
        </div>
        
        <div className="h-4 w-px bg-primary/20 mx-2 hidden md:block"></div>
        
        <button
          onClick={toggleLanguage}
          className="flex h-8 items-center gap-2 rounded-md px-3 text-[0.8125rem] font-medium text-primary/80 transition-colors duration-200 hover:bg-primary/[0.06] hover:text-primary cursor-pointer"
          aria-label="Change Language"
        >
          <Globe className="w-4 h-4" />
          <span>{language}</span>
        </button>
      </div>
      
      <div className="flex gap-3">
        {(userRole === 'farmer' || userRole === 'vet') && (
          <button 
            onClick={onLogDose}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium text-sm transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Syringe className="w-4 h-4" />
            Record Treatment
          </button>
        )}
        {(userRole === 'admin' || userRole === 'vet') && (
          <button 
            onClick={onGeneratePass}
            className="flex items-center gap-2 bg-white/80 hover:bg-white text-primary border border-primary/10 px-4 py-2 rounded-md font-medium text-sm transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Generate Batch Pass
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

