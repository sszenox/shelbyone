import { 
  Home, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Archive, 
  FolderSync, 
  ShoppingBag, 
  Settings as SettingsIcon,
  Cpu,
  User
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  walletConnected: boolean;
  walletAddress: string | null;
  onConnectWallet: () => void;
}

export default function Sidebar({
  activeSection,
  setActiveSection,
  walletConnected,
  walletAddress,
  onConnectWallet
}: SidebarProps) {
  
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'vaults', label: 'Vaults', icon: ShieldCheck },
    { id: 'ai', label: 'Operating AI', icon: Sparkles },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'workspace', label: 'Workspace', icon: FolderSync },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <aside id="shelby-sidebar" className="w-64 h-[calc(100vh-2rem)] glass-panel rounded-2xl flex flex-col justify-between p-5 border border-white/5 relative z-40 shrink-0">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-8">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-shelby-blue to-shelby-purple shadow-lg shadow-shelby-blue/20">
            <Cpu className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-shelby-cyan rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-shelby-cyan rounded-full" />
          </div>
          <div>
            <h1 className="text-lg font-display font-medium tracking-wide text-white flex items-center gap-1">
              Shelby<span className="text-transparent bg-clip-text bg-gradient-to-r from-shelby-blue to-shelby-cyan font-bold">ONE</span>
            </h1>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">
              Decentralized Cloud OS
            </p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                id={`sidebar-btn-${item.id}`}
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none ${
                  isActive
                    ? 'bg-gradient-to-r from-shelby-blue/15 to-shelby-purple/5 text-shelby-blue font-medium border-l-2 border-shelby-blue'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-shelby-blue' : 'text-gray-400'}`} />
                <span>{item.label}</span>
                {item.id === 'ai' && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-shelby-purple animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Wallet Status Area */}
      <div className="mt-auto border-t border-white/5 pt-5 px-1">
        {walletConnected && walletAddress ? (
          <div className="flex flex-col gap-2.5 bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-shelby-blue/20 flex items-center justify-center">
                <User className="w-3 h-3 text-shelby-blue" />
              </div>
              <span className="text-xs font-mono text-gray-300 font-medium tracking-tight">
                {truncateAddress(walletAddress)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">ShelbyNet Network</span>
              <span className="text-xs text-shelby-cyan font-semibold font-mono">ACTIVE</span>
            </div>
          </div>
        ) : (
          <button
            id="sidebar-wallet-trigger"
            onClick={onConnectWallet}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-shelby-blue to-shelby-purple hover:from-shelby-blue/90 hover:to-shelby-purple/90 text-white text-xs font-medium rounded-xl transition-all duration-300 shadow-md shadow-shelby-blue/15 hover:shadow-shelby-blue/25 uppercase tracking-wider outline-none"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </aside>
  );
}
