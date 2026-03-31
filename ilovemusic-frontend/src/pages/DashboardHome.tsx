import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ListMusic, Disc3, Clock, Play, Music, AudioWaveform, Search, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePlayerStore, MOCK_TRACKS } from '@/stores/usePlayerStore';
import { Link } from 'react-router-dom';

function AnimatedCounter({ target, label, icon: Icon }: { target: number; label: string; icon: React.ElementType }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-border rounded-xl p-[1px]"
    >
      <div className="surface-card rounded-xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-display font-bold">{count.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

const recentlyPlayed = [
  { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', art: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', platform: 'spotify' as const },
  { id: '2', title: 'Levitating', artist: 'Dua Lipa', art: 'https://i.scdn.co/image/ab67616d0000b273d4daf28d55fe4197ede848be', platform: 'spotify' as const },
  { id: '3', title: 'Starboy', artist: 'The Weeknd', art: 'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452', platform: 'youtube' as const },
  { id: '4', title: 'Stay', artist: 'The Kid LAROI', art: 'https://i.scdn.co/image/ab67616d0000b273a3a7f38ea2033aa501afd4cf', platform: 'spotify' as const },
  { id: '5', title: 'Peaches', artist: 'Justin Bieber', art: 'https://i.scdn.co/image/ab67616d0000b273e6f407c7f3a0ec98845e4431', platform: 'youtube' as const },
  { id: '6', title: 'Montero', artist: 'Lil Nas X', art: 'https://i.scdn.co/image/ab67616d0000b273be82673b5f79d9658ec0a9fd', platform: 'spotify' as const },
];

const quickActions = [
  { label: 'Import from Spotify', icon: Music, color: 'bg-green-500/10 text-green-400 border-green-500/20', to: '/playlists' },
  { label: 'Import from YouTube', icon: Play, color: 'bg-red-500/10 text-red-400 border-red-500/20', to: '/playlists' },
  { label: 'Open Music Studio', icon: AudioWaveform, color: 'bg-primary/10 text-primary border-primary/20', to: '/studio' },
  { label: 'Identify a Song', icon: Search, color: 'bg-accent/10 text-accent border-accent/20', to: '/recognize' },
];

const continuePlaylists = [
  { id: 'p1', name: 'Chill Vibes 2024', tracks: 42, art: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', progress: 65 },
  { id: 'p2', name: 'Workout Hits', tracks: 28, art: 'https://i.scdn.co/image/ab67616d0000b273d4daf28d55fe4197ede848be', progress: 30 },
  { id: 'p3', name: 'Late Night Jazz', tracks: 35, art: 'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452', progress: 80 },
];

export default function DashboardHome() {
  const user = useAuthStore((s) => s.user);
  const setTrack = usePlayerStore((s) => s.setTrack);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl surface-card p-8 md:p-10"
      >
        <div className="absolute inset-0 flex items-end justify-center gap-1 opacity-10 px-4 pb-4">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary rounded-full animate-waveform"
              style={{ animationDelay: `${i * 0.05}s`, height: `${20 + Math.random() * 60}%` }}
            />
          ))}
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            {getGreeting()}, {user?.name || 'there'} 👋
          </h1>
          <p className="text-muted-foreground">Ready to create something amazing?</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AnimatedCounter target={127} label="Playlists Imported" icon={ListMusic} />
        <AnimatedCounter target={2847} label="Tracks Saved" icon={Disc3} />
        <AnimatedCounter target={432} label="Hours Listened" icon={Clock} />
      </div>

      {/* Recently Played */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold">Recently Played</h2>
          <Link to="/playlists" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            See all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {recentlyPlayed.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex-shrink-0 w-36 group cursor-pointer"
              onClick={() => {
                const t = MOCK_TRACKS.find(t => t.id === item.id);
                if (t) setTrack(t);
              }}
            >
              <div className="relative rounded-xl overflow-hidden mb-2">
                <img src={item.art} alt={item.title} className="w-36 h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <Play className="h-5 w-5 text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${item.platform === 'spotify' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {item.platform === 'spotify' ? 'S' : 'Y'}
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground truncate">{item.artist}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-display font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <motion.div key={action.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <Link
                to={action.to}
                className={`flex flex-col items-center gap-3 p-5 rounded-xl border ${action.color} hover:scale-[1.02] transition-all`}
              >
                <action.icon className="h-6 w-6" />
                <span className="text-xs font-medium text-center">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Continue Listening */}
      <section>
        <h2 className="text-lg font-display font-bold mb-4">Continue Listening</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {continuePlaylists.map((pl, i) => (
            <motion.div
              key={pl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="surface-card rounded-xl overflow-hidden group cursor-pointer hover:ring-1 hover:ring-primary/30 transition-all"
            >
              <div className="flex items-center gap-4 p-4">
                <div className="relative flex-shrink-0">
                  <img src={pl.art} alt={pl.name} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg">
                    <Play className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{pl.name}</p>
                  <p className="text-xs text-muted-foreground">{pl.tracks} tracks</p>
                  <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pl.progress}%`, background: 'linear-gradient(90deg, hsl(263 70% 58%), hsl(187 92% 43%))' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
