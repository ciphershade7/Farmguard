const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();
const blockchain = require('./blockchainClient');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper to generate recent timestamps
const getPastTime = (hoursAgo) => new Date(Date.now() - hoursAgo * 3600000).toISOString();
const randomHash = () => '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6);

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

// Promise wrappers around sqlite3's callback API. Only used by the routes
// that needed to be rewritten as async functions to await the blockchain
// anchoring step (log-dose, generate-pass, and the new /api/blockchain/*
// routes). All other routes in this file are untouched and keep using the
// original callback style.
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this); // gives access to this.lastID / this.changes
    });
  });
}
function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
}
function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

/**
 * Anchor a payload to the blockchain and record the outcome in the local
 * blockchain_records table, regardless of whether anchoring succeeded.
 *
 * If the Hardhat node / contract isn't reachable, this does NOT throw and
 * does NOT block the caller's main DB write from having already happened -
 * it just records anchored=0 so the Blockchain Dashboard can show the record
 * as "not anchored" instead of silently pretending it's on-chain.
 */
async function anchorAndStore(recordType, referenceId, farmId, payload) {
  const createdAt = new Date().toISOString();
  const localHash = blockchain.canonicalHash(payload);

  try {
    const result = await blockchain.anchorRecord({ recordType, referenceId, farmId, dataObject: payload });
    await runAsync(
      `INSERT INTO blockchain_records
        (recordType, referenceId, farmId, payloadJson, dataHash, chainIndex, txHash, blockNumber, anchored, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [recordType, referenceId, farmId, JSON.stringify(payload), result.dataHash, result.recordIndex, result.txHash, result.blockNumber, 1, createdAt]
    );
    return { anchored: true, txHash: result.txHash, blockNumber: result.blockNumber, dataHash: result.dataHash };
  } catch (err) {
    // Blockchain unreachable/not deployed - keep the app fully functional,
    // just mark this event as not anchored (no fake tx hash is invented).
    const fallbackHash = `0xUNANCHORED${localHash.slice(2, 12)}`;
    await runAsync(
      `INSERT INTO blockchain_records
        (recordType, referenceId, farmId, payloadJson, dataHash, chainIndex, txHash, blockNumber, anchored, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [recordType, referenceId, farmId, JSON.stringify(payload), localHash, null, fallbackHash, null, 0, createdAt]
    );
    console.warn(`[blockchain] Failed to anchor ${recordType} ${referenceId}: ${err.message}`);
    return { anchored: false, txHash: fallbackHash, blockNumber: null, dataHash: localHash, error: err.message };
  }
}

function initDb() {
  db.serialize(() => {
    // Drop existing tables to reseed with multi-farm schema
    db.run(`DROP TABLE IF EXISTS batch_status`);
    db.run(`DROP TABLE IF EXISTS animals`);
    db.run(`DROP TABLE IF EXISTS treatments`);
    db.run(`DROP TABLE IF EXISTS ledger_entries`);
    db.run(`DROP TABLE IF EXISTS consultations`);
    db.run(`DROP TABLE IF EXISTS users`);
    db.run(`DROP TABLE IF EXISTS vet_assignments`);
    db.run(`DROP TABLE IF EXISTS blockchain_records`);

    // Create Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT,
      entityId TEXT
    )`);

    // Create Vet Assignments table (links vets to farms)
    db.run(`CREATE TABLE IF NOT EXISTS vet_assignments (
      vetId TEXT,
      farmId TEXT
    )`);

    // Create Batch Status table
    db.run(`CREATE TABLE IF NOT EXISTS batch_status (
      batchId TEXT PRIMARY KEY,
      farmId TEXT,
      status TEXT,
      totalLiters INTEGER,
      lockedLiters INTEGER,
      safeToMilk INTEGER,
      inWithdrawal INTEGER
    )`);

    // Create Animals table
    db.run(`CREATE TABLE IF NOT EXISTS animals (
      tagNumber TEXT PRIMARY KEY,
      farmId TEXT,
      species TEXT,
      breed TEXT,
      age INTEGER,
      healthStatus TEXT,
      withdrawalDays INTEGER
    )`);

    // Create Treatments table
    db.run(`CREATE TABLE IF NOT EXISTS treatments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      animalId TEXT,
      farmId TEXT,
      drug TEXT,
      dosage INTEGER,
      date TEXT,
      vet TEXT,
      withdrawalEnd TEXT
    )`);

    // Create Consultations table
    db.run(`CREATE TABLE IF NOT EXISTS consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmId TEXT,
      vetId TEXT,
      sender TEXT,
      type TEXT,
      content TEXT,
      status TEXT,
      createdAt TEXT
    )`);

    // Create Ledger Entries table
    db.run(`CREATE TABLE IF NOT EXISTS ledger_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      txHash TEXT,
      timestamp TEXT,
      farmId TEXT,
      actor TEXT,
      action TEXT,
      details TEXT,
      verified BOOLEAN
    )`);

    // Create Blockchain Records table - one row per attempt to anchor a
    // FarmGuard event (treatment, batch clearance, ...) to the smart contract.
    // payloadJson is the exact canonical data that was hashed; dataHash is
    // that hash; chainIndex/txHash/blockNumber identify where it landed on
    // the FarmGuardLedger contract. anchored=0 means the chain was
    // unreachable when this event happened (no fake data is stored).
    db.run(`CREATE TABLE IF NOT EXISTS blockchain_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recordType TEXT,
      referenceId TEXT,
      farmId TEXT,
      payloadJson TEXT,
      dataHash TEXT,
      chainIndex INTEGER,
      txHash TEXT,
      blockNumber INTEGER,
      anchored INTEGER,
      createdAt TEXT
    )`);

    // Pre-fill Users
    const initialUsers = [
      { username: 'farmerA', password: 'password', role: 'farmer', entityId: 'FARM-A' },
      { username: 'farmerA2', password: 'password', role: 'farmer', entityId: 'FARM-A' },
      { username: 'farmerB', password: 'password', role: 'farmer', entityId: 'FARM-B' },
      { username: 'vet1', password: 'password', role: 'vet', entityId: 'VET-800' },
      { username: 'vet2', password: 'password', role: 'vet', entityId: 'VET-801' },
      { username: 'vet3', password: 'password', role: 'vet', entityId: 'VET-802' },
      { username: 'vet4', password: 'password', role: 'vet', entityId: 'VET-803' },
      { username: 'vet5', password: 'password', role: 'vet', entityId: 'VET-804' },
      { username: 'admin1', password: 'password', role: 'admin', entityId: 'ADMIN-1' }
    ];
    const stmtUsers = db.prepare("INSERT INTO users (username, password, role, entityId) VALUES (?, ?, ?, ?)");
    initialUsers.forEach(u => stmtUsers.run(u.username, u.password, u.role, u.entityId));
    stmtUsers.finalize();

    // Pre-fill Vet Assignments
    const initialVetAssignments = [
      { vetId: 'VET-800', farmId: 'FARM-A' },
      { vetId: 'VET-800', farmId: 'FARM-B' },
      { vetId: 'VET-801', farmId: 'FARM-C' },
      { vetId: 'VET-802', farmId: 'FARM-D' },
      { vetId: 'VET-803', farmId: 'FARM-E' },
      { vetId: 'VET-804', farmId: 'FARM-F' }
    ];
    const stmtVetAssignments = db.prepare("INSERT INTO vet_assignments (vetId, farmId) VALUES (?, ?)");
    initialVetAssignments.forEach(va => stmtVetAssignments.run(va.vetId, va.farmId));
    stmtVetAssignments.finalize();

    // Pre-fill Batch Status
    db.run(`INSERT INTO batch_status (batchId, farmId, status, totalLiters, lockedLiters, safeToMilk, inWithdrawal)
            VALUES 
            ('BCH-8801', 'FARM-A', 'COMPLIANT', 450, 12, 142, 3),
            ('BCH-8802', 'FARM-B', 'WARNING', 320, 45, 90, 5)`);

    // Pre-fill Ledger Entries
    const initialLedger = [
      { txHash: randomHash(), timestamp: getPastTime(0.1), farmId: 'FARM-A', actor: 'Auto-Milker V2', action: 'Yield Logged', details: 'Added 12L from Tag #110 to Batch BCH-8801', verified: true },
      { txHash: randomHash(), timestamp: getPastTime(0.5), farmId: 'FARM-A', actor: 'Dr. R. Verma', action: 'Antibiotic Administration', details: 'Amoxicillin (10ml) to Tag #104. Withdrawal set 48h.', verified: true },
      { txHash: randomHash(), timestamp: getPastTime(1), farmId: 'FARM-A', actor: 'Auto-Milker V2', action: 'Yield Logged', details: 'Added 14L from Tag #89 to Batch BCH-8801', verified: true },
      { txHash: randomHash(), timestamp: getPastTime(1.5), farmId: 'FARM-B', actor: 'FarmGuard Oracle', action: 'Batch Cleared', details: 'Batch BCH-8802 certified Zero-Residue and sealed.', verified: true },
      { txHash: randomHash(), timestamp: getPastTime(2), farmId: 'FARM-B', actor: 'SysAdmin', action: 'Quarantine Enforced', details: 'Tag #42 milk diverted from main tank (System Override).', verified: true },
      { txHash: randomHash(), timestamp: getPastTime(3), farmId: 'FARM-B', actor: 'Auto-Milker V1', action: 'Yield Logged', details: 'Added 11L from Tag #55 to Batch BCH-8802', verified: true },
      { txHash: randomHash(), timestamp: getPastTime(4), farmId: 'FARM-A', actor: 'Dr. R. Verma', action: 'Health Check', details: 'Routine check Tag #12 to #20. All clear.', verified: true },
      { txHash: randomHash(), timestamp: getPastTime(12), farmId: 'FARM-A', actor: 'Smart Contract', action: 'Withdrawal Expired', details: 'Tag #08 clearance restored. Milk safe for collection.', verified: true },
      { txHash: randomHash(), timestamp: getPastTime(14), farmId: 'FARM-A', actor: 'Logistics Node', action: 'Transfer Custody', details: 'Batch BCH-8799 transferred to Processor Node.', verified: true },
      { txHash: randomHash(), timestamp: getPastTime(24), farmId: 'FARM-B', actor: 'Auto-Milker V2', action: 'Yield Logged', details: 'Added 15L from Tag #110 to Batch BCH-8802', verified: true },
      { txHash: randomHash(), timestamp: getPastTime(26), farmId: 'FARM-A', actor: 'Dr. S. Patil', action: 'Vaccination', details: 'FMD Vaccine administered to Batch B-02 (20 animals).', verified: true },
      { txHash: randomHash(), timestamp: getPastTime(36), farmId: 'FARM-B', actor: 'Smart Contract', action: 'Alert Generated', details: 'Tag #104 missed scheduled milking window.', verified: true },
      { txHash: randomHash(), timestamp: getPastTime(48), farmId: 'FARM-B', actor: 'FarmGuard Oracle', action: 'Batch Cleared', details: 'Batch BCH-8798 certified Zero-Residue.', verified: true },
    ];

    const stmtLedger = db.prepare("INSERT INTO ledger_entries (txHash, timestamp, farmId, actor, action, details, verified) VALUES (?, ?, ?, ?, ?, ?, ?)");
    initialLedger.forEach(entry => {
      stmtLedger.run(entry.txHash, entry.timestamp, entry.farmId, entry.actor, entry.action, entry.details, entry.verified ? 1 : 0);
    });
    stmtLedger.finalize();

    // Pre-fill Animals
    const initialAnimals = [
      { tagNumber: 'TAG-104', farmId: 'FARM-A', species: 'Cattle', breed: 'Holstein', age: 4, healthStatus: 'Under Treatment', withdrawalDays: 5 },
      { tagNumber: 'TAG-110', farmId: 'FARM-A', species: 'Cattle', breed: 'Jersey', age: 3, healthStatus: 'Healthy', withdrawalDays: 0 },
      { tagNumber: 'TAG-089', farmId: 'FARM-A', species: 'Cattle', breed: 'Brown Swiss', age: 2, healthStatus: 'Healthy', withdrawalDays: 0 },
      { tagNumber: 'TAG-042', farmId: 'FARM-B', species: 'Cattle', breed: 'Holstein', age: 5, healthStatus: 'Quarantine', withdrawalDays: 14 },
      { tagNumber: 'TAG-055', farmId: 'FARM-B', species: 'Cattle', breed: 'Jersey', age: 4, healthStatus: 'Healthy', withdrawalDays: 0 },
      { tagNumber: 'TAG-077', farmId: 'FARM-B', species: 'Buffalo', breed: 'Murrah', age: 6, healthStatus: 'Under Treatment', withdrawalDays: 3 }
    ];
    const stmtAnimals = db.prepare("INSERT INTO animals (tagNumber, farmId, species, breed, age, healthStatus, withdrawalDays) VALUES (?, ?, ?, ?, ?, ?, ?)");
    initialAnimals.forEach(a => stmtAnimals.run(a.tagNumber, a.farmId, a.species, a.breed, a.age, a.healthStatus, a.withdrawalDays));
    stmtAnimals.finalize();

    // Pre-fill Treatments
    const initialTreatments = [
      { animalId: 'TAG-104', farmId: 'FARM-A', drug: 'Amoxicillin', dosage: 10, date: getPastTime(24), vet: 'Dr. R. Verma', withdrawalEnd: new Date(Date.now() + 4 * 86400000).toISOString() },
      { animalId: 'TAG-042', farmId: 'FARM-B', drug: 'Oxytetracycline', dosage: 20, date: getPastTime(72), vet: 'Dr. S. Patil', withdrawalEnd: new Date(Date.now() + 11 * 86400000).toISOString() },
      { animalId: 'TAG-077', farmId: 'FARM-B', drug: 'Ceftiofur', dosage: 15, date: getPastTime(12), vet: 'Dr. S. Patil', withdrawalEnd: new Date(Date.now() + 3 * 86400000).toISOString() }
    ];
    const stmtTreatments = db.prepare("INSERT INTO treatments (animalId, farmId, drug, dosage, date, vet, withdrawalEnd) VALUES (?, ?, ?, ?, ?, ?, ?)");
    initialTreatments.forEach(t => stmtTreatments.run(t.animalId, t.farmId, t.drug, t.dosage, t.date, t.vet, t.withdrawalEnd));
    stmtTreatments.finalize();

    // Pre-fill Consultations
    const initialConsultations = [
      { farmId: 'FARM-A', vetId: 'VET-800', sender: 'Farmer', type: 'Visit Request', content: 'Routine checkup requested for new calves.', status: 'Completed', createdAt: getPastTime(72) },
      { farmId: 'FARM-A', vetId: 'VET-800', sender: 'Farmer', type: 'Visit Request', content: 'FMD Vaccination drive for Batch B-02.', status: 'Completed', createdAt: getPastTime(240) },
      { farmId: 'FARM-B', vetId: 'VET-800', sender: 'Farmer', type: 'Message', content: 'Tag #042 is showing lethargy, should we isolate?', status: 'Pending', createdAt: getPastTime(2) },
      { farmId: 'FARM-B', vetId: 'VET-800', sender: 'Vet', type: 'Reply', content: 'Yes, please isolate immediately. I will schedule a visit for tomorrow morning.', status: 'Sent', createdAt: getPastTime(1) }
    ];
    const stmtConsultations = db.prepare("INSERT INTO consultations (farmId, vetId, sender, type, content, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)");
    initialConsultations.forEach(c => stmtConsultations.run(c.farmId, c.vetId, c.sender, c.type, c.content, c.status, c.createdAt));
    stmtConsultations.finalize();
  });
}

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT id, username, role, entityId FROM users WHERE username = ? AND password = ?`, [username, password], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json(user);
  });
});

