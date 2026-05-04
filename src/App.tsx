import { useState } from 'react';
import { Sparkles, ArrowLeft, RefreshCw, AlertCircle, ShieldCheck, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GenerationForm from './components/GenerationForm';
import GeneratingState from './components/GeneratingState';
import GenerationResult from './components/GenerationResult';
import SettingsModal from './components/SettingsModal';
import { generateSocialContent } from './lib/gemini';
import { PostResult, GeneratingStatus, SocialPlatform, ConnectedAccount, GenerationOptions, PlatformCredentials } from './types';

export default function App() {
  const [status, setStatus] = useState<GeneratingStatus>('idle');
  const [result, setResult] = useState<PostResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([
    { platform: 'linkedin', handle: '@professional_builder', isConnected: false },
    { platform: 'x', handle: '@tech_lead', isConnected: false },
    { platform: 'instagram', handle: '@content_creator', isConnected: false },
  ]);

  const handleGenerate = async (title: string, context: string, platform: SocialPlatform, options: GenerationOptions) => {
    try {
      setError(null);
      setResult(null);
      
      setStatus('researching');
      await new Promise(r => setTimeout(r, 1500));
      
      setStatus('strategizing');
      await new Promise(r => setTimeout(r, 1000));
      
      setStatus('generating');
      const generated = await generateSocialContent(title, context, platform, options);
      
      setResult(generated);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
      setStatus('error');
    }
  };

  const handleConnect = (platform: SocialPlatform) => {
    const acc = connectedAccounts.find(a => a.platform === platform);
    if (!acc?.credentials?.apiKey) {
      setIsSettingsOpen(true);
      return;
    }
    setConnectedAccounts(prev => prev.map(acc => 
      acc.platform === platform ? { ...acc, isConnected: true } : acc
    ));
  };

  const handleSaveCredentials = (platform: SocialPlatform, credentials: PlatformCredentials) => {
    setConnectedAccounts(prev => prev.map(acc => 
      acc.platform === platform 
        ? { ...acc, credentials, isConnected: !!(credentials.apiKey || credentials.accessToken) } 
        : acc
    ));
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans text-slate-800">
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        accounts={connectedAccounts}
        onSave={handleSaveCredentials}
      />
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1 cursor-pointer" onClick={handleReset}>
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <h1 className="text-white font-bold tracking-tight text-lg">SocialCraft AI</h1>
          </div>
          <p className="text-xs text-slate-500">v2.4 Content Engine</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Workflow</div>
          
          {[
            { id: 'idle', label: 'Understand Intent', step: '01' },
            { id: 'researching', label: 'RAG Research', step: '02' },
            { id: 'strategizing', label: 'Strategy Mapping', step: '03' },
            { id: 'success', label: 'Content Generation', step: '04' }
          ].map((item) => {
            const isActive = 
              (item.id === 'idle' && status === 'idle') || 
              (item.id === 'researching' && status === 'researching') ||
              (item.id === 'strategizing' && status === 'strategizing') ||
              (item.id === 'success' && (status === 'success' || status === 'generating'));
            
            return (
              <div 
                key={item.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-slate-800 text-white' : 'opacity-60'
                }`}
              >
                <span className={`text-[10px] px-1.5 py-0.5 rounded text-white ${isActive ? 'bg-blue-600' : 'bg-slate-700'}`}>
                  {item.step}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            );
          })}

          <div className="mt-8 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Identity Management</div>
          {connectedAccounts.map(acc => (
            <div key={acc.platform} className="px-3 py-1.5 flex items-center justify-between group">
              <span className={`text-sm ${acc.isConnected ? 'text-slate-300' : 'text-slate-600'} truncate`}>
                {acc.handle}
              </span>
              {acc.isConnected && <ShieldCheck className="w-3 h-3 text-green-500" />}
              {!acc.isConnected && (
                <button 
                  onClick={() => handleConnect(acc.platform)}
                  className="text-[10px] font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  CONNECT
                </button>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <div className="text-[10px] text-slate-500 uppercase mb-1">AI Credits</div>
            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[85%]"></div>
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-mono">
              <span>8.5k</span>
              <span>10k</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <h2 className="text-sm font-semibold text-slate-600">
              {status === 'idle' ? 'New Campaign' : 'Generating Content'}: 
              <span className="text-slate-900 ml-2">Digital Strategy</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all"
              title="Identity Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            {status === 'success' && (
              <button 
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Start New
              </button>
            )}
            <button 
              onClick={() => {}} 
              disabled={status !== 'idle'}
              className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg shadow-sm shadow-blue-200 hover:bg-blue-700 disabled:opacity-50"
            >
              Execute Workflow
            </button>
          </div>
        </header>

        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 grid grid-cols-12 gap-8"
              >
                <div className="col-span-12 lg:col-span-6 space-y-8">
                  <div>
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Create Social Strategy</h2>
                    <p className="text-slate-500">Transform complex topics into high-engagement content backed by real-time RAG research.</p>
                  </div>
                  <GenerationForm 
                    onGenerate={handleGenerate} 
                    isLoading={false} 
                    connectedAccounts={connectedAccounts}
                    onConnect={handleConnect}
                  />
                </div>
                
                <div className="hidden lg:block lg:col-span-6 space-y-6">
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                    <h3 className="text-xs font-bold text-blue-800 uppercase mb-4 flex items-center gap-2">
                       <Sparkles className="w-4 h-4" />
                       Campaign Engine v2.4
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white p-3 rounded-xl border border-blue-100/50 shadow-sm">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Search Grounding</div>
                        <p className="text-xs text-slate-600">Live web scanning for trends and statistics.</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-blue-100/50 shadow-sm">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Identity Sync</div>
                        <p className="text-xs text-slate-600">Seamless integration with your social profiles.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {(status === 'researching' || status === 'strategizing' || status === 'generating') && (
              <motion.div 
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 h-full flex items-center justify-center"
              >
                <GeneratingState status={status} />
              </motion.div>
            )}

            {status === 'success' && result && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8"
              >
                <GenerationResult result={result} connectedAccounts={connectedAccounts} />
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-20 text-center space-y-6"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center border border-red-200">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">Workflow Interrupted</h3>
                  <p className="text-slate-500 max-sm mx-auto">{error}</p>
                </div>
                <button 
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all"
                >
                  Retry Campaign
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
