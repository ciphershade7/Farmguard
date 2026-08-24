#  FarmGuard

A modern digital farm management platform for monitoring **livestock health, antimicrobial usage (AMU), Maximum Residue Limits (MRL), treatment records, and compliance** with an integrated **Blockchain Audit & Verification Layer**.

---

## 🚀 Project Demo

FarmGuard provides separate dashboards and workflows for:

- 👨‍🌾 Farmers
- 🩺 Veterinarians
- 👨‍💼 Administrators

---

## 📌 Project Overview

FarmGuard is designed to solve common livestock management and treatment tracking problems such as:

- Lack of centralized livestock records
- Difficulties tracking treatment history
- Manual antimicrobial usage monitoring
- Difficulty monitoring withdrawal periods
- MRL compliance tracking
- Lack of reliable treatment audit trails

The platform combines:

- **Full-Stack Web Application**
- **Livestock & Treatment Management**
- **AMU & MRL Monitoring**
- **Role-Based Dashboards**
- **Blockchain-Based Audit & Verification**
- **Local Hardhat Blockchain**
- **Solidity Smart Contracts**

---

## ✨ Features

###  Farmer Dashboard

- Herd registry
- Animal records
- Animal-specific treatment history
- Treatment compliance monitoring
- Farm health overview
- Veterinarian consultation

###  Veterinarian Dashboard

- Patient/animal management
- Treatment recording
- Antimicrobial Usage (AMU) monitoring
- Maximum Residue Limit (MRL) compliance
- Withdrawal period tracking
- Vet consultation management
- AMU & MRL analytics

###  Admin Dashboard

- Farm-wide monitoring
- System analytics
- Livestock and treatment insights
- Centralized system overview
- Blockchain audit dashboard
- Blockchain record verification

###  Blockchain Audit & Verification

- Local Hardhat blockchain network
- Solidity smart contract
- Treatment record hashing
- Blockchain proof generation
- Transaction information
- Record verification
- Admin-only blockchain dashboard
- Backend blockchain integration using ethers.js

---

##  Tech Stack

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

### Tools

- VS Code
- Git
- GitHub
- npm


##  Blockchain Integration

The blockchain implementation is available in the [blockchain](./blockchain) directory.

### Blockchain Client

The backend communicates with the blockchain through:

[server/blockchainClient.js](./server/blockchainClient.js)

### Blockchain Dashboard

The admin blockchain interface is available at:

[BlockchainDashboard.jsx](./client/src/components/admin/BlockchainDashboard.jsx)

---

##  Blockchain Workflow

1. Treatment data is recorded through the application.
2. The backend processes the treatment record.
3. A cryptographic hash/proof is generated.
4. The backend communicates with the local Hardhat blockchain through ethers.js.
5. The proof is recorded using the Solidity smart contract.
6. Blockchain transaction details can be viewed through the Admin Blockchain Dashboard.
7. The record can be verified against its blockchain proof.

---

##  Installation

### Clone the Repository

    git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
    cd FarmGuard

### Install Frontend Dependencies

    cd client
    npm install

### Install Backend Dependencies

    cd ../server
    npm install

### Install Blockchain Dependencies

    cd ../blockchain
    npm install

---

##  Running the Project

### Start Backend

    cd server
    npm start

### Start Frontend

Open another terminal:

    cd client
    npm run dev

### Start Blockchain

Open another terminal and start the configured Hardhat local network.

---

##  Purpose

FarmGuard aims to improve livestock treatment management by providing a centralized platform for **record keeping, compliance monitoring, analytics, and blockchain-backed verification**.

The blockchain layer provides an additional **tamper-evident audit mechanism** while the application's operational data remains managed through the backend database.

---

##  Project

**FarmGuard**

**Type:** Full-Stack Web Application + Blockchain Audit Layer

**Frontend:** React + Vite

**Backend:** Node.js + Express

**Database:** SQLite

**Blockchain:** Hardhat + Solidity + ethers.js

---
