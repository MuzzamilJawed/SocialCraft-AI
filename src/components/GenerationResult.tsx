import { Copy, Check, Twitter, Linkedin, Hash, Instagram, Share2, Rocket, Globe, Smartphone, Monitor, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { PostResult, ConnectedAccount } from '../types';
import ImageGenerator from './ImageGenerator';

interface GenerationResultProps {
  result: PostResult;
  connectedAccounts: ConnectedAccount[];
}

export default function GenerationResult({ result, connectedAccounts }: GenerationResultProps) {
  const [copied, setCopied] = useState<'main' | 'hashtags' | 'variation' | null>(null);
  const [activeTab, setActiveTab] = useState<'post' | 'strategy' | 'tags'>('post');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [imageUrl, setImageUrl] = useState<string | undefined>(result.generatedImageUrl);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'success' | 'no-credentials'>('idle');

  const account = connectedAccounts.find(a => a.platform === result.platform);

  const handleCopy = (text: string, id: 'main' | 'hashtags' | 'variation') => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePublish = async () => {
    if (!account?.credentials?.apiKey && !account?.credentials?.accessToken) {
      setPublishStatus('no-credentials');
      setTimeout(() => setPublishStatus('idle'), 3000);
      return;
    }

    setIsPublishing(true);
    // In a real implementation, we would call an API here
    // Example: fetch('/api/social/publish', { method: 'POST', body: JSON.stringify({ ...result, credentials: account.credentials }) })
    await new Promise(r => setTimeout(r, 2000));
    setIsPublishing(false);
    setPublishStatus('success');
    setTimeout(() => setPublishStatus('idle'), 4000);
  };

  const PlatformIcon = result.platform === 'linkedin' ? Linkedin : result.platform === 'x' ? Twitter : Instagram;

  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      {/* Analytics/Context Sidebar */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <ImageGenerator 
          postTitle={result.postContent.slice(0, 50)} 
          existingUrl={imageUrl}
          onImageGenerated={setImageUrl}
        />

        <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl">
          <h3 className="text-xs font-bold text-blue-800 uppercase mb-4 flex items-center gap-2">
            <Share2 className="w-3 h-3" />
            Execution Strategy
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white px-3 py-2 rounded border border-blue-100 text-[10px] font-bold text-blue-700 capitalize">PLAT: {result.platform}</div>
            <div className="bg-white px-3 py-2 rounded border border-blue-100 text-[10px] font-bold text-blue-700">OPT: High Engagement</div>
            <div className="bg-white px-3 py-2 rounded border border-blue-100 text-[10px] font-bold text-blue-700">AUD: Targeted</div>
            <div className="bg-white px-3 py-2 rounded border border-blue-100 text-[10px] font-bold text-blue-700">TONE: Polished</div>
          </div>
        </div>

        {result.insights && (
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-3 text-center">Context Matrix</div>
            <div className="space-y-2">
              {result.insights.slice(0, 3).map((insight, idx) => (
                <div key={idx} className="text-[11px] p-2 bg-slate-50 rounded border border-slate-100 text-slate-600 flex justify-between gap-2">
                  <span>{insight}</span>
                  <span className="text-green-600 font-mono shrink-0">MATCH</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={handlePublish}
          disabled={isPublishing || publishStatus === 'success'}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg ${
            publishStatus === 'success' 
              ? 'bg-green-500 text-white shadow-green-100' 
              : publishStatus === 'no-credentials'
              ? 'bg-red-500 text-white shadow-red-100'
              : 'bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800 active:scale-[0.98]'
          }`}
        >
          {isPublishing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Rocket className="w-5 h-5" />
            </motion.div>
          ) : publishStatus === 'success' ? (
            <Check className="w-5 h-5" />
          ) : publishStatus === 'no-credentials' ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <Globe className="w-5 h-5" />
          )}
          {isPublishing 
            ? 'Synchronizing...' 
            : publishStatus === 'success' 
            ? 'Published Successfully' 
            : publishStatus === 'no-credentials'
            ? 'Credentials Required'
            : `Publish to ${result.platform.toUpperCase()}`}
        </button>
      </div>

      {/* Main Preview Window */}
      <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col overflow-hidden min-h-[600px]">
        {/* Window Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex gap-4 items-center">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-400/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/50"></div>
            </div>
            
            <div className="flex bg-white/80 backdrop-blur border border-slate-200 rounded-lg p-1">
              <button 
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded transition-colors ${previewMode === 'desktop' ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded transition-colors ${previewMode === 'mobile' ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="flex bg-white border border-slate-200 rounded-lg p-1">
            <button 
              onClick={() => setActiveTab('post')}
              className={`px-4 py-1 text-[11px] font-bold rounded transition-colors ${activeTab === 'post' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Post
            </button>
            <button 
              onClick={() => setActiveTab('tags')}
              className={`px-4 py-1 text-[11px] font-bold rounded transition-colors ${activeTab === 'tags' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Hashtags
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleCopy(activeTab === 'post' ? result.postContent : result.hashtags.join(' '), activeTab === 'post' ? 'main' : 'hashtags')}
              className="px-3 py-1.5 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 text-[10px] font-bold text-slate-600 border border-transparent hover:border-slate-300"
            >
              {copied === 'main' || copied === 'hashtags' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
              COPY
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 p-8 lg:p-12 overflow-y-auto bg-white transition-all duration-500 ${previewMode === 'mobile' ? 'max-w-md mx-auto border-x border-slate-100 shadow-inner' : ''}`}>
          <AnimatePresence mode="wait">
            {activeTab === 'post' ? (
              <motion.article 
                key="post"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                    <PlatformIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="h-3 w-32 bg-slate-100 rounded-full mb-2"></div>
                    <div className="h-2 w-20 bg-slate-50 rounded-full"></div>
                  </div>
                </div>

                {imageUrl && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm mb-6"
                  >
                    <img src={imageUrl} alt="Post asset" className="w-full object-cover" referrerPolicy="no-referrer" />
                  </motion.div>
                )}

                <div className="text-slate-800 leading-relaxed font-serif text-lg">
                  <ReactMarkdown components={{
                    p: ({children}) => <p className="mb-4">{children}</p>,
                    strong: ({children}) => <span className="font-bold text-slate-950 font-sans">{children}</span>,
                  }}>
                    {result.postContent}
                  </ReactMarkdown>
                </div>
                
                <div className="pt-4 flex flex-wrap gap-1">
                  {result.hashtags.map(tag => (
                    <span key={tag} className="text-sm font-bold text-blue-600">#{tag}</span>
                  ))}
                </div>
              </motion.article>
            ) : (
              <motion.div 
                key="tags"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-xl mx-auto pt-8"
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest text-center">Optimized Hashtags</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {result.hashtags.map((tag) => (
                    <span key={tag} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-blue-600 hover:border-blue-200 transition-colors cursor-default">
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Window Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
             <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
               Polished Tone
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
               Ready to sync
             </div>
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
             <Rocket className="w-3 h-3" />
             OPTIMIZED_V2
          </div>
        </div>
      </div>
    </div>
  );
}
