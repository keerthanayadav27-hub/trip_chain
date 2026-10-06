import React, { useState } from 'react';
import { HelpCircle, ShieldCheck, Wallet, Blocks, AlertTriangle, Download, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  icon: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, icon, isOpen, onClick }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden mb-4 transition-all duration-200 hover:border-indigo-500/30">
      <button 
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-slate-900/50 rounded-lg text-indigo-400">
            {icon}
          </div>
          <h3 className="text-lg font-medium text-slate-200">{question}</h3>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      <div 
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-slate-300 pl-14 pr-4 text-sm leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What if the AI fails?",
      icon: <AlertTriangle size={24} />,
      answer: (
        <div className="space-y-3">
          <p>
            The AI service is modular and wrapped in try/catch error boundaries. If the real AI API (e.g., GPT-4, Gemini) is unavailable, the app falls back to a pre-built destination knowledge base with curated itineraries for popular cities.
          </p>
          <p>
            Users also see clear error toasts and can retry generation <RefreshCw size={14} className="inline text-cyan-400" />. The architecture uses a service adapter pattern so switching AI providers requires changing only one file (<code>aiService.ts</code>).
          </p>
        </div>
      )
    },
    {
      question: "What if the website crashes before the trip?",
      icon: <ShieldCheck size={24} />,
      answer: (
        <div className="space-y-3">
          <p>
            Every approved itinerary version is cryptographically hashed (SHA-256) and permanently recorded on-chain with timestamps and digital signatures. Even if the website goes down, the on-chain record proves exactly what the group agreed to.
          </p>
          <p>
            Additionally, users can export their complete itinerary as a standard .ics calendar file <Download size={14} className="inline text-cyan-400" /> that works offline in Google Calendar, Apple Calendar, or Outlook. The version history is also persisted in <code>localStorage</code> as a secondary backup.
          </p>
        </div>
      )
    },
    {
      question: "How is MetaMask used?",
      icon: <Wallet size={24} />,
      answer: (
        <div className="space-y-3">
          <p>
            MetaMask integration follows the <strong>EIP-712</strong> typed data signing standard. When a group member approves an itinerary change, the app constructs a structured EIP-712 payload containing the trip ID, destination, version number, canonical itinerary hash, budget, and vote.
          </p>
          <p>
            This payload is sent to MetaMask for signing via <code>eth_signTypedData_v4</code>. The resulting ECDSA signature cryptographically proves the signer's identity and consent. If MetaMask is not installed, the app uses a high-fidelity simulation with Web Crypto API (SHA-256) to demonstrate the exact same flow. The Connect Wallet button in the navbar persona dropdown activates real MetaMask.
          </p>
        </div>
      )
    },
    {
      question: "Where is blockchain being used?",
      icon: <Blocks size={24} />,
      answer: (
        <div className="space-y-3">
          <p>
            Blockchain serves as the immutable consensus ledger. Specifically:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Each approved itinerary version is deterministically serialized to canonical JSON, hashed with SHA-256, and the hash is stored on a smart contract (simulated Arbitrum Sepolia L2, contract <code>0x742d...44e</code>).</li>
            <li>The contract emits <code>ItineraryCommitted</code> events with the hash, version, signers, and block timestamp.</li>
            <li>A linked-list chain structure connects versions via <code>previousHash</code> pointers (like a mini-blockchain within the contract).</li>
            <li>The tamper detection demo proves that any local modification breaks the hash match against the on-chain record.</li>
            <li>Expense splitting uses $TRIP test tokens with on-chain transfer simulation.</li>
          </ol>
          <p>
            All blockchain services are modular in <code>blockchainService.ts</code> and can be swapped to real Ethers.js/Wagmi calls.
          </p>
        </div>
      )
    }
  ];

  return (
    <section className="w-full max-w-4xl mx-auto my-16 px-4">
      <div className="flex items-center gap-3 mb-8">
        <HelpCircle className="text-indigo-400" size={28} />
        <h2 className="text-2xl font-bold text-white">Technical Architecture & FAQ</h2>
      </div>
      
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            icon={faq.icon}
            answer={faq.answer}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
