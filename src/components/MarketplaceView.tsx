import { useState } from 'react';
import { MarketItem, Wallet } from '../types';
import { INITIAL_MARKETPLACE } from '../data/mockData';
import { ShoppingBag, ChevronRight, Check, AlertTriangle, BadgeDollarSign } from 'lucide-react';

interface MarketplaceViewProps {
  wallet: Wallet | null;
  onDeductBalance: (amount: number) => void;
  onAddCapacity: (gb: number) => void;
}

export default function MarketplaceView({ wallet, onDeductBalance, onAddCapacity }: MarketplaceViewProps) {
  const [items, setItems] = useState<MarketItem[]>(INITIAL_MARKETPLACE);
  const [purchasingItem, setPurchasingItem] = useState<MarketItem | null>(null);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handlePurchase = (item: MarketItem) => {
    if (!wallet) {
      setErrorMsg('Please connect your ShelbyNet signature wallet first to subscribe.');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    if (wallet.balance < item.cost) {
      setErrorMsg(`Insufficient funds. Storage lease requires ${item.cost} SBY. Your wallet contains ${wallet.balance} SBY.`);
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    setPurchasingItem(item);
  };

  const handleConfirmPurchase = () => {
    if (!purchasingItem || !wallet) return;

    // Deduct
    onDeductBalance(purchasingItem.cost);
    
    // If capacity lease, add space
    if (purchasingItem.type === 'capacity') {
      onAddCapacity(50); // allocation of 50 GB
    }

    setSuccessMsg(`Agreement active! Leased ${purchasingItem.name} for ${purchasingItem.cost} SBY.`);
    setPurchasingItem(null);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div id="marketplace-root" className="space-y-6">
      
      {/* Description Panel */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-display font-medium text-white flex items-center gap-2">
            <ShoppingBag className="w-5 text-shelby-blue" />
            Shelby Storage Marketplace
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Exchange bandwidth, purchase distributed validator setups, and lease persistent Arweave-peered gas storage packages.
          </p>
        </div>
        {wallet && (
          <div className="bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-2">
            <span className="text-gray-500 uppercase">Available Capital</span>
            <span className="text-shelby-cyan font-semibold">{wallet.balance.toFixed(2)} SBY</span>
          </div>
        )}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs space-y-1">
          <p className="font-bold">✓ Transaction Consensus Finalized</p>
          <p className="text-[11px] font-mono">{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid listing */}
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            id={`market-item-${item.id}`}
            className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex flex-col justify-between transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-shelby-blue/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 rounded text-[8px] font-mono uppercase bg-shelby-blue/15 text-shelby-blue border border-shelby-blue/10">
                  {item.type}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">★★★★★ {item.rating}</span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white tracking-tight leading-snug group-hover:text-shelby-blue transition-colors">
                  {item.name}
                </h4>
                <p className="text-[10px] font-mono text-gray-500 mt-0.5">Offered by {item.seller}</p>
              </div>

              <p className="text-xs text-gray-400 leading-normal">
                {item.description}
              </p>

              {/* Key traits */}
              <div className="space-y-1 font-mono text-[9px] text-gray-500">
                {item.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-1.5 items-center">
                    <Check className="w-3 h-3 text-shelby-cyan shrink-0" />
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/5 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-mono block leading-none">Agreement cost</span>
                <span className="text-sm font-bold font-mono text-shelby-cyan mt-1 block">{item.cost} SBY</span>
              </div>
              <button
                id={`btn-purchase-${item.id}`}
                onClick={() => handlePurchase(item)}
                className="px-3.5 py-1.5 bg-white/5 hover:bg-shelby-blue hover:text-white rounded-lg text-xs font-semibold text-white transition-all outline-none"
              >
                Acquire lease
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation overlay */}
      {purchasingItem && (
        <div id="purchase-modal" className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BadgeDollarSign className="w-5 h-5 text-shelby-cyan" />
              Sign Shelby Lease Contract
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              You are about to sign an autonomous smart ledger transaction deploying lease allocation coordinates.
            </p>

            <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Resource Provider:</span>
                <span className="text-white font-mono">{purchasingItem.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Cost:</span>
                <span className="text-shelby-cyan font-mono font-bold">{purchasingItem.cost} SBY</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Your Current Balance:</span>
                <span className="text-white font-mono">{wallet?.balance} SBY</span>
              </div>
              <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                <span className="text-gray-500">Post Transaction Balance:</span>
                <span className="text-slate-400 font-mono">{(wallet ? wallet.balance - purchasingItem.cost : 0).toFixed(2)} SBY</span>
              </div>
            </div>

            <div className="flex gap-2.5 justify-end">
              <button
                id="btn-cancel-purchase"
                onClick={() => setPurchasingItem(null)}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white text-xs rounded-xl transition-colors outline-none"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-purchase"
                onClick={handleConfirmPurchase}
                className="px-4 py-2 bg-gradient-to-r from-shelby-blue to-shelby-purple text-white text-xs font-semibold rounded-xl transition-all shadow-lg outline-none"
              >
                Sign & Deploy Lease
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
