import { useState, useEffect } from 'react';
import { StorageNode, FileItem } from '../types';
import { Server, File, Network, Activity, ShieldAlert, Cpu } from 'lucide-react';

interface KnowledgeGraphProps {
  nodes: StorageNode[];
  files: FileItem[];
}

export default function KnowledgeGraph({ nodes, files }: KnowledgeGraphProps) {
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [pulseLine, setPulseLine] = useState<number>(0);

  // Animate pulse effects
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseLine((prev) => (prev + 1) % 100);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  const totalCapacity = nodes.reduce((acc, n) => acc + n.storageCapacity, 0);
  const totalUsed = nodes.reduce((acc, n) => acc + parseFloat(n.storageUsed.toString()), 0);
  const averagePing = Math.round(nodes.reduce((acc, n) => acc + n.ping, 0) / nodes.length);

  return (
    <div id="knowledge-graph-container" className="space-y-6">
      
      {/* Top dashboard stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Active Sharding Nodes</div>
          <div className="text-xl font-bold font-display text-white mt-1 flex items-center gap-2">
            <Server className="w-5 h-5 text-shelby-blue" />
            {nodes.filter(n => n.status === 'online').length} <span className="text-xs text-gray-500 font-normal">/ {nodes.length}</span>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Total Network Space</div>
          <div className="text-xl font-bold font-display text-white mt-1 flex items-center gap-1.5">
            <Activity className="w-5 h-5 text-shelby-purple" />
            {(totalCapacity / 1024).toFixed(1)} <span className="text-xs text-gray-500 font-normal">TB Pool</span>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Global Memory Load</div>
          <div className="text-xl font-bold font-display text-white mt-1 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-shelby-cyan" />
            {((totalUsed / totalCapacity) * 100).toFixed(1)}% <span className="text-xs text-gray-500 font-normal">allocated</span>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01]">
          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Consensus Latency Index</div>
          <div className="text-xl font-bold font-display text-white mt-1 flex items-center gap-1.5">
            <Network className="w-5 h-5 text-emerald-400" />
            {averagePing} <span className="text-xs text-gray-500 font-normal">ms average</span>
          </div>
        </div>
      </div>

      {/* Main Graph Canvas Display */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Interactive SVG Diagram */}
        <div className="col-span-2 glass-panel p-5 rounded-2xl border border-white/10 h-[400px] flex flex-col justify-between relative overflow-hidden bg-black/40">
          <div className="absolute top-4 left-4 z-10">
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest">Shelby Decentralized Storage Peer-Map</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Visual representation of live replication sectors and sharded records.</p>
          </div>

          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <span className="flex items-center gap-1 text-[10px] font-mono text-shelby-blue">
              <span className="w-1.5 h-1.5 rounded-full bg-shelby-blue animate-pulse" /> Peer nodes
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-shelby-purple">
              <span className="w-1.5 h-1.5 rounded-full bg-shelby-purple animate-pulse" /> Data fragments
            </span>
          </div>

          {/* Interactive Network Graph */}
          <div className="w-full h-full flex items-center justify-center relative translate-y-3">
            <svg className="w-full h-full max-h-[350px]" viewBox="0 0 600 350">
              <defs>
                <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F8CFF" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#4F8CFF" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Central ShelbyONE operating system nexus */}
              <circle cx="300" cy="175" r="35" className="fill-black stroke-shelby-cyan/40" strokeWidth="1.5" />
              <circle cx="300" cy="175" r="45" className="fill-none stroke-shelby-cyan/10 animate-pulse" strokeWidth="1" />
              <text x="300" y="179" textAnchor="middle" className="fill-white font-mono text-[10px] uppercase font-bold tracking-widest">Core</text>

              {/* Node replication connections (lines from central to peer nodes) */}
              {/* Singapore (left-top) */}
              <line x1="300" y1="175" x2="120" y2="70" className="stroke-white/10" strokeWidth="1" />
              <circle cx={300 + (120 - 300) * (pulseLine / 100)} cy={175 + (70 - 175) * (pulseLine / 100)} r="2" className="fill-shelby-cyan" />
              
              {/* Berlin (right-top) */}
              <line x1="300" y1="175" x2="480" y2="70" className="stroke-white/10" strokeWidth="1" />
              <circle cx={300 + (480 - 300) * (pulseLine / 100)} cy={175 + (70 - 175) * (pulseLine / 100)} r="2" className="fill-shelby-blue" />
              
              {/* Silicon Valley (left-bottom) */}
              <line x1="300" y1="175" x2="150" y2="280" className="stroke-white/10" strokeWidth="1" />
              <circle cx={300 + (150 - 300) * (pulseLine / 100)} cy={175 + (280 - 175) * (pulseLine / 100)} r="2" className="fill-shelby-purple" />
              
              {/* Brazil (right-bottom) */}
              <line x1="300" y1="175" x2="450" y2="280" className="stroke-white/10" strokeWidth="1" />
              <circle cx={300 + (450 - 300) * (pulseLine / 100)} cy={175 + (280 - 175) * (pulseLine / 100)} r="2" className="fill-shelby-purple" />

              {/* Inter-node ring connections demonstrating mesh architecture */}
              <path d="M 120 70 A 240 240 0 0 1 480 70" className="fill-none stroke-white/5 border-dashed" strokeWidth="1" strokeDasharray="3,3" />
              <path d="M 150 280 A 240 240 0 0 1 450 280" className="fill-none stroke-white/5 border-dashed" strokeWidth="1" strokeDasharray="3,3" />

              {/* Singapore Node Circle */}
              <g 
                onClick={() => setSelectedElement({ type: 'node', data: nodes[0] })}
                className="cursor-pointer group"
              >
                <circle cx="120" cy="70" r="18" className="fill-black stroke-shelby-cyan hover:fill-shelby-cyan/20 transition-all" strokeWidth="2" />
                <text x="120" y="74" textAnchor="middle" className="fill-white font-mono text-[9px] font-bold">SG</text>
              </g>

              {/* Berlin Node Circle */}
              <g 
                onClick={() => setSelectedElement({ type: 'node', data: nodes[1] })}
                className="cursor-pointer group"
              >
                <circle cx="480" cy="70" r="18" className="fill-black stroke-shelby-blue hover:fill-shelby-blue/20 transition-all" strokeWidth="2" />
                <text x="480" y="74" textAnchor="middle" className="fill-white font-mono text-[9px] font-bold">DE</text>
              </g>

              {/* Silicon Valley Node Circle */}
              <g 
                onClick={() => setSelectedElement({ type: 'node', data: nodes[2] })}
                className="cursor-pointer group"
              >
                <circle cx="150" cy="280" r="18" className="fill-black stroke-shelby-purple hover:fill-shelby-purple/20 transition-all" strokeWidth="2" />
                <text x="150" y="284" textAnchor="middle" className="fill-white font-mono text-[9px] font-bold">US</text>
              </g>

              {/* Brazil Node Circle (Red-ish if high latency) */}
              <g 
                onClick={() => setSelectedElement({ type: 'node', data: nodes[3] })}
                className="cursor-pointer group"
              >
                <circle cx="450" cy="280" r="18" className="fill-black stroke-rose-500 hover:fill-rose-500/20 transition-all animate-pulse" strokeWidth="2" />
                <text x="450" y="284" textAnchor="middle" className="fill-white font-mono text-[9px] font-bold">BR</text>
              </g>

              {/* Small file fragments floating connected to nodes */}
              {files.slice(0, 5).map((file, idx) => {
                const targetNode = idx % 4;
                let fx = 180;
                let fy = 150;
                
                // coordinates around center
                if (idx === 0) { fx = 230; fy = 120; }
                else if (idx === 1) { fx = 370; fy = 130; }
                else if (idx === 2) { fx = 220; fy = 200; }
                else if (idx === 3) { fx = 360; fy = 210; }
                else { fx = 300; fy = 100; }

                return (
                  <g 
                    key={file.id} 
                    onClick={() => setSelectedElement({ type: 'file', data: file })}
                    className="cursor-pointer"
                  >
                    <line x1="300" y1="175" x2={fx} y2={fy} className="stroke-white/5" strokeWidth="1" />
                    <circle cx={fx} cy={fy} r="8" className="fill-black stroke-shelby-purple/60" strokeWidth="1.5" />
                    <circle cx={fx} cy={fy} r="3" className="fill-shelby-purple" />
                  </g>
                );
              })}

            </svg>
          </div>
        </div>

        {/* Selected Element Diagnostics (Right 1 Column) */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest flex items-center gap-2">
              <Network className="w-4 h-4 text-shelby-cyan" />
              Diagnostics Panel
            </h4>
            <p className="text-[10px] text-gray-500 mt-1 leading-normal">
              Click any element on the peer map to retrieve exact hardware or metadata diagnostics.
            </p>
          </div>

          {selectedElement ? (
            /* Selected Element Details */
            <div className="flex-1 mt-6 space-y-4 text-xs">
              {selectedElement.type === 'node' ? (
                <>
                  <div className="pb-2 border-b border-white/5">
                    <span className="text-[10px] font-mono uppercase text-gray-500">Storage Peer IP</span>
                    <h5 className="font-semibold text-shelby-blue text-sm mt-0.5">{selectedElement.data.name}</h5>
                    <span className="text-[9px] font-mono text-gray-400">Region: {selectedElement.data.region}</span>
                  </div>

                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Node Status:</span>
                      <span className={selectedElement.data.status === 'online' ? 'text-emerald-400' : 'text-amber-500 animate-pulse'}>
                        {selectedElement.data.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Hardware Ping:</span>
                      <span className="text-white">{selectedElement.data.ping} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bandwidth Cap:</span>
                      <span className="text-white">{selectedElement.data.storageCapacity} GB Allocated</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Yield Earnings:</span>
                      <span className="text-shelby-cyan font-bold">{selectedElement.data.earnings} SBY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reputation Index:</span>
                      <span className="text-emerald-400">{selectedElement.data.reputation}% verified</span>
                    </div>
                  </div>

                  {selectedElement.data.status === 'latency-high' && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 text-amber-300">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-[10px] leading-normal">
                        This regional node is experiencing high packet delay due to heavy consensus leases. Shelby router has re-negotiated priority pathways via Singapore node automatically.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="pb-2 border-b border-white/5">
                    <span className="text-[10px] font-mono uppercase text-gray-500">Encrypted Sharded File</span>
                    <h5 className="font-semibold text-shelby-purple text-sm mt-0.5 truncate">{selectedElement.data.name}</h5>
                    <span className="text-[9px] font-mono text-gray-400">Class: {selectedElement.data.category.toUpperCase()}</span>
                  </div>

                  <div className="space-y-2.5 font-mono text-[11px] text-gray-300">
                    <div>
                      <span className="text-gray-500 block">Root IPFS Link:</span>
                      <span className="text-white break-all text-[10px]">{selectedElement.data.md5}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">File Integrity:</span>
                      <span className="text-emerald-400">ZKP Clean</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Replica Sector:</span>
                      <span className="text-white">Mainnet-1</span>
                    </div>
                    {selectedElement.data.isPermanent && (
                      <div>
                        <span className="text-gray-500 block">ShelbyNet Tx Permanent:</span>
                        <span className="text-shelby-cyan break-all text-[9px]">{selectedElement.data.aptosTx}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Visual Placeholder info when nothing is active */
            <div className="flex-1 flex flex-col justify-center items-center py-10 text-center gap-2">
              <Network className="w-8 h-8 text-gray-600 animate-pulse" />
              <p className="text-[11px] text-gray-500">No active network nodes mapped. Select node Singapore or Europe on the peer-map to start telemetry tracking.</p>
            </div>
          )}

          <div className="border-t border-white/5 pt-3">
            <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest block">Security Protocol</span>
            <span className="text-[11px] text-gray-400 mt-0.5 block font-sans">
              Dynamic multi-route fragmentation prevents packet sniffing and node correlation attacks.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
