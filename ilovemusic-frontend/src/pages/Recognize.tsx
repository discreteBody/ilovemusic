import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2, RotateCcw, ListPlus, Music } from 'lucide-react';

type State = 'idle' | 'listening' | 'processing' | 'result' | 'error';

const mockResult = {
  title: 'Blinding Lights',
  artist: 'The Weeknd',
  album: 'After Hours',
  confidence: 94,
  art: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
};

export default function Recognize() {
  const [state, setState] = useState<State>('idle');

  const handleStart = () => {
    setState('listening');
    setTimeout(() => setState('processing'), 3000);
    setTimeout(() => {
      if (Math.random() > 0.15) setState('result');
      else setState('error');
    }, 5000);
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto flex flex-col items-center min-h-[70vh] justify-center">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-display font-bold mb-10 text-center">
        Song Finder
      </motion.h1>

      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6">
            <button onClick={handleStart} className="relative w-24 h-24 rounded-full gradient-bg flex items-center justify-center hover:scale-105 transition-transform shadow-lg glow-primary">
              <Mic className="h-10 w-10 text-white" />
            </button>
            <p className="text-muted-foreground text-sm">Tap to identify a song playing around you</p>
          </motion.div>
        )}

        {state === 'listening' && (
          <motion.div key="listening" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24">
              {[1, 2, 3].map(i => (
                <div key={i} className="absolute inset-0 rounded-full border-2 border-primary/40 animate-pulse-ring" style={{ animationDelay: `${i * 0.4}s` }} />
              ))}
              <div className="absolute inset-0 rounded-full gradient-bg flex items-center justify-center">
                <Mic className="h-10 w-10 text-white" />
              </div>
            </div>
            <p className="text-sm text-primary font-medium">Listening...</p>
          </motion.div>
        )}

        {state === 'processing' && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Identifying...</p>
          </motion.div>
        )}

        {state === 'result' && (
          <motion.div key="result" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-sm">
            <div className="surface-card rounded-2xl overflow-hidden border border-border">
              <div className="relative">
                <img src={mockResult.art} alt={mockResult.album} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
              <div className="p-5 -mt-16 relative z-10">
                <h2 className="text-xl font-display font-bold mb-0.5">{mockResult.title}</h2>
                <p className="text-muted-foreground text-sm">{mockResult.artist} · {mockResult.album}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full gradient-bg" style={{ width: `${mockResult.confidence}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{mockResult.confidence}%</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg gradient-bg text-white text-xs font-semibold">
                    <ListPlus className="h-3.5 w-3.5" /> Add to Playlist
                  </button>
                  <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-border text-xs font-semibold hover:bg-secondary transition-colors">
                    <Music className="h-3.5 w-3.5" /> Open in Studio
                  </button>
                  <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-green-500/30 text-green-400 text-xs font-semibold hover:bg-green-500/10 transition-colors">
                    Find on Spotify
                  </button>
                  <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition-colors">
                    Find on YouTube
                  </button>
                </div>
                <button onClick={() => setState('idle')} className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-2">
                  Try another song
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <Mic className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-sm text-muted-foreground text-center">Couldn't identify the song. Try again.</p>
            <button onClick={handleStart} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors">
              <RotateCcw className="h-4 w-4" /> Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
