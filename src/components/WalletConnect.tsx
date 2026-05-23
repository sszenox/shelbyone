import React, { useState, useEffect } from 'react';
import { INITIAL_WALLETS } from '../data/mockData';
import { Wallet } from '../types';
import { 
  Shield, 
  KeyRound, 
  Check, 
  X, 
  AlertCircle, 
  Lock, 
  Unlock, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  Terminal,
  Fingerprint
} from 'lucide-react';

// Brand SVG Logos
export function PetraLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#5A33FD"/>
      {/* Handcrafted precise wave-ring representing the modern curving Petra 'P' */}
      <path 
        d="M50 22C34.5 22 22 34.5 22 50C22 65.5 34.5 78 50 78C53.9 78 57.6 77.2 61 75.7C63.2 74.7 63.6 72 61.8 70.4C58.8 67.8 55.4 66.8 51.5 67.3C40.7 68.7 31.4 59.8 32 49C32.6 38.6 41.4 30.5 51.8 30C62.8 29.5 72 38.2 72 49C72 54.4 69.8 59.2 66.2 62.7C64.4 64.5 64.7 67.5 66.8 68.9C69.4 70.7 72.8 69.1 74.5 66.3C79.2 58.7 82 49.7 82 40C82 22 67.4 22 50 22Z" 
        fill="white"
      />
    </svg>
  );
}

export function MartianLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#0B0F19"/>
      {/* Sci-fi cyberpunk alien helmet logo of Martian Wallet */}
      <path 
        d="M50 25C33.5 25 24 38.5 24 51C24 64.5 33.5 75 50 75C66.5 75 76 64.5 76 51C76 38.5 66.5 25 50 25ZM38 52C34.7 52 32 49.3 32 46C32 42.7 34.7 40 38 40C41.3 40 44 42.7 44 46C44 49.3 41.3 52 38 52ZM62 52C58.7 52 56 49.3 56 46C56 42.7 58.7 40 62 40C65.3 40 68 42.7 68 46C68 49.3 65.3 52 62 52Z" 
        fill="#3DDFD3"
      />
      <path 
        d="M45 61C48.5 63.5 51.5 63.5 55 61" 
        stroke="#3DDFD3" 
        strokeWidth="3.5" 
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PontemLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#141125"/>
      {/* Pontem's official overlapping colored orbit ring bridge */}
      <circle cx="41" cy="50" r="14" stroke="#E11D48" strokeWidth="6" />
      <circle cx="59" cy="50" r="14" stroke="#1D4ED8" strokeWidth="6" style={{ mixBlendMode: 'screen' }} />
      <path d="M41 50C44.5 46.5 48.5 45 50 45C51.5 45 55.5 46.5 59 50" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function FewchaLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#1A181E"/>
      {/* Beautiful geometric Fewcha Fox Face vector */}
      <path d="M50 20L26 44H42L50 58L58 44H74L50 20Z" fill="#FF5E00"/>
      <path d="M26 44L34 71L50 83L66 71L74 44H26Z" fill="#FFA200" fillOpacity="0.85"/>
      <path d="M50 58L42 71H58L50 58Z" fill="#FFFFFF"/>
    </svg>
  );
}

interface WalletConnectProps {
  onWalletConnected: (wallet: Wallet, address: string) => void;
  onClose: () => void;
  open: boolean;
}

