# FarmGuard

### Digital Farm Management Portal for Monitoring Antimicrobial Usage (AMU) and Maximum Residue Limits (MRL) in Livestock

FarmGuard is a digital farm management platform designed to help farmers, veterinarians, and administrators monitor livestock health, treatment records, antimicrobial usage, and MRL compliance through a centralized system.

---

## Features

### Farmer Dashboard
- Herd registry and animal records
- Animal-specific treatment history
- Treatment compliance monitoring
- Vet consultation
- Farm-level health overview

### Veterinarian Dashboard
- Patient/animal management
- Treatment recording
- Antimicrobial Usage (AMU) monitoring
- Maximum Residue Limit (MRL) compliance
- Vet consultation management
- AMU and MRL analytics

### Admin Dashboard
- Farm-wide monitoring
- System analytics
- Overall livestock and treatment insights
- Centralized system overview

### Treatment & Compliance
- Record livestock treatments
- Track antimicrobial usage
- Monitor withdrawal periods
- Check MRL-related compliance
- Maintain treatment history

---
## Project Structure

```text
FarmGuard/
│
├── client/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── server/              # Node.js / Express backend
│   ├── index.js
│   └── package.json
│
└── README.md