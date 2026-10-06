import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trip, 
  Member, 
  DayPlan, 
  Activity, 
  Proposal, 
  ItineraryVersion, 
  OnChainRecord,
  SignatureRecord
} from './types';
import { INITIAL_MEMBERS } from './data/initialData';
import { generateFullItinerary, regenerateSingleDay } from './services/aiService';
import { 
  computeItineraryHash, 
  buildEIP712Payload, 
  EIP712Payload,
  verifyItineraryIntegrity 
} from './services/cryptoService';
import { BlockchainService } from './services/blockchainService';
import { downloadICalendar } from './services/calendarService';
import { simulatePayShareToken } from './services/expenseSplitService';

// Components
import { Navbar } from './components/Navbar';
import { TripHero } from './components/TripHero';
import { ItinerarySection } from './components/ItinerarySection';
import { ProposalBanner } from './components/ProposalBanner';
import { SignatureModal } from './components/SignatureModal';
import { OnChainVerificationSection } from './components/OnChainVerificationSection';
import { VersionHistorySection } from './components/VersionHistorySection';
import { BudgetSection } from './components/BudgetSection';
import { GroupMembersSection } from './components/GroupMembersSection';
import { DayRegenerateModal } from './components/DayRegenerateModal';
import { ActivityEditModal } from './components/ActivityEditModal';
import { TripCreationModal } from './components/TripCreationModal';
import { VersionDiffModal } from './components/VersionDiffModal';
import { BlockExplorerModal } from './components/BlockExplorerModal';

export const App: React.FC = () => {
  // Application State
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [currentMember, setCurrentMember] = useState<Member>(INITIAL_MEMBERS[0]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [versionHistory, setVersionHistory] = useState<ItineraryVersion[]>([]);
  const [onChainRecord, setOnChainRecord] = useState<OnChainRecord | null>(null);
  const [activeProposal, setActiveProposal] = useState<Proposal | null>(null);

  // Loading & Processing States
  const [isInitializing, setIsInitializing] = useState(true);
  const [isGeneratingTrip, setIsGeneratingTrip] = useState(false);
  const [regeneratingDayNumber, setRegeneratingDayNumber] = useState<number | null>(null);
  const [isCommittingOnChain, setIsCommittingOnChain] = useState(false);
  const [isPayingShare, setIsPayingShare] = useState(false);
  const [isTampered, setIsTampered] = useState(false);
  const [isRealWalletConnected, setIsRealWalletConnected] = useState(false);

  // Modal Controls
  const [isTripCreationOpen, setIsTripCreationOpen] = useState(false);
  const [dayToRegenerate, setDayToRegenerate] = useState<number | null>(null);
  const [activityModalState, setActivityModalState] = useState<{
    isOpen: boolean;
    dayNumber: number;
    activityToEdit?: Activity | null;
  }>({ isOpen: false, dayNumber: 1 });
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signaturePayload, setSignaturePayload] = useState<EIP712Payload | null>(null);
  const [diffModalState, setDiffModalState] = useState<{
    isOpen: boolean;
    v1?: string;
    v2?: string;
  }>({ isOpen: false });
  const [explorerModalState, setExplorerModalState] = useState<{
    isOpen: boolean;
    txHash?: string;
  }>({ isOpen: false });

  // Floating Toast Notification
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'info' | 'error';
    text: string;
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial Load: Generate Genesis Tokyo Trip & record on-chain
  useEffect(() => {
    const initApp = async () => {
      try {
        const initialTrip = await generateFullItinerary({
          destination: 'Tokyo',
          country: 'Japan',
          startDate: '2026-10-15',
          endDate: '2026-10-18',
          totalBudget: 1500,
          interests: ['Culture', 'Gastronomy', 'Nightlife', 'Sightseeing']
        });

        // Create Genesis Signature from Alice
        const alice = INITIAL_MEMBERS[0];
        const hash = await computeItineraryHash(initialTrip);
        const genesisSig: SignatureRecord = {
          memberId: alice.id,
          memberName: alice.name,
          walletAddress: alice.walletAddress,
          vote: 'APPROVE',
          signature: `0xgenesis_${hash.substring(2, 18)}8f9a2b1c4e7d0`,
          timestamp: new Date().toISOString(),
          comment: 'Genesis consensus verified'
        };

        const { version, record } = await BlockchainService.recordGenesisVersion(initialTrip, genesisSig);

        setTrip(initialTrip);
        setVersionHistory([version]);
        setOnChainRecord(record);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initApp();
  }, []);

  // Total estimated expenses
  const totalEstimated = trip
    ? trip.days.reduce(
        (sum, day) => sum + day.activities.reduce((s, a) => s + (a.estimatedCost || 0), 0),
        0
      )
    : 0;

  // Handler: Create new trip with AI
  const handleCreateTrip = async (params: {
    destination: string;
    startDate: string;
    endDate: string;
    totalBudget: number;
    interests: string[];
  }) => {
    setIsGeneratingTrip(true);
    try {
      const newTrip = await generateFullItinerary(params);

      // Create Genesis Signature from Current Member
      const hash = await computeItineraryHash(newTrip);
      const genesisSig: SignatureRecord = {
        memberId: currentMember.id,
        memberName: currentMember.name,
        walletAddress: currentMember.walletAddress,
        vote: 'APPROVE',
        signature: `0xgenesis_${hash.substring(2, 18)}4c8d9e2a`,
        timestamp: new Date().toISOString(),
        comment: 'Genesis AI Trip Itinerary Consensus'
      };

      const { version, record } = await BlockchainService.recordGenesisVersion(newTrip, genesisSig);

      setTrip(newTrip);
      setVersionHistory([version]);
      setOnChainRecord(record);
      setActiveProposal(null);
      setIsTampered(false);
      setIsTripCreationOpen(false);

      showToast(`AI generated 3-day itinerary for ${newTrip.destination}! Genesis v1.0 anchored on-chain.`);
    } catch (err) {
      console.error('Trip creation failed:', err);
      showToast('Failed to generate trip. Please try again.', 'error');
    } finally {
      setIsGeneratingTrip(false);
    }
  };

  // Helper: Create or update draft proposal when trip is modified
  const proposeChanges = (modifiedTrip: Trip, changeNote: string) => {
    if (!trip || !onChainRecord) return;

    const baseVer = onChainRecord.currentVersion;
    // Calculate target version number (e.g. v1.0 -> v2.0 or v1.1)
    const verNumberNum = parseFloat(baseVer.replace('v', '')) + 1.0;
    const targetVer = `v${verNumberNum.toFixed(1)}`;

    const existingVotes = activeProposal?.votes || {};
    // Proposer automatically registers approval
    const updatedVotes = {
      ...existingVotes,
      [currentMember.id]: {
        vote: 'APPROVED' as const,
        signature: `0xsig_${currentMember.id}_${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        comment: changeNote
      }
    };

    const existingSummary = activeProposal?.summaryOfChanges || [];
    const newSummary = Array.from(new Set([...existingSummary, changeNote]));

    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      tripId: trip.id,
      title: `Consensus Amendment: ${changeNote}`,
      summaryOfChanges: newSummary,
      baseVersionNumber: baseVer,
      targetVersionNumber: targetVer,
      proposedTrip: modifiedTrip,
      proposerId: currentMember.id,
      proposerName: currentMember.name,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      votes: updatedVotes,
      quorumThreshold: 2 // 2 of 3 required
    };

    setActiveProposal(newProposal);
    setTrip(modifiedTrip);
    setIsTampered(false);

    showToast(`Draft proposal created: "${changeNote}". Ready for group signatures.`, 'info');
  };

  // Handler: Regenerate a single day with AI
  const handleRegenerateDay = async (dayNumber: number, customInstructions: string) => {
    if (!trip) return;
    setRegeneratingDayNumber(dayNumber);
    try {
      const regeneratedDay = await regenerateSingleDay(trip, dayNumber, customInstructions);
      const updatedDays = trip.days.map(d => d.dayNumber === dayNumber ? regeneratedDay : d);
      const modifiedTrip = { ...trip, days: updatedDays };

      const changeSummary = customInstructions.trim() 
        ? `Regenerated Day ${dayNumber} (${customInstructions.substring(0, 45)}...)`
        : `Regenerated Day ${dayNumber} with AI recommendations`;

      proposeChanges(modifiedTrip, changeSummary);
      setDayToRegenerate(null);
    } catch (err) {
      console.error('Day regeneration failed:', err);
      showToast(`Failed to regenerate Day ${dayNumber}.`, 'error');
    } finally {
      setRegeneratingDayNumber(null);
    }
  };

  // Handler: Save or Add Activity
  const handleSaveActivity = (dayNumber: number, activity: Activity) => {
    if (!trip) return;

    const targetDay = trip.days.find(d => d.dayNumber === dayNumber);
    if (!targetDay) return;

    const isExisting = targetDay.activities.some(a => a.id === activity.id);
    let updatedActivities: Activity[];
    let changeDesc = '';

    if (isExisting) {
      updatedActivities = targetDay.activities.map(a => a.id === activity.id ? activity : a);
      changeDesc = `Modified "${activity.title}" in Day ${dayNumber} ($${activity.estimatedCost})`;
    } else {
      updatedActivities = [...targetDay.activities, activity];
      changeDesc = `Added "${activity.title}" to Day ${dayNumber} ($${activity.estimatedCost})`;
    }

    const updatedDays = trip.days.map(d => 
      d.dayNumber === dayNumber ? { ...d, activities: updatedActivities } : d
    );
    const modifiedTrip = { ...trip, days: updatedDays };

    proposeChanges(modifiedTrip, changeDesc);
  };

  // Handler: Delete Activity
  const handleDeleteActivity = (dayNumber: number, activityId: string) => {
    if (!trip) return;

    const targetDay = trip.days.find(d => d.dayNumber === dayNumber);
    if (!targetDay) return;

    const actToDelete = targetDay.activities.find(a => a.id === activityId);
    const updatedActivities = targetDay.activities.filter(a => a.id !== activityId);
    const updatedDays = trip.days.map(d => 
      d.dayNumber === dayNumber ? { ...d, activities: updatedActivities } : d
    );
    const modifiedTrip = { ...trip, days: updatedDays };

    proposeChanges(modifiedTrip, `Removed "${actToDelete?.title || 'activity'}" from Day ${dayNumber}`);
  };

  // Open EIP-712 Signature Modal for current active member
  const handleOpenSignatureModal = async () => {
    if (!activeProposal) return;
    try {
      const hash = await computeItineraryHash(activeProposal.proposedTrip);
      const payload = buildEIP712Payload({
        trip: activeProposal.proposedTrip,
        version: activeProposal.targetVersionNumber,
        itineraryHash: hash,
        signerAddress: currentMember.walletAddress,
        vote: 'APPROVE'
      });
      setSignaturePayload(payload);
      setIsSignatureModalOpen(true);
    } catch (err) {
      console.error('Failed building EIP-712 payload:', err);
    }
  };

  // Confirm Signature
  const handleConfirmSignature = (signature: string) => {
    if (!activeProposal) return;

    const updatedVotes = {
      ...activeProposal.votes,
      [currentMember.id]: {
        vote: 'APPROVED' as const,
        signature,
        timestamp: new Date().toISOString()
      }
    };

    setActiveProposal({
      ...activeProposal,
      votes: updatedVotes
    });

    setIsSignatureModalOpen(false);
    showToast(`Signature verified & recorded for ${currentMember.name} (${currentMember.walletAddress.substring(0, 6)}...)`);
  };

  // Reject Proposal
  const handleRejectProposal = () => {
    if (!activeProposal) return;

    const updatedVotes = {
      ...activeProposal.votes,
      [currentMember.id]: {
        vote: 'REJECTED' as const,
        timestamp: new Date().toISOString()
      }
    };

    setActiveProposal({
      ...activeProposal,
      votes: updatedVotes
    });

    showToast(`${currentMember.name} rejected the proposal.`, 'info');
  };

  // Commit Approved Proposal On-Chain
  const handleCommitOnChain = async () => {
    if (!activeProposal || !trip) return;
    setIsCommittingOnChain(true);

    try {
      // Build signature records
      const signatureRecords: SignatureRecord[] = Object.entries(activeProposal.votes)
        .filter(([_, v]) => v.vote === 'APPROVED')
        .map(([memberId, v]) => {
          const m = members.find(mem => mem.id === memberId);
          return {
            memberId,
            memberName: m?.name || 'Group Member',
            walletAddress: m?.walletAddress || '0x0000000000000000000000000000000000000000',
            vote: 'APPROVE',
            signature: v.signature || `0xdefault_sig_${Date.now()}`,
            timestamp: v.timestamp || new Date().toISOString()
          };
        });

      const { newVersion, updatedRecord } = await BlockchainService.commitProposalOnChain(
        activeProposal,
        signatureRecords
      );

      // Celebrate with confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTrip(activeProposal.proposedTrip);
      setVersionHistory(prev => [...prev, newVersion]);
      setOnChainRecord(updatedRecord);
      setActiveProposal(null);

      showToast(`🎉 Consensus reached! Version ${newVersion.versionNumber} committed on-chain at Block #${newVersion.blockNumber}!`);
    } catch (err) {
      console.error('On-chain commit failed:', err);
      showToast('Transaction failed on-chain. Please retry.', 'error');
    } finally {
      setIsCommittingOnChain(false);
    }
  };

  // Discard draft proposal
  const handleDiscardProposal = () => {
    if (versionHistory.length > 0) {
      const latestVer = versionHistory[versionHistory.length - 1];
      setTrip(JSON.parse(JSON.stringify(latestVer.tripSnapshot)));
    }
    setActiveProposal(null);
    showToast('Draft proposal discarded. Reverted to latest confirmed on-chain version.', 'info');
  };

  // Tamper Demo
  const handleTamperData = () => {
    if (!trip) return;
    // Maliciously alter an activity cost and title locally without consensus
    const tamperedDays = trip.days.map((d, i) => {
      if (i === 1 && d.activities.length > 0) {
        const alteredActivities = [...d.activities];
        alteredActivities[0] = {
          ...alteredActivities[0],
          title: `[TAMPERED] Unapproved Luxury Suite Upgrade`,
          estimatedCost: alteredActivities[0].estimatedCost + 950
        };
        return { ...d, activities: alteredActivities };
      }
      return d;
    });

    setTrip({ ...trip, days: tamperedDays });
    setIsTampered(true);
    showToast('⚠️ Data altered locally! Run integrity check to observe cryptographic mismatch.', 'error');
  };

  // Restore Tampered Data from on-chain snapshot
  const handleRestoreData = () => {
    if (versionHistory.length > 0) {
      const latestVer = versionHistory[versionHistory.length - 1];
      setTrip(JSON.parse(JSON.stringify(latestVer.tripSnapshot)));
      setIsTampered(false);
      showToast('Consensus restored from on-chain verified snapshot!', 'success');
    }
  };

  // Shared Expense Splitting: Pay with test token
  const handlePayShare = (memberId: string, amountTRIP: number) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    setIsPayingShare(true);
    setTimeout(() => {
      const result = simulatePayShareToken(member, amountTRIP);
      if (result.success) {
        const updatedMembers = members.map(m => 
          m.id === memberId ? { ...m, testTokenBalance: result.newBalance, hasPaidShare: true } : m
        );
        setMembers(updatedMembers);
        setCurrentMember(updatedMembers.find(m => m.id === currentMember.id) || currentMember);

        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 }
        });

        showToast(`Payment of ${amountTRIP} $TRIP confirmed! Tx: ${result.txHash.substring(0, 10)}...`);
      } else {
        showToast('Insufficient $TRIP balance. Claim tokens from faucet.', 'error');
      }
      setIsPayingShare(false);
    }, 700);
  };

  // Faucet Claim (+100 $TRIP)
  const handleClaimFaucet = () => {
    const updatedMembers = members.map(m => 
      m.id === currentMember.id ? { ...m, testTokenBalance: m.testTokenBalance + 100 } : m
    );
    setMembers(updatedMembers);
    setCurrentMember(updatedMembers.find(m => m.id === currentMember.id) || currentMember);
    showToast(`Claimed 100 $TRIP testnet tokens to ${currentMember.walletAddress.substring(0, 6)}...`);
  };

  // Reset Demo State
  const handleResetDemo = async () => {
    if (trip) {
      BlockchainService.clearTripLedger(trip.id);
    }
    localStorage.clear();
    window.location.reload();
  };

  // Connect Real Wallet
  const handleConnectRealWallet = async () => {
    if (typeof window !== 'undefined' && (window as unknown as { ethereum?: unknown }).ethereum) {
      try {
        const eth = (window as unknown as { ethereum: { request: (args: unknown) => Promise<string[]> } }).ethereum;
        const accounts = await eth.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          setIsRealWalletConnected(true);
          const updatedAlice = { ...members[0], walletAddress: accounts[0] };
          const updatedMembers = [updatedAlice, members[1], members[2]];
          setMembers(updatedMembers);
          setCurrentMember(updatedAlice);
          showToast(`MetaMask connected: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`);
        }
      } catch (err) {
        console.warn('Wallet connection failed or rejected:', err);
      }
    } else {
      showToast('No Web3 wallet extension detected. Using high-fidelity simulated cryptography.', 'info');
    }
  };

  if (isInitializing || !trip) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 shadow-glow-indigo">
            <div className="animate-spin w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent" />
          </div>
          <h2 className="text-xl font-bold text-white">Initializing TripChain Protocol</h2>
          <p className="text-xs text-slate-400">
            Synthesizing initial 3-day AI itinerary, computing canonical hashes, and preparing on-chain consensus state...
          </p>
        </div>
      </div>
    );
  }

  const latestVersion = versionHistory.length > 0 ? versionHistory[versionHistory.length - 1] : null;

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col">
      
      {/* Navigation Bar */}
      <Navbar
        members={members}
        currentMember={currentMember}
        onSelectMember={setCurrentMember}
        onNewTrip={() => setIsTripCreationOpen(true)}
        onResetDemo={handleResetDemo}
        onOpenExplorer={() => setExplorerModalState({ isOpen: true })}
        onClaimFaucet={handleClaimFaucet}
        isRealWalletConnected={isRealWalletConnected}
        onConnectRealWallet={handleConnectRealWallet}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div className={`px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border flex items-center gap-2 ${
            toastMessage.type === 'error'
              ? 'bg-rose-950/90 border-rose-500 text-rose-200'
              : toastMessage.type === 'info'
                ? 'bg-indigo-950/90 border-indigo-500 text-indigo-200'
                : 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-glow-emerald'
          }`}>
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section */}
        <TripHero
          trip={trip}
          onChainRecord={onChainRecord}
          totalEstimated={totalEstimated}
          onExportCalendar={() => downloadICalendar(trip)}
          onOpenVerification={() => {
            const el = document.getElementById('on-chain-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onProposeChange={() => setActivityModalState({ isOpen: true, dayNumber: 1 })}
          onOpenDiffModal={() => setDiffModalState({ isOpen: true })}
          hasActiveProposal={activeProposal !== null}
          versionCount={versionHistory.length}
        />

        {/* Proposal Banner (If active draft) */}
        {activeProposal && (
          <ProposalBanner
            proposal={activeProposal}
            members={members}
            currentMember={currentMember}
            onOpenSignModal={handleOpenSignatureModal}
            onRejectProposal={handleRejectProposal}
            onCommitOnChain={handleCommitOnChain}
            onDiscardProposal={handleDiscardProposal}
            isCommitting={isCommittingOnChain}
          />
        )}

        {/* Itinerary Section: 3-Day Plan with independent day regeneration & edit */}
        <ItinerarySection
          trip={trip}
          onRegenerateDay={(dayNumber) => setDayToRegenerate(dayNumber)}
          onAddActivity={(dayNumber) => setActivityModalState({ isOpen: true, dayNumber, activityToEdit: null })}
          onEditActivity={(dayNumber, activity) => setActivityModalState({ isOpen: true, dayNumber, activityToEdit: activity })}
          onDeleteActivity={handleDeleteActivity}
          isRegeneratingDay={regeneratingDayNumber}
        />

        {/* Group Members & Multi-Sig Voting */}
        <GroupMembersSection
          members={members}
          currentMember={currentMember}
          proposal={activeProposal}
          onSelectMember={setCurrentMember}
        />

        {/* Budget Tracking & Shared Expense Splitting */}
        <BudgetSection
          trip={trip}
          members={members}
          currentMember={currentMember}
          onPayShare={handlePayShare}
          isPayingShare={isPayingShare}
        />

        {/* On-Chain Verification Section (Anchored with id for smooth scrolling) */}
        <div id="on-chain-section">
          <OnChainVerificationSection
            trip={trip}
            onChainRecord={onChainRecord}
            latestVersion={latestVersion}
            onOpenExplorer={(tx) => setExplorerModalState({ isOpen: true, txHash: tx })}
            onTamperData={handleTamperData}
            onRestoreData={handleRestoreData}
            isTampered={isTampered}
          />
        </div>

        {/* Version History & Consensus Timeline */}
        <VersionHistorySection
          versionHistory={versionHistory}
          currentVersionNumber={onChainRecord?.currentVersion || 'v1.0'}
          onOpenDiffModal={(v1, v2) => setDiffModalState({ isOpen: true, v1, v2 })}
          onOpenExplorer={(tx) => setExplorerModalState({ isOpen: true, txHash: tx })}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#070a10] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">TripChain Protocol</span>
            <span>•</span>
            <span>Collaborative Travel Itinerary Consensus on L2</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Contract: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TripCreationModal
        isOpen={isTripCreationOpen}
        onClose={() => setIsTripCreationOpen(false)}
        onSubmit={handleCreateTrip}
        isGenerating={isGeneratingTrip}
      />

      <DayRegenerateModal
        isOpen={dayToRegenerate !== null}
        onClose={() => setDayToRegenerate(null)}
        dayNumber={dayToRegenerate || 1}
        destination={trip.destination}
        onConfirm={handleRegenerateDay}
        isGenerating={regeneratingDayNumber !== null}
      />

      <ActivityEditModal
        isOpen={activityModalState.isOpen}
        onClose={() => setActivityModalState({ isOpen: false, dayNumber: 1 })}
        dayNumber={activityModalState.dayNumber}
        activityToEdit={activityModalState.activityToEdit}
        onSave={handleSaveActivity}
      />

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        member={currentMember}
        payload={signaturePayload}
        onConfirmSignature={handleConfirmSignature}
        isRealWalletConnected={isRealWalletConnected}
      />

      <VersionDiffModal
        isOpen={diffModalState.isOpen}
        onClose={() => setDiffModalState({ isOpen: false })}
        versions={versionHistory}
        initialV1={diffModalState.v1}
        initialV2={diffModalState.v2}
      />

      <BlockExplorerModal
        isOpen={explorerModalState.isOpen}
        onClose={() => setExplorerModalState({ isOpen: false })}
        txHash={explorerModalState.txHash}
        onChainRecord={onChainRecord}
        version={latestVersion}
      />

    </div>
  );
};
export default App;
