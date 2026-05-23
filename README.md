# 🌌 ShelbyONE Operating Core

> **The Decentralized Storage Operating Desktop Interface for ShelbyNet (Testnet & Devnet)**

ShelbyONE is an advanced web-based operational terminal designed to manage secure, sharded, and zero-knowledge storage resources. Interfacing directly with **ShelbyNet** (Testnet/Devnet), it empowers users to fragment data, lease validator space, lock permanent archives, and run semantic queries over distributed indices using integrated AI.

🔗 **Official ShelbyNet Explorer:** [https://explorer.shelby.xyz/shelbynet](https://explorer.shelby.xyz/shelbynet)

---

## 🎨 System Highlights

*   **ShelbyNet Wallet Auth Protocol:** Standard-compliant signature-only sessions using simulated/native wallets. Operates entirely with native **SBY** (ShelbyNet gas & lease tokens).
*   **Zero-Knowledge Cryptographic Vaults:** Side-channel hardened, symmetric client-side encryption. Data is turned into ciphertext shards *before* egress; your private keys never leave the sandbox.
*   **Decentralized Multi-Route Sharding:** Automatic file partitioning into unique cryptographically secured IPFS fragments distributed across global miner clusters (Singapore, Berlin, Silicon Valley, Brazil).
*   **Gas-Locked Permanent Archives:** Support for immutable storage leases. Lock archive files on-chain indefinitely with zero risk of consensus deletions using SBY escrow parameters.
*   **AI-Powered Semantic Companion (ShelbyONE Core):** Natural-language storage analyzer powered by Gemini. Easily summarize raw document shards, search global metadata, and command operations in human language.
*   **Active Peer Telemetry Graph:** Interactive canvas providing real-time ping latency diagnostics, bandwidth cap reporting, and node verification ratios.

---

## 🚀 Technical Architecture

The codebase is engineered with high-density components on a full-stack architecture:

```
├── server.ts                 # Full-stack Node.js server with Express & Vite middleware
├── src/
│   ├── main.tsx              # Web entry paint
│   ├── App.tsx               # Master App Hub, state controller, and workflow router
│   ├── types.ts              # Absolute typed parameters (Files, Vaults, Nodes, SBY Wallets)
│   ├── components/
│   │   ├── Dashboard.tsx     # Root storage catalog, uploads, search, and action commands
│   │   ├── SharedWorkspace.tsx # Collaborator permissions controller
│   │   ├── AICenter.tsx      # ShelbyONE system terminal prompt and Gemini controller
│   │   ├── KnowledgeGraph.tsx # interactive SVG Peer-Map and hardware diagnostic logs
│   │   ├── MarketplaceView.tsx# Lease catalog for bandwidth and validation nodes using SBY
│   │   ├── WalletConnect.tsx # ShelbyNet wallet selector and consensus signer simulator
│   │   └── UploadZone.tsx    # Drag-and-drop sharding and transaction sequencer
│   └── data/
│       └── mockData.ts       # Structured bootstrap metadata 
```

---

## 🛠️ Configuration & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/sszenox/ShelbyONE-.git
cd ShelbyONE-
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (using `.env.example` as a template):
```env
# Server Secret Keys (Kept completely hidden from client browser)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Seed Development Server
Start the development server with Hot Module Replacement and Vite integration:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the workspace.

### 5. Build for Production Optimization
Compiles the client-side SPA bundle and packages the Node.js server into a single, high-efficiency file inside `dist/`:
```bash
npm run build
npm run start
```

---

## 🔒 Cryptographic & Consensus Protocol

1. **Fragmentation Sequence:**
   Files uploaded are segmented into independent chunk indices. Each segment is passed to a client-side hashing pipeline to extract a unique multi-hash integrity footprint (`ipfs://...`).
2. **Signature Sequencer:**
   All mutations—such as vault lock definitions, permanent archive locks, and collaborator authorization—are processed as signature request payloads. Transactions are committed dynamically to the virtual ledger with $0.00$ gas overhead during active testnet sessions.
3. **Multi-Peer Replication:**
   Validator configurations can be deployed by leasing nodes in the Storage Marketplace. Active validators earn yield returns computed in virtual **SBY** tokens deposited securely to your signed account address.

---

## 📄 License
This workspace is licensed under private Shelby Decentralized Core guidelines. Feel free to copy, alter, and deploy your custom node wrappers!
