import React, { useState, useEffect, useRef } from 'react';

const MOCK_LOGS = [
  "INFO: Syncing with FSSAI Node...",
  "INFO: Block 894920 validated.",
  "INFO: Received updated consensus from Processor Hub.",
  "INFO: Block 894921 validated.",
];

const NEW_LOGS = [
  "INFO: Oracle node health check OK.",
  "INFO: Incoming state trie update...",
  "INFO: Verified 14 transactions in Mempool.",
  "INFO: Block 894922 propagated.",
  "INFO: Pinging FSSAI regulator endpoint: 200 OK",
  "INFO: Fetching gas price oracle update.",
];

const NetworkStatus = () => {
  const [logs, setLogs] = useState(MOCK_LOGS);
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = NEW_LOGS[Math.floor(Math.random() * NEW_LOGS.length)];
      setLogs(prev => [...prev, randomLog].slice(-20)); // keep last 20
    }, Math.random() * 2000 + 1500); // between 1.5s and 3.5s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in relative z-10">
      <div className="mb-8 pb-4 border-b border-primary/10">
        <h2 className="text-3xl font-serif font-bold text-primary tracking-tight">Network Node Status</h2>
        <p className="text-primary/70 text-sm mt-1">Real-time connectivity with processors and regulators.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/20 relative">
             <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-20"></div>
             <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h3 className="font-bold text-primary">Local Farm Node</h3>
          <p className="text-xs font-mono text-green-600 mt-1">SYNCED (Block 894921)</p>
        </div>
        
        <div className="bg-white/40 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center opacity-80">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
             <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <h3 className="font-bold text-primary/70">Processor Hub (Amul)</h3>
          <p className="text-xs font-mono text-primary/50 mt-1">Latency: 24ms</p>
        </div>

        <div className="bg-white/40 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center opacity-80">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 border border-purple-500/20">
             <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
          </div>
          <h3 className="font-bold text-primary/70">FSSAI Regulator Node</h3>
          <p className="text-xs font-mono text-primary/50 mt-1">Latency: 42ms</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white/40 backdrop-blur-md border border-primary/10 p-5 rounded-xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-primary/60 mb-3">Network Logs</h4>
        <div 
          ref={scrollRef}
          className="font-mono text-xs text-primary/70 space-y-2 h-32 overflow-y-auto custom-scrollbar scroll-smooth"
        >
          {logs.map((log, i) => {
            // Fake timestamps based on index to make them look sequential
            const d = new Date();
            d.setSeconds(d.getSeconds() - (logs.length - i) * 2);
            const timeStr = d.toLocaleTimeString([], { hour12: false });
            return <p key={i}>[{timeStr}] {log}</p>;
          })}
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;
