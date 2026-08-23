import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SmartContracts from './components/SmartContracts';
import NetworkStatus from './components/NetworkStatus';
import LogDoseModal from './components/LogDoseModal';
import AnimalDetailModal from './components/AnimalDetailModal';
import MilkPassModal from './components/MilkPassModal';
import { LoginPage } from './components/login/LoginPage';

// Farmer Components
import FarmDashboard from './components/farmer/FarmDashboard';
import HerdRegistry from './components/farmer/HerdRegistry';
import TreatmentCompliance from './components/farmer/TreatmentCompliance';
import VetConsultation from './components/farmer/VetConsultation';

// Vet & Admin Components
import VetDashboard from './components/vet/VetDashboard';
import VetPatients from './components/vet/VetPatients';
import VetTreatment from './components/vet/VetTreatment';
import VetMRL from './components/vet/VetMRL';
import VetConsultations from './components/vet/VetConsultations';
import VetAMU from './components/vet/VetAMU';
import SystemAnalytics from './components/admin/SystemAnalytics';
import FarmMonitor from './components/admin/FarmMonitor';
import VerifyPage from './components/VerifyPage';

function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('farmguard_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('farmguard_auth') === 'true';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('farmguard_user');
    return saved ? JSON.parse(saved) : { role: 'farmer', entityId: 'FARM-A' };
  });
  // Derived role for convenience
  const userRole = currentUser?.role || 'farmer';
  const [isLogDoseOpen, setIsLogDoseOpen] = useState(false);
  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [isMilkPassOpen, setIsMilkPassOpen] = useState(false);
  const [generatedTxHash, setGeneratedTxHash] = useState(null);
  const [isVerifyRoute, setIsVerifyRoute] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const role = currentUser?.role || 'farmer';
    if (role === 'farmer') return 'farm_dashboard';
    if (role === 'vet') return 'vet_dashboard';
    if (role === 'admin') return 'dashboard';
    return 'dashboard';
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('verify')) {
      setIsVerifyRoute(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'farmer' && currentUser?.entityId) {
      fetch(`http://localhost:3000/api/dashboard?farmId=${currentUser.entityId}`)
        .then(res => res.json())
        .then(fetchedData => setData(fetchedData))
        .catch(err => console.error("Error fetching data: ", err));
    } else if (isAuthenticated && (currentUser?.role === 'admin' || currentUser?.role === 'vet')) {
      fetch(`http://localhost:3000/api/dashboard`)
        .then(res => res.json())
        .then(fetchedData => setData(fetchedData))
        .catch(err => console.error("Error fetching data: ", err));
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      localStorage.setItem('farmguard_data', JSON.stringify(data));
    }
  }, [data]);

  const handleLogin = (user, remember) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    
    let defaultTab = 'dashboard';
    if (user.role === 'farmer') defaultTab = 'farm_dashboard';
    if (user.role === 'vet') defaultTab = 'vet_dashboard';
    if (user.role === 'admin') defaultTab = 'dashboard';
    setActiveTab(defaultTab);
    
    if (remember) {
      localStorage.setItem('farmguard_auth', 'true');
      localStorage.setItem('farmguard_user', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser({ role: 'farmer', entityId: 'FARM-A' });
    setActiveTab('farm_dashboard');
    localStorage.removeItem('farmguard_auth');
    localStorage.removeItem('farmguard_user');
    localStorage.removeItem('farmguard_data');
  };

  const handleTagClick = (tagId) => {
    setSelectedTagId(tagId);
    setIsAnimalModalOpen(true);
  };

  const handleAddTreatment = (treatmentData) => {
    if (!data) return;

    fetch('http://localhost:3000/api/log-dose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(treatmentData),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          // Re-fetch data from server to stay perfectly in sync
          const farmId = currentUser?.entityId || 'FARM-A';
          const url = (currentUser?.role === 'admin' || currentUser?.role === 'vet')
            ? 'http://localhost:3000/api/dashboard' 
            : `http://localhost:3000/api/dashboard?farmId=${farmId}`;
            
          fetch(url)
            .then(res => res.json())
            .then(fetchedData => setData(fetchedData))
            .catch(err => console.error("Error fetching data: ", err));
        }
      })
      .catch((err) => console.error("Error logging dose: ", err));
  };

  const handleGeneratePass = () => {
    if (!data) return;
    const farmId = currentUser?.entityId || 'FARM-A';
    
    fetch('http://localhost:3000/api/generate-pass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ farmId })
    })
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          const url = (currentUser?.role === 'admin' || currentUser?.role === 'vet')
            ? 'http://localhost:3000/api/dashboard' 
            : `http://localhost:3000/api/dashboard?farmId=${farmId}`;
            
          fetch(url)
            .then(res => res.json())
            .then(fetchedData => {
              setData(fetchedData);
              setGeneratedTxHash(response.txHash);
              setIsMilkPassOpen(true);
            })
            .catch(err => console.error("Error fetching data: ", err));
        }
      })
      .catch(err => console.error("Error generating pass: ", err));
  };

  const renderContent = () => {
    // Admin Tabs
    if (activeTab === 'dashboard') return <Dashboard data={data} />;
    if (activeTab === 'contracts') return <SmartContracts />;
    if (activeTab === 'network') return <NetworkStatus />;
    if (activeTab === 'farm_monitor') return <FarmMonitor />;
    if (activeTab === 'system_analytics' || activeTab === 'admin_dashboard') return <SystemAnalytics />;
    
    // Farmer Tabs
    if (activeTab === 'farm_dashboard') return <FarmDashboard currentUser={currentUser} />;
    if (activeTab === 'herd') return <HerdRegistry currentUser={currentUser} onTagClick={handleTagClick} />;
    if (activeTab === 'treatments') return <TreatmentCompliance currentUser={currentUser} />;
    if (activeTab === 'vet') return <VetConsultation currentUser={currentUser} />;
    
    // Vet Tabs (vet_dashboard, vet_patients, vet_treatment, vet_mrl, vet_consultations, vet_amu)
    if (activeTab === 'vet_dashboard') return <VetDashboard data={data} setActiveTab={setActiveTab} onTagClick={handleTagClick} currentUser={currentUser} />;
    if (activeTab === 'vet_patients') return <VetPatients data={data} setActiveTab={setActiveTab} onTagClick={handleTagClick} currentUser={currentUser} />;
    if (activeTab === 'vet_treatment') return <VetTreatment data={data} onLogDose={() => setIsLogDoseOpen(true)} onTagClick={handleTagClick} currentUser={currentUser} />;
    if (activeTab === 'vet_mrl') return <VetMRL data={data} onTagClick={handleTagClick} currentUser={currentUser} />;
    if (activeTab === 'vet_consultations') return <VetConsultations data={data} currentUser={currentUser} />;
    if (activeTab === 'vet_amu') return <VetAMU data={data} currentUser={currentUser} />;
    
    // Default fallback
    return data ? (
      <Dashboard data={data} />
    ) : (
      <div className="h-full flex items-center justify-center text-gray-400 font-mono text-sm">
        Syncing Ledger...
      </div>
    );
  };

  if (isVerifyRoute) {
    return <VerifyPage />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background-login font-sans antialiased relative">
      {/* Clean background with paper grain */}
      <div
        aria-hidden="true"
        className="paper-grain pointer-events-none absolute inset-0 text-primary/[0.03] z-0"
      />
      
      {/* Decorative SVGs in background to make it look cool */}
      <div className="absolute top-0 right-0 pointer-events-none z-0 overflow-hidden w-full h-full">
        {/* Large abstract mesh hanging from top right */}
        <svg className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] text-primary/[0.04] transform rotate-12" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 Q50,100 100,50 T200,0" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M-20,0 Q30,120 120,30 T220,0" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M-40,0 Q10,140 140,10 T240,0" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M-60,0 Q-10,160 160,-10 T260,0" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 2" />
          <circle cx="120" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="0.2" />
        </svg>

        {/* Abstract floating tech nodes hanging */}
        <svg className="absolute top-[10%] right-[15%] w-64 h-96 text-primary/[0.06]" viewBox="0 0 100 200" fill="none" stroke="currentColor">
           <line x1="50" y1="0" x2="50" y2="150" strokeWidth="0.5" strokeDasharray="2 4" />
           <circle cx="50" cy="150" r="4" fill="currentColor" />
           <circle cx="50" cy="150" r="12" strokeWidth="0.5" />
           <line x1="80" y1="0" x2="80" y2="80" strokeWidth="0.5" strokeDasharray="1 3" />
           <circle cx="80" cy="80" r="2" fill="currentColor" />
           <line x1="20" y1="0" x2="20" y2="110" strokeWidth="0.5" strokeDasharray="2 4" />
           <circle cx="20" cy="110" r="3" fill="currentColor" />
           <circle cx="20" cy="110" r="8" strokeWidth="0.5" strokeDasharray="1 1" />
        </svg>

        {/* BrandMark Watermark on bottom left */}
        <div className="absolute bottom-10 left-[20%] opacity-[0.02] transform -rotate-12 scale-150">
           <svg viewBox="0 0 32 32" fill="none" className="w-96 h-96 text-primary">
             <path d="M16 2.5 27 6.2v9.1c0 6.6-4.4 12.3-11 14.2-6.6-1.9-11-7.6-11-14.2V6.2L16 2.5Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
             <path d="M16 22.5v-6.2m0 0c0-3 2.3-5.4 5.2-5.4 0 3-2.3 5.4-5.2 5.4Zm0 0c0-3-2.3-5.4-5.2-5.4 0 3 2.3 5.4 5.2 5.4Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
           </svg>
        </div>
      </div>
      
      <div className="flex h-full w-full z-10 relative">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} userRole={userRole} />
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header 
          onLogDose={() => setIsLogDoseOpen(true)} 
          onGeneratePass={handleGeneratePass}
          userRole={userRole}
        />
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
      </div>

      <LogDoseModal 
        isOpen={isLogDoseOpen} 
        onClose={() => setIsLogDoseOpen(false)} 
        onSubmit={handleAddTreatment}
      />
      <AnimalDetailModal
        isOpen={isAnimalModalOpen}
        onClose={() => setIsAnimalModalOpen(false)}
        tagId={selectedTagId}
        animalData={data?.animals?.find(a => a.tagNumber === selectedTagId)}
      />
      <MilkPassModal 
        isOpen={isMilkPassOpen} 
        onClose={() => setIsMilkPassOpen(false)} 
        batchId={data?.batchStatus?.batchId || 'BCH-UNKNOWN'} 
        txHash={generatedTxHash}
      />
      </div>
    </div>
  );
}

export default App;
