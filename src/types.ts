export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string; // 'photo' | 'video' | 'document' | 'app' | 'note' | 'archive' | 'encrypted'
  category: 'photos' | 'videos' | 'documents' | 'apps' | 'notes' | 'archives' | 'vaults' | 'memories';
  dateAdded: string;
  isEncrypted: boolean;
  vaultId: string | null; // null if unmanaged / root public
  isPermanent: boolean; // stored forever on Aptos transactional level
  md5: string; // Simulated IPFS CID / Shelby hash
  aptosTx: string | null; // Aptos Transaction hash if permanent
  owner: string;
  contentSummary?: string; // AI generated summary/description
  tags: string[];
}

export type VaultType = 'public' | 'private' | 'permanent' | 'secret';

export interface Vault {
  id: string;
  name: string;
  type: VaultType;
  description: string;
  storageUsed: number;
  maxStorage: number;
  fileCount: number;
  isUnlocked: boolean;
  requiresPassword?: boolean;
  passwordHash?: string;
  createdAt: string;
}

export interface Wallet {
  name: string;
  id: 'petra' | 'martian' | 'pontem' | 'fewcha';
  logo: string;
  connected: boolean;
  address: string | null;
  balance: number; // SBY
}

export interface MarketItem {
  id: string;
  name: string;
  cost: number; // SBY per month or outright purchase
  type: 'capacity' | 'node' | 'bandwidth' | 'contract';
  description: string;
  rating: number;
  seller: string;
  features: string[];
}

export interface StorageNode {
  id: string;
  name: string;
  region: string;
  storageCapacity: number; // GB
  storageUsed: number; // GB
  status: 'online' | 'offline' | 'latency-high';
  ping: number; // ms
  earnings: number; // SBY
  reputation: number; // %
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isExecuting?: boolean;
  actionExecuted?: {
    type: string;
    label: string;
    meta?: any;
  };
}

export interface AIMemory {
  id: string;
  key: string;
  value: string;
  category: string;
  createdAt: string;
}
