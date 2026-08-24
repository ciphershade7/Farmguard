import React, { useEffect, useState, useCallback } from 'react';
import {
  Link2,
  Blocks,
  ShieldCheck,
  ShieldAlert,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Copy,
  X,
  Loader2,
  Info,
} from 'lucide-react';

const API_BASE = 'http://localhost:3000';

// Turn a raw blockchain_records row (recordType/referenceId + the anchored
// payload) into the short, human-readable label shown in the table. Falls
// back gracefully when the payload is missing (record predates this field,
// or failed to parse) instead of just printing "TREATMENT-4".
const describeRecord = (r) => {
  const payload = r.payload || null;

  if (r.recordType === 'TREATMENT') {
    const idMatch = /TREATMENT-(\d+)/.exec(r.referenceId || '');
    const treatmentId = idMatch ? idMatch[1] : r.referenceId;
    return {
      title: `Treatment #${treatmentId}`,
      subtitle: payload ? `${payload.animalId} · ${payload.drug}` : 'Details unavailable',
    };
  }

  if (r.recordType === 'BATCH_CLEARANCE') {
    return {
      title: `Batch ${r.referenceId}`,
      subtitle: payload ? `${payload.totalLiters ?? '—'} L cleared` : 'Details unavailable',
    };
  }

  return { title: r.recordType || 'Record', subtitle: r.referenceId };
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const StatCard = ({ label, value, sub, icon: Icon, tone = 'default' }) => {
  const toneClasses = {
    default: 'bg-white/60 border-white/40 text-primary',
    good: 'bg-green-500/5 border-green-500/20 text-green-700',
    bad: 'bg-red-500/5 border-red-500/20 text-red-700',
  };
  return (
    <div className={`backdrop-blur-xl border p-5 rounded-xl shadow-sm flex items-start gap-4 ${toneClasses[tone]}`}>
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">{label}</p>
        <p className="font-mono text-sm font-bold truncate" title={typeof value === 'string' ? value : undefined}>
          {value}
        </p>
        {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

const truncateHash = (hash, len = 10) => {
  if (!hash) return '—';
  if (hash.length <= len * 2 + 3) return hash;
  return `${hash.slice(0, len)}...${hash.slice(-6)}`;
};

const VerifyResultModal = ({ result, onClose }) => {
  if (!result) return null;
  const { data, error } = result;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#E2E8F0]/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {error ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <XCircle className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-serif text-[#18181B] tracking-tight">Verification Failed</h2>
            </div>
            <p className="text-sm text-gray-600">{error}</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  data.match ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}
              >
                {data.match ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              </div>
              <h2 className="text-2xl font-serif text-[#18181B] tracking-tight">
                {data.match ? 'Verified: Match' : data.anchored ? 'MISMATCH DETECTED' : 'Not Anchored'}
              </h2>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{data.message}</p>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Record</span>
                <span className="font-mono text-right text-gray-900">
                  {data.recordType} · {data.referenceId}
                </span>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Hash recomputed from FarmGuard's stored data (now)
                </p>
                <p className="font-mono text-xs text-gray-800 break-all bg-white border border-gray-200 rounded-lg px-3 py-2">
                  {data.localHash}
                </p>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Hash stored on the smart contract
                </p>
                <p
                  className={`font-mono text-xs break-all border rounded-lg px-3 py-2 ${
                    data.anchored
                      ? data.match
                        ? 'text-green-700 bg-green-50 border-green-200'
                        : 'text-red-700 bg-red-50 border-red-200'
                      : 'text-gray-400 bg-white border-gray-200'
                  }`}
                >
                  {data.onChainHash || 'No on-chain value (never anchored)'}
                </p>
              </div>
              {data.anchored && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                  <div>
                    <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Tx Hash</p>
                    <p className="font-mono text-xs text-blue-600 truncate">{data.txHash}</p>
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Block #</p>
                    <p className="font-mono text-xs text-gray-800">{data.blockNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 py-4 bg-[#F4F4F5] text-[#18181B] rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Field row helper used inside the detail modal's info panels.
const InfoRow = ({ label, value, mono = false }) => (
  <div className="flex justify-between gap-4 py-1.5">
    <span className="text-gray-500 text-xs">{label}</span>
    <span className={`text-right text-gray-900 text-xs ${mono ? 'font-mono' : ''}`}>{value ?? '—'}</span>
  </div>
);

// Clicking a row opens this. It shows the plain-English treatment/animal
// info (from the anchored payload), the blockchain proof (tx/block/contract),
// and re-runs the same /api/blockchain/verify/:id check used by the
// "Verify Record" button so integrity status is visible without extra clicks.
const RecordDetailModal = ({ record, status, onClose }) => {
  const [verify, setVerify] = useState({ loading: true, data: null, error: null });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!record) return;
    let cancelled = false;
    setVerify({ loading: true, data: null, error: null });
    fetch(`${API_BASE}/api/blockchain/verify/${record.id}`, { method: 'POST' })
      .then((res) => res.json().then((json) => ({ ok: res.ok, json })))
      .then(({ ok, json }) => {
        if (cancelled) return;
        if (!ok) setVerify({ loading: false, data: null, error: json.error || 'Verification request failed.' });
        else setVerify({ loading: false, data: json, error: null });
      })
      .catch(() => {
        if (!cancelled) {
          setVerify({ loading: false, data: null, error: 'Could not reach the FarmGuard backend to verify this record.' });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [record]);

  if (!record) return null;
  const { title, subtitle } = describeRecord(record);
  const payload = record.payload || null;
  const isTreatment = record.recordType === 'TREATMENT';

  const handleCopy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(record.txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#E2E8F0]/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-3xl p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pr-8">
          <h2 className="text-2xl font-serif text-[#18181B] tracking-tight">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>

        {/* Treatment / record information, sourced from the payload that was anchored */}
        <div className="mb-5">
          <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-2">
            {isTreatment ? 'Treatment information' : 'Record information'}
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-2 divide-y divide-gray-100">
            {payload ? (
              isTreatment ? (
                <>
                  <InfoRow label="Treatment ID" value={record.referenceId} mono />
                  <InfoRow label="Animal" value={payload.animalId} mono />
                  <InfoRow label="Medicine" value={payload.drug} />
                  <InfoRow label="Dosage" value={payload.dosage != null ? `${payload.dosage} mL` : '—'} />
                  <InfoRow label="Diagnosis" value={payload.diagnosis} />
                  <InfoRow label="Date" value={formatDate(payload.date)} />
                  <InfoRow label="Vet" value={payload.vet} />
                  <InfoRow label="Withdrawal ends" value={formatDate(payload.withdrawalEnd)} />
                </>
              ) : (
                <>
                  <InfoRow label="Reference" value={record.referenceId} mono />
                  <InfoRow label="Farm" value={payload.farmId} />
                  <InfoRow label="Batch" value={payload.batchId} mono />
                  <InfoRow label="Total liters" value={payload.totalLiters} />
                  <InfoRow label="Safe to milk" value={payload.safeToMilk} />
                  <InfoRow label="In withdrawal" value={payload.inWithdrawal} />
                  <InfoRow label="Cleared at" value={formatDate(payload.clearedAt)} />
                </>
              )
            ) : (
              <p className="py-2 text-xs text-gray-400 italic">
                Details unavailable — no matching FarmGuard data for this record. The blockchain proof below is
                still valid.
              </p>
            )}
          </div>
        </div>

        {/* Blockchain proof */}
        <div className="mb-5">
          <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-2">Blockchain proof</p>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-2 divide-y divide-gray-100">
            <InfoRow
              label="Status"
              value={
                record.anchored ? (
                  <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Anchored on blockchain
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                    <ShieldAlert className="w-3.5 h-3.5" /> Not anchored
                  </span>
                )
              }
            />
            <InfoRow label="Block" value={record.blockNumber != null ? `#${record.blockNumber}` : '—'} mono />
            <InfoRow label="Contract" value={status?.contractAddress ? truncateHash(status.contractAddress, 8) : '—'} mono />
            <InfoRow label="Chain ID" value={status?.chainId ?? '—'} mono />
          </div>
          <div className="mt-2">
            <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Transaction hash</p>
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-between gap-2 font-mono text-xs text-gray-800 break-all bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors text-left"
              title="Copy full transaction hash"
            >
              <span className="break-all">{record.txHash}</span>
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
              ) : (
                <Copy className="w-3 h-3 shrink-0 opacity-50" />
              )}
            </button>
          </div>
        </div>

        {/* Integrity verification, live from /api/blockchain/verify/:id */}
        <div>
          <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-2">Integrity verification</p>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm">
            {verify.loading && (
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking against the smart contract…
              </div>
            )}
            {!verify.loading && verify.error && (
              <p className="text-xs text-red-600">{verify.error}</p>
            )}
            {!verify.loading && verify.data && (
              <p
                className={`text-xs font-medium ${
                  verify.data.match ? 'text-green-700' : verify.data.anchored ? 'text-red-700' : 'text-amber-700'
                }`}
              >
                {verify.data.match ? '✓ ' : verify.data.anchored ? '⚠ ' : ''}
                {verify.data.message}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-4 bg-[#F4F4F5] text-[#18181B] rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const BlockchainDashboard = () => {
  const [status, setStatus] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      const [statusRes, recordsRes] = await Promise.all([
        fetch(`${API_BASE}/api/blockchain/status`),
        fetch(`${API_BASE}/api/blockchain/records?limit=25`),
      ]);
      const statusJson = await statusRes.json();
      const recordsJson = await recordsRes.json();
      setStatus(statusJson);
      setStatusError(statusJson.connected ? null : statusJson.error);
      setRecords(Array.isArray(recordsJson) ? recordsJson : []);
    } catch (err) {
      setStatusError('Could not reach the FarmGuard backend at ' + API_BASE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 6000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const handleVerify = async (id) => {
    setVerifyingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/blockchain/verify/${id}`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) {
        setVerifyResult({ error: json.error || 'Verification request failed.' });
      } else {
        setVerifyResult({ data: json });
      }
    } catch (err) {
      setVerifyResult({ error: 'Could not reach the FarmGuard backend to verify this record.' });
    } finally {
      setVerifyingId(null);
    }
  };

  const handleCopy = (text, field) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const connected = !!status?.connected;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in relative z-10">
      <div className="mb-8 pb-4 border-b border-primary/10 flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-clay uppercase mb-3">
            <Link2 className="w-3 h-3" />
            Ethers.js · Hardhat · Solidity
          </p>
          <h2 className="text-3xl font-serif font-bold text-primary tracking-tight">Blockchain Dashboard</h2>
          <p className="text-primary/70 text-sm mt-1 max-w-xl">
            Live status of the FarmGuardLedger smart contract and the tamper-evident audit trail it anchors for
            treatments and batch clearances.
          </p>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 text-xs font-mono text-primary/60 hover:text-primary bg-white/60 border border-white/40 px-3 py-2 rounded-md shadow-sm transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="mb-6 bg-white/50 border border-white/40 rounded-xl p-4 flex items-start gap-3 text-sm">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary/50" />
        <p className="text-primary/70 text-xs leading-relaxed">
          Blockchain records provide tamper-evident proof that an important FarmGuard record was recorded at a
          specific time. FarmGuard's operational data remains in the application database — the chain does not
          replace it and does not, by itself, prevent someone from entering false information.
        </p>
      </div>

      {!loading && !connected && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/30 text-amber-800 rounded-xl p-4 flex items-start gap-3 text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Not connected to the blockchain.</p>
            <p className="mt-1 text-amber-700/90">
              {statusError || 'The Hardhat node is not running or the contract has not been deployed yet.'} New
              treatments and batch clearances will still work, but won't be anchored on-chain until this is fixed.
              See the setup instructions for the exact commands to start the chain and deploy the contract.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Network Status"
          value={connected ? 'Connected' : 'Offline'}
          sub={connected ? `Chain ID ${status.chainId}` : 'No RPC connection'}
          icon={connected ? Wifi : WifiOff}
          tone={connected ? 'good' : 'bad'}
        />
        <StatCard
          label="Current Block"
          value={connected ? `#${status.blockNumber}` : '—'}
          sub={connected ? status.rpcUrl : 'Awaiting connection'}
          icon={Blocks}
        />
        <StatCard
          label="Contract Address"
          value={connected ? truncateHash(status.contractAddress, 8) : '—'}
          sub={connected ? 'FarmGuardLedger.sol' : 'Not deployed'}
          icon={ShieldCheck}
        />
        <StatCard
          label="On-Chain Records"
          value={connected ? status.totalRecords : status?.anchoredRecordsInDb ?? 0}
          sub={
            status
              ? `${status.anchoredRecordsInDb ?? 0} anchored · ${status.unanchoredRecordsInDb ?? 0} pending`
              : ''
          }
          icon={Link2}
        />
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-5 border-b border-primary/10 bg-white/40 flex justify-between items-center">
          <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Recent Blockchain Records</h3>
          <span className="text-xs font-mono text-primary/50">{records.length} shown</span>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/40 text-xs text-primary/60 border-b border-primary/10 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Type / Reference</th>
                <th className="px-6 py-4 font-semibold">Tx Hash</th>
                <th className="px-6 py-4 font-semibold">Block</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5 text-sm">
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-primary/40 text-sm">
                    {loading ? 'Loading records…' : 'No blockchain records yet. Log a treatment or clear a batch to create one.'}
                  </td>
                </tr>
              )}
              {records.map((r) => {
                const { title, subtitle } = describeRecord(r);
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedRecord(r)}
                    className="hover:bg-white/40 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary text-xs">{title}</div>
                      <div className="text-primary/50 font-mono text-xs">{subtitle}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(r.txHash, r.id);
                        }}
                        className="flex items-center gap-1.5 font-mono text-xs text-primary/70 hover:text-clay transition-colors"
                        title={r.txHash}
                      >
                        {truncateHash(r.txHash)}
                        {copiedField === r.id ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        ) : (
                          <Copy className="w-3 h-3 shrink-0 opacity-50" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-primary/60">
                      {r.blockNumber !== null && r.blockNumber !== undefined ? `#${r.blockNumber}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {r.anchored ? (
                        <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-700 border border-green-500/20 px-2 py-1 text-xs font-bold rounded-md">
                          <ShieldCheck className="w-3 h-3" /> ANCHORED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2 py-1 text-xs font-bold rounded-md">
                          <ShieldAlert className="w-3 h-3" /> NOT ANCHORED
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerify(r.id);
                        }}
                        disabled={verifyingId === r.id}
                        className="flex items-center gap-1.5 text-brand-terracotta hover:underline text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {verifyingId === r.id && <Loader2 className="w-3 h-3 animate-spin" />}
                        Verify Record
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <VerifyResultModal result={verifyResult} onClose={() => setVerifyResult(null)} />
      <RecordDetailModal record={selectedRecord} status={status} onClose={() => setSelectedRecord(null)} />
    </div>
  );
};

export default BlockchainDashboard;
