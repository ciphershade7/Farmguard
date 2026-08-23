import React, { useEffect, useState } from 'react';
import { X, FileText, CheckCircle2, Copy } from 'lucide-react';

const TxReceiptModal = ({ isOpen, onClose, transaction }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsRendered(true));
    } else {
      setIsRendered(false);
    }
  }, [isOpen]);

  if (!isOpen && !isRendered) return null;
  if (!transaction) return null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'opacity-100 bg-[#E2E8F0]/80 backdrop-blur-md' : 'opacity-0 bg-transparent pointer-events-none'}`}>
      <div 
        className={`relative w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col ${isRendered ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'}`}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#8EA397]/20 flex items-center justify-center text-[#3A5343]">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-serif text-[#18181B] tracking-tight">Transaction Receipt</h2>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <div>
              <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
              <div className="flex items-center gap-1.5 text-green-700 font-medium text-sm">
                <CheckCircle2 className="w-4 h-4" /> Success
              </div>
            </div>
            <div className="text-right">
              <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Block / Timestamp</p>
              <p className="text-sm font-mono text-gray-700">#894921 • {new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Transaction Hash</p>
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2">
                <p className="text-xs font-mono text-blue-600 truncate mr-2">{transaction.txHash}</p>
                <button onClick={handleCopy} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Action</p>
              <p className="text-sm text-gray-900 font-medium">{transaction.action}</p>
            </div>
            
            <div>
              <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Initiator</p>
              <p className="text-sm text-gray-900">{transaction.actor}</p>
            </div>

            <div>
              <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">On-Chain Data</p>
              <div className="bg-[#18181B] rounded-lg p-3 overflow-hidden relative group">
                <p className="text-xs font-mono text-green-400 leading-relaxed break-words">{transaction.details}</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-[#F4F4F5] text-[#18181B] rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Close Receipt
        </button>
      </div>
    </div>
  );
};

export default TxReceiptModal;
