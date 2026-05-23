import { useState, useRef, DragEvent } from 'react';
import { Upload, File, Sparkles, Server, Check, ArrowRight, ShieldAlert } from 'lucide-react';
import { FileItem, Vault } from '../types';

interface UploadZoneProps {
  activeVault: Vault | null;
  onUploadSuccess: (newFile: FileItem) => void;
  walletConnected: boolean;
}

export default function UploadZone({ activeVault, onUploadSuccess, walletConnected }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadingFile, setUploadingFile] = useState<any | null>(null);
  const [stage, setStage] = useState<'idle' | 'reading' | 'fragmenting' | 'syncing' | 'complete'>('idle');
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadingFile(file);
    setStage('reading');
    setUploadProgress(10);

    // Step 1: Simulate reading & hashing
    setTimeout(() => {
      setUploadProgress(40);
      setStage('fragmenting');
      
      // Step 2: Simulate peer sharding / ZKP circuits
      setTimeout(() => {
        setUploadProgress(75);
        setStage('syncing');

        // Step 3: AI categorization analysis
        let category: any = 'documents';
        let suggestedTags = ['shelby', 'raw-binary'];
        let aiRecommendation = 'Store in public drive.';
        let summaryText = 'Generic off-chain user asset file.';

        const fileLower = file.name.toLowerCase();
        if (fileLower.endsWith('.png') || fileLower.endsWith('.jpg') || fileLower.endsWith('.jpeg')) {
          category = 'photos';
          suggestedTags = ['image', 'visual', 'render'];
          summaryText = 'AI Vision classified: Raster image coordinate dataset.';
          aiRecommendation = 'Store in Public vault or Private ZK photo backup.';
        } else if (fileLower.endsWith('.mp4') || fileLower.endsWith('.mov')) {
          category = 'videos';
          suggestedTags = ['motion-video', 'multimedia', 'sequence'];
          summaryText = 'Decentralized audio-video container stream.';
          aiRecommendation = 'Keep in public streaming sector.';
        } else if (fileLower.includes('key') || fileLower.includes('pass') || fileLower.includes('wallet') || fileLower.includes('seed') || fileLower.endsWith('.enc') || fileLower.endsWith('.key')) {
          category = 'vaults';
          suggestedTags = ['credentials', 'private-circuit', 'secret-key'];
          summaryText = 'DANGER: Contains high-entropy cryptographic signatures / credentials.';
          aiRecommendation = 'CRITICAL: Move immediately into ZK Private Vault with client password locking.';
        } else if (fileLower.endsWith('.yaml') || fileLower.endsWith('.json') || fileLower.endsWith('.toml') || fileLower.endsWith('.config')) {
          category = 'documents';
          suggestedTags = ['config', 'system-code', 'yaml'];
          summaryText = 'System parameters configuration matrix parsed for validation.';
          aiRecommendation = 'Permanent transaction storing recommended to lock registry.';
        } else if (fileLower.endsWith('.pdf') || fileLower.endsWith('.doc') || fileLower.endsWith('.docx') || fileLower.endsWith('.text') || fileLower.endsWith('.md')) {
          category = 'documents';
          suggestedTags = ['knowledge', 'whitepaper', 'editorial'];
          summaryText = 'Text document containing off-chain database logic or draft papers.';
          aiRecommendation = 'Store in permanent archive or index semantically with Operating AI.';
        }

        setAiAnalysis({
          category,
          suggestedTags,
          aiRecommendation,
          summaryText
        });

        setTimeout(() => {
          setUploadProgress(100);
          setStage('complete');

          // construct file object
          const hex = '0123456789abcdef';
          let md5Hash = 'ipfs://Qm';
          for (let i = 0; i < 30; i++) {
            md5Hash += hex[Math.floor(Math.random() * 16)];
          }

          let aptosTx: string | null = null;
          if (activeVault?.type === 'permanent') {
            aptosTx = '0x';
            for (let i = 0; i < 64; i++) {
              aptosTx += hex[Math.floor(Math.random() * 16)];
            }
          }

          const newFile: FileItem = {
            id: 'file-' + Date.now(),
            name: file.name,
            size: file.size,
            type: fileLower.split('.').pop() || 'binary',
            category: category,
            dateAdded: new Date().toISOString(),
            isEncrypted: activeVault?.type === 'private' || activeVault?.type === 'secret',
            vaultId: activeVault ? activeVault.id : 'v-public',
            isPermanent: activeVault?.type === 'permanent',
            md5: md5Hash,
            aptosTx: aptosTx,
            owner: walletConnected ? 'Connected Wallet' : '0x000...Anonymous',
            contentSummary: summaryText,
            tags: suggestedTags
          };

          onUploadSuccess(newFile);
        }, 1500);
      }, 1200);
    }, 1000);
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setUploadingFile(null);
    setUploadProgress(0);
    setStage('idle');
    setAiAnalysis(null);
  };

  return (
    <div id="file-upload-container" className="w-full">
      {stage === 'idle' ? (
        <div
          id="dropzone-area"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerSelect}
          className={`h-48 border-2 border-dashed rounded-2xl flex flex-col justify-center items-center gap-3 p-6 cursor-pointer transition-all duration-300 relative overflow-hidden ${
            isDragActive 
              ? 'border-shelby-blue bg-shelby-blue/10' 
              : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/25'
          }`}
        >
          {/* Subtle decoration elements */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/5" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/5" />

          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
            <Upload className="w-5 h-5 text-shelby-blue" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-white">
              Drag file here, or <span className="text-shelby-blue hover:underline">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Active Target: <span className="text-shelby-cyan font-semibold">{activeVault ? activeVault.name : 'Public Drive'}</span>
            </p>
            <p className="text-[10px] text-gray-500 font-mono mt-1">
              Supports photos, videos, notes, configurations up to 2GB
            </p>
          </div>
          <input
            id="file-hidden-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        /* Dynamic Futuristic Progress Stage */
        <div id="file-upload-pipeline" className="glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-shelby-blue">
                <File className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white truncate max-w-[200px]">
                  {uploadingFile?.name}
                </h4>
                <p className="text-xs text-gray-500 font-mono">
                  {(uploadingFile?.size / 1024).toFixed(1)} KB • {stage.toUpperCase()}
                </p>
              </div>
            </div>
            {stage === 'complete' && (
              <button
                id="upload-reset-btn"
                onClick={resetUpload}
                className="px-3 py-1 text-[11px] font-mono text-shelby-blue hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors outline-none"
              >
                Upload more
              </button>
            )}
          </div>

          {/* Progress Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400 flex items-center gap-1">
                {stage === 'reading' && '🔄 Generating Sha-256 header hash...'}
                {stage === 'fragmenting' && '✂️ Sharding file fragments across ShelbyNet...'}
                {stage === 'syncing' && '🌌 Committing block proofs to ShelbyNet chain...'}
                {stage === 'complete' && '✅ Ledger registration complete! Item organized.'}
              </span>
              <span className="text-shelby-cyan font-bold">{uploadProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-shelby-blue via-shelby-purple to-shelby-cyan transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>

          {/* Decentralized Sharding Visualization Grid */}
          {stage !== 'complete' && (
            <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-[9px] text-[#22D3EE]/90">
              <div className={`p-2 border rounded-lg ${stage === 'fragmenting' || stage === 'syncing' ? 'border-shelby-cyan/30 bg-shelby-cyan/10 animate-pulse' : 'border-white/5 bg-white/[0.01]'}`}>
                <span>Shard alpha-1</span>
                <span className="block text-gray-500">Node IP: 162.82.11</span>
              </div>
              <div className={`p-2 border rounded-lg ${stage === 'fragmenting' || stage === 'syncing' ? 'border-shelby-purple/30 bg-shelby-purple/10 animate-pulse' : 'border-white/5 bg-white/[0.01]'}`}>
                <span>Shard beta-2</span>
                <span className="block text-gray-500">Node IP: 89.21.144</span>
              </div>
              <div className={`p-2 border rounded-lg ${stage === 'syncing' ? 'border-shelby-blue/30 bg-shelby-blue/10 animate-pulse' : 'border-white/5 bg-white/[0.01]'}`}>
                <span>Shard gamma-3</span>
                <span className="block text-gray-500">Node IP: 41.51.99.1</span>
              </div>
              <div className={`p-2 border rounded-lg ${stage === 'syncing' ? 'border-shelby-cyan/30 bg-shelby-cyan/10 animate-pulse' : 'border-white/5 bg-white/[0.01]'}`}>
                <span>Shard delta-4</span>
                <span className="block text-gray-500">Node IP: 201.2.45.9</span>
              </div>
            </div>
          )}

          {/* AI Organization Insights Feedback Panel */}
          {aiAnalysis && (
            <div className="p-4 bg-shelby-purple/5 border border-shelby-purple/20 rounded-xl space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs text-shelby-purple font-medium font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>ShelbyONE Operating AI Cognitive Report</span>
              </div>
              <p className="text-xs text-gray-300 leading-normal font-sans">
                {aiAnalysis.summaryText}
              </p>
              <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400">
                <div className="flex items-center gap-1">
                  <span>Class:</span>
                  <span className="text-shelby-blue uppercase">{aiAnalysis.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Tags:</span>
                  <span className="text-gray-300">{aiAnalysis.suggestedTags.join(', ')}</span>
                </div>
              </div>
              
              {/* Crypto advice message if match keys */}
              {uploadingFile?.name.toLowerCase().includes('key') ? (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2 text-rose-300">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-[10px] uppercase font-bold tracking-tight">
                    {aiAnalysis.aiRecommendation}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
                  <span>Recommendation:</span>
                  <span className="text-shelby-cyan">{aiAnalysis.aiRecommendation}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
