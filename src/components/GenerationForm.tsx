import { useState } from 'react';
import { Sparkles, SendHorizontal, Linkedin, Twitter, Instagram, Link2, Type as TypeIcon, Image as ImageIcon, Gauge } from 'lucide-react';
import { motion } from 'motion/react';
import { SocialPlatform, ConnectedAccount, GenerationOptions } from '../types';

interface GenerationFormProps {
  onGenerate: (title: string, context: string, platform: SocialPlatform, options: GenerationOptions) => void;
  isLoading: boolean;
  connectedAccounts: ConnectedAccount[];
  onConnect: (platform: SocialPlatform) => void;
}

const platforms = [
  { id: 'linkedin' as SocialPlatform, icon: Linkedin, label: 'LinkedIn', color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'x' as SocialPlatform, icon: Twitter, label: 'X / Twitter', color: 'text-slate-900', bg: 'bg-slate-100' },
  { id: 'instagram' as SocialPlatform, icon: Instagram, label: 'Instagram', color: 'text-pink-600', bg: 'bg-pink-50' },
];

const tones = [
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Casual' },
  { id: 'viral', label: 'Viral' },
  { id: 'edgy', label: 'Edgy' },
] as const;

export default function GenerationForm({ onGenerate, isLoading, connectedAccounts, onConnect }: GenerationFormProps) {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('linkedin');
  const [options, setOptions] = useState<GenerationOptions>({
    generateText: true,
    generateImage: true,
    tone: 'professional'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && context.trim()) {
      onGenerate(title, context, selectedPlatform, options);
    }
  };

  const isConnected = connectedAccounts.find(a => a.platform === selectedPlatform)?.isConnected;

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-8 w-full"
    >
      {/* Platform Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Target Platform</label>
        <div className="grid grid-cols-3 gap-4">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const active = selectedPlatform === platform.id;
            const connected = connectedAccounts.find(a => a.platform === platform.id)?.isConnected;

            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => setSelectedPlatform(platform.id)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                  active 
                    ? 'border-blue-600 bg-white shadow-md' 
                    : 'border-slate-200 bg-slate-100/50 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${active ? platform.bg : 'bg-white'}`}>
                  <Icon className={`w-5 h-5 ${active ? platform.color : 'text-slate-400'}`} />
                </div>
                <span className={`text-[11px] font-bold ${active ? 'text-slate-900' : 'text-slate-500'}`}>{platform.label}</span>
                
                {connected && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full" title="Connected" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Output Toggles & Tone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-100/50 rounded-2xl border border-slate-200">
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-tight flex items-center gap-2">
            <Gauge className="w-3 h-3" />
            Generation Assets
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setOptions(prev => ({ ...prev, generateText: !prev.generateText }))}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all text-xs font-bold ${
                options.generateText ? 'bg-white border-blue-600 text-blue-600 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <TypeIcon className="w-4 h-4" />
              Text
            </button>
            <button
              type="button"
              onClick={() => setOptions(prev => ({ ...prev, generateImage: !prev.generateImage }))}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all text-xs font-bold ${
                options.generateImage ? 'bg-white border-blue-600 text-blue-600 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Image
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Content Tone
          </label>
          <div className="grid grid-cols-2 gap-2">
            {tones.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setOptions(prev => ({ ...prev, tone: t.id }))}
                className={`py-2 px-3 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${
                  options.tone === t.id ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Prompt Title</span>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AI replacing developers"
            required
            className="mt-1.5 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </label>
        
        <label className="block">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Context & Nuance</span>
          <textarea
            id="context"
            rows={5}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Explain how AI tools are augmenting engineers rather than replacing them..."
            required
            className="mt-1.5 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
        </label>
      </div>

      <div className="flex flex-col gap-4">
        {!isConnected && (
          <button
            type="button"
            onClick={() => onConnect(selectedPlatform)}
            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-all text-xs font-bold uppercase tracking-wider"
          >
            <Link2 className="w-4 h-4" />
            Connect {platforms.find(p => p.id === selectedPlatform)?.label} Identity
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading || !title.trim() || !context.trim() || (!options.generateText && !options.generateImage)}
          className="w-full relative flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Optimizing for {platforms.find(p => p.id === selectedPlatform)?.label}...
            </div>
          ) : (
            <>
              <SendHorizontal className="w-5 h-5" />
              Launch Strategic Analysis
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}
