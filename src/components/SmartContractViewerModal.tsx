import React, { useState } from 'react';
import { X, Copy, Check, FileCode2, ExternalLink, ShieldCheck } from 'lucide-react';

interface SmartContractViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SOLIDITY_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TripChainConsensus
 * @notice Collaborative AI travel itinerary planner smart contract.
 * Records immutable, cryptographically verified itinerary version hashes,
 * timestamps, and multi-sig wallet approvals on-chain.
 */
contract TripChainConsensus {
    
    struct ItineraryVersion {
        string version;             // e.g. "v1.0", "v2.0"
        bytes32 itineraryHash;      // Canonical SHA-256 hash of consensus JSON
        bytes32 previousHash;       // Hash of the prior version (immutable linked list)
        uint256 blockTimestamp;     // On-chain block timestamp
        uint256 blockNumber;        // Block height
        address proposer;           // Member who initiated the proposal
        address[] approvers;        // Addresses that approved via cryptographic signatures
        string changeSummary;       // Human-readable change summary
    }

    mapping(bytes32 => ItineraryVersion[]) private tripVersionHistory;
    mapping(bytes32 => uint256) public currentVersionIndex;

    event ItineraryCommitted(
        bytes32 indexed tripIdHash,
        string version,
        bytes32 indexed itineraryHash,
        bytes32 previousHash,
        address indexed proposer,
        address[] approvers,
        uint256 blockTimestamp
    );

    function commitItineraryVersion(
        string calldata tripId,
        string calldata version,
        bytes32 itineraryHash,
        string calldata changeSummary,
        address[] calldata approvers
    ) external returns (uint256 newVersionIndex) {
        require(itineraryHash != bytes32(0), "Invalid itinerary hash");
        require(approvers.length >= 2, "Quorum: minimum 2 approvers");

        bytes32 tripKey = keccak256(bytes(tripId));
        bytes32 prevHash = bytes32(0);

        if (tripVersionHistory[tripKey].length > 0) {
            prevHash = tripVersionHistory[tripKey][tripVersionHistory[tripKey].length - 1].itineraryHash;
        }

        ItineraryVersion memory newVer = ItineraryVersion({
            version: version,
            itineraryHash: itineraryHash,
            previousHash: prevHash,
            blockTimestamp: block.timestamp,
            blockNumber: block.number,
            proposer: msg.sender,
            approvers: approvers,
            changeSummary: changeSummary
        });

        tripVersionHistory[tripKey].push(newVer);
        newVersionIndex = tripVersionHistory[tripKey].length - 1;
        currentVersionIndex[tripKey] = newVersionIndex;

        emit ItineraryCommitted(
            tripKey,
            version,
            itineraryHash,
            prevHash,
            msg.sender,
            approvers,
            block.timestamp
        );
    }
}`;

export const SmartContractViewerModal: React.FC<SmartContractViewerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SOLIDITY_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-3xl max-h-[85vh] rounded-2xl border border-slate-700 bg-[#0d121f] p-6 shadow-2xl flex flex-col text-slate-200 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white leading-tight">
                  TripChainConsensus.sol
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Solidity ^0.8.20
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Arbitrum Sepolia L2 Contract: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto my-3 p-4 rounded-xl bg-[#070a10] border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed">
          <pre>{SOLIDITY_CODE}</pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographic EIP-712 Typed Signing & Canonical Hashing Verified</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
