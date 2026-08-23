import React from 'react';
import { X, Activity, Hash, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const AnimalDetailModal = ({ isOpen, onClose, tagId, animalData }) => {
  if (!isOpen) return null;

  // Dummy fallback data if animal is not found in the DB (for UI robustness)
  const data = animalData || {
    tagNumber: tagId,
    farmId: 'Unknown',
    species: 'Unknown',
    breed: 'Unknown',
    age: 'N/A',
    healthStatus: 'Unknown',
    withdrawalDays: 0
  };

  const isHealthy = data.healthStatus === 'Healthy' && data.withdrawalDays === 0;
  const isWarning = data.withdrawalDays > 0;
  const isCritical = data.healthStatus === 'Under Treatment' || data.healthStatus === 'Quarantine';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#E2E8F0]/80 backdrop-blur-md transition-opacity duration-300">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-primary/40 hover:text-primary transition-colors hover:scale-110 active:scale-95 cursor-pointer p-2 hover:bg-secondary rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary border border-border">
            <Hash className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary font-mono">{data.tagNumber}</h2>
            <p className="text-sm font-medium text-primary/60 mt-0.5">Animal Profile</p>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`p-4 rounded-xl border mb-6 flex items-start gap-3 ${
          isHealthy ? 'bg-green-50 border-green-200 text-green-800' :
          isCritical ? 'bg-red-50 border-red-200 text-red-800' :
          'bg-yellow-50 border-yellow-200 text-yellow-800'
        }`}>
          {isHealthy ? <CheckCircle2 className="w-5 h-5 mt-0.5" /> : 
           isCritical ? <AlertTriangle className="w-5 h-5 mt-0.5" /> :
           <Info className="w-5 h-5 mt-0.5" />}
          <div>
            <div className="font-bold text-sm">
              Status: {data.healthStatus}
            </div>
            {data.withdrawalDays > 0 && (
              <div className="text-xs font-medium opacity-80 mt-1">
                Active Withdrawal Period: {data.withdrawalDays} Days Remaining
              </div>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
            <div className="text-xs font-semibold text-primary/50 mb-1 uppercase tracking-wider">Farm ID</div>
            <div className="font-bold text-primary">{data.farmId}</div>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
            <div className="text-xs font-semibold text-primary/50 mb-1 uppercase tracking-wider">Species</div>
            <div className="font-bold text-primary">{data.species}</div>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
            <div className="text-xs font-semibold text-primary/50 mb-1 uppercase tracking-wider">Breed</div>
            <div className="font-bold text-primary">{data.breed}</div>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
            <div className="text-xs font-semibold text-primary/50 mb-1 uppercase tracking-wider">Age</div>
            <div className="font-bold text-primary">{data.age} Years</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default AnimalDetailModal;
