import { FileItem, Vault, MarketItem, StorageNode, Wallet } from '../types';

export const INITIAL_WALLETS: Wallet[] = [
  {
    name: 'Petra Wallet',
    id: 'petra',
    logo: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&w=120&q=80', // Simulated abstract crypto circle
    connected: false,
    address: null,
    balance: 142.5,
  },
  {
    name: 'Martian Wallet',
    id: 'martian',
    logo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=120&q=80',
    connected: false,
    address: null,
    balance: 89.2,
  },
  {
    name: 'Pontem Wallet',
    id: 'pontem',
    logo: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=120&q=80',
    connected: false,
    address: null,
    balance: 247.1,
  },
  {
    name: 'Fewcha Wallet',
    id: 'fewcha',
    logo: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=120&q=80',
    connected: false,
    address: null,
    balance: 12.3,
  }
];

export const INITIAL_VAULTS: Vault[] = [
  {
    id: 'v-public',
    name: 'Public Space',
    type: 'public',
    description: 'Shared open directory backed by unencrypted replicated IPFS fragments on Shelby nodes.',
    storageUsed: 2.1 * 1024 * 1024 * 1024, // 2.1 GB in bytes
    maxStorage: 10 * 1024 * 1024 * 1024, // 10 GB
    fileCount: 4,
    isUnlocked: true,
    createdAt: '2026-05-10T12:00:00Z',
  },
  {
    id: 'v-private',
    name: 'ShelbyNet Zero-Knowledge Vault',
    type: 'private',
    description: 'ZKP-verified storage with end-to-end client-side encryption. Keys are never visible on server.',
    storageUsed: 1.4 * 1024 * 1024 * 1024,
    maxStorage: 50 * 1024 * 1024 * 1024,
    fileCount: 3,
    isUnlocked: false,
    requiresPassword: true,
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // empty / simple simulation
    createdAt: '2026-05-12T14:30:00Z',
  },
  {
    id: 'v-permanent',
    name: 'Permanent Storage Vault',
    type: 'permanent',
    description: 'Immutable, transactional data written directly to Shelby consensus state under gas-locked storage leases.',
    storageUsed: 0.85 * 1024 * 1024 * 1024,
    maxStorage: 5 * 1024 * 1024 * 1024,
    fileCount: 2,
    isUnlocked: true,
    createdAt: '2026-05-15T09:12:00Z',
  },
  {
    id: 'v-secret',
    name: 'Blackhole Secret Vault',
    type: 'secret',
    description: 'Double-blinded backup utilizing decentralized sharding & custom password hashing schemes.',
    storageUsed: 0,
    maxStorage: 100 * 1024 * 1024 * 1024,
    fileCount: 0,
    isUnlocked: false,
    requiresPassword: true,
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // 'admin' / hashed
    createdAt: '2026-05-18T18:45:00Z',
  }
];

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'f1',
    name: 'ShelbyNet_Validator_Config.yaml',
    size: 24 * 1024, // 24 KB
    type: 'document',
    category: 'documents',
    dateAdded: '2026-05-22T08:14:00Z',
    isEncrypted: false,
    vaultId: 'v-public',
    isPermanent: false,
    md5: 'ipfs://QmXGTzUXr9Pz9...Shelby3X1',
    aptosTx: null,
    owner: '0x3a4...9e102',
    contentSummary: 'Configuration file for deploying a decentralized ShelbyNet Node Validator, detailing consensus weights, network ports, and Genesis states.',
    tags: ['shelbynet', 'config', 'nodes']
  },
  {
    id: 'f2',
    name: 'DecentralizedAI_Whitepaper_v2.1.pdf',
    size: 4.8 * 1024 * 1024, // 4.8 MB
    type: 'document',
    category: 'documents',
    dateAdded: '2026-05-21T18:30:20Z',
    isEncrypted: false,
    vaultId: 'v-public',
    isPermanent: true,
    md5: 'ipfs://QmTeyDsk2o7...ShelbyWhite',
    aptosTx: '0x15aef7ac2091c6e1db0df10bc6db13a10cc97c9b2bd0767cc8fe92db3b76fc0f',
    owner: '0x3a4...9e102',
    contentSummary: 'The architectural specification of Shelby decentralized AI operating core. Outlines the tokenomics, peer-to-peer data fragmentation scheme, and ZK-computations on file headers.',
    tags: ['whitepaper', 'zkp', 'decentralized-ai']
  },
  {
    id: 'f3',
    name: 'Genesis_ShelbyONE_Memory.mp4',
    size: 45 * 1024 * 1024, // 45 MB
    type: 'video',
    category: 'videos',
    dateAdded: '2026-05-20T10:11:15Z',
    isEncrypted: false,
    vaultId: 'v-public',
    isPermanent: false,
    md5: 'ipfs://QmYt8Sdf87S...ShelbyGenesis',
    aptosTx: null,
    owner: '0x3a4...9e102',
    contentSummary: 'Welcome video render showcasing the Shelby storage node configuration sequence during the testnet launch.',
    tags: ['render', 'video', 'space']
  },
  {
    id: 'f4',
    name: 'Client_Ledger_Backups.enc',
    size: 320 * 1024, // 320 KB
    type: 'archive',
    category: 'vaults',
    dateAdded: '2026-05-19T21:44:00Z',
    isEncrypted: true,
    vaultId: 'v-private',
    isPermanent: false,
    md5: 'zero-knowledge://cipher-7ae1fdb209e9f90fa18b...shelbyZKP',
    aptosTx: null,
    owner: '0x3a4...9e102',
    contentSummary: 'Zero-knowledge end-to-end encrypted backup file containing clients cryptographic keys and off-chain transaction registries in fully ciphertext form.',
    tags: ['encrypted', 'keys', 'ledger']
  },
  {
    id: 'f5',
    name: 'ShelbyNet_Ecosystem_Landscape_Core.png',
    size: 1.2 * 1024 * 1024, // 1.2 MB
    type: 'photo',
    category: 'photos',
    dateAdded: '2026-05-18T14:22:00Z',
    isEncrypted: false,
    vaultId: 'v-public',
    isPermanent: false,
    md5: 'ipfs://QmS89Nfd78...LandscapeImage',
    aptosTx: null,
    owner: '0x3a4...9e102',
    contentSummary: 'Visual breakdown map containing ecosystem partners across DeFi, NFT, and GameFi domains integrated under Shelby storage pipelines on ShelbyNet Testnet.',
    tags: ['shelbynet', 'infographic', 'partner']
  },
  {
    id: 'f6',
    name: 'Off-chain_ZKP_Circuits.json',
    size: 140 * 1024, // 140 KB
    type: 'app',
    category: 'apps',
    dateAdded: '2026-05-15T09:12:00Z',
    isEncrypted: true,
    vaultId: 'v-permanent',
    isPermanent: true,
    md5: 'ipfs://QmCirc77Sda8f9q...ZKPCirc',
    aptosTx: '0xbaef41aa892cccddeeef20210214aa2777123faee908bd4dee15dfb167a9c873',
    owner: '0x3a4...9e102',
    contentSummary: 'Circuits describing the recursive cryptographic proofs used to verify off-chain data availability without revealing structural contents of the files.',
    tags: ['zkp', 'circuits', 'math']
  }
];

