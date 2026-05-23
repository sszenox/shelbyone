import { useState } from 'react';
import { Vault, FileItem } from '../types';
import { ShieldCheck, Lock, Unlock, Eye, Sparkles, Database, FileCode, CheckCircle, Flame } from 'lucide-react';

interface VaultViewProps {
  vaults: Vault[];
  files: FileItem[];
  activeVault: Vault | null;
  onSelectVault: (vault: Vault | null) => void;
  onUnlockVault: (vaultId: string, isUnlocked: boolean) => void;
  onAddNewVault: (newVault: Vault) => void;
}

export default function VaultView({
  vaults,
  files,
  activeVault,
  onSelectVault,
  onUnlockVault,
  onAddNewVault
}: VaultViewProps) {
  const [unlockingVault, setUnlockingVault] = useState<Vault | null>(null);
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [zkProofSim, setZkProofSim] = useState<boolean>(false);
  const [zkStatus, setZkStatus] = useState<string>('');

  // Add new vault states
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [newVaultName, setNewVaultName] = useState<string>('');
  const [newVaultType, setNewVaultType] = useState<'public' | 'private' | 'permanent' | 'secret'>('private');
  const [newVaultDesc, setNewVaultDesc] = useState<string>('');
  const [newVaultPass, setNewVaultPass] = useState<string>('');

  const handleStartUnlock = (vault: Vault) => {
    if (vault.isUnlocked) {
      // Relock vault
      onUnlockVault(vault.id, false);
      if (activeVault?.id === vault.id) {
        onSelectVault(null); // Deselect if selection is locked
      }
      return;
    }
    setUnlockingVault(vault);
    setPassword('');
    setErrorMsg('');
    setZkProofSim(false);
  };

  const handleVerifyPassword = (e: any) => {
    e.preventDefault();
    if (!unlockingVault) return;

    if (!password) {
      setErrorMsg('Signature required.');
      return;
    }

    // High fidelity simulated ZK proof generation
    setZkProofSim(true);
    setZkStatus('Initiating client-side modular arithmetic proof...');
    
    setTimeout(() => {
      setZkStatus('Hashing seed coordinates under SHA3-256...');
      setTimeout(() => {
        setZkStatus('Transmitting cryptographic proof coordinates to Shelby miner network...');
        setTimeout(() => {
          // Verify
          const isCorrect = password === 'admin' || password.length >= 4; // Accept passwords >= 4 characters
          
          if (isCorrect) {
            onUnlockVault(unlockingVault.id, true);
            setZkProofSim(false);
            setUnlockingVault(null);
          } else {
            setZkProofSim(false);
            setErrorMsg('Cryptographic integrity check failed. Signature error.');
          }
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleCreateVaultSubmit = (e: any) => {
    e.preventDefault();
    if (!newVaultName || !newVaultDesc) return;

    const newVault: Vault = {
      id: 'v-' + Date.now(),
      name: newVaultName,
      type: newVaultType,
      description: newVaultDesc,
      storageUsed: 0,
      maxStorage: newVaultType === 'secret' ? 100 * 1024 * 1024 * 1024 : 10 * 1024 * 1024 * 1024,
      fileCount: 0,
      isUnlocked: newVaultType === 'public' || newVaultType === 'permanent',
      requiresPassword: newVaultType === 'private' || newVaultType === 'secret',
      passwordHash: newVaultPass || undefined,
      createdAt: new Date().toISOString()
    };

    onAddNewVault(newVault);
    setShowCreate(false);
    setNewVaultName('');
    setNewVaultDesc('');
    setNewVaultPass('');
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div id="vaults-module-root" className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-display font-medium text-white flex items-center gap-2">
            <ShieldCheck className="w-5 text-shelby-blue" />
            Shelby Cryptographic Vaults
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Zero-knowledge, peer-to-peer data sharding spaces operating natively on ShelbyNet smart contracts.
          </p>
        </div>
        <button
          id="btn-trigger-vault-create"
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold border border-white/5 transition-all outline-none"
        >
          {showCreate ? 'Back to Vaults' : '+ Create Custom Vault'}
        </button>
      </div>

      {showCreate ? (
        /* Vault Creation Interface */
        <form id="vault-creation-form" onSubmit={handleCreateVaultSubmit} className="max-w-xl glass-panel rounded-2xl border border-white/10 p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Configure Decentralized Node Space</h3>
          
          <div className="space-y-2">
            <label className="text-xs text-gray-400 block font-mono">Vault Identity Name</label>
            <input
              id="new-vault-name"
              type="text"
              required
              value={newVaultName}
              onChange={(e) => setNewVaultName(e.target.value)}
              placeholder="e.g. Scientific Research Archive"
              className="w-full bg-[#11131a] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-shelby-blue font-sans"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-400 block font-mono">Storage Architecture</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="vault-type-private-opt"
                type="button"
                onClick={() => { setNewVaultType('private'); }}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${newVaultType === 'private' ? 'border-shelby-purple bg-shelby-purple/5' : 'border-white/5 bg-white/[0.01]'}`}
              >
                <span className="text-xs font-semibold text-white">Private Encrypted ZKP</span>
                <span className="text-[10px] text-gray-500">Client-side keys, zero knowledge proof required.</span>
              </button>
              <button
                id="vault-type-permanent-opt"
                type="button"
                onClick={() => { setNewVaultType('permanent'); }}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${newVaultType === 'permanent' ? 'border-shelby-blue bg-shelby-blue/5' : 'border-white/5 bg-white/[0.01]'}`}
              >
                <span className="text-xs font-semibold text-white">Permanent Archive</span>
                <span className="text-[10px] text-gray-500">Immutable, written directly under transactional leases.</span>
              </button>
              <button
                id="vault-type-secret-opt"
                type="button"
                onClick={() => { setNewVaultType('secret'); }}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${newVaultType === 'secret' ? 'border-shelby-cyan bg-shelby-cyan/5' : 'border-white/5 bg-white/[0.01]'}`}
              >
                <span className="text-xs font-semibold text-white">Blackhole Secret</span>
                <span className="text-[10px] text-gray-500">Double-blind backup utilizing customized password sharding.</span>
              </button>
              <button
                id="vault-type-public-opt"
                type="button"
                onClick={() => { setNewVaultType('public'); }}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${newVaultType === 'public' ? 'border-white/10 bg-white/[0.01]' : 'border-white/5 bg-white/[0.01]'}`}
              >
                <span className="text-xs font-semibold text-white">Open Public Drive</span>
                <span className="text-[10px] text-gray-500">Open replicated index storage, fully shared.</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-400 block font-mono">Storage space descriptor</label>
            <textarea
              id="new-vault-desc"
              required
              rows={3}
              value={newVaultDesc}
              onChange={(e) => setNewVaultDesc(e.target.value)}
              placeholder="Provide a description of the architectural scope of files inside this vault..."
              className="w-full bg-[#11131a] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-shelby-blue font-sans resize-none"
            />
          </div>

          { (newVaultType === 'private' || newVaultType === 'secret') && (
            <div className="space-y-2">
              <label className="text-xs text-gray-400 block font-mono">Set Symmetric Keyset Passphrase</label>
              <input
                id="new-vault-pass"
                type="password"
                required
                value={newVaultPass}
                onChange={(e) => setNewVaultPass(e.target.value)}
                placeholder="Secure phrase (e.g., admin or secretPhrase)"
                className="w-full bg-[#11131a] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-shelby-blue font-mono"
              />
            </div>
          )}

          <button
            id="btn-vault-deploy-submit"
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-shelby-blue to-shelby-purple text-white text-xs font-semibold rounded-xl transition-all font-mono uppercase tracking-widest shadow-lg shadow-shelby-blue/10 hover:shadow-shelby-blue/20"
          >
            Deploy New Shelby Smart Vault
          </button>
        </form>
      ) : (
        /* Vault Grid Interface */
        <div id="vaults-display-grid" className="grid grid-cols-2 gap-4">
          {vaults.map((vault) => {
            const isSelected = activeVault?.id === vault.id;
            const vaultFiles = files.filter((f) => f.vaultId === vault.id);
            const utilization = (vault.storageUsed / vault.maxStorage) * 100;
            
            return (
              <div
                id={`vault-card-${vault.id}`}
                key={vault.id}
                className={`glass-panel rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isSelected 
                    ? 'border-shelby-blue/40 bg-white/[0.04] glow-blue' 
                    : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'
                }`}
              >
                {/* Background accents depending on state */}
                {vault.type === 'private' && <div className="absolute top-0 right-0 w-24 h-24 bg-shelby-purple/5 rounded-full blur-2xl -z-10" />}
                {vault.type === 'permanent' && <div className="absolute top-0 right-0 w-24 h-24 bg-shelby-blue/5 rounded-full blur-2xl -z-10" />}
                {vault.type === 'secret' && <div className="absolute top-0 right-0 w-24 h-24 bg-shelby-cyan/5 rounded-full blur-2xl -z-10" />}

                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        vault.type === 'private' ? 'bg-shelby-purple/15 text-shelby-purple' :
                        vault.type === 'permanent' ? 'bg-shelby-blue/15 text-shelby-blue' :
                        vault.type === 'secret' ? 'bg-shelby-cyan/15 text-shelby-cyan' :
                        'bg-white/5 text-gray-400'
                      }`}>
                        {vault.type === 'private' && <Lock className="w-4 h-4" />}
                        {vault.type === 'permanent' && <Database className="w-4 h-4" />}
                        {vault.type === 'secret' && <Flame className="w-4 h-4" />}
                        {vault.type === 'public' && <FileCode className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white tracking-tight">{vault.name}</h4>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-gray-500">{vault.type} Storage</span>
                      </div>
                    </div>

                    {/* Locking UI controls */}
                    {vault.requiresPassword && (
                      <button
                        id={`btn-toggle-lock-${vault.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartUnlock(vault);
                        }}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-mono border uppercase tracking-wider ${
                          vault.isUnlocked 
                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:border-emerald-500/60' 
                            : 'border-amber-500/30 text-amber-500 bg-amber-500/5 hover:border-amber-500/60'
                        }`}
                      >
                        {vault.isUnlocked ? (
                          <>
                            <Unlock className="w-3 h-3" />
                            <span>Unlocked</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                    {vault.description}
                  </p>
                </div>

                <div className="mt-5 space-y-4">
                  {/* Utilization parameters */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                      <span>Space allocation</span>
                      <span>{formatSize(vault.storageUsed)} of {formatSize(vault.maxStorage)}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          vault.type === 'private' ? 'bg-shelby-purple' :
                          vault.type === 'permanent' ? 'bg-shelby-blue' :
                          vault.type === 'secret' ? 'bg-shelby-cyan' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${utilization}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-[11px] font-mono text-gray-500">{vaultFiles.length} files committed</span>
                    
                    <button
                      id={`btn-select-vault-${vault.id}`}
                      disabled={vault.requiresPassword && !vault.isUnlocked}
                      onClick={() => onSelectVault(isSelected ? null : vault)}
                      className={`text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        vault.requiresPassword && !vault.isUnlocked
                          ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                          : isSelected
                          ? 'bg-shelby-blue/20 text-shelby-blue border border-shelby-blue/30'
                          : 'bg-white/5 hover:bg-white/10 text-white'
                      }`}
                    >
                      {isSelected ? 'Main Workspace View' : 'Explore Workspace'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cryptographic Unlocking Modal */}
      {unlockingVault && (
        <div id="unlock-modal-overlay" className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div id="unlock-modal-card" className="w-full max-w-sm glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-shelby-purple" />
              Compute Decryption Proof
            </h4>
            <p className="text-xs text-ray-400 text-gray-400 leading-relaxed">
              Decryption is fully decentralized. Provide the Symmetric hash password. The ledger verifies your client signature via on-chain ZK constraints.
            </p>

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Password Key Phrase</label>
                  <span className="text-[10px] text-gray-600 font-mono">Seed: standard</span>
                </div>
                <input
                  id="vault-unlock-password"
                  type="password"
                  required
                  placeholder="Enter vault passphrase (e.g. admin)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={zkProofSim}
                  className="w-full bg-[#11131a] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-shelby-purple font-mono"
                />
              </div>

              {errorMsg && (
                <div className="text-[11px] font-mono text-rose-400 bg-rose-500/10 p-2.5 border border-rose-500/20 rounded-lg">
                  ⚠️ {errorMsg}
                </div>
              )}

              {zkProofSim ? (
                <div className="space-y-3 py-2 text-center text-xs">
                  <div className="w-6 h-6 border-2 border-dashed border-shelby-purple rounded-full animate-spin mx-auto" />
                  <p className="text-[11px] text-gray-400 font-mono animate-pulse">{zkStatus}</p>
                </div>
              ) : (
                <div className="flex gap-2.5 justify-end">
                  <button
                    id="btn-cancel-unlock"
                    type="button"
                    onClick={() => setUnlockingVault(null)}
                    className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white text-xs rounded-xl transition-colors outline-none"
                  >
                    Close
                  </button>
                  <button
                    id="btn-confirm-unlock shadow-lg shadow-shelby-purple/10"
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-shelby-purple to-shelby-blue text-white text-xs font-semibold rounded-xl transition-all outline-none"
                  >
                    Authenticate Proof
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
