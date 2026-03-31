import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Play, X, Shuffle, ExternalLink, Loader } from 'lucide-react';
import { usePlayerStore, MOCK_TRACKS, type Track } from '@/stores/usePlayerStore';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';

const API_BASE_URL = 'http://localhost:8080/ilovemusic/api';

interface PlaylistDTO {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  trackCount?: number;
  platform?: 'spotify' | 'youtube';
  externalUrl?: string;
}

interface PlaylistResponse {
  success: boolean;
  data: PlaylistDTO[];
  message?: string;
}

const platforms = [
  { id: 'spotify', name: 'Spotify', color: 'border-green-500/30 bg-green-500/5', dot: 'bg-green-500', badge: 'text-green-400', connected: true },
  { id: 'youtube', name: 'YouTube Music', color: 'border-red-500/30 bg-red-500/5', dot: 'bg-red-500', badge: 'text-red-400', connected: true },
];

const playlistTracks: Track[] = MOCK_TRACKS;

export default function Playlists() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setTrack, currentTrack } = usePlayerStore();
  const { token } = useAuthStore();

  // Fetch playlists from Spotify on mount
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/v1/playlists/spotify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch playlists: ${response.status}`);
        }

        const data: PlaylistResponse = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setPlaylists(data.data);
        } else {
          setError('Failed to parse playlists data');
        }
      } catch (err) {
        console.error('Error fetching playlists:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch playlists');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [token]);

  const handleSync = (platformId: string) => {
    setSyncing(platformId);
    setTimeout(() => setSyncing(null), 2000);
  };

  const handleRefresh = () => {
    if (token) {
      setLoading(true);
      fetch(`${API_BASE_URL}/v1/playlists/spotify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.data)) {
            setPlaylists(data.data);
          }
        })
        .catch(() => setError('Failed to refresh playlists'))
        .finally(() => setLoading(false));
    }
  };

  const selected = playlists.find(p => p.id === selectedPlaylist);
  
  // Helper to get duration for display (estimated)
  const getDuration = (playlist: PlaylistDTO) => {
    const minutes = (playlist.trackCount || 0) * 3;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-display font-bold">
          My Playlists
        </motion.h1>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-border hover:bg-secondary transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

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
            <p className="text-sm text-muted-foreground mb-3">{playlists.filter(pl => pl.platform === p.id).length} playlists found</p>
            <button onClick={() => handleSync(p.id)} disabled={syncing === p.id} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
              <RefreshCw className={cn('h-3 w-3', syncing === p.id && 'animate-spin')} />
              {syncing === p.id ? 'Syncing...' : 'Sync Now'}
            </button>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your playlists...</p>
          </div>
        </div>
      ) : playlists.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">No playlists found. Connect your Spotify account to get started!</p>
        </div>
      ) : (
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
                    <img 
                      src={pl.imageUrl || 'https://i.scdn.co/image/ab67616d0000b273default'} 
                      alt={pl.name} 
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" 
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = 'https://via.placeholder.com/300?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="font-semibold text-sm truncate">{pl.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{pl.trackCount || 0} tracks</span><span>·</span><span>{getDuration(pl)}</span>
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
                  <img 
                    src={selected.imageUrl || 'https://i.scdn.co/image/ab67616d0000b273default'} 
                    alt="" 
                    className="w-full h-48 object-cover blur-sm opacity-60" 
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'https://via.placeholder.com/300?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
                  <button onClick={() => setSelectedPlaylist(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full surface-elevated flex items-center justify-center text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-display font-bold text-lg">{selected.name}</h3>
                    <p className="text-xs text-muted-foreground">{selected.trackCount || 0} tracks · {getDuration(selected)}</p>
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
      )}
    </div>
  );
}

