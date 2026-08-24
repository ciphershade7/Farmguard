# FarmGuard

### Digital Farm Management & Livestock Treatment Compliance Platform

FarmGuard is a full-stack digital farm management platform designed to help farmers, veterinarians, and administrators manage livestock records, treatment history, antimicrobial usage (AMU), withdrawal periods, and Maximum Residue Limit (MRL) compliance through a centralized system.

The platform also includes a local blockchain audit and verification layer using Hardhat, Solidity, and ethers.js to provide tamper-resistant proof for important treatment records.

---

## Features

### Farmer Dashboard

- Herd registry and animal records
- Animal-specific treatment history
- Treatment compliance monitoring
- Farm health overview
- Veterinarian consultation

### Veterinarian Dashboard

- Patient/animal management
- Treatment recording
- Antimicrobial Usage (AMU) monitoring
- Maximum Residue Limit (MRL) compliance
- Withdrawal period tracking
- Vet consultation management
- AMU and MRL analytics

### Admin Dashboard

- Farm-wide monitoring
- System analytics
- Livestock and treatment insights
- Centralized system overview
- Blockchain audit dashboard
- Record verification

### Treatment & Compliance

- Record livestock treatments
- Track antimicrobial usage
- Monitor withdrawal periods
- Check MRL-related compliance
- Maintain treatment history
- Generate compliance-related insights

### Blockchain Audit & Verification

- Local Hardhat blockchain network
- Solidity smart contract for audit records
- Treatment record hashing
- Blockchain proof generation
- Transaction and block information
- Record verification through blockchain
- Admin-only Blockchain Dashboard
- Backend blockchain integration using ethers.js

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- SQLite

### Blockchain

- Solidity
- Hardhat
- ethers.js
- Local Ethereum-compatible blockchain

### Development Tools

- VS Code
- Git
- GitHub
- npm

---

## Project Structure

FarmGuard/
│
├── blockchain/                  # Hardhat blockchain project
│   ├── contracts/               # Solidity smart contracts
│   ├── scripts/                 # Deployment/setup scripts
│   ├── test/                    # Smart contract tests
│   └── ...
│
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── BlockchainDashboard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── server/                      # Node.js + Express backend
│   ├── index.js
│   ├── blockchainClient.js      # Blockchain integration
│   └── package.json
│
└── README.md

---

## Architecture

React + Vite Frontend
        │
        ▼
Node.js + Express Backend
        │
        ├──────────────► SQLite Database
        │
        ▼
ethers.js Blockchain Client
        │
        ▼
Hardhat Local Blockchain
        │
        ▼
Solidity Smart Contract

---

## Blockchain Workflow

1. A treatment record is created through the application.
2. The backend processes the record.
3. A cryptographic hash/proof is generated for the relevant record data.
4. The blockchain client communicates with the local Hardhat network through ethers.js.
5. The proof is recorded through the Solidity smart contract.
6. Blockchain transaction information can be viewed from the Admin Blockchain Dashboard.
7. A record can subsequently be verified against its blockchain proof.

The blockchain layer is used as an audit and verification mechanism, while the application's primary operational data remains in the backend database.

---

## Running the Project

### Install Frontend Dependencies

cd client
npm install

### Install Backend Dependencies

cd ../server
npm install

### Install Blockchain Dependencies

cd ../blockchain
npm install

### Start the Backend

cd server
npm start

### Start the Frontend

Open another terminal:

cd client
npm run dev

### Start the Local Blockchain

Open another terminal and start the Hardhat local network using the project's configured Hardhat commands.

---

## Purpose

FarmGuard aims to provide a centralized digital platform for livestock treatment management while improving transparency, traceability, and auditability of treatment records.

The combination of a conventional database with a blockchain-based verification layer allows the system to maintain practical application data while providing an additional layer of tamper-evident record verification.

---

## Project Status

**Project:** FarmGuard  
**Type:** Full-Stack Web Application with Blockchain Audit Layer  
**Frontend:** React + Vite  
**Backend:** Node.js + Express  
**Database:** SQLite  
**Blockchain:** Hardhat + Solidity + ethers.js