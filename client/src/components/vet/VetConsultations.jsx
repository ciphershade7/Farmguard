import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Calendar, Video, Phone, Filter, Send } from 'lucide-react';

const VetConsultations = ({ data: _data }) => {
  const [messages, setMessages] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filterPending, setFilterPending] = useState(false);
  const chatEndRef = useRef(null);

  const fetchMessages = () => {
    fetch('http://localhost:3000/api/consultations?vetId=VET-800')
      .then(res => res.json())
      .then(data => {
        // Reverse because backend sends ORDER BY createdAt DESC, and we want oldest first for chat
        const sorted = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setMessages(sorted);
        
        if (sorted.length > 0) {
          setSelectedFarm(prev => {
            if (!prev) {
              // Select the farm from the most recent message (last in sorted array)
              return sorted[sorted.length - 1].farmId;
            }
            return prev;
          });
        }
      })
      .catch(err => console.error("Failed to fetch vet requests", err));
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Polling for new messages
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedFarm]);

  // Group messages by farmId
  const threads = messages.reduce((acc, msg) => {
    if (!acc[msg.farmId]) {
      acc[msg.farmId] = {
        farmId: msg.farmId,
        messages: [],
        lastUpdate: msg.createdAt,
        type: msg.type
      };
    }
    acc[msg.farmId].messages.push(msg);
    if (new Date(msg.createdAt) > new Date(acc[msg.farmId].lastUpdate)) {
      acc[msg.farmId].lastUpdate = msg.createdAt;
      acc[msg.farmId].type = msg.type;
    }
    return acc;
  }, {});

  const threadList = Object.values(threads).sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
  const filteredThreadList = filterPending ? threadList.filter(t => t.type === 'Visit Request') : threadList;
  const activeThread = selectedFarm ? threads[selectedFarm] : null;

  const handleSend = () => {
    if (!replyText.trim() || !selectedFarm) return;

    const payload = {
      farmId: selectedFarm,
      vetId: 'VET-800',
      sender: 'Vet',
      type: 'Reply',
      content: replyText.trim()
    };

    fetch('http://localhost:3000/api/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        setReplyText('');
        fetchMessages(); // refresh instantly
      })
      .catch(err => console.error("Failed to send message", err));
  };

  const handleScheduleVisit = () => {
    if (!selectedFarm) return;

    const payload = {
      farmId: selectedFarm,
      vetId: 'VET-800',
      sender: 'Vet',
      type: 'Visit Scheduled',
      content: 'A visit has been officially scheduled for your farm.'
    };

    fetch('http://localhost:3000/api/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        fetchMessages(); // refresh instantly
      })
      .catch(err => console.error("Failed to schedule visit", err));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative z-10 h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-6 flex justify-between items-end pr-rise" style={{ animationDelay: '0ms' }}>
        <div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-none">Consultation Inbox</h2>
          <p className="text-primary/60 text-sm mt-3 max-w-xl">Manage farm visit requests and messages from farmers.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setFilterPending(!filterPending)}
            className={`px-4 py-2 border text-sm rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 ${filterPending ? 'bg-brand-forest text-white border-brand-forest' : 'bg-card border-border text-primary font-medium hover:bg-secondary'}`}
          >
            <Filter className="w-4 h-4" /> {filterPending ? 'Showing Pending' : 'Filter Pending'}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-1 pr-rise" style={{ animationDelay: '100ms' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 w-full h-full">
          {/* Thread List */}
          <div className="col-span-1 border-r border-border bg-secondary/30 flex flex-col h-full">
            <div className="p-5 border-b border-border bg-secondary/50">
              <h3 className="font-bold text-primary text-sm uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-forest" /> Active Threads
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredThreadList.length === 0 ? (
                <div className="p-8 text-center text-primary/40 text-sm">No threads found.</div>
              ) : (
                <ul className="divide-y divide-border/50">
                  {filteredThreadList.map((thread) => (
                    <li 
                      key={thread.farmId} 
                      onClick={() => setSelectedFarm(thread.farmId)}
                      className={`p-5 cursor-pointer hover:bg-background/80 transition-colors ${selectedFarm === thread.farmId ? 'bg-background border-l-4 border-l-brand-forest shadow-sm' : 'border-l-4 border-l-transparent'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`font-semibold text-sm ${selectedFarm === thread.farmId ? 'text-brand-forest' : 'text-primary'}`}>
                          {thread.farmId}
                        </span>
                        <span className="text-[10px] font-mono text-primary/40">
                          {new Date(thread.lastUpdate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-primary/60 truncate mb-3">
                        {thread.messages[thread.messages.length - 1].content}
                      </p>
                      <div className="flex gap-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md border tracking-wide uppercase ${thread.type === 'Visit Request' ? 'bg-blue-500/10 text-blue-700 border-blue-500/20' : 'bg-brand-forest/10 text-brand-forest border-brand-forest/20'}`}>
                          {thread.type === 'Reply' ? 'Active Chat' : thread.type}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Chat / Details View */}
          <div className="col-span-1 md:col-span-2 flex flex-col h-full bg-background/50 relative">
            {activeThread ? (
              <>
                <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center backdrop-blur-md sticky top-0 z-10">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-primary">{activeThread.farmId}</h3>
                    <p className="text-xs text-primary/50 mt-1 uppercase tracking-widest font-mono">Last active: {new Date(activeThread.lastUpdate).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-card rounded-lg border border-border hover:bg-secondary transition-all cursor-pointer hover:scale-105 shadow-sm text-primary">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-card rounded-lg border border-border hover:bg-secondary transition-all cursor-pointer hover:scale-105 shadow-sm text-primary">
                      <Video className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleScheduleVisit}
                      className="flex items-center gap-2 px-4 py-2 bg-card text-brand-forest border border-brand-forest/30 rounded-lg text-sm font-semibold hover:bg-brand-forest hover:text-white transition-all cursor-pointer hover:scale-105 shadow-sm"
                    >
                      <Calendar className="w-4 h-4" /> Schedule Visit
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 relative z-0">
                  {activeThread.messages.map((msg, i) => {
                    const isVet = msg.sender === 'Vet' || msg.vetId === msg.sender; // fallback
                    return (
                      <div key={i} className={`flex flex-col max-w-[75%] ${isVet ? 'self-end items-end' : 'self-start items-start'}`}>
                        <div className={`p-4 rounded-2xl shadow-sm text-sm relative group
                          ${isVet ? 
                            'bg-brand-forest text-white rounded-tr-none border border-brand-forest/80' : 
                            'bg-card text-primary border border-border rounded-tl-none'}
                        `}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-primary/40 mt-1.5 font-mono px-1">
                          {isVet ? 'Dr. R Verma' : activeThread.farmId} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-5 border-t border-border bg-card/80 backdrop-blur-md sticky bottom-0 z-10">
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Type a reply to the farmer..." 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 px-5 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest text-sm transition-all shadow-inner"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={!replyText.trim()}
                      className="px-6 py-3 bg-brand-forest text-white rounded-xl text-sm font-semibold hover:bg-brand-forest/90 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
                    >
                      <span>Send</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-primary/40 text-sm h-full">
                <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                <p>Select a thread from the sidebar to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetConsultations;
