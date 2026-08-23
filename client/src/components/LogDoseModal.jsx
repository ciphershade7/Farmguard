import React, { useState } from 'react';
import { LoaderCircle, X, ShieldAlert, PenTool } from 'lucide-react';

const LogDoseModal = ({ isOpen, onClose, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ tagId: '', drug: 'Amoxicillin', dosage: '', diagnosis: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSubmit) {
        onSubmit(formData);
      }
      onClose();
      // Reset form
      setFormData({ tagId: '', drug: 'Amoxicillin', dosage: '', diagnosis: '' });
    }, 1500);
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#E2E8F0]/80 backdrop-blur-md transition-opacity duration-300`}>
      <div 
        className={`relative w-full max-w-lg bg-white rounded-3xl p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col animate-in fade-in zoom-in-95 duration-300`}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#8EA397]/20 flex items-center justify-center text-[#3A5343]">
            <PenTool className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-serif text-[#18181B] tracking-tight">Record Treatment</h2>
        </div>
        <p className="text-sm text-[#71717A] mb-8">Securely log veterinary data to the blockchain.</p>
        
        <div className="bg-[#C9947E]/10 border border-[#C9947E]/20 p-4 rounded-xl flex gap-3 text-sm text-[#8B5A46] mb-8">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="leading-relaxed">Logging this treatment will cryptographically lock the animal's milk output until the calculated withdrawal period ends.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <input 
              required
              type="text" 
              id="tagId"
              value={formData.tagId}
              onChange={(e) => setFormData({...formData, tagId: e.target.value})}
              className="peer w-full p-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#8EA397] focus:ring-1 focus:ring-[#8EA397] focus:outline-none transition-all text-sm text-gray-900 placeholder-transparent font-mono" 
              placeholder="#104" 
            />
            <label 
              htmlFor="tagId"
              className="absolute left-4 top-2 text-[0.65rem] font-semibold tracking-wider text-gray-400 uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[0.65rem] peer-focus:text-[#8EA397] peer-focus:uppercase peer-focus:font-semibold"
            >
              Animal Tag ID
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <select 
                id="drug"
                value={formData.drug}
                onChange={(e) => setFormData({...formData, drug: e.target.value})}
                className="w-full p-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#8EA397] focus:ring-1 focus:ring-[#8EA397] focus:outline-none transition-all text-sm text-gray-900 appearance-none"
              >
                <option>Amoxicillin</option>
                <option>Ceftiofur</option>
                <option>Penicillin G</option>
              </select>
              <label 
                htmlFor="drug"
                className="absolute left-4 top-2 text-[0.65rem] font-semibold tracking-wider text-[#8EA397] uppercase"
              >
                Antimicrobial Drug
              </label>
            </div>
            <div className="relative group">
              <input 
                required
                type="number" 
                id="dosage"
                value={formData.dosage}
                onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                className="peer w-full p-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#8EA397] focus:ring-1 focus:ring-[#8EA397] focus:outline-none transition-all text-sm text-gray-900 placeholder-transparent font-mono" 
                placeholder="10" 
              />
              <label 
                htmlFor="dosage"
                className="absolute left-4 top-2 text-[0.65rem] font-semibold tracking-wider text-gray-400 uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[0.65rem] peer-focus:text-[#8EA397] peer-focus:uppercase peer-focus:font-semibold"
              >
                Dosage (mL)
              </label>
            </div>
          </div>

          <div className="relative group">
            <input 
              required
              type="text" 
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
              className="peer w-full p-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#8EA397] focus:ring-1 focus:ring-[#8EA397] focus:outline-none transition-all text-sm text-gray-900 placeholder-transparent" 
              placeholder="e.g. Mastitis" 
            />
            <label 
              htmlFor="diagnosis"
              className="absolute left-4 top-2 text-[0.65rem] font-semibold tracking-wider text-gray-400 uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[0.65rem] peer-focus:text-[#8EA397] peer-focus:uppercase peer-focus:font-semibold"
            >
              Diagnosis
            </label>
          </div>
          
          <button 
            disabled={isSubmitting}
            type="submit" 
            className="w-full mt-4 py-4 bg-[#18181B] text-white rounded-xl font-medium text-sm hover:bg-[#27272A] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 shadow-[0_4px_14px_0_rgba(24,24,27,0.39)] hover:shadow-[0_6px_20px_rgba(24,24,27,0.23)] hover:-translate-y-px"
          >
            {isSubmitting ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              <PenTool className="w-4 h-4" />
            )}
            {isSubmitting ? 'Signing Tx...' : 'Sign & Submit to Chain'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogDoseModal;
