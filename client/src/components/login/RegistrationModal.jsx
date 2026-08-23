import React, { useState, useEffect } from 'react';
import { LoaderCircle, Check, X, ShieldCheck, Stethoscope, Tractor } from 'lucide-react';

export function RegistrationModal({ isOpen, onClose }) {
  const [status, setStatus] = useState('idle'); // idle, submitting, success
  const [isRendered, setIsRendered] = useState(false);
  const [role, setRole] = useState('farmer'); // 'farmer' or 'vet'

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsRendered(true));
    } else {
      setIsRendered(false);
      setTimeout(() => {
        setStatus('idle');
        setRole('farmer');
      }, 500); // reset after exit animation
    }
  }, [isOpen]);

  if (!isOpen && !isRendered) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'opacity-100 bg-[#E2E8F0]/80 backdrop-blur-md' : 'opacity-0 bg-transparent pointer-events-none'}`}>
      <div 
        className={`relative w-full max-w-md bg-white rounded-3xl p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isRendered ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'}`}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-[#8EA397]/20 rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-[#3A5343]" />
            </div>
            <h2 className="text-3xl font-serif text-[#18181B] tracking-tight mb-4">Request Sent</h2>
            <p className="text-[0.95rem] text-[#52525B] leading-relaxed mb-8">
              {role === 'farmer' 
                ? "A field officer has been assigned to verify your holding. You will receive an SMS when your digital identity is ready." 
                : "Your application for the Vet Examination has been received. You will receive an email with your test schedule and portal access."}
            </p>
            <button 
              onClick={onClose} 
              className="w-full py-3.5 bg-[#F4F4F5] text-[#18181B] rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-serif text-[#18181B] tracking-tight mb-2">Registration</h2>
            <p className="text-sm text-[#71717A] mb-6">Select your role to continue.</p>
            
            {/* Role Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
              <button 
                type="button"
                onClick={() => setRole('farmer')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'farmer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Tractor className="w-4 h-4" /> Farmer
              </button>
              <button 
                type="button"
                onClick={() => setRole('vet')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'vet' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Stethoscope className="w-4 h-4" /> Veterinarian
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {role === 'farmer' ? (
                <>
                  <div className="relative group">
                    <input 
                      required 
                      type="text" 
                      id="farmName"
                      className="peer w-full p-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#8EA397] focus:ring-1 focus:ring-[#8EA397] focus:outline-none transition-all text-sm text-gray-900 placeholder-transparent" 
                      placeholder="Farm Name" 
                    />
                    <label 
                      htmlFor="farmName"
                      className="absolute left-4 top-2 text-[0.65rem] font-semibold tracking-wider text-gray-400 uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[0.65rem] peer-focus:text-[#8EA397] peer-focus:uppercase peer-focus:font-semibold"
                    >
                      Farm / Holding Name
                    </label>
                  </div>

                  <div className="relative group">
                    <input 
                      required 
                      type="text" 
                      id="district"
                      className="peer w-full p-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#8EA397] focus:ring-1 focus:ring-[#8EA397] focus:outline-none transition-all text-sm text-gray-900 placeholder-transparent" 
                      placeholder="District" 
                    />
                    <label 
                      htmlFor="district"
                      className="absolute left-4 top-2 text-[0.65rem] font-semibold tracking-wider text-gray-400 uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[0.65rem] peer-focus:text-[#8EA397] peer-focus:uppercase peer-focus:font-semibold"
                    >
                      District Location
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <input 
                        required 
                        type="number" 
                        min="1"
                        id="cattle"
                        className="peer w-full p-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#8EA397] focus:ring-1 focus:ring-[#8EA397] focus:outline-none transition-all text-sm text-gray-900 placeholder-transparent" 
                        placeholder="Count" 
                      />
                      <label 
                        htmlFor="cattle"
                        className="absolute left-4 top-2 text-[0.65rem] font-semibold tracking-wider text-gray-400 uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[0.65rem] peer-focus:text-[#8EA397] peer-focus:uppercase peer-focus:font-semibold"
                      >
                        Cattle
                      </label>
                    </div>
                    <div className="relative group">
                      <input 
                        required 
                        type="tel"
                        id="phone"
                        className="peer w-full p-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#8EA397] focus:ring-1 focus:ring-[#8EA397] focus:outline-none transition-all text-sm text-gray-900 placeholder-transparent" 
                        placeholder="Phone" 
                      />
                      <label 
                        htmlFor="phone"
                        className="absolute left-4 top-2 text-[0.65rem] font-semibold tracking-wider text-gray-400 uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[0.65rem] peer-focus:text-[#8EA397] peer-focus:uppercase peer-focus:font-semibold"
                      >
                        Phone
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative group">
                    <input 
                      required 
                      type="text" 
                      id="fullName"
                      className="peer w-full p-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#8EA397] focus:ring-1 focus:ring-[#8EA397] focus:outline-none transition-all text-sm text-gray-900 placeholder-transparent" 
                      placeholder="Full Name" 
                    />
                    <label 
                      htmlFor="fullName"
                      className="absolute left-4 top-2 text-[0.65rem] font-semibold tracking-wider text-gray-400 uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[0.65rem] peer-focus:text-[#8EA397] peer-focus:uppercase peer-focus:font-semibold"
                    >
                      Legal Full Name
                    </label>
                  </div>

                  <div className="relative group">
                    <input 
                      required 
                      type="text" 
                      id="licenseNum"
                      className="peer w-full p-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#8EA397] focus:ring-1 focus:ring-[#8EA397] focus:outline-none transition-all text-sm text-gray-900 placeholder-transparent" 
                      placeholder="License Number (Optional)" 
                    />
                    <label 
                      htmlFor="licenseNum"
                      className="absolute left-4 top-2 text-[0.65rem] font-semibold tracking-wider text-gray-400 uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[0.65rem] peer-focus:text-[#8EA397] peer-focus:uppercase peer-focus:font-semibold"
                    >
                      Medical License # (If Any)
                    </label>
                  </div>
                  
                  <div className="relative group">
                    <input 
                      required 
                      type="email"
                      id="email"
                      className="peer w-full p-4 pt-6 pb-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#8EA397] focus:ring-1 focus:ring-[#8EA397] focus:outline-none transition-all text-sm text-gray-900 placeholder-transparent" 
                      placeholder="Email Address" 
                    />
                    <label 
                      htmlFor="email"
                      className="absolute left-4 top-2 text-[0.65rem] font-semibold tracking-wider text-gray-400 uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[0.65rem] peer-focus:text-[#8EA397] peer-focus:uppercase peer-focus:font-semibold"
                    >
                      Email Address
                    </label>
                  </div>
                </>
              )}
              
              <button 
                disabled={status === 'submitting'} 
                type="submit" 
                className="w-full mt-2 py-4 bg-[#18181B] text-white rounded-xl font-medium text-sm hover:bg-[#27272A] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 shadow-[0_4px_14px_0_rgba(24,24,27,0.39)] hover:shadow-[0_6px_20px_rgba(24,24,27,0.23)] hover:-translate-y-px"
              >
                {status === 'submitting' && <LoaderCircle className="w-4 h-4 animate-spin" />}
                {status === 'submitting' 
                  ? 'Submitting...' 
                  : (role === 'farmer' ? 'Submit Farm Request' : 'Apply for Vet Exam')
                }
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
