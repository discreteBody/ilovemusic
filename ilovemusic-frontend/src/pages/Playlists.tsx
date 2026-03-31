import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Play, X, Shuffle, ExternalLink } from 'lucide-react';
import { usePlayerStore, MOCK_TRACKS, type Track } from '@/stores/usePlayerStore';
import { cn } from '@/lib/utils';

const platforms = [
  { id: 'spotify', name: 'Spotify', color: 'border-green-500/30 bg-green-500/5', dot: 'bg-green-500', badge: 'text-green-400', tracks: 847, connected: true },
  { id: 'youtube', name: 'YouTube Music', color: 'border-red-500/30 bg-red-500/5', dot: 'bg-red-500', badge: 'text-red-400', tracks: 312, connected: true },
];

const playlists = [
  { id: 'p1', name: 'Chill Vibes 2024', tracks: 42, duration: '2h 34m', platform: 'spotify' as const, art: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36' },
  { id: 'p2', name: 'Workout Motivation', tracks: 28, duration: '1h 45m', platform: 'spotify' as const, art: 'https://i.scdn.co/image/ab67616d0000b273d4daf28d55fe4197ede848be' },
  { id: 'p3', name: 'Late Night Jazz', tracks: 35, duration: '3h 12m', platform: 'youtube' as const, art: 'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452' },
  { id: 'p4', name: 'Indie Rock Essentials', tracks: 56, duration: '3h 50m', platform: 'spotify' as const, art: 'https://i.scdn.co/image/ab67616d0000b273a3a7f38ea2033aa501afd4cf' },
  { id: 'p5', name: 'Electronic Dreams', tracks: 63, duration: '4h 20m', platform: 'youtube' as const, art: 'https://i.scdn.co/image/ab67616d0000b273e6f407c7f3a0ec98845e4431' },
  { id: 'p6', name: 'Acoustic Sessions', tracks: 22, duration: '1h 15m', platform: 'spotify' as const, art: 'https://i.scdn.co/image/ab67616d0000b273be82673b5f79d9658ec0a9fd' },
];

const playlistTracks: Track[] = MOCK_TRACKS;

export default function Playlists() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const { setTrack, currentTrack } = usePlayerStore();

  const handleSync = (platformId: string) => {
    setSyncing(platformId);
    setTimeout(() => setSyncing(null), 2000);
  };

  const selected = playlists.find(p => p.id === selectedPlaylist);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-display font-bold mb-6">
        My Playlists
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {platforms.map((p) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl border p-5 ${p.color}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn('w-3 h-3 rounded-full', p.dot)} />
                <span className="font-display font-bold">{p.name}</span>
              </div>
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', p.badge, p.color)}>Connected</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{p.tracks} tracks synced</p>
            <button onClick={() => handleSync(p.id)} disabled={syncing === p.id} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
              <RefreshCw className={cn('h-3 w-3', syncing === p.id && 'animate-spin')} />
              {syncing === p.id ? 'Syncing...' : 'Sync Now'}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((pl, i) => (
              <motion.div
                key={pl.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedPlaylist(pl.id)}
                className={cn(
                  'surface-card rounded-xl overflow-hidden cursor-pointer group transition-all hover:scale-[1.02] hover:ring-1 hover:ring-primary/30',
                  selectedPlaylist === pl.id && 'ring-1 ring-primary/50'
                )}
              >
                <div className="relative">
                  <img src={pl.art} alt={pl.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-semibold text-sm truncate">{pl.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{pl.tracks} tracks</span><span>·</span><span>{pl.duration}</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white', pl.platform === 'spotify' ? 'bg-green-500' : 'bg-red-500')}>
                      {pl.platform === 'spotify' ? 'S' : 'Y'}
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shadow-lg">
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="hidden lg:block w-96 surface-card rounded-2xl overflow-hidden flex-shrink-0 self-start sticky top-8"
            >
              <div className="relative">
                <img src={selected.art} alt="" className="w-full h-48 object-cover blur-sm opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
                <button onClick={() => setSelectedPlaylist(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full surface-elevated flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <h3 className="font-display font-bold text-lg">{selected.name}</h3>
                  <p className="text-xs text-muted-foreground">{selected.tracks} tracks · {selected.duration}</p>
                </div>
              </div>

              <div className="p-4 space-y-1 max-h-[50vh] overflow-y-auto">
                {playlistTracks.map((track, idx) => (
                  <div
                    key={track.id}
                    onClick={() => setTrack(track)}
                    className={cn(
                      'flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-secondary/50',
                      currentTrack?.id === track.id && 'bg-primary/10'
                    )}
                  >
                    <div className="w-5 text-center">
                      {currentTrack?.id === track.id ? (
                        <div className="flex items-end gap-[2px] h-4 justify-center">
                          {[1, 2, 3].map(b => (
                            <div key={b} className="w-[3px] bg-primary rounded-full animate-eq-bar" style={{ animationDelay: `${b * 0.15}s` }} />
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">{idx + 1}</span>
                      )}
                    </div>
                    <img src={track.albumArt} className="w-9 h-9 rounded object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium truncate', currentTrack?.id === track.id && 'text-primary')}>{track.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-border flex items-center gap-2">
                <button className="flex-1 gradient-bg text-white text-xs font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Play className="h-3.5 w-3.5" /> Play All
                </button>
                <button className="flex-1 border border-border text-xs font-semibold py-2.5 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-2">
                  <Shuffle className="h-3.5 w-3.5" /> Shuffle
                </button>
                <button className="p-2.5 border border-border rounded-lg hover:bg-secondary transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
