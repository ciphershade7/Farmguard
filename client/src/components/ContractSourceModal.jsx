import React, { useEffect, useState } from 'react';

const ContractSourceModal = ({ isOpen, onClose, contractTitle }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsRendered(true));
    } else {
      setIsRendered(false);
    }
  }, [isOpen]);

  if (!isOpen && !isRendered) return null;

  const mockSolidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ${contractTitle.replace(/\s+/g, '')}
 * @dev Enforces the withdrawal period for antimicrobial treatments
 * before milk can be certified as Zero-Residue.
 */
contract ${contractTitle.replace(/\s+/g, '')} {
    
    struct Treatment {
        uint256 animalId;
        string drugName;
        uint256 withdrawalHours;
        uint256 timestamp;
        address vet;
    }

    mapping(uint256 => Treatment[]) public animalTreatments;

    event TreatmentLogged(uint256 indexed animalId, string drugName, uint256 withdrawalEnds);
    event BatchCleared(string batchId, uint256 safeLiters);

    function logTreatment(uint256 _animalId, string memory _drug, uint256 _hours) public {
        Treatment memory newTx = Treatment({
            animalId: _animalId,
            drugName: _drug,
            withdrawalHours: _hours,
            timestamp: block.timestamp,
            vet: msg.sender
        });
        
        animalTreatments[_animalId].push(newTx);
        emit TreatmentLogged(_animalId, _drug, block.timestamp + (_hours * 1 hours));
    }

    function isSafeToMilk(uint256 _animalId) public view returns (bool) {
        Treatment[] memory txs = animalTreatments[_animalId];
        if (txs.length == 0) return true;
        
        Treatment memory lastTx = txs[txs.length - 1];
        uint256 clearanceTime = lastTx.timestamp + (lastTx.withdrawalHours * 1 hours);
        
        return block.timestamp >= clearanceTime;
    }
}`;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'opacity-100 bg-black/60 backdrop-blur-md' : 'opacity-0 bg-transparent pointer-events-none'}`}>
      <div className={`relative bg-[#1E1E1E] border border-gray-700 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isRendered ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-12 scale-95 opacity-0'}`}>
        <div className="bg-[#2D2D2D] p-3 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
            <h2 className="text-gray-200 font-mono text-sm">{contractTitle}.sol</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div className="p-4 overflow-auto custom-scrollbar h-96">
          <pre className="text-sm font-mono text-green-400 leading-relaxed">
            <code>{mockSolidityCode}</code>
          </pre>
        </div>
        
        <div className="p-3 bg-[#2D2D2D] border-t border-gray-700 flex justify-between items-center text-xs text-gray-500 font-mono">
          <span>Read-only View</span>
          <span>Verified on FarmGuard Testnet</span>
        </div>
      </div>
    </div>
  );
};

export default ContractSourceModal;
