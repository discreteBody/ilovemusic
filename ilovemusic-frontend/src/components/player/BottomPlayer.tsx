import { Heart, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, VolumeX, ListMusic, AudioWaveform, Maximize2 } from 'lucide-react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import StemPopup from './StemPopup';
import QueuePanel from './QueuePanel';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function PlatformBadge({ platform }: { platform: string }) {
  if (platform === 'spotify') {
    return <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[8px] font-bold text-white">S</div>;
  }
  return <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] font-bold text-white">Y</div>;
}

export default function BottomPlayer() {
  const {
    currentTrack, isPlaying, currentTime, duration, volume,
    isShuffle, repeatMode, isLiked, showQueue, showStemPopup,
    togglePlay, setCurrentTime, setVolume, toggleShuffle,
    cycleRepeat, toggleLike, toggleQueue, toggleStemPopup,
    playNext, playPrev,
  } = usePlayerStore();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Floating panels */}
      <AnimatePresence>
        {showStemPopup && <StemPopup />}
        {showQueue && <QueuePanel />}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-50 h-20 border-t border-border bg-background/95 backdrop-blur-xl">
        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-border group cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            setCurrentTime(pct * duration);
          }}
        >
          <div
            className="h-full rounded-r-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, hsl(263 70% 58%), hsl(187 92% 43%))',
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
          />
        </div>

        <div className="flex items-center h-full px-4 gap-4">
          {/* Left: Track info */}
          <div className="flex items-center gap-3 w-1/4 min-w-0">
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.album}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
            <div className="min-w-0 hidden sm:block">
              <p className="text-sm font-semibold text-foreground truncate">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
            <button onClick={toggleLike} className="hidden sm:block flex-shrink-0">
              <Heart className={cn('h-4 w-4 transition-colors', isLiked ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-foreground')} />
            </button>
            <PlatformBadge platform={currentTrack.platform} />
          </div>

          {/* Center: Controls */}
          <div className="flex flex-col items-center justify-center flex-1 gap-1">
            <div className="flex items-center gap-3 md:gap-4">
              <button onClick={toggleShuffle} className={cn('hidden md:block transition-colors', isShuffle ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}>
                <Shuffle className="h-4 w-4" />
              </button>
              <button onClick={playPrev} className="text-muted-foreground hover:text-foreground transition-colors">
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full gradient-bg flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white ml-0.5" />}
              </button>
              <button onClick={playNext} className="text-muted-foreground hover:text-foreground transition-colors">
                <SkipForward className="h-5 w-5" />
              </button>
              <button onClick={cycleRepeat} className={cn('hidden md:block transition-colors', repeatMode !== 'off' ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}>
                {repeatMode === 'one' ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
              </button>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] text-muted-foreground w-full max-w-md">
              <span className="w-8 text-right">{formatTime(currentTime)}</span>
              <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, hsl(263 70% 58%), hsl(187 92% 43%))' }} />
              </div>
              <span className="w-8">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Volume + extras */}
          <div className="flex items-center gap-2 md:gap-3 w-1/4 justify-end">
            <button className="hidden md:block text-muted-foreground hover:text-foreground" onClick={() => setVolume(volume > 0 ? 0 : 0.8)}>
              {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min={0} max={1} step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="hidden md:block w-20 h-1 accent-primary"
            />
            <button onClick={toggleQueue} className={cn('text-muted-foreground hover:text-foreground transition-colors', showQueue && 'text-primary')}>
              <ListMusic className="h-4 w-4" />
            </button>
            <button
              onClick={toggleStemPopup}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                showStemPopup
                  ? 'gradient-bg text-white animate-glow-pulse'
                  : 'border border-primary/50 text-primary hover:bg-primary/10'
              )}
            >
              <AudioWaveform className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Stems</span>
            </button>
            <button className="hidden lg:block text-muted-foreground hover:text-foreground">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
