import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

// API plugin to handle backend routes in development
function apiPlugin(): Plugin {
  let aiClient: GoogleGenAI | null = null;

  function getGeminiClient(): GoogleGenAI | null {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY' || key === '') {
      return null;
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/health', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          status: 'active',
          network: 'ShelbyNet Devnet / Testnet',
          shelbynetStatus: 'connected',
          explorerUrl: 'https://explorer.shelby.xyz/shelbynet',
          localTime: new Date().toISOString(),
          nodesOnline: 4,
          usingRealAI: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
        }));
      });

      server.middlewares.use('/api/ai/command', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { message, files, vaults, currentFolder, commandContext } = JSON.parse(body);

            const systemPrompt = `
              You are "ShelbyONE AI Core", the intelligent decentralized storage operating system assistant built on the ShelbyNet Network (Testnet / Devnet) with Shelby infrastructure. 
              Your purpose is strictly limited to storage operations, vault configurations, semantic indexing, zero-knowledge encryption analysis, file summarizing, decentralized replication diagnostics, and workspace automation.
              Do NOT answer general general-knowledge questions unless they relate directly to storage, cryptography, file organization, AI summaries, or the ShelbyNet ecosystem.
              Refer to the official network explorer at https://explorer.shelby.xyz/shelbynet if helpful.
              Keep your tone highly futuristic, clean, precise, minimal, and secure. Speak as a premium, advanced cloud operating system module. Use visual and structural clarity.

              Context available:
              - Current Vault Context: ${JSON.stringify(vaults || {})}
              - Current Folder/View: ${currentFolder || 'Root/Home'}
              - File List currently stored: ${JSON.stringify(files || [])}
              - Wallet Connection status: ${commandContext?.isWalletConnected ? 'Connected to address ' + commandContext?.walletAddress : 'Disconnected'}
            `;

            const client = getGeminiClient();
            res.setHeader('Content-Type', 'application/json');

            if (client) {
              const response = await client.models.generateContent({
                model: 'gemini-3.5-flash',
                contents: message,
                config: {
                  systemInstruction: systemPrompt,
                  temperature: 0.2,
                }
              });

              const replyText = response.text || 'Core response empty.';
              res.end(JSON.stringify({
                status: 'success',
                reply: replyText,
                isSimulated: false
              }));
            } else {
              // Fallback simulation
              const responseLower = message.toLowerCase();
              let reply = '';
              let action: any = { recommendedAction: 'none', targetId: '', description: '' };

              if (responseLower.includes('encrypt') || responseLower.includes('private')) {
                reply = `### 🔒 Shelby Cryptographic Diagnostic
Your request matches Shelby ZK-encryption protocols. To encrypt files:
- Drag-and-drop the files into the **Aptos Zero-Knowledge Vault**.
- The decentralized system hashes files client-side, creates randomized shards, and distributes copies to different Shelby storage nodes.

**Consensus Verification:**
- Integrity: Verifiable under SHA-256 state proof.
- Access: Requires Aptos signature to unlock access keys.

Would you like me to provision a new Private Zero-Knowledge Vault for you?`;
                action = {
                  recommendedAction: 'create_vault',
                  targetId: 'v-private',
                  description: 'Initiate client-side Zero-Knowledge keyset generation.'
                };
              } else if (responseLower.includes('permanent') || responseLower.includes('archive') || responseLower.includes('journal')) {
                reply = `### 🌐 Permanent Transaction Lease Verification
ShelbyONE storage leases can resolve directly on the ShelbyNet ledger for permanent archival:
- Files are committed to Arweave-interfaced Shelby miner sectors.
- Gas is locked using SBY transactional escrow.
- Track real-time mutations directly on ShelbyNet: https://explorer.shelby.xyz/shelbynet
- Deletions are mathematically blocked by network consensus contracts.

Would you like me to commit files in your workspace directly to the ShelbyNet ledger permanently?`;
                action = {
                  recommendedAction: 'permanent_archive',
                  targetId: '',
                  description: 'Escrow permanent transaction fee on ShelbyNet ledger.'
                };
              } else if (responseLower.includes('find') || responseLower.includes('search') || responseLower.includes('whitepaper') || responseLower.includes('config') || responseLower.includes('pdf')) {
                const matched = files?.filter((f: any) => 
                  f.name.toLowerCase().includes('whitepaper') || 
                  f.name.toLowerCase().includes('config') ||
                  f.tags.some((t: string) => responseLower.includes(t))
                ) || [];

                if (matched.length > 0) {
                  reply = `### 🔍 Shelby Semantic Index Search
I've queried your catalog of decentralized files for relevance:

${matched.map((f: any) => `* **${f.name}** (${(f.size/1024).toFixed(1)} KB)
  * Location: *${f.vaultId === 'v-public' ? 'Public Space' : 'ZK Private Vault'}*
  * Summary: ${f.contentSummary || 'No summary available.'}
  * Hash: \`${f.md5}\``).join('\n\n')}

Your requested index matches are listed above.`;
                } else {
                  reply = `### 🔍 Semantic Index Search Report
The search query didn't trigger any exact metadata matches in your currently active vaults. Try querying:
- "Find my config files"
- "Show me whitepaper files"`;
                }
              } else if (responseLower.includes('summarize') || responseLower.includes('summary')) {
                const matchedFile = files?.find((f: any) => responseLower.includes(f.name.toLowerCase()) || responseLower.includes(f.id.toLowerCase()));
                if (matchedFile) {
                  reply = `### 📑 Shelby AI Document Summary - ${matchedFile.name}
**Integrated Dimensions:**
- Size: ${(matchedFile.size / 1024).toFixed(1)} KB (${matchedFile.size} Bytes)
- Replication Sector: ShelbyNet Contract Address verified
- Permanent Suffix: ${matchedFile.isPermanent ? 'Active Lease (Immutable)' : 'Varying Lease'}

**Decentralized Intelligence Summary:**
${matchedFile.contentSummary || 'Document containing code guidelines or systems parameters for decentralized off-chain networks.'}

Would you like to duplicate this summary and write its markdown directly back to the database?`;
                } else {
                  reply = `### 📑 Document Summarizer Core
Provide a filename or ID from your workspace (e.g. "Summarize Whitepaper" or "Summarize Config file"). I will parse its decentralization header, retrieve file fragments, and construct a concise diagnostic analysis.`;
                }
              } else {
                reply = `### 🛰️ ShelbyONE OS Core AI Active

Welcome to ShelbyONE, the AI-powered decentralized cloud workspace. I am ready to process cloud storage actions.

**What I can do for you:**
1. **Security & Encryption**: Suggest zero-knowledge setups: *"Encrypt this folder"* or *"Create a private vault"*
2. **Metadata Searches**: Query files globally: *"Show my ShelbyNet whitepaper"*
3. **Ledger Archiving**: Trigger gas-escrowed locks: *"Store permanently"*
4. **Insights**: Summarize files instantly: *"Summarize Whitepaper"*

How would you like to configure your Shelby Decentralized storage core today?`;
              }

              res.end(JSON.stringify({
                status: 'success',
                reply: reply,
                action: action,
                isSimulated: true
              }));
            }
          } catch (err: any) {
            console.error('Error in AI command:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ status: 'error', message: err.message }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: false,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
