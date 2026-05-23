import { useState, useRef, useEffect } from 'react';
import { Sparkles, Terminal, Cpu, Play, Trash2, ArrowUpRight, HelpCircle } from 'lucide-react';
import { AIChatMessage, FileItem, Vault } from '../types';

interface AICenterProps {
  files: FileItem[];
  vaults: Vault[];
  currentFolder: string;
  walletConnected: boolean;
  walletAddress: string | null;
  onSelectVault: (vault: Vault | null) => void;
  onUnlockVault: (vaultId: string, isUnlocked: boolean) => void;
  onAddNewVault: (newVault: Vault) => void;
}

export default function AICenter({
  files,
  vaults,
  currentFolder,
  walletConnected,
  walletAddress,
  onSelectVault,
  onUnlockVault,
  onAddNewVault
}: AICenterProps) {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'ai-welcome',
      role: 'assistant',
      content: '### Welcome to ShelbyONE operating Core\nI am the decentralization AI assistant for Shelby infrastructure. I handle zero-knowledge setups, verify shard hashes, compile index files, and manage your ShelbyNet storage contracts.\n\n*Try invoking one of the system commands below to inspect operational state.*',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const sampleCommands = [
    { text: 'Create private vault', hint: 'Provision symmetric keystore' },
    { text: 'Find my ShelbyNet files', hint: 'Search metadata archives' },
    { text: 'Store permanently', hint: 'Sync state locks on shell' },
    { text: 'Summarize ShelbyNet_Validator_Config.yaml', hint: 'Compile code summary' },
    { text: 'Search archived research', hint: 'Decentralized document parser' },
    { text: 'Encrypt this folder', hint: 'Trigger sharder pipeline' }
  ];

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendCommand = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          files,
          vaults,
          currentFolder,
          commandContext: {
            isWalletConnected: walletConnected,
            walletAddress: walletAddress
          }
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        const assistantMessage: AIChatMessage = {
          id: 'msg-reply-' + Date.now(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toISOString()
        };

        // If backend suggested helper action, attach it nicely
        if (data.action && data.action.recommendedAction !== 'none') {
          assistantMessage.actionExecuted = {
            type: data.action.recommendedAction,
            label: data.action.description,
            meta: data.action
          };
          
          // Auto-execute vault action to simulate full OS interaction
          setTimeout(() => {
            executeOSAction(data.action.recommendedAction, data.action.targetId);
          }, 1500);
        }

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message || 'Error communicating with AI Core');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          role: 'assistant',
          content: `⚠️ **AI Core Sync Interrupted**\nCould not compile modular consensus: ${err.message}. Reverting to local terminal loop.`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeOSAction = (actionType: string, targetId: string) => {
    if (actionType === 'create_vault') {
      // Check if vault already exists
      const exists = vaults.find(v => v.id === targetId);
      if (!exists) {
        const demoVault: Vault = {
          id: targetId || 'v-ai-generated',
          name: 'AI Generated ZK Vault',
          type: 'private',
          description: 'Keystore automatically compiled by ShelbyONE Operating AI Core.',
          storageUsed: 0,
          maxStorage: 15 * 1024 * 1024 * 1024,
          fileCount: 0,
          isUnlocked: false,
          requiresPassword: true,
          passwordHash: 'admin',
          createdAt: new Date().toISOString()
        };
        onAddNewVault(demoVault);
        setMessages(prev => [...prev, {
          id: 'action-feedback-' + Date.now(),
          role: 'system',
          content: `⚡ **AI Automation Complete:** Created "AI Generated ZK Vault" and registered consensus keyset successfully. Unlock key: \`admin\``,
          timestamp: new Date().toISOString()
        }]);
      }
    } else if (actionType === 'permanent_archive') {
      setMessages(prev => [...prev, {
        id: 'action-feedback-' + Date.now(),
        role: 'system',
        content: `⚡ **ShelbyNet Ledger Sync:** Submitting files checkpoint. Transaction hash generated on-chain. Immutable write committed. View on ShelbyNet Explorer: https://explorer.shelby.xyz/shelbynet`,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'ai-welcome',
        role: 'assistant',
        content: '### ShelbyONE Operating AI Active\nInput storage commands or select templates below.',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div id="ai-center-root" className="grid grid-cols-5 gap-6 h-[calc(100vh-10rem)]">
      
      {/* Visual Workspace Orb & Templates (Left 2 Columns) */}
      <div className="col-span-2 flex flex-col justify-between space-y-4">
        
        {/* Core Animated Orb Panel */}
        <div className="glass-panel rounded-2xl border border-white/10 p-5 relative overflow-hidden flex flex-col justify-center items-center h-1/2 min-h-[220px]">
          {/* Neon Floating Orbs */}
          <div className="absolute w-28 h-28 bg-[#4F8CFF] rounded-full blur-[45px] ai-orb-primary opacity-30 pointer-events-none" />
          <div className="absolute w-24 h-24 bg-[#8B5CF6] rounded-full blur-[40px] ai-orb-secondary opacity-25 pointer-events-none" />
          <div className="absolute w-16 h-16 bg-[#22D3EE] rounded-full blur-[30px] bottom-10 left-10 opacity-20 pointer-events-none" />

          {/* Glowing Ring Overlay */}
          <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center p-3 relative z-10 bg-black/40 backdrop-blur-sm shadow-inner">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>

          <div className="text-center mt-4 relative z-10">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-display">Shelby AI Core Online</h3>
            <p className="text-[10px] font-mono text-shelby-cyan mt-1 uppercase tracking-widest">
              Decentralized OS Shell
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2 bg-white/5 border border-white/5 py-1 px-2.5 rounded-full w-fit mx-auto text-[10px] text-gray-400 font-mono">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span>Telemetry Connected</span>
            </div>
          </div>
        </div>

        {/* AI Templates Prompt Library */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 h-1/2 flex flex-col justify-between overflow-y-auto">
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-shelby-purple" />
              Direct Operating Actions
            </h4>
            <p className="text-[10px] text-gray-500 mt-1">
              Select an intelligent command shortcut to invoke target file workflows:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 overflow-y-auto pr-1">
            {sampleCommands.map((cmd, i) => (
              <button
                id={`ai-shortcut-${i}`}
                key={i}
                type="button"
                onClick={() => handleSendCommand(cmd.text)}
                className="text-left w-full p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-shelby-blue/20 hover:bg-white/[0.08] transition-all duration-200 flex items-center justify-between group outline-none"
              >
                <div>
                  <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors block">
                    “{cmd.text}”
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider block mt-0.5">
                    {cmd.hint}
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-shelby-cyan transition-colors shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Structured Communication Dialog Feed (Right 3 Columns) */}
      <div className="col-span-3 glass-panel rounded-2xl border border-white/10 flex flex-col justify-between overflow-hidden relative">
        
        {/* Chat Control Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-shelby-blue" />
            <span className="text-xs font-bold tracking-wider text-white uppercase font-display">Communication stream</span>
          </div>
          <button
            id="clear-chat-btn"
            onClick={handleClearChat}
            className="p-1 text-gray-500 hover:text-white transition-colors rounded hover:bg-white/5 outline-none"
            title="Clear Stream"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Message Feed Display */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 font-sans max-h-[calc(100vh-21rem)]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col space-y-1.5 ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                <span>{msg.role === 'user' ? 'CHALLENGER (Wallet)' : msg.role === 'system' ? 'SYSTEM EVENT' : 'SHELBY AI CORE'}</span>
                <span>•</span>
                <span>{msg.timestamp.substring(11, 19)} UTC</span>
              </div>
              
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed border ${
                  msg.role === 'user'
                    ? 'bg-shelby-blue/10 border-shelby-blue/20 text-white'
                    : msg.role === 'system'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 font-mono text-[11px]'
                    : 'bg-white/[0.02] border-white/5 text-gray-200'
                }`}
              >
                {/* Parse simple markdown tags we provide */}
                <p className="whitespace-pre-line">
                  {msg.content}
                </p>

                {msg.actionExecuted && (
                  <div className="mt-3 p-2.5 bg-shelby-purple/10 border border-shelby-purple/20 rounded-xl flex items-center justify-between text-[11px] font-mono text-shelby-purple">
                    <span>⚡ Autopilot Action Triggers...</span>
                    <span>{msg.actionExecuted.label}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start space-y-1.5">
              <span className="text-[10px] font-mono text-gray-500">SHELBY COMPILING PROOFS...</span>
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-shelby-blue rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-shelby-purple rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-shelby-cyan rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] font-mono text-gray-500">Retrieving node segments...</span>
              </div>
            </div>
          )}
          
          <div ref={chatScrollRef} />
        </div>

        {/* Input Interface */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendCommand(inputText);
          }}
          className="p-3 border-t border-white/5 bg-black/40 flex gap-2 items-center"
        >
          <input
            id="ai-prompt-input"
            type="text"
            required
            disabled={isLoading}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Instruct AI Storage core... (e.g. Encrypt folder)"
            className="flex-1 bg-[#10121a] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-shelby-blue outline-none"
          />
          <button
            id="ai-send-btn"
            type="submit"
            disabled={isLoading}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-shelby-blue to-shelby-purple text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none"
          >
            <Play className="w-4 h-4 fill-white" />
          </button>
        </form>

      </div>

    </div>
  );
}
