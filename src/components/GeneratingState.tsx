import { Search, Brain, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GeneratingStatus } from '../types';

interface GeneratingStateProps {
  status: GeneratingStatus;
}

const steps = [
  { id: 'researching', icon: Search, label: 'Researching current trends and facts...' },
  { id: 'strategizing', icon: Brain, label: 'Developing content strategy and hook...' },
  { id: 'generating', icon: FileText, label: 'Writing platform-optimized content...' },
] as const;

export default function GeneratingState({ status }: GeneratingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-12 w-full max-w-lg mx-auto text-center">
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="w-40 h-40 border-2 border-slate-200 border-t-blue-600 rounded-full flex items-center justify-center"
        >
          <Loader2 className="w-8 h-8 text-slate-200" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              key={status}
              className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100"
            >
              {(() => {
                const activeStep = steps.find(s => s.id === status);
                if (!activeStep) return <Brain className="w-10 h-10 text-blue-600" />;
                const Icon = activeStep.icon;
                return <Icon className="w-10 h-10 text-blue-600 animate-pulse" />;
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-4 w-full px-8">
        {steps.map((step, index) => {
          const isActive = step.id === status;
          const isPast = steps.findIndex(s => s.id === status) > index;
          
          return (
            <motion.div 
              key={step.id}
              initial={false}
              animate={{
                opacity: isActive || isPast ? 1 : 0.3,
                scale: isActive ? 1.02 : 1
              }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                isActive ? 'bg-white border-slate-200 shadow-sm ring-1 ring-blue-50' : 'border-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold ${
                isPast ? 'bg-green-100 border-green-200 text-green-700' : 
                isActive ? 'border-blue-600 bg-blue-600 text-white' :
                'border-slate-200 text-slate-400'
              }`}>
                {isPast ? '✓' : index + 1}
              </div>
              <div className="text-left">
                <div className={`text-sm font-bold tracking-tight ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                  {step.label}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
