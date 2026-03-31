import { create } from 'zustand';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  albumArt: string;
  platform: 'spotify' | 'youtube' | 'local';
  src?: string;
}

interface StemState {
  vocals: boolean;
  drums: boolean;
  bass: boolean;
  instruments: boolean;
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  recentlyPlayed: Track[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  isLiked: boolean;
  isMiniPlayer: boolean;
  showQueue: boolean;
  showStemPopup: boolean;
  stems: StemState;
  isolateMode: boolean;

  setTrack: (track: Track) => void;
  togglePlay: () => void;
  setIsPlaying: (v: boolean) => void;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleLike: () => void;
  toggleMiniPlayer: () => void;
  toggleQueue: () => void;
  toggleStemPopup: () => void;
  toggleStem: (stem: keyof StemState) => void;
  toggleIsolateMode: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrev: () => void;
}

const MOCK_TRACKS: Track[] = [
  { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: 200, albumArt: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', platform: 'spotify' },
  { id: '2', title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', duration: 230, albumArt: 'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452', platform: 'spotify' },
  { id: '3', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: 203, albumArt: 'https://i.scdn.co/image/ab67616d0000b273d4daf28d55fe4197ede848be', platform: 'spotify' },
  { id: '4', title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', duration: 215, albumArt: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', platform: 'youtube' },
  { id: '5', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*ck Love 3', duration: 141, albumArt: 'https://i.scdn.co/image/ab67616d0000b273a3a7f38ea2033aa501afd4cf', platform: 'spotify' },
  { id: '6', title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', duration: 198, albumArt: 'https://i.scdn.co/image/ab67616d0000b273e6f407c7f3a0ec98845e4431', platform: 'youtube' },
];

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: MOCK_TRACKS[0],
  queue: MOCK_TRACKS.slice(1),
  recentlyPlayed: MOCK_TRACKS.slice(3),
  isPlaying: false,
  currentTime: 47,
  duration: 200,
  volume: 0.8,
  isShuffle: false,
  repeatMode: 'off',
  isLiked: false,
  isMiniPlayer: false,
  showQueue: false,
  showStemPopup: false,
  stems: { vocals: true, drums: true, bass: true, instruments: true },
  isolateMode: false,

  setTrack: (track) => {
    const { currentTrack, recentlyPlayed } = get();
    const newRecent = currentTrack
      ? [currentTrack, ...recentlyPlayed.filter(t => t.id !== currentTrack.id)].slice(0, 10)
      : recentlyPlayed;
    set({ currentTrack: track, isPlaying: true, currentTime: 0, recentlyPlayed: newRecent });
  },
  togglePlay: () => set(s => ({ isPlaying: !s.isPlaying })),
  setIsPlaying: (v) => set({ isPlaying: v }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
  setVolume: (v) => set({ volume: v }),
  toggleShuffle: () => set(s => ({ isShuffle: !s.isShuffle })),
  cycleRepeat: () => set(s => ({
    repeatMode: s.repeatMode === 'off' ? 'all' : s.repeatMode === 'all' ? 'one' : 'off',
  })),
  toggleLike: () => set(s => ({ isLiked: !s.isLiked })),
  toggleMiniPlayer: () => set(s => ({ isMiniPlayer: !s.isMiniPlayer })),
  toggleQueue: () => set(s => ({ showQueue: !s.showQueue, showStemPopup: false })),
  toggleStemPopup: () => set(s => ({ showStemPopup: !s.showStemPopup, showQueue: false })),
  toggleStem: (stem) => set(s => ({ stems: { ...s.stems, [stem]: !s.stems[stem] } })),
  toggleIsolateMode: () => set(s => ({ isolateMode: !s.isolateMode })),
  addToQueue: (track) => set(s => ({ queue: [...s.queue, track] })),
  removeFromQueue: (id) => set(s => ({ queue: s.queue.filter(t => t.id !== id) })),
  clearQueue: () => set({ queue: [] }),
  playNext: () => {
    const { queue, currentTrack, recentlyPlayed } = get();
    if (queue.length === 0) return;
    const next = queue[0];
    const newRecent = currentTrack
      ? [currentTrack, ...recentlyPlayed.filter(t => t.id !== currentTrack.id)].slice(0, 10)
      : recentlyPlayed;
    set({ currentTrack: next, queue: queue.slice(1), currentTime: 0, isPlaying: true, recentlyPlayed: newRecent });
  },
  playPrev: () => {
    const { recentlyPlayed, currentTrack, queue } = get();
    if (recentlyPlayed.length === 0) return;
    const prev = recentlyPlayed[0];
    const newQueue = currentTrack ? [currentTrack, ...queue] : queue;
    set({ currentTrack: prev, recentlyPlayed: recentlyPlayed.slice(1), queue: newQueue, currentTime: 0, isPlaying: true });
  },
}));

export { MOCK_TRACKS };