export default function WalletConnect({ onWalletConnected, onClose, open }: WalletConnectProps) {
  const [wallets, setWallets] = useState<Wallet[]>(INITIAL_WALLETS);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  
  // Simulation & Chrome Extension Window Emulator States
  const [showEmulator, setShowEmulator] = useState<boolean>(false);
  const [emulatorPhase, setEmulatorPhase] = useState<'unlock' | 'approve' | 'loading' | 'success'>('unlock');
  const [password, setPassword] = useState<string>('petra123'); // Preset password
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [simulatedAddress, setSimulatedAddress] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');

  useEffect(() => {
    if (open) {
      // Clean states on modal open
      setSelectedWallet(null);
      setShowEmulator(false);
      setEmulatorPhase('unlock');
      setErrorText('');
    }
  }, [open]);

  if (!open) return null;

  // Custom Logo mapping helper
  const renderLogo = (id: string, className = "w-9 h-9") => {
    switch (id) {
      case 'petra': return <PetraLogo className={className} />;
      case 'martian': return <MartianLogo className={className} />;
      case 'pontem': return <PontemLogo className={className} />;
      case 'fewcha': return <FewchaLogo className={className} />;
      default: return <PetraLogo className={className} />;
    }
  };

  const handleSelectWallet = async (wallet: Wallet) => {
    setSelectedWallet(wallet);
    
    // Generate simulated address
    const hex = '0123456789abcdef';
    let addr = '0x';
    for (let i = 0; i < 40; i++) {
      addr += hex[Math.floor(Math.random() * 16)];
    }
    setSimulatedAddress(addr);

    // Check if real wallet extension is available
    const getWalletProvider = () => {
      if (typeof window === 'undefined') return null;
      
      switch (wallet.id) {
        case 'petra':
          return (window as any).aptos || (window as any).petra;
        case 'martian':
          return (window as any).martian;
        case 'pontem':
          return (window as any).pontem;
        case 'fewcha':
          return (window as any).fewcha;
        default:
          return null;
      }
    };

    const walletProvider = getWalletProvider();
    
    // If real wallet extension is detected, try to connect to it
    if (walletProvider) {
      console.log(`[v0] Real ${wallet.name} extension detected! Attempting connection...`);
      try {
        const response = await walletProvider.connect();
        let realAddr = response?.address;
        
        // For Petra, also try getting account if address not in response
        if (!realAddr && wallet.id === 'petra' && walletProvider.account) {
          const account = await walletProvider.account();
          realAddr = account?.address;
        }
        
        if (realAddr) {
          console.log(`[v0] Successfully connected to real ${wallet.name}: ${realAddr}`);
          onWalletConnected({ ...wallet, connected: true, address: realAddr }, realAddr);
          onClose();
          return;
        }
      } catch (err: any) {
        // User rejected or extension error - show error and stay on selection
        console.warn(`[v0] ${wallet.name} connection rejected or failed:`, err?.message || err);
        setErrorText(`Connection rejected. Please try again or use the simulator.`);
        // Don't auto-fall back to emulator - let user decide
        return;
      }
    }

    // No real extension found - show the simulated wallet emulator
    console.log(`[v0] No real ${wallet.name} extension found. Starting simulator...`);
    setShowEmulator(true);
    setEmulatorPhase('unlock');
    setPassword(''); // Force user or bypass password
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.trim() === '') {
      setErrorText('Please enter password to unlock wallet.');
      return;
    }
    setErrorText('');
    setEmulatorPhase('approve');
  };

  const handleQuickBypassUnlock = () => {
    setErrorText('');
    setEmulatorPhase('approve');
  };

  const handleApprove = () => {
    if (!selectedWallet) return;
    setEmulatorPhase('loading');
    
    // Simulate interactive consensus lag with success completion
    setTimeout(() => {
      setEmulatorPhase('success');
      setTimeout(() => {
        onWalletConnected(selectedWallet, simulatedAddress);
        setShowEmulator(false);
        setSelectedWallet(null);
        onClose();
      }, 1000);
    }, 1500);
  };

  const handleCancelSim = () => {
    setShowEmulator(false);
    setSelectedWallet(null);
  };

  // Helper styles based on selected wallet branding colors
  const getBrandDetails = () => {
    switch (selectedWallet?.id) {
      case 'petra':
        return {
          bg: 'bg-[#110F24]',
          accent: 'bg-[#5A33FD]',
          accentText: 'text-[#8A6FFD]',
          border: 'border-[#5A33FD]/35',
          btnHover: 'hover:bg-[#4822E5]',
          glow: 'shadow-[0_0_30px_rgba(90,51,253,0.15)]'
        };
      case 'martian':
        return {
          bg: 'bg-[#0A0D15]',
          accent: 'bg-[#1A8389]',
          accentText: 'text-[#3DDFD3]',
          border: 'border-[#3DDFD3]/35',
          btnHover: 'hover:bg-[#156E73]',
          glow: 'shadow-[0_0_30px_rgba(61,223,211,0.15)]'
        };
      case 'pontem':
        return {
          bg: 'bg-[#0E0B1A]',
          accent: 'bg-[#1D4ED8]',
          accentText: 'text-[#3B82F6]',
          border: 'border-[#4F46E5]/35',
          btnHover: 'hover:bg-[#1E40AF]',
          glow: 'shadow-[0_0_30px_rgba(79,70,229,0.15)]'
        };
      case 'fewcha':
        return {
          bg: 'bg-[#131117]',
          accent: 'bg-[#FF5E00]',
          accentText: 'text-[#FFA200]',
          border: 'border-[#FF5E00]/35',
          btnHover: 'hover:bg-[#E05300]',
          glow: 'shadow-[0_0_30px_rgba(255,94,0,0.15)]'
        };
      default:
        return {
          bg: 'bg-[#110F24]',
          accent: 'bg-[#5A33FD]',
          accentText: 'text-[#8A6FFD]',
          border: 'border-[#5A33FD]/35',
          btnHover: 'hover:bg-[#4822E5]',
          glow: 'shadow-[0_0_30px_rgba(90,51,253,0.15)]'
        };
    }
  };

  const brand = getBrandDetails();

  return (
    <div id="wallet-modal-overlay" className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
      
      {!showEmulator ? (
        /* Dynamic Wallet Listing Modal */
        <div id="wallet-modal-card" className="w-full max-w-md bg-[#090B10]/95 border border-white/10 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-300 transform scale-100">
          {/* Top Glow bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#5A33FD] via-[#3DDFD3] to-[#FF5E00]" />
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-shelby-cyan" />
                Select Wallet Signature Node
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Establish an authorized API session on ShelbyNet consensus layer.
              </p>
            </div>
            <button 
              id="close-wallet-modal-btn"
              onClick={onClose} 
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Wallets Selection Row (Authentic Branded Gradients & SVG icons) */}
          <div className="space-y-3">
            {wallets.map((w) => {
              const hoverStyle = 
                w.id === 'petra' ? 'hover:border-[#5A33FD]/50 hover:bg-[#5A33FD]/5' :
                w.id === 'martian' ? 'hover:border-[#3DDFD3]/50 hover:bg-[#3DDFD3]/5' :
                w.id === 'pontem' ? 'hover:border-[#6744f6]/50 hover:bg-[#6744f6]/5' :
                'hover:border-[#FF5E00]/50 hover:bg-[#FF5E00]/5';

              return (
                <button
                  id={`wallet-option-${w.id}`}
                  key={w.id}
                  onClick={() => handleSelectWallet(w)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 ${hoverStyle} transition-all duration-300 group text-left outline-none`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="transform scale-95 group-hover:scale-100 transition-all duration-300">
                      {renderLogo(w.id, "w-10 h-10")}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                        {w.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-mono transition-colors group-hover:text-gray-400">
                        Official Extension Core
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">Balance</span>
                    <span className={`text-xs font-semibold font-mono ${
                      w.id === 'petra' ? 'text-[#8A6FFD]' :
                      w.id === 'martian' ? 'text-[#3DDFD3]' :
                      w.id === 'pontem' ? 'text-[#8A6FFD]' :
                      'text-[#FFA200]'
                    }`}>{w.balance} SBY</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2.5 items-start p-3 bg-white/[0.02] border border-white/5 rounded-xl mt-4">
            <AlertCircle className="w-4 h-4 text-shelby-cyan shrink-0 mt-0.5" />
            <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
              Note: If browser extension is active, clicking on the logos will prompt your real keyrings. Otherwise, a pixel-perfect browser sandbox emulator will start.
            </p>
          </div>
        </div>
      ) : (
        /* 🌌 ULTRA-DETAILED CHROME EXTENSION POPUP EMULATOR 🌌 */
        <div 
          id="chrome-extension-frame" 
          className={`w-full max-w-[375px] ${brand.bg} border ${brand.border} rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] transform scale-100 transition-all duration-300 relative ${brand.glow}`}
        >
          {/* Chrome Extension Status Header */}
          <div className="bg-[#181a20]/95 border-b border-white/[0.06] py-2 px-3 flex items-center justify-between font-mono text-[10px] text-gray-400">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-gray-500 truncate select-all">chrome-extension://{selectedWallet?.id}-wallet/popup.html</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="cursor-default hover:text-white">?</span>
              <button onClick={handleCancelSim} className="hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-5 flex flex-col justify-between min-h-[500px]">
            
            {/* Header branding of current wallet */}
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3.5">
              <div className="flex items-center gap-2.5">
                {renderLogo(selectedWallet?.id || 'petra', "w-8 h-8")}
                <span className="text-white font-semibold text-sm tracking-wide font-sans">{selectedWallet?.name}</span>
              </div>
              <div className="bg-white/5 font-mono text-[9px] px-2 py-0.5 rounded-full text-emerald-400 border border-emerald-500/10 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                ShelbyNet
              </div>
            </div>

            {/* UNLOCK PHASE */}
            {emulatorPhase === 'unlock' && (
              <div className="flex-1 flex flex-col justify-between pt-6">
                <div className="space-y-5 text-center">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Unlock your {selectedWallet?.name}</h4>
                    <p className="text-[11px] text-gray-400 mt-1 font-mono">Requires verification passcode</p>
                  </div>

                  <form onSubmit={handleUnlock} className="space-y-4 text-left">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrorText('');
                        }}
                        placeholder="Enter 6-digit PIN or password"
                        className="w-full bg-[#1e202b] border border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors pr-10 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {errorText && (
                      <p className="text-[10px] text-rose-400 flex items-center gap-1 font-mono">
                        <XCircle className="w-3.5 h-3.5" />
                        {errorText}
                      </p>
                    )}

                    <button
                      type="submit"
                      className={`w-full py-3 ${brand.accent} text-white rounded-xl text-xs font-semibold tracking-wider font-sans transition-all active:scale-[0.98] ${brand.btnHover} shadow-md`}
                    >
                      Unlock Wallet
                    </button>
                  </form>
                </div>

                <div className="border-t border-white/[0.04] pt-4 text-center">
                  <button 
                    onClick={handleQuickBypassUnlock}
                    className={`text-[10px] uppercase font-mono ${brand.accentText} hover:underline font-bold tracking-widest`}
                  >
                    ⚡ Fast-Bypass Wallet Security Protocol ⚡
                  </button>
                </div>
              </div>
            )}

            {/* CONNECTION PERMISSION REQUEST PHASE */}
            {emulatorPhase === 'approve' && (
              <div className="flex-1 flex flex-col justify-between pt-4">
                <div className="space-y-4">
                  {/* Connection Node flow visual */}
                  <div className="flex items-center justify-center gap-5 my-2">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                      <Terminal className="w-5 h-5 text-shelby-cyan" />
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-full border-t border-dashed border-white/10 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500/20 text-indigo-400 p-0.5 rounded-full ring-2 ring-indigo-500/10">
                          <Fingerprint className="w-3.5 h-3.5 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                      {renderLogo(selectedWallet?.id || 'petra', "w-6 h-6")}
                    </div>
                  </div>

                  <div className="text-center">
                    <h4 className="text-white font-medium text-sm tracking-tight">Authorization Signature Prompt</h4>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-400/5 px-2 py-0.5 rounded border border-indigo-400/10 mt-1.5 inline-block">
                      {simulatedAddress.substring(0, 10)}...{simulatedAddress.substring(34)}
                    </span>
                  </div>

                  <p className="text-[10px] leading-relaxed text-gray-400 font-mono p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="font-bold text-white uppercase block mb-1">Requested permissions:</span>
                    🔓 Read account address & transaction indices<br />
                    💸 Request signature parameters for SBY lease gas fees<br />
                    🛡️ This site <span className="text-white underline">CANNOT</span> access recovery mnemonics or sign transactions without interactive confirmations.
                  </p>

                  <div className="space-y-1 bg-[#1a1b24] p-3 rounded-lg border border-white/[0.03] font-mono text-[9px] text-gray-400">
                    <div><span className="text-gray-500">REQUESTER URL:</span> {window.location.origin}</div>
                    <div><span className="text-gray-500">ESTIMATED FEE:</span> 0.00 SBY (Signature Only)</div>
                    <div><span className="text-gray-500">TRANSACTION WEIGHT:</span> Null Session Validation</div>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-4">
                  <button
                    onClick={handleCancelSim}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold font-sans transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleApprove}
                    className={`flex-1 py-2.5 ${brand.accent} hover:bg-opacity-90 text-white rounded-xl text-xs font-semibold font-sans transition-color shadow-lg`}
                  >
                    Approve Request
                  </button>
                </div>
              </div>
            )}

            {/* REPLICATION SYNC LOADER */}
            {emulatorPhase === 'loading' && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                <div className="relative flex items-center justify-center">
                  <div className={`w-14 h-14 rounded-full border-2 border-dashed border-white/10 border-t-${selectedWallet?.id === 'martin' ? 'teal-400' : 'indigo-500'} animate-spin`} />
                  <div className="absolute font-mono text-[9px] text-gray-500">SBY</div>
                </div>
                <div>
                  <h5 className="text-white font-medium text-xs font-mono uppercase tracking-widest">Awaiting Consensus</h5>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono leading-relaxed">
                    Broadcasting auth signatures to ShelbyNet validators...
                  </p>
                </div>
              </div>
            )}

            {/* SIGNATURE VERIFIED */}
            {emulatorPhase === 'success' && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h5 className="text-white font-bold text-xs uppercase tracking-wider">Handshake Bound</h5>
                  <p className="text-[10px] text-emerald-400/90 font-mono mt-1">
                    Signature approved. Returning lease parameters...
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