export const INITIAL_MARKETPLACE: MarketItem[] = [
  {
    id: 'm1',
    name: 'Hyper-replicated Storage Lease (50GB)',
    cost: 5.5,
    type: 'capacity',
    description: 'Guarantees storage replication across 12 high-connectivity validator-grade nodes in parallel, giving optimal throughput.',
    rating: 4.9,
    seller: 'Shelby Core Foundation',
    features: ['12x replication', 'E2EE default', '0.04ms average retrieval', 'Gas prepaid under ShelbyNet leases']
  },
  {
    id: 'm2',
    name: 'Shelby Storage Miner Node Setup',
    cost: 45.0,
    type: 'node',
    description: 'Hardware provisioning and virtual node license. Direct consensus earnings in SBY for yielding bandwidth and spare memory.',
    rating: 4.8,
    seller: 'NodeOps Technologies',
    features: ['Auto-rewards delegation', '99.98% up-time index', 'ShelbyNet Fullnode pairing', '24/7 telemetry monitoring']
  },
  {
    id: 'm3',
    name: 'Quantum-Safe Decentralized Bandwidth (1TB)',
    cost: 12.0,
    type: 'bandwidth',
    description: 'High-speed encrypted fiber lanes specifically filtered through our decentralized edge servers to prevent deep packet analysis.',
    rating: 4.7,
    seller: 'ShelbyNet Edge Dynamic',
    features: ['Zero logs policy', 'Anti-DDoS routing protection', 'Unmetered bursts up to 10 Gbps', 'Global CDN parity']
  }
];

export const INITIAL_NODES: StorageNode[] = [
  {
    id: 'node-sg-1',
    name: 'Shelby Apex - Singapore 1',
    region: 'Asia Southeast',
    storageCapacity: 2048,
    storageUsed: 1420,
    status: 'online',
    ping: 18,
    earnings: 341.2,
    reputation: 99.8
  },
  {
    id: 'node-de-2',
    name: 'Shelby Berlin Core - Germany',
    region: 'Europe Central',
    storageCapacity: 4096,
    storageUsed: 3112,
    status: 'online',
    ping: 42,
    earnings: 689.4,
    reputation: 99.4
  },
  {
    id: 'node-us-3',
    name: 'Shelby Silicon Valley - US East',
    region: 'North America East',
    storageCapacity: 1024,
    storageUsed: 914,
    status: 'online',
    ping: 54,
    earnings: 124.5,
    reputation: 98.9
  },
  {
    id: 'node-br-4',
    name: 'Shelby Amazon - Brazil Edge',
    region: 'South America',
    storageCapacity: 1024,
    storageUsed: 80,
    status: 'latency-high',
    ping: 195,
    earnings: 14.1,
    reputation: 92.1
  }
];
