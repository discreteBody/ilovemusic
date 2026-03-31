import { X, Mic, Drum, Guitar, Piano } from 'lucide-react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const STEMS = [
  { key: 'vocals' as const, label: 'Vocals', icon: Mic, color: 'text-pink-400 border-pink-400/50 bg-pink-400/10', glowColor: 'shadow-pink-400/30' },
  { key: 'drums' as const, label: 'Drums', icon: Drum, color: 'text-orange-400 border-orange-400/50 bg-orange-400/10', glowColor: 'shadow-orange-400/30' },
  { key: 'bass' as const, label: 'Bass', icon: Guitar, color: 'text-cyan-400 border-cyan-400/50 bg-cyan-400/10', glowColor: 'shadow-cyan-400/30' },
  { key: 'instruments' as const, label: 'Instruments', icon: Piano, color: 'text-purple-400 border-purple-400/50 bg-purple-400/10', glowColor: 'shadow-purple-400/30' },
];

export default function StemPopup() {
  const { stems, toggleStem, isolateMode, toggleIsolateMode, toggleStemPopup } = usePlayerStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-24 right-4 md:right-20 z-[60] w-72 glass-card rounded-2xl p-5 animate-glow-pulse"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-sm">Stem Controls</h3>
        <button onClick={toggleStemPopup} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {STEMS.map((stem) => {
          const active = stems[stem.key];
          return (
            <button
              key={stem.key}
              onClick={() => toggleStem(stem.key)}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200',
                active
                  ? `${stem.color} shadow-lg ${stem.glowColor}`
                  : 'border-border text-muted-foreground bg-secondary/30 opacity-50'
              )}
            >
              <stem.icon className={cn('h-5 w-5', !active && 'line-through')} />
              <span className="text-xs font-medium">{stem.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">Isolate Mode</span>
        <Switch checked={isolateMode} onCheckedChange={toggleIsolateMode} />
      </div>
    </motion.div>
  );
}
