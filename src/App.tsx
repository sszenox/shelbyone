import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VaultView from './components/VaultView';
import AICenter from './components/AICenter';
import KnowledgeGraph from './components/KnowledgeGraph';
import MarketplaceView from './components/MarketplaceView';
import WalletConnect, { PetraLogo, MartianLogo, PontemLogo, FewchaLogo } from './components/WalletConnect';
import { FileItem, Vault, StorageNode, Wallet } from './types';
import { INITIAL_FILES, INITIAL_VAULTS, INITIAL_NODES } from './data/mockData';
import { 
  Sparkles, 
  Wallet as WalletIcon, 
  HelpCircle, 
  Terminal, 
  ShieldCheck, 
  FolderSync, 
  KeyRound, 
  Database,
  Cpu, 
  Check, 
  X,
  Plus,
  Network
} from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeVault, setActiveVault] = useState<Vault | null>(null);
  
  // Simulated State Database
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [vaults, setVaults] = useState<Vault[]>(INITIAL_VAULTS);
  const [nodes, setNodes] = useState<StorageNode[]>(INITIAL_NODES);
  
  // Wallet states
  const [connectedWallet, setConnectedWallet] = useState<Wallet | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);

  // Archive lease state
  const [archiveGasEscrow, setArchiveGasEscrow] = useState<number>(0.25); // SBY gas
  const [archiveProofMode, setArchiveProofMode] = useState<boolean>(true);

  // Multi-collaboration states
  const [collaborators, setCollaborators] = useState<string[]>([
    '0x2b89adcf412e6bfda009a4732ea071bf12e9b0df12',
    '0xf671dbbe90df03ef928374d6cde36acb012eb234aa'
  ]);
  const [newCollabAddress, setNewCollabAddress] = useState<string>('');

  // AI center communication bridge
  const [aiFocusFile, setAiFocusFile] = useState<string | null>(null);

  const handleWalletConnected = (wallet: Wallet, address: string) => {
    setConnectedWallet({ ...wallet, connected: true, address });
    setWalletAddress(address);
    setOpenWalletModal(false);
  };

  const handleDisconnectWallet = () => {
    setConnectedWallet(null);
    setWalletAddress(null);
  };

  const handleAddFile = (newFile: FileItem) => {
    setFiles((prev) => [newFile, ...prev]);

    // Update vault storage size & file counts
    if (newFile.vaultId) {
      setVaults((prevVaults) =>
        prevVaults.map((vault) => {
          if (vault.id === newFile.vaultId) {
            return {
              ...vault,
              storageUsed: vault.storageUsed + newFile.size,
              fileCount: vault.fileCount + 1,
            };
          }
          return vault;
        })
      );
    }
  };

  const handleDeleteFile = (fileId: string) => {
    const fileToDelete = files.find((f) => f.id === fileId);
    if (!fileToDelete) return;

    setFiles((prev) => prev.filter((f) => f.id !== fileId));

    // Update vault stats
    if (fileToDelete.vaultId) {
      setVaults((prevVaults) =>
        prevVaults.map((vault) => {
          if (vault.id === fileToDelete.vaultId) {
            return {
              ...vault,
              storageUsed: Math.max(0, vault.storageUsed - fileToDelete.size),
              fileCount: Math.max(0, vault.fileCount - 1),
            };
          }
          return vault;
        })
      );
    }
  };

  const handleUnlockVault = (vaultId: string, isUnlocked: boolean) => {
    setVaults((prev) =>
      prev.map((vault) => {
        if (vault.id === vaultId) {
          return { ...vault, isUnlocked };
        }
        return vault;
      })
    );
  };

  const handleAddNewVault = (newVault: Vault) => {
    setVaults((prev) => [...prev, newVault]);
  };

  const handleTriggerSummary = (fileName: string) => {
    // Navigate to AI tab
    setActiveSection('ai');
    // Save search focus which the chat will automatically execute
    setTimeout(() => {
      const inputEl = document.getElementById('ai-prompt-input') as HTMLInputElement;
      const sendBtn = document.getElementById('ai-send-btn') as HTMLButtonElement;
      if (inputEl && sendBtn) {
        inputEl.value = `Summarize ${fileName}`;
        // Trigger programmatic submission
        sendBtn.click();
      }
    }, 450);
  };

  const handleDeductBalance = (amount: number) => {
    if (!connectedWallet) return;
    setConnectedWallet((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        balance: Math.max(0, prev.balance - amount),
      };
    });
  };

  const handleAddCapacity = (gb: number) => {
    // Add size to public drive or create custom pool
    setVaults((prev) =>
      prev.map((v) => {
        if (v.id === 'v-public') {
          return {
            ...v,
            maxStorage: v.maxStorage + gb * 1024 * 1024 * 1024,
          };
        }
        return v;
      })
    );
  };

  const handleAddCollaborator = (e: any) => {
    e.preventDefault();
    if (!newCollabAddress.trim()) return;
    setCollaborators((prev) => [...prev, newCollabAddress]);
    setNewCollabAddress('');
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const totalUsedSpace = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div id="shelby-applet-root" className="min-h-screen bg-[#0A0B0F] text-slate-100 flex p-4 gap-6 radial-grid font-sans selection:bg-shelby-blue/30 overflow-hidden select-none">
      
      {/* Sidebar navigation controls */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={(section) => {
          setActiveSection(section);
          // If moving between segments, clear active vault focus to maintain UI sanity
          if (section !== 'home' && section !== 'vaults') {
            setActiveVault(null);
          }
        }}
        walletConnected={connectedWallet?.connected || false}
        walletAddress={walletAddress}
        onConnectWallet={() => setOpenWalletModal(true)}
      />

      {/* Main interactive operating space */}
      <main id="shelby-operating-space" className="flex-1 flex flex-col justify-between h-[calc(100vh-2rem)] overflow-y-auto pr-1">
        
        {/* Master operating header displaying system telemetry status */}
        <header className="flex justify-between items-center mb-6 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              ShelbyNet storage contract gas-station leases mapped
            </span>
          </div>

          <div className="flex gap-4 items-center">
            {connectedWallet && (
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/5 py-1.5 px-3 rounded-xl text-xs font-mono font-medium tracking-tight">
                <div className="flex items-center gap-1.5">
                  {connectedWallet.id === 'petra' && <PetraLogo className="w-4 h-4 shrink-0" />}
                  {connectedWallet.id === 'martian' && <MartianLogo className="w-4 h-4 shrink-0" />}
                  {connectedWallet.id === 'pontem' && <PontemLogo className="w-4 h-4 shrink-0" />}
                  {connectedWallet.id === 'fewcha' && <FewchaLogo className="w-4 h-4 shrink-0" />}
                  <span className="text-gray-200">{connectedWallet.name}</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-shelby-cyan">{connectedWallet.balance.toFixed(2)} SBY</span>
              </div>
            )}
            
            <button
              id="top-wallet-action-btn"
              onClick={() => {
                if (connectedWallet) {
                  handleDisconnectWallet();
                } else {
                  setOpenWalletModal(true);
                }
              }}
              className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold border border-white/5 transition-all outline-none flex items-center gap-1.5"
            >
              <WalletIcon className="w-3.5 h-3.5 text-shelby-blue" />
              <span>{connectedWallet ? 'Disconnect Wallet' : 'Connect Wallet'}</span>
            </button>
          </div>
        </header>

        {/* Dynamic workspace viewport based on active tab selection */}
        <div className="flex-1">
          {/* HOME WORKSPACE */}
          {activeSection === 'home' && (
            <Dashboard
              files={files}
              vaults={vaults}
              activeVault={activeVault}
              onUploadSuccess={handleAddFile}
              onDeleteFile={handleDeleteFile}
              walletConnected={connectedWallet?.connected || false}
              onTriggerSummary={handleTriggerSummary}
            />
          )}

          {/* VAULT WORKSPACE */}
          {activeSection === 'vaults' && (
            <VaultView
              vaults={vaults}
              files={files}
              activeVault={activeVault}
              onSelectVault={(v) => {
                setActiveVault(v);
                setActiveSection('home'); // Go to Dashboard file explorer with that vault selected!
              }}
              onUnlockVault={handleUnlockVault}
              onAddNewVault={handleAddNewVault}
            />
          )}

          {/* AI CENTRE WORKSPACE */}
          {activeSection === 'ai' && (
            <AICenter
              files={files}
              vaults={vaults}
              currentFolder={activeVault ? activeVault.name : 'Public root'}
              walletConnected={connectedWallet?.connected || false}
              walletAddress={walletAddress}
              onSelectVault={setActiveVault}
              onUnlockVault={handleUnlockVault}
              onAddNewVault={handleAddNewVault}
            />
          )}

          {/* SEMANTIC SEARCH TABS */}
          {activeSection === 'search' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-display font-medium text-white flex items-center gap-2">
                  <Sparkles className="w-5 text-shelby-blue" />
                  Semantic Semantic AI Search Engine
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Query intellectual indexes from off-chain directories natively using our natural language processor.
                </p>
              </div>

              {/* Direct Search query widget triggers AI summaries */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 bg-black/40">
                <p className="text-xs text-gray-300">
                  Type what you want to retrieve, (e.g. "Find whitepapers" or "config files"). Your request triggers the ShelbyONE OS cognitive summary endpoint.
                </p>
                <div className="flex gap-2">
                  <input
                    id="semantic-globalsearch-input"
                    type="text"
                    required
                    placeholder="e.g. Find my ShelbyNet files"
                    className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-shelby-blue font-sans"
                  />
                  <button
                    id="btn-trigger-semantic-query"
                    onClick={() => {
                      const query = (document.getElementById('semantic-globalsearch-input') as HTMLInputElement)?.value;
                      if (!query) return;
                      setActiveSection('ai');
                      setTimeout(() => handleSendCommand(query), 300);
                    }}
                    className="px-5 bg-gradient-to-r from-shelby-blue to-shelby-purple text-xs font-semibold text-white rounded-xl transition-all"
                  >
                    Search Storage Base
                  </button>
                </div>
              </div>

              {/* Mapped network visualization */}
              <KnowledgeGraph nodes={nodes} files={files} />
            </div>
          )}

          {/* PERMANENT ARCHIVE WORKSPACE */}
          {activeSection === 'archive' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-display font-medium text-white flex items-center gap-2">
                  <Database className="w-5 text-shelby-blue" />
                  Gas-Locked Permanent Archive Base
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Immutable records written permanently to Shelby mining clusters. Deletions are mathematically prohibited under smart ledger lease structures.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                
                {/* Archive metrics panel */}
                <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 space-y-4">
                  <h3 className="text-xs uppercase font-mono text-shelby-cyan tracking-wider">Storage Escrow Lease Details</h3>
                  
                  <div className="space-y-3 font-mono text-xs text-gray-300">
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span>Status State:</span>
                      <span className="text-emerald-400">ACTIVE IMMUTABLE</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span>Gas Lease Escrow Deposit:</span>
                      <span>{archiveGasEscrow} SBY</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span>Proof Scheme:</span>
                      <span className="text-shelby-blue">ShelbyNet-replicated Shard Lease</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span>Rent Lease Limit:</span>
                      <span className="text-white">PERMANENT DEPOSITS</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-[10px] text-gray-500 font-mono block mb-1">Increase Gas Escrow (SBY)</label>
                    <div className="flex gap-2">
                      <input
                        id="escrow-increase-amount"
                        type="number"
                        step="0.05"
                        defaultValue="0.10"
                        className="w-20 bg-white/5 border border-white/5 rounded-lg px-2 text-xs text-white text-center"
                      />
                      <button
                        onClick={() => {
                          const val = parseFloat((document.getElementById('escrow-increase-amount') as HTMLInputElement)?.value || '0.1');
                          if (connectedWallet && connectedWallet.balance >= val) {
                            handleDeductBalance(val);
                            setArchiveGasEscrow((v) => v + val);
                          }
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[11px] rounded-lg border border-white/5 text-white"
                      >
                        Escrow Deposit
                      </button>
                    </div>
                  </div>
                </div>

                {/* Permanent Files list */}
                <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/30 space-y-4">
                  <h3 className="text-xs uppercase font-mono text-gray-500 tracking-wider">Immutable Consensus Ledger Items</h3>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                    {files.filter(f => f.isPermanent).map(f => (
                      <div key={f.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold text-white block">{f.name}</span>
                          <span className="text-[9px] font-mono text-gray-500 block text-ellipsis max-w-[200px] truncate">{f.aptosTx}</span>
                        </div>
                        <span className="text-[10px] bg-shelby-blue/15 text-shelby-blue font-mono px-2 py-0.5 rounded border border-shelby-blue/10 shrink-0">
                          PERMANENT
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* WORKSPACE CO-COLLABORATION TABS */}
          {activeSection === 'workspace' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-display font-medium text-white flex items-center gap-2">
                  <FolderSync className="w-5 text-shelby-blue" />
                  Decentralized Shared Workspace
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Authorize collaborator wallets to securely sign keysets and view sharded data. No central database, purely verified via smart-contract permissions.
                </p>
              </div>

              <div className="grid grid-cols-5 gap-6">
                
                {/* Authorization Manager (3 Columns) */}
                <div className="col-span-3 glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 space-y-5">
                  <h3 className="text-xs uppercase font-mono text-shelby-purple tracking-widest">Workspace Collaborators List</h3>
                  
                  <div className="space-y-3">
                    {collaborators.map((collab, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 bg-white/5 border border-white/5 rounded-xl">
                        <span className="text-xs font-mono text-gray-300 break-all">{collab}</span>
                        <button
                          onClick={() => setCollaborators((prev) => prev.filter(c => c !== collab))}
                          className="p-1 text-gray-500 hover:text-rose-400 rounded-lg transition-colors border border-transparent hover:border-rose-400/20 text-xs shrink-0"
                        >
                          Revoke
                        </button>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddCollaborator} className="pt-2 space-y-2">
                    <label className="text-[10px] text-gray-500 font-mono block">Add guest ShelbyNet / Aptos Account Address</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={newCollabAddress}
                        onChange={(e) => setNewCollabAddress(e.target.value)}
                        placeholder="e.g. 0x5a18b...1a0ef"
                        className="flex-1 bg-[#10121a] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-shelby-purple outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 bg-gradient-to-r from-shelby-purple to-shelby-blue text-xs font-semibold text-white rounded-xl transition-all"
                      >
                        Authorize
                      </button>
                    </div>
                  </form>
                </div>

                {/* Scope breakdown list (2 Columns) */}
                <div className="col-span-2 glass-panel p-5 rounded-2xl border border-white/10 bg-black/30 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase font-mono text-gray-500 tracking-wider">Shared Resource Access</h3>
                    <p className="text-xs text-gray-400 leading-normal">
                      Guest signatures are mapped inside our Shelby directory state proofs. Once guest triggers wallet connection, their local keys can securely decode the ciphertext shards from miners.
                    </p>
                  </div>
                  <div className="p-3.5 bg-shelby-blue/5 border border-shelby-blue/10 rounded-xl mt-4">
                    <div className="text-[11px] font-mono text-shelby-blue font-bold uppercase">Zero-Exposure Trust</div>
                    <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                      Only authorized collaborator addresses can request shard-integrity values from storage miner peers. Unauthorized callers receive cryptographically blind bytes.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* MARKETPLACE WORKSPACE */}
          {activeSection === 'marketplace' && (
            <MarketplaceView
              wallet={connectedWallet}
              onDeductBalance={handleDeductBalance}
              onAddCapacity={handleAddCapacity}
            />
          )}

          {/* SETTINGS WORKSPACE */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-display font-medium text-white flex items-center gap-2">
                  <KeyRound className="w-5 text-shelby-blue" />
                  System Keyset & Telemetry Parameters
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Adjust directory telemetry indexes, configure node weights, and review system keystore parameters.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                {/* Keyset config */}
                <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 space-y-4">
                  <h3 className="text-xs uppercase font-mono text-shelby-cyan tracking-wider">Client Cryptographic Keyrings</h3>
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">Interactive Signature Key (SK)</span>
                      <div className="p-2.5 bg-white/5 border border-white/5 rounded-lg font-mono text-[10px] text-gray-400 select-all break-all">
                        {walletAddress ? `shelby-mainnet-seed-secp256k1-${walletAddress.substring(2, 25)}...` : 'DISCONNECTED — keys uninstantiated'}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">ZK proof coordinate key</span>
                      <div className="p-2.5 bg-white/5 border border-white/5 rounded-lg font-mono text-[10px] text-gray-400 select-all break-all">
                        {walletAddress ? `circuitProof://0x9181ba4fdbcb0bc91a76efccee8be910901abcf81...` : 'DISCONNECTED'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workspace stats bento card */}
                <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/30 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs uppercase font-mono text-gray-500 tracking-wider">Workspace storage allocation</h3>
                    <div className="mt-4 space-y-2.5">
                      <div className="flex justify-between font-mono text-xs text-slate-300">
                        <span>Replicated Files Count:</span>
                        <span>{files.length} records</span>
                      </div>
                      <div className="flex justify-between font-mono text-xs text-slate-300">
                        <span>Total Cryptographic Weight:</span>
                        <span>{formatSize(totalUsedSpace)}</span>
                      </div>
                      <div className="flex justify-between font-mono text-xs text-slate-300">
                        <span>ShelbyNet Signatures:</span>
                        <span className="text-shelby-cyan">{walletAddress ? 'ACTIVE SESSION' : 'MOCK STATE'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 mt-4 text-[10px] text-gray-500 font-mono leading-relaxed">
                    ShelbyONE is compiled on the Decentralized ShelbyNet peer cloud node architecture. Telemetry indices update every block height (~0.9s consensus intervals).
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

        {/* Master footer displaying humble system metrics - NO TELEMETRY SLOP */}
        <footer className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center px-1 text-[11px] text-gray-500 font-mono select-none">
          <div>
            <span>ShelbyONE Operating Core (rev 2.4.1)</span>
          </div>
          <div className="flex gap-4">
            <span>Network: <a href="https://explorer.shelby.xyz/shelbynet" target="_blank" rel="noopener noreferrer" className="hover:text-shelby-cyan text-gray-400 underline">ShelbyNet</a></span>
            <span>Blocks: #19,410,215</span>
          </div>
        </footer>

      </main>

      {/* Wallet Connect Dialog modal frame */}
      <WalletConnect
        open={openWalletModal}
        onClose={() => setOpenWalletModal(false)}
        onWalletConnected={handleWalletConnected}
      />

    </div>
  );
}

// Inline trigger helper to bridge chat command executions during Dashboard summarizing trigger
async function handleSendCommand(message: string) {
  const inputEl = document.getElementById('ai-prompt-input') as HTMLInputElement;
  const sendBtn = document.getElementById('ai-send-btn') as HTMLButtonElement;
  if (inputEl && sendBtn) {
    inputEl.value = message;
    sendBtn.click();
  }
}
