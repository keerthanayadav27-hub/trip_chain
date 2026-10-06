import React, { useState } from 'react';
import { Member } from '../types';
import { 
  Plane, 
  Link as ChainLink, 
  ShieldCheck, 
  Wallet, 
  Coins, 
  PlusCircle, 
  RotateCcw, 
  Check, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  members: Member[];
  currentMember: Member;
  onSelectMember: (member: Member) => void;
  onNewTrip: () => void;
  onResetDemo: () => void;
  onOpenExplorer: () => void;
  onClaimFaucet: () => void;
  isRealWalletConnected: boolean;
  onConnectRealWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  members,
  currentMember,
  onSelectMember,
  onNewTrip,
  onResetDemo,
  onOpenExplorer,
  onClaimFaucet,
  isRealWalletConnected,
  onConnectRealWallet
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const shortenAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-glow-indigo">
            <div className="w-full h-full bg-[#0d121f] rounded-[11px] flex items-center justify-center">
              <div className="relative">
                <Plane className="w-5 h-5 text-cyan-400 -rotate-45" />
                <ChainLink className="w-3.5 h-3.5 text-indigo-400 absolute -bottom-1 -right-1" />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                TripChain
              </span>
              <span className="text-[10px] uppercase font-mono font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                L2 Protocol
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Collaborative AI Travel • Consensus On-Chain
            </p>
          </div>
        </div>

        {/* Center: Network Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-slate-400">Arbitrum Sepolia</span>
          <button 
            onClick={onOpenExplorer}
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] underline underline-offset-2 ml-1"
            title="Inspect smart contract on block explorer"
          >
            0x742d...44e
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Right Actions: Faucet, New Trip, Persona Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Faucet Claim button */}
          <button
            onClick={onClaimFaucet}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-all"
            title="Claim 100 test $TRIP tokens to test expense splitting"
          >
            <Coins className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Faucet</span>
            <span className="font-mono text-cyan-300 font-semibold">{currentMember.testTokenBalance} $TRIP</span>
          </button>

          {/* New Trip button */}
          <button
            onClick={onNewTrip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Trip</span>
          </button>

          {/* Active Wallet / Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 transition-all"
            >
              <img 
                src={currentMember.avatar} 
                alt={currentMember.name} 
                className="w-5 h-5 rounded-full object-cover border border-slate-700" 
              />
              <div className="text-left hidden sm:block">
                <div className="font-medium text-slate-100 leading-tight">{currentMember.name}</div>
                <div className="font-mono text-[10px] text-slate-400">{shortenAddress(currentMember.walletAddress)}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Persona Switcher Dropdown */}
            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-xs"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Switch Active Persona (Multi-Sig Demo)
                </div>
                <div className="py-1 space-y-1">
                  {members.map(m => {
                    const isSelected = m.id === currentMember.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => onSelectMember(m)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                          isSelected 
                            ? 'bg-indigo-950/80 border border-indigo-500/40 text-white' 
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <div className="font-medium flex items-center gap-1.5">
                              {m.name}
                              {isSelected && <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.2 rounded">Active</span>}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {shortenAddress(m.walletAddress)} • {m.role}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-800 mt-1 space-y-1">
                  <button
                    onClick={onConnectRealWallet}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-all"
                  >
                    <Wallet className="w-4 h-4 text-cyan-400" />
                    <span>{isRealWalletConnected ? 'MetaMask Connected' : 'Connect Real Web3 Wallet'}</span>
                  </button>
                  <button
                    onClick={onResetDemo}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-rose-950/30 text-rose-300 transition-all"
                  >
                    <RotateCcw className="w-4 h-4 text-rose-400" />
                    <span>Reset Demo State</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
