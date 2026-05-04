import { useState } from 'react';
import { X, Shield, Key, Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SocialPlatform, ConnectedAccount, PlatformCredentials } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: ConnectedAccount[];
  onSave: (platform: SocialPlatform, credentials: PlatformCredentials) => void;
}

export default function SettingsModal({ isOpen, onClose, accounts, onSave }: SettingsModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('linkedin');
  const [showKey, setShowKey] = useState(false);
  const [credentials, setCredentials] = useState<Record<SocialPlatform, PlatformCredentials>>({
    linkedin: accounts.find(a => a.platform === 'linkedin')?.credentials || { platform: 'linkedin' },
    x: accounts.find(a => a.platform === 'x')?.credentials || { platform: 'x' },
    instagram: accounts.find(a => a.platform === 'instagram')?.credentials || { platform: 'instagram' },
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave(selectedPlatform, credentials[selectedPlatform]);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const updateField = (field: keyof PlatformCredentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [selectedPlatform]: {
        ...prev[selectedPlatform],
        [field]: value
      }
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex">
              {/* Sidebar */}
              <div className="w-48 bg-slate-50 border-r border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-8 px-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Vault</span>
                </div>
                <div className="space-y-1">
                  {(['linkedin', 'x', 'instagram'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setSelectedPlatform(p)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        selectedPlatform === p ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-200/50'
                      }`}
                    >
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 capitalize">{selectedPlatform} Credentials</h3>
                    <p className="text-xs text-slate-500 mt-1">Configure your API access tokens for automated publishing.</p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block ml-1">
                      {selectedPlatform === 'linkedin' ? 'Client ID / API Key' : 'API Key'}
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showKey ? 'text' : 'password'}
                        value={credentials[selectedPlatform].apiKey || ''}
                        onChange={(e) => updateField('apiKey', e.target.value)}
                        placeholder={`Enter your ${selectedPlatform} API Key`}
                        className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      />
                      <button 
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:text-blue-600 transition-colors"
                      >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block ml-1">
                      {selectedPlatform === 'linkedin' ? 'Member Access Token' : 'Bearer Token / Secret'}
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <textarea
                        rows={3}
                        value={credentials[selectedPlatform].accessToken || ''}
                        onChange={(e) => updateField('accessToken', e.target.value)}
                        placeholder={`Paste your ${selectedPlatform} access token here`}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 italic">Data is stored locally in your browser session.</p>
                    <button
                      onClick={handleSave}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                        isSaved ? 'bg-green-500 text-white shadow-green-100' : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700 active:scale-95'
                      }`}
                    >
                      {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      {isSaved ? 'Synced' : 'Secure Save'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
