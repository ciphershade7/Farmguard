/**
 * blockchainClient.js
 * ---------------------------------------------------------------------------
 * Thin wrapper around ethers.js that connects the FarmGuard backend to the
 * FarmGuardLedger smart contract deployed on a local Hardhat node.
 *
 * This module does NOT store business data on-chain. It only:
 *   1. Computes a keccak256 hash of a canonical JSON payload (a treatment,
 *      a withdrawal clearance, a batch event, etc).
 *   2. Submits that hash + a few identifiers to the FarmGuardLedger contract.
 *   3. Lets the rest of the backend re-fetch on-chain records to verify that
 *      a given off-chain record hasn't been tampered with.
 *
 * If the Hardhat node isn't running or the contract hasn't been deployed yet,
 * every exported function fails gracefully (throws / returns connected:false)
 * so the rest of FarmGuard (treatments, withdrawals, batches) keeps working
 * exactly as before.
 * ---------------------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';

// Hardhat's well-known default local account #0 private key. This account only
// ever exists on the throwaway local `npx hardhat node` chain started for this
// project — it is never used on a real network. It lets the backend sign
// transactions out of the box without any manual key setup.
const DEFAULT_HARDHAT_PRIVATE_KEY =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const DEPLOYMENT_PATH = path.resolve(__dirname, '../blockchain/deployment.json');
const ARTIFACT_PATH = path.resolve(
  __dirname,
  '../blockchain/artifacts/contracts/FarmGuardLedger.sol/FarmGuardLedger.json'
);

let provider = null;
let wallet = null;
let contract = null;
let contractAddress = null;
let initError = 'Not initialized yet';

function init() {
  try {
    if (!fs.existsSync(DEPLOYMENT_PATH)) {
      throw new Error(
        'blockchain/deployment.json not found. Run the contract deploy step first (see README / setup instructions).'
      );
    }
    if (!fs.existsSync(ARTIFACT_PATH)) {
      throw new Error(
        'Compiled contract artifact not found. Run "npx hardhat compile" inside /blockchain first.'
      );
    }

    const deployment = JSON.parse(fs.readFileSync(DEPLOYMENT_PATH, 'utf8'));
    const artifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, 'utf8'));

    contractAddress = deployment.address;

    provider = new ethers.JsonRpcProvider(RPC_URL);
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY || DEFAULT_HARDHAT_PRIVATE_KEY;
    wallet = new ethers.Wallet(privateKey, provider);
    // NonceManager tracks the next nonce locally instead of re-querying the
    // node for every send. Without it, two transactions submitted in quick
    // succession (e.g. logging a treatment right before clearing a batch)
    // can both read the same "pending" nonce from the provider's short-lived
    // cache and the second one gets rejected as NONCE_EXPIRED.
    const signer = new ethers.NonceManager(wallet);
    contract = new ethers.Contract(contractAddress, artifact.abi, signer);

    initError = null;
    console.log(`[blockchain] Ready. RPC=${RPC_URL} contract=${contractAddress}`);
  } catch (err) {
    contract = null;
    initError = err.message;
    console.warn(`[blockchain] Not connected: ${err.message}`);
  }
}

init();

/** Re-run initialization, e.g. after redeploying the contract without restarting the server. */
function reinit() {
  init();
}

function isConnected() {
  return !!contract;
}

/**
 * Deterministically hash a JS object the same way every time, regardless of
 * key insertion order, so the same logical record always produces the same
 * hash both when anchoring and when later verifying.
 */
function canonicalHash(obj) {
  const ordered = Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
  const json = JSON.stringify(ordered);
  return ethers.keccak256(ethers.toUtf8Bytes(json));
}

/**
 * Submit a real on-chain transaction anchoring the hash of `dataObject`.
 * Waits for the transaction to be mined and returns the real tx hash, block
 * number, and the index the record was stored at inside the contract.
 */
async function anchorRecord({ recordType, referenceId, farmId, dataObject }) {
  if (!contract) {
    throw new Error(initError || 'Blockchain not connected');
  }

  const dataHash = canonicalHash(dataObject);
  const tx = await contract.addRecord(recordType, referenceId, farmId, dataHash);
  const receipt = await tx.wait();

  let recordIndex = null;
  for (const log of receipt.logs) {
    try {
      const parsed = contract.interface.parseLog(log);
      if (parsed && parsed.name === 'RecordAdded') {
        recordIndex = Number(parsed.args.recordIndex);
        break;
      }
    } catch (_err) {
      // Not a log emitted by our contract's ABI - ignore.
    }
  }

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    recordIndex,
    dataHash,
  };
}

/** Live status of the chain + contract, used by the Blockchain Dashboard. */
async function getStatus() {
  if (!contract) {
    return { connected: false, error: initError, rpcUrl: RPC_URL };
  }
  const [blockNumber, network, totalRecords, balance] = await Promise.all([
    provider.getBlockNumber(),
    provider.getNetwork(),
    contract.getRecordCount(),
    provider.getBalance(wallet.address),
  ]);

  return {
    connected: true,
    rpcUrl: RPC_URL,
    chainId: Number(network.chainId),
    blockNumber,
    contractAddress,
    totalRecords: Number(totalRecords),
    signerAddress: wallet.address,
    signerBalanceEth: ethers.formatEther(balance),
  };
}

/** Fetch a single record straight from the contract (live call, no caching). */
async function getRecordOnChain(index) {
  if (!contract) {
    throw new Error(initError || 'Blockchain not connected');
  }
  const r = await contract.getRecord(index);
  return {
    recordType: r.recordType,
    referenceId: r.referenceId,
    farmId: r.farmId,
    dataHash: r.dataHash,
    timestamp: Number(r.timestamp),
    submitter: r.submitter,
  };
}

module.exports = {
  init,
  reinit,
  isConnected,
  canonicalHash,
  anchorRecord,
  getStatus,
  getRecordOnChain,
};
