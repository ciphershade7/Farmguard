import React from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout, userRole = 'farmer' }) => {
  const profileDetails = {
    farmer: { initials: 'FM', name: 'R. Kadam', id: 'ID: FRM-233' },
    vet: { initials: 'RV', name: 'Dr. R. Verma', id: 'ID: VET-800' },
    admin: { initials: 'AD', name: 'System Admin', id: 'ID: ADM-001' }
  };
  
  const profile = profileDetails[userRole] || profileDetails.farmer;

  
  const getTabClass = (tabId) => {
    return activeTab === tabId 
      ? "flex items-center gap-3 px-3 py-2 bg-white/15 text-white rounded-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] text-sm font-medium transition-all"
      : "flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-all text-sm font-medium cursor-pointer";
  };

  return (
    <aside className="w-64 bg-[#163828] text-white flex flex-col z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)]">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-8 h-8 bg-[#204735] rounded-md flex items-center justify-center text-white shadow-sm border border-white/10">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-serif font-bold text-xl leading-tight text-white">FarmGuard</h1>
          <p className="text-[10px] tracking-widest text-white/60 uppercase font-mono mt-1">Traceability Node</p>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto relative">
        <ul className="space-y-2 relative z-10">
          {userRole === 'farmer' && (
            <>
              <li>
                <button onClick={() => setActiveTab('farm_dashboard')} className={`w-full text-left ${getTabClass('farm_dashboard')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                  Farm Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('herd')} className={`w-full text-left ${getTabClass('herd')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  Herd Registry
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('treatments')} className={`w-full text-left ${getTabClass('treatments')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                  Treatment & Compliance
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('vet')} className={`w-full text-left ${getTabClass('vet')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                  Vet Consultation
                </button>
              </li>
            </>
          )}
          
          {userRole === 'vet' && (
            <>
              <li>
                <button onClick={() => setActiveTab('vet_dashboard')} className={`w-full text-left ${getTabClass('vet_dashboard')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                  Vet Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('vet_patients')} className={`w-full text-left ${getTabClass('vet_patients')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  Patients / Herd
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('vet_treatment')} className={`w-full text-left ${getTabClass('vet_treatment')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                  Treatment Management
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('vet_mrl')} className={`w-full text-left ${getTabClass('vet_mrl')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  MRL / Withdrawal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('vet_consultations')} className={`w-full text-left ${getTabClass('vet_consultations')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  Consultations
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('vet_amu')} className={`w-full text-left ${getTabClass('vet_amu')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  AMU Analytics
                </button>
              </li>
            </>
          )}

          {userRole === 'admin' && (
            <>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left ${getTabClass('dashboard')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                  Ledger Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contracts')} className={`w-full text-left ${getTabClass('contracts')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                  Smart Contracts
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('network')} className={`w-full text-left ${getTabClass('network')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  Network Status
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('farm_monitor')} className={`w-full text-left ${getTabClass('farm_monitor')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  Farm / Batch Monitoring
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('system_analytics')} className={`w-full text-left ${getTabClass('system_analytics')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                  System Analytics
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('blockchain_dashboard')} className={`w-full text-left ${getTabClass('blockchain_dashboard')}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Blockchain Dashboard
                </button>
              </li>
            </>
          )}
        </ul>
        
        {/* Decorative Landscape Illustration in empty space */}
        <div className="absolute bottom-0 left-0 w-full h-56 pointer-events-none opacity-60 overflow-hidden flex items-end z-0">
          <svg viewBox="0 0 200 150" className="w-full h-full object-cover" preserveAspectRatio="xMidYMax slice">
            {/* Sun */}
            <circle cx="160" cy="50" r="30" fill="#B85E3E" opacity="0.9" />
            
            {/* Flocking Birds */}
            <path d="M120,40 Q122,35 124,40 Q126,35 128,40" fill="none" stroke="#163828" strokeWidth="1" opacity="0.5" />
            <path d="M110,48 Q113,44 116,48 Q119,44 122,48" fill="none" stroke="#163828" strokeWidth="1" opacity="0.5" />
            <path d="M135,45 Q137,42 139,45 Q141,42 143,45" fill="none" stroke="#163828" strokeWidth="1" opacity="0.5" />

            {/* Background Hill */}
            <path d="M0,90 Q50,60 120,80 T200,70 L200,150 L0,150 Z" fill="#1C4230" />
            
            {/* Midground Hill */}
            <path d="M-20,110 Q60,80 140,100 T220,85 L220,150 L-20,150 Z" fill="#204735" />
            
            {/* Windmill Silhouette */}
            <rect x="165" y="70" width="4" height="25" fill="#163828" />
            <path d="M167,75 L155,65 L167,75 L179,65 L167,75 L167,60 Z" fill="none" stroke="#163828" strokeWidth="1.5" />
            <circle cx="167" cy="75" r="2" fill="#B85E3E" />

            {/* Foreground Hill */}
            <path d="M-10,125 Q80,100 160,120 T210,110 L210,150 L-10,150 Z" fill="#24513B" />
            
            {/* Barn/House Silhouette */}
            <path d="M40,100 L65,100 L65,120 L40,120 Z" fill="#B85E3E" opacity="0.8" />
            <path d="M35,100 L52.5,85 L70,100 Z" fill="#A04F34" />
            <rect x="50" y="110" width="8" height="10" fill="#163828" />
            
            {/* Tree Silhouette */}
            <path d="M25,120 L25,95 Q30,80 35,95 L35,120 Z" fill="#1A3F2C" />
            <path d="M80,125 L80,110 Q83,100 86,110 L86,125 Z" fill="#1A3F2C" opacity="0.8" />
            <path d="M15,125 L15,110 Q17,105 19,110 L19,125 Z" fill="#1A3F2C" opacity="0.7" />
            
            {/* Tiny animal silhouettes */}
            <rect x="110" y="115" width="6" height="4" rx="1" fill="#163828" opacity="0.7" />
            <rect x="110" y="119" width="1.5" height="3" fill="#163828" opacity="0.7" />
            <rect x="114.5" y="119" width="1.5" height="3" fill="#163828" opacity="0.7" />
            
            <rect x="130" y="122" width="5" height="3" rx="1" fill="#163828" opacity="0.7" />
            <rect x="130" y="125" width="1" height="2" fill="#163828" opacity="0.7" />
            <rect x="134" y="125" width="1" height="2" fill="#163828" opacity="0.7" />
          </svg>
        </div>
      </nav>

      <div className="p-4 border-t border-white/5 mx-3 mb-3 bg-[#0E271C] rounded-lg flex items-center justify-between shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] relative z-10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-md bg-[#204735] flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm border border-white/10">
            {profile.initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white/90 truncate">{profile.name}</p>
            <p className="text-[10px] text-white/50 font-mono truncate">{profile.id}</p>
          </div>
        </div>
        <button 
          onClick={onLogout} 
          className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-md transition-colors flex-shrink-0 cursor-pointer hover:scale-105 active:scale-95"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
