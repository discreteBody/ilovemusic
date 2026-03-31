import { X, Trash2, GripVertical } from 'lucide-react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { motion } from 'framer-motion';

export default function QueuePanel() {
  const { queue, currentTrack, recentlyPlayed, toggleQueue, clearQueue, setTrack, removeFromQueue } = usePlayerStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 20, x: 20 }}
      className="fixed bottom-24 right-4 z-[60] w-80 max-h-[60vh] glass-card rounded-2xl overflow-hidden flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-display font-bold text-sm">Queue</h3>
        <div className="flex items-center gap-2">
          <button onClick={clearQueue} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
            Clear
          </button>
          <button onClick={toggleQueue} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-3 space-y-4">
        {currentTrack && (
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 px-1">Now Playing</p>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 border border-primary/20">
              <img src={currentTrack.albumArt} className="w-10 h-10 rounded object-cover" alt="" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate">{currentTrack.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
            </div>
          </div>
        )}

        {queue.length > 0 && (
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 px-1">Up Next</p>
            <div className="space-y-1">
              {queue.map((track) => (
                <div key={track.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 group transition-colors">
                  <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  <img src={track.albumArt} className="w-8 h-8 rounded object-cover" alt="" />
                  <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setTrack(track)}>
                    <p className="text-xs font-medium truncate">{track.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <button onClick={() => removeFromQueue(track.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentlyPlayed.length > 0 && (
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 px-1">Recently Played</p>
            <div className="space-y-1">
              {recentlyPlayed.slice(0, 5).map((track) => (
                <div key={track.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors" onClick={() => setTrack(track)}>
                  <img src={track.albumArt} className="w-8 h-8 rounded object-cover opacity-60" alt="" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate text-muted-foreground">{track.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