// Get Farms assigned to a Vet
app.get('/api/vet/farms', (req, res) => {
  const { vetId } = req.query;
  if (!vetId) return res.status(400).json({ error: 'vetId is required' });
  db.all(`SELECT farmId FROM vet_assignments WHERE vetId = ?`, [vetId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => r.farmId));
  });
});

app.get('/api/dashboard', (req, res) => {
  const farmId = req.query.farmId;
  const batchQuery = farmId ? `SELECT * FROM batch_status WHERE farmId = '${farmId}' LIMIT 1` : `SELECT * FROM batch_status LIMIT 1`;
  
  db.get(batchQuery, (err, batchStatusRow) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const ledgerQuery = farmId ? `SELECT * FROM ledger_entries WHERE farmId = '${farmId}' ORDER BY timestamp DESC` : `SELECT * FROM ledger_entries ORDER BY timestamp DESC`;
    db.all(ledgerQuery, (err, ledgerRows) => {
      if (err) return res.status(500).json({ error: err.message });

      const animalsQuery = farmId ? `SELECT * FROM animals WHERE farmId = '${farmId}'` : `SELECT * FROM animals`;
      db.all(animalsQuery, (err, animalsRows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Convert verified from 1/0 to true/false
        const ledger = ledgerRows.map(row => ({
          ...row,
          verified: row.verified === 1
        }));

        res.json({
          batchStatus: batchStatusRow || {},
          ledger: ledger,
          animals: animalsRows || []
        });
      });
    });
  });
});

