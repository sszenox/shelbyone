import { useState } from 'react';
import { FileItem, Vault } from '../types';
import UploadZone from './UploadZone';
import { 
  FileText, 
  Image, 
  Video, 
  Binary, 
  FileArchive, 
  Layers, 
  Sparkles, 
  Search, 
  Plus, 
  Trash2, 
  FileCheck, 
  Download, 
  Database
} from 'lucide-react';

interface DashboardProps {
  files: FileItem[];
  vaults: Vault[];
  activeVault: Vault | null;
  onUploadSuccess: (newFile: FileItem) => void;
  onDeleteFile: (fileId: string) => void;
  walletConnected: boolean;
  onTriggerSummary: (fileName: string) => void;
}

export default function Dashboard({
  files,
  vaults,
  activeVault,
  onUploadSuccess,
  onDeleteFile,
  walletConnected,
  onTriggerSummary
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter files by query and category, as well as vault mapping
  const filteredFiles = files.filter((file) => {
    // Vault filter: If activeVault selected, show only files belonging to that vault
    // Otherwise show only files with null vaultId or 'v-public'
    if (activeVault) {
      if (file.vaultId !== activeVault.id) return false;
    } else {
      if (file.vaultId && file.vaultId !== 'v-public') return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && file.category !== selectedCategory) return false;

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = file.name.toLowerCase().includes(q);
      const matchTags = file.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchName || matchTags;
    }

    return true;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'photo':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <Image className="w-4 h-4 text-sky-400" />;
      case 'video':
      case 'mp4':
      case 'mov':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'archive':
      case 'enc':
      case 'zip':
      case 'tar':
        return <FileArchive className="w-4 h-4 text-amber-500" />;
      case 'document':
      case 'doc':
      case 'docx':
      case 'pdf':
        return <FileText className="w-4 h-4 text-shelby-blue" />;
      default:
        return <Binary className="w-4 h-4 text-[#22D3EE]" />;
    }
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
    <div id="dashboard-root" className="space-y-6">
      
      {/* Top Banner indicating Active Explorer Mode */}
      <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-shelby-blue/5 rounded-full blur-2xl pointer-events-none" />
        
        <div>
          <h2 className="text-xl font-display font-medium text-white flex items-center gap-2">
            {activeVault ? (
              <>
                <Layers className="w-5 text-shelby-purple" />
                Active Vault: <span className="text-shelby-purple">{activeVault.name}</span>
              </>
            ) : (
              <>
                <Database className="w-5 text-shelby-blue" />
                Root Desktop Space
              </>
            )}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {activeVault 
              ? `Reviewing encrypted, peer-sharded storage nodes reserved for ${activeVault.name}.`
              : 'Managing general open drive files peering onto direct Shelby nodes.'
            }
          </p>
        </div>

        <div className="flex gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-[10px] text-gray-500 uppercase block">Workspace integrity</span>
            <span className="text-emerald-400 font-semibold uppercase mt-0.5 block">ZK Verified</span>
          </div>
          <div className="text-right border-l border-white/5 pl-4">
            <span className="text-[10px] text-gray-500 uppercase block">Active fragments</span>
            <span className="text-white font-semibold mt-0.5 block">{filteredFiles.length} records</span>
          </div>
        </div>
      </div>

      {/* Main Row: Drag & Drop upload and category links */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <UploadZone
            activeVault={activeVault}
            onUploadSuccess={onUploadSuccess}
            walletConnected={walletConnected}
          />
        </div>

        {/* Categories Sidebar Selection (1 Column bento grid) */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col justify-between bg-black/30">
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest">Workspace categorization</h3>
            <p className="text-[10px] text-gray-500 mt-1">Filter your storage segments dynamically by index classes:</p>
          </div>

          <div className="space-y-1 mt-4">
            {[
              { id: 'all', label: 'All files', count: files.length },
              { id: 'documents', label: 'Documents & whitepapers', count: files.filter(f => f.category === 'documents').length },
              { id: 'photos', label: 'Photos & designs', count: files.filter(f => f.category === 'photos').length },
              { id: 'videos', label: 'Videos & raw stream', count: files.filter(f => f.category === 'videos').length },
              { id: 'vaults', label: 'Protected archives', count: files.filter(f => f.category === 'vaults').length }
            ].map((cat) => (
              <button
                id={`cat-filter-${cat.id}`}
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex justify-between items-center px-3 py-2 rounded-xl text-xs transition-colors outline-none ${
                  selectedCategory === cat.id
                    ? 'bg-shelby-blue/10 text-shelby-blue font-semibold border-l-2 border-shelby-blue'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <span>{cat.label}</span>
                <span className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded-lg text-gray-500">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-white/5 pt-3 mt-4 flex justify-between items-center text-[10px] text-gray-500 font-mono">
            <span>NETWORK LOAD</span>
            <span className="text-emerald-400">OPTIMAL</span>
          </div>
        </div>
      </div>

      {/* Files Tabular Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden bg-black/40">
        
        {/* Table Search & Filter Header bar */}
        <div className="flex gap-4 justify-between items-center px-5 py-4 border-b border-white/5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              id="file-search-field"
              type="text"
              placeholder="Search index metadata or tag (e.g. config)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-shelby-blue transition-colors"
            />
          </div>
          
          <div className="flex gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest items-center">
            <span>Shelby storage catalog</span>
          </div>
        </div>

        {/* Main files table */}
        {filteredFiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-black/20">
                  <th className="px-5 py-3 font-semibold">Label Name</th>
                  <th className="px-5 py-3 font-semibold">Integrity Index</th>
                  <th className="px-5 py-3 font-semibold">Weight Size</th>
                  <th className="px-5 py-3 font-semibold">Committed At</th>
                  <th className="px-5 py-3 text-right pr-5 font-semibold">Control Matrix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    id={`file-row-${file.id}`}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3 flex gap-3 items-center">
                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="truncate max-w-[200px]">
                        <span className="font-semibold text-white block truncate">{file.name}</span>
                        <div className="flex gap-1.5 mt-0.5 shrink-0 overflow-x-auto text-[9px]">
                          {file.tags.map((tag, i) => (
                            <span key={i} className="text-[9px] font-mono text-gray-500 hover:text-shelby-cyan cursor-pointer">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-400 break-all max-w-[120px] truncate block" title={file.md5}>
                          {file.md5}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3 font-mono text-gray-400">
                      {formatSize(file.size)}
                    </td>

                    <td className="px-5 py-3 font-mono text-gray-500">
                      {file.dateAdded.substring(0, 10)}
                    </td>

                    <td className="px-5 py-3 text-right space-x-1.5 shrink-0 pr-5">
                      {/* Summarize button links with AI chatbot */}
                      <button
                        id={`btn-ai-summary-${file.id}`}
                        onClick={() => onTriggerSummary(file.name)}
                        className="px-2 py-1.5 text-[11px] font-semibold text-shelby-blue hover:text-white bg-shelby-blue/10 hover:bg-shelby-blue rounded-lg transition-all"
                        title="Compile AI Summary"
                      >
                        <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                        AI Summary
                      </button>

                      <button
                        id={`btn-file-delete-${file.id}`}
                        onClick={() => onDeleteFile(file.id)}
                        className="p-1 px-1.5 text-gray-500 hover:text-rose-400 rounded-lg transition-colors border border-transparent hover:border-rose-400/20"
                        title="Scour File"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty Storage Screen */
          <div className="py-12 flex flex-col justify-center items-center text-center gap-2">
            <Database className="w-10 h-10 text-gray-600 animate-pulse" />
            <h4 className="text-sm font-semibold text-white">Registry Empty</h4>
            <p className="text-xs text-gray-500 max-w-sm">
              {activeVault 
                ? `There are no encrypted file copies committed inside the security sector "${activeVault.name}".`
                : 'No decentralization files allocated globally in open storage. Drag files on dropping panel to start.'
              }
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
