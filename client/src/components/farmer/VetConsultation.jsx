import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Phone, Video, Calendar, UserRound, Send } from 'lucide-react';

const VetConsultation = ({ currentUser }) => {
  const [requestText, setRequestText] = useState('');
  const [consultations, setConsultations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatEndRef = useRef(null);
  
  const farmId = currentUser?.entityId || 'FARM-A';
  const vetId = (farmId === 'FARM-A' || farmId === 'FARM-B') ? 'VET-800' : 'VET-801'; // Mock routing

  const fetchConsultations = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/consultations?farmId=${farmId}`);
      const data = await res.json();
      // Sort oldest to newest for chat display
      const sorted = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setConsultations(sorted);
    } catch (error) {
      console.error("Error fetching consultations", error);
    }
  };

  useEffect(() => {
    fetchConsultations();
    const interval = setInterval(fetchConsultations, 5000);
    return () => clearInterval(interval);
  }, [farmId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consultations]);

  const submitRequest = async (type, overrideText = null) => {
    const textToSend = overrideText || requestText.trim();
    if (!textToSend && type !== 'Visit Request') return;
    
    setIsSubmitting(true);
    try {
      await fetch('http://localhost:3000/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmId: farmId,
          vetId: vetId,
          sender: 'Farmer',
          type: type,
          content: textToSend || 'I would like to schedule an in-person visit.'
        })
      });
      if (!overrideText) setRequestText('');
      fetchConsultations();
    } catch (error) {
      console.error("Error submitting request", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in relative z-10">
      <div className="mb-8 border-b border-primary/10 pb-4">
        <h2 className="text-3xl font-serif font-bold text-brand-dark">Vet Consultation</h2>
        <p className="text-brand-dark/70 text-sm mt-1">Connect with your assigned veterinarian for help and advice.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Vet Profile */}
        <div className="lg:col-span-1 bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden flex flex-col relative h-fit">
          <div className="absolute inset-0 border border-white/60 rounded-3xl pointer-events-none z-20"></div>
          
          <div className="h-32 bg-brand-forest/90 w-full relative z-0">
             <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')]"></div>
          </div>
          
          <div className="px-6 pb-8 flex flex-col items-center -mt-14 relative z-10">
            <div className="w-28 h-28 bg-[#FAF9F6] border-4 border-white/80 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm relative">
              <UserRound className="w-12 h-12 text-brand-forest" />
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            
            <h3 className="mt-5 text-xl font-serif font-bold text-brand-dark">Dr. {vetId === 'VET-800' ? 'R. Verma' : 'S. Patil'}</h3>
            <p className="text-sm text-brand-dark/70 font-medium mt-1">Senior Livestock Veterinarian</p>
            <div className="mt-3 text-xs font-mono bg-white/50 text-brand-dark px-3 py-1.5 rounded-xl border border-white/60 shadow-sm">ID: {vetId}</div>
            
            <div className="w-full mt-8 space-y-3">
              <button 
                onClick={() => submitRequest('Visit Request', 'I am officially requesting an in-person visit.')}
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 bg-brand-forest/90 backdrop-blur-md text-white py-3 rounded-2xl hover:bg-brand-forest hover:scale-105 active:scale-95 transition-all shadow-md font-medium text-sm border border-white/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                <Calendar className="w-4 h-4" /> Request a Visit
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex justify-center items-center gap-2 bg-white/50 backdrop-blur-sm border border-white/60 text-brand-dark py-2.5 rounded-2xl hover:bg-white/70 hover:scale-105 active:scale-95 transition-all font-medium text-sm shadow-sm cursor-pointer">
                  <Phone className="w-4 h-4" /> Call
                </button>
                <button className="flex justify-center items-center gap-2 bg-white/50 backdrop-blur-sm border border-white/60 text-brand-dark py-2.5 rounded-2xl hover:bg-white/70 hover:scale-105 active:scale-95 transition-all font-medium text-sm shadow-sm cursor-pointer">
                  <Video className="w-4 h-4" /> Video
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel - Chat UI */}
        <div className="lg:col-span-2 flex flex-col h-[600px] bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 border border-white/60 rounded-3xl pointer-events-none"></div>
          
          <div className="p-5 border-b border-white/30 bg-white/30 backdrop-blur-md relative z-10 flex justify-between items-center">
            <h3 className="font-bold text-brand-dark text-sm uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-forest" /> Conversation History
            </h3>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5 relative z-10">
            {consultations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-brand-dark/40 text-sm italic">
                <MessageSquare className="w-10 h-10 mb-3 opacity-20" />
                No messages yet. Send a request to start the conversation.
              </div>
            ) : (
              consultations.map((msg, i) => {
                const isFarmer = msg.sender === 'Farmer' || msg.farmId === msg.sender;
                return (
                  <div key={i} className={`flex flex-col max-w-[80%] ${isFarmer ? 'self-end items-end' : 'self-start items-start'}`}>
                    <div className={`p-3.5 rounded-2xl shadow-sm text-sm relative group border
                      ${isFarmer ? 
                        'bg-brand-forest text-white rounded-tr-none border-brand-forest/80' : 
                        'bg-white/80 backdrop-blur-sm text-brand-dark border-white/60 rounded-tl-none'}
                    `}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-brand-dark/50 mt-1.5 font-mono px-1">
                      {isFarmer ? 'You' : `Dr. ${vetId === 'VET-800' ? 'Verma' : 'Patil'}`} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-white/30 bg-white/40 backdrop-blur-md relative z-10">
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder={`Type a message to Dr. ${vetId === 'VET-800' ? 'Verma' : 'Patil'}...`} 
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitRequest('Reply')}
                className="flex-1 px-4 py-3 rounded-xl bg-white/60 border border-white/60 focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest text-sm transition-all shadow-inner placeholder:text-brand-dark/40 text-brand-dark"
              />
              <button 
                onClick={() => submitRequest('Reply')}
                disabled={isSubmitting || !requestText.trim()}
                className="px-5 py-3 bg-brand-forest text-white rounded-xl text-sm font-semibold hover:bg-brand-forest/90 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetConsultation;