app.post('/api/log-dose', async (req, res) => {
  const { tagId, farmId = 'FARM-A', drug, dosage, diagnosis } = req.body;
  const timestamp = new Date().toISOString();
  const actor = 'Dr. R. Verma'; // Using the vet profile from client
  const action = 'Treatment Logged';
  const details = `Administered ${dosage}mL ${drug} to animal ${tagId} for ${diagnosis}. Status set to WITHDRAWAL.`;
  const withdrawalEnd = new Date(Date.now() + 4 * 86400000).toISOString();

  try {
    // 1. Insert into treatments (same write as before)
    const treatmentResult = await runAsync(
      "INSERT INTO treatments (animalId, farmId, drug, dosage, date, vet, withdrawalEnd) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [tagId, farmId, drug, dosage, timestamp, actor, withdrawalEnd]
    );
    const treatmentId = treatmentResult.lastID;

    // 2. Update batch status (same write as before)
    await runAsync(
      `UPDATE batch_status
       SET status = 'WARNING: ACTIVE WITHDRAWALS',
           inWithdrawal = inWithdrawal + 1,
           safeToMilk = safeToMilk - 1
       WHERE farmId = ?`,
      [farmId]
    );

    // 3. Update animals table if tag exists (same write as before)
    await runAsync(
      "UPDATE animals SET healthStatus = 'Under Treatment', withdrawalDays = 4 WHERE tagNumber = ? AND farmId = ?",
      [tagId, farmId]
    );

    // 4. NEW: anchor this treatment to the FarmGuardLedger smart contract.
    // The referenceId ties this on-chain record back to the treatments row.
    const referenceId = `TREATMENT-${treatmentId}`;
    const payload = {
      recordType: 'TREATMENT',
      referenceId,
      farmId,
      animalId: tagId,
      drug,
      dosage: Number(dosage),
      diagnosis,
      date: timestamp,
      vet: actor,
      withdrawalEnd,
    };
    const anchorResult = await anchorAndStore('TREATMENT', referenceId, farmId, payload);

    // 5. Ledger entry now uses the REAL blockchain tx hash when anchoring
    // succeeded (or a clearly-labeled unanchored hash when it didn't),
    // instead of the old randomHash() mock.
    await runAsync(
      "INSERT INTO ledger_entries (txHash, timestamp, farmId, actor, action, details, verified) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [anchorResult.txHash, timestamp, farmId, actor, action, details, anchorResult.anchored ? 1 : 0]
    );

    console.log(
      anchorResult.anchored
        ? `[BLOCKCHAIN] Treatment ${treatmentId} anchored on-chain: tx=${anchorResult.txHash} block=${anchorResult.blockNumber}`
        : `[BLOCKCHAIN] Treatment ${treatmentId} NOT anchored (${anchorResult.error})`
    );

    res.status(200).json({
      success: true,
      txHash: anchorResult.txHash,
      blockchainAnchored: anchorResult.anchored,
      blockNumber: anchorResult.blockNumber,
      message: anchorResult.anchored
        ? 'Smart contract executed. Withdrawal locked. Treatment anchored to blockchain.'
        : 'Withdrawal locked and database updated, but blockchain anchoring failed (is the Hardhat node running and the contract deployed?).',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/generate-pass', async (req, res) => {
  const { farmId = 'FARM-A' } = req.body;
  const timestamp = new Date().toISOString();
  const actor = 'FarmGuard Oracle';
  const action = 'Batch Cleared';
  const details = 'Batch certified Zero-Residue and sealed. MRL check passed.';

  try {
    const batchRow = await getAsync(`SELECT * FROM batch_status WHERE farmId = ?`, [farmId]);
    const batchId = batchRow ? batchRow.batchId : 'BCH-UNKNOWN';

    // Same write as before
    await runAsync(`UPDATE batch_status SET status = 'COMPLIANT' WHERE farmId = ?`, [farmId]);

    // NEW: anchor this withdrawal clearance / batch certification to the
    // FarmGuardLedger smart contract.
    const referenceId = batchId;
    const payload = {
      recordType: 'BATCH_CLEARANCE',
      referenceId,
      farmId,
      batchId,
      totalLiters: batchRow ? batchRow.totalLiters : null,
      safeToMilk: batchRow ? batchRow.safeToMilk : null,
      inWithdrawal: batchRow ? batchRow.inWithdrawal : null,
      clearedAt: timestamp,
    };
    const anchorResult = await anchorAndStore('BATCH_CLEARANCE', referenceId, farmId, payload);

    await runAsync(
      "INSERT INTO ledger_entries (txHash, timestamp, farmId, actor, action, details, verified) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [anchorResult.txHash, timestamp, farmId, actor, action, details, anchorResult.anchored ? 1 : 0]
    );

    console.log(
      anchorResult.anchored
        ? `[BLOCKCHAIN] Batch ${batchId} clearance anchored on-chain: tx=${anchorResult.txHash} block=${anchorResult.blockNumber}`
        : `[BLOCKCHAIN] Batch ${batchId} clearance NOT anchored (${anchorResult.error})`
    );

    res.status(200).json({
      success: true,
      txHash: anchorResult.txHash,
      blockchainAnchored: anchorResult.anchored,
      blockNumber: anchorResult.blockNumber,
      message: anchorResult.anchored
        ? 'Batch Cleared and anchored to blockchain.'
        : 'Batch Cleared, but blockchain anchoring failed (is the Hardhat node running and the contract deployed?).',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/farm-stats', (req, res) => {
  const farmId = req.query.farmId;
  const filterAnimals = farmId ? `WHERE farmId = '${farmId}'` : '';
  const filterTreated = farmId ? `WHERE farmId = '${farmId}' AND healthStatus = 'Under Treatment'` : `WHERE healthStatus = 'Under Treatment'`;
  const filterWithdrawal = farmId ? `WHERE farmId = '${farmId}' AND withdrawalDays > 0` : `WHERE withdrawalDays > 0`;
  const filterTreatments = farmId ? `WHERE farmId = '${farmId}'` : '';
  
  db.get(`SELECT COUNT(*) as totalAnimals FROM animals ${filterAnimals}`, (err, row1) => {
    db.get(`SELECT COUNT(*) as treatedAnimals FROM animals ${filterTreated}`, (err, row2) => {
      db.get(`SELECT COUNT(*) as withdrawalAnimals FROM animals ${filterWithdrawal}`, (err, row3) => {
        db.all(`SELECT * FROM treatments ${filterTreatments} ORDER BY date DESC LIMIT 5`, (err, recentTreatments) => {
          res.json({
            totalAnimals: row1 ? row1.totalAnimals : 0,
            treatedAnimals: row2 ? row2.treatedAnimals : 0,
            withdrawalAnimals: row3 ? row3.withdrawalAnimals : 0,
            clearedAnimals: (row1 ? row1.totalAnimals : 0) - ((row2 ? row2.treatedAnimals : 0) + (row3 ? row3.withdrawalAnimals : 0)),
            recentTreatments: recentTreatments || [],
            alerts: [
              { id: 1, type: 'warning', message: 'TAG-104 missed scheduled milking window.' },
              { id: 2, type: 'danger', message: 'TAG-042 milk diverted (System Override).' }
            ]
          });
        });
      });
    });
  });
});

app.get('/api/animals', (req, res) => {
  const farmId = req.query.farmId;
  const query = farmId ? `SELECT * FROM animals WHERE farmId = '${farmId}'` : `SELECT * FROM animals`;
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/treatments', (req, res) => {
  const farmId = req.query.farmId;
  const query = farmId ? `SELECT * FROM treatments WHERE farmId = '${farmId}' ORDER BY date DESC` : `SELECT * FROM treatments ORDER BY date DESC`;
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/consultations', (req, res) => {
  const { farmId, vetId, sender = 'Farmer', type, content } = req.body;
  const createdAt = new Date().toISOString();
  
  db.run(
    `INSERT INTO consultations (farmId, vetId, sender, type, content, status, createdAt) VALUES (?, ?, ?, ?, ?, 'Pending', ?)`,
    [farmId, vetId, sender, type, content, createdAt],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ success: true, id: this.lastID, message: 'Message sent.' });
    }
  );
});

app.get('/api/consultations', (req, res) => {
  const { vetId, farmId } = req.query;
  let query = `SELECT * FROM consultations`;
  let conditions = [];
  
  if (vetId) conditions.push(`vetId = '${vetId}'`);
  if (farmId) conditions.push(`farmId = '${farmId}'`);
  
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }
  query += ` ORDER BY createdAt DESC`;

  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ---------------------------------------------------------------------------
// Blockchain Dashboard endpoints (NEW)
// ---------------------------------------------------------------------------

// Live network/contract status - always calls the chain, never cached/fake.
app.get('/api/blockchain/status', async (req, res) => {
  try {
    const status = await blockchain.getStatus();
    const dbCountRow = await getAsync(
      `SELECT COUNT(*) as total FROM blockchain_records WHERE anchored = 1`
    );
    const unanchoredRow = await getAsync(
      `SELECT COUNT(*) as total FROM blockchain_records WHERE anchored = 0`
    );
    res.json({
      ...status,
      anchoredRecordsInDb: dbCountRow ? dbCountRow.total : 0,
      unanchoredRecordsInDb: unanchoredRow ? unanchoredRow.total : 0,
    });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// Recent anchoring attempts (successful and failed), newest first.
//
// Includes the parsed `payload` that was anchored (animalId, drug, date,
// vet, etc. for a TREATMENT; batchId, totalLiters, etc. for a
// BATCH_CLEARANCE). This is the exact data anchorAndStore() hashed at write
// time, so the Blockchain Dashboard can show human-readable record details
// without joining back to the treatments/animals tables. If payloadJson is
// missing or fails to parse, `payload` is null and the dashboard falls back
// to "Details unavailable" instead of crashing.
app.get('/api/blockchain/records', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const rows = await allAsync(
      `SELECT id, recordType, referenceId, farmId, payloadJson, dataHash, chainIndex, txHash, blockNumber, anchored, createdAt
       FROM blockchain_records ORDER BY id DESC LIMIT ?`,
      [limit]
    );
    res.json(rows.map(({ payloadJson, ...r }) => {
      let payload = null;
      try {
        payload = payloadJson ? JSON.parse(payloadJson) : null;
      } catch (_err) {
        payload = null;
      }
      return { ...r, anchored: r.anchored === 1, payload };
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recompute the hash of the stored payload and compare it against what is
// actually stored on-chain right now. This is the "Verify Record" action:
// it proves the off-chain data hasn't drifted from what was committed.
app.post('/api/blockchain/verify/:id', async (req, res) => {
  try {
    const row = await getAsync(`SELECT * FROM blockchain_records WHERE id = ?`, [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Blockchain record not found' });

    const payload = JSON.parse(row.payloadJson);
    const localHash = blockchain.canonicalHash(payload);

    if (!row.anchored || row.chainIndex === null || row.chainIndex === undefined) {
      return res.json({
        match: false,
        anchored: false,
        recordType: row.recordType,
        referenceId: row.referenceId,
        localHash,
        onChainHash: null,
        message: 'This record was never anchored to the blockchain (the chain was unreachable when it was created), so there is nothing on-chain to compare against.',
      });
    }

    // Live call to the contract - not cached, not read from our own DB copy.
    const onChain = await blockchain.getRecordOnChain(row.chainIndex);
    const match =
      localHash.toLowerCase() === onChain.dataHash.toLowerCase() &&
      localHash.toLowerCase() === row.dataHash.toLowerCase();

    res.json({
      match,
      anchored: true,
      recordType: row.recordType,
      referenceId: row.referenceId,
      farmId: row.farmId,
      localHash,
      storedHash: row.dataHash,
      onChainHash: onChain.dataHash,
      txHash: row.txHash,
      blockNumber: row.blockNumber,
      chainTimestamp: onChain.timestamp,
      submitter: onChain.submitter,
      message: match
        ? 'Match. The data behind this record is identical to what was committed on-chain.'
        : 'MISMATCH. The locally stored data no longer matches the hash committed on-chain - this record may have been tampered with.',
    });
  } catch (err) {
    res.status(500).json({ match: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
