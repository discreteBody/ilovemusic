import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, AudioWaveform, Play, Pause, Download, Volume2, VolumeX, Mic, Drum, Guitar, Piano, Scissors, RotateCcw, RotateCw, ZoomIn, ZoomOut, Save, ArrowDownToLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

// === STEM SEPARATOR TAB ===
function StemSeparator() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [stemStates, setStemStates] = useState({ vocals: true, drums: true, bass: true, other: true });
  const [playingStems, setPlayingStems] = useState<Record<string, boolean>>({});

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleFile = (f: File) => {
    setFile(f);
    setDone(false);
    setProcessing(true);
    setProgress(0);

    const statuses = ['Analyzing audio...', 'Separating vocals...', 'Extracting instruments...', 'Finalizing...', 'Done!'];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setProgress(Math.min((i / 20) * 100, 100));
      setStatusText(statuses[Math.min(Math.floor(i / 4), statuses.length - 1)]);
      if (i >= 20) {
        clearInterval(interval);
        setProcessing(false);
        setDone(true);
      }
    }, 200);
  };

  const stems = [
    { key: 'vocals', label: 'Vocals', icon: Mic, color: 'from-pink-500 to-pink-600', barColor: 'bg-pink-400' },
    { key: 'drums', label: 'Drums', icon: Drum, color: 'from-orange-500 to-orange-600', barColor: 'bg-orange-400' },
    { key: 'bass', label: 'Bass', icon: Guitar, color: 'from-cyan-500 to-cyan-600', barColor: 'bg-cyan-400' },
    { key: 'other', label: 'Other', icon: Piano, color: 'from-purple-500 to-purple-600', barColor: 'bg-purple-400' },
  ];

  return (
    <div className="space-y-6">
      {!file && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer',
            dragOver ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/50'
          )}
          onClick={() => document.getElementById('stem-upload')?.click()}
        >
          <input id="stem-upload" type="file" accept=".mp3,.wav,.flac" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-display font-bold text-lg mb-1">Drop your track here</p>
          <p className="text-sm text-muted-foreground">Supports MP3, WAV, FLAC</p>
        </motion.div>
      )}

      {processing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="surface-card rounded-2xl p-8 text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" className="fill-none stroke-border" strokeWidth="6" />
              <circle cx="50" cy="50" r="42" className="fill-none stroke-primary" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${progress * 2.64} 264`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{Math.round(progress)}%</span>
          </div>
          <p className="font-display font-semibold">{statusText}</p>
          <p className="text-xs text-muted-foreground mt-1">{file?.name}</p>
        </motion.div>
      )}

      {done && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stems.map((stem, i) => (
              <motion.div
                key={stem.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'surface-card rounded-xl p-5 border transition-all',
                  stemStates[stem.key as keyof typeof stemStates] ? 'border-border' : 'border-border opacity-40'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stem.color} flex items-center justify-center`}>
                      <stem.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm">{stem.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPlayingStems(s => ({ ...s, [stem.key]: !s[stem.key] }))}
                      className="w-8 h-8 rounded-full surface-elevated flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      {playingStems[stem.key] ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
                    </button>
                    <button
                      onClick={() => setStemStates(s => ({ ...s, [stem.key]: !s[stem.key as keyof typeof s] }))}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {stemStates[stem.key as keyof typeof stemStates] ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {/* Mini waveform */}
                <div className="flex items-end gap-[2px] h-12 mb-3">
                  {Array.from({ length: 50 }).map((_, j) => (
                    <div
                      key={j}
                      className={cn('flex-1 rounded-full transition-all', stem.barColor)}
                      style={{
                        height: `${15 + Math.random() * 85}%`,
                        opacity: stemStates[stem.key as keyof typeof stemStates] ? 0.7 : 0.2,
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Slider defaultValue={[80]} max={100} className="flex-1" />
                  <button className="text-muted-foreground hover:text-foreground">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Master Mix */}
          <div className="surface-card rounded-xl p-5 border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AudioWaveform className="h-5 w-5 text-primary" />
                <span className="font-display font-bold">Master Mix</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                  <Play className="h-5 w-5 text-white ml-0.5" />
                </button>
                <button className="px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/10 transition-colors">
                  Export Mix
                </button>
              </div>
            </div>
            <div className="flex items-end gap-[1px] h-16">
              {Array.from({ length: 100 }).map((_, j) => (
                <div key={j} className="flex-1 rounded-full bg-primary/60" style={{ height: `${10 + Math.random() * 90}%` }} />
              ))}
            </div>
          </div>

          <button onClick={() => { setFile(null); setDone(false); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Upload another track
          </button>
        </motion.div>
      )}
    </div>
  );
}

// === TRACK EDITOR TAB ===
function TrackEditor() {
  const [hasTrack, setHasTrack] = useState(false);

  return (
    <div className="space-y-6">
      {!hasTrack ? (
        <div
          className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => setHasTrack(true)}
        >
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-display font-bold text-lg mb-1">Load a track to edit</p>
          <p className="text-sm text-muted-foreground">Upload or select from your playlists</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { icon: Scissors, label: 'Trim' },
              { icon: RotateCcw, label: 'Undo' },
              { icon: RotateCw, label: 'Redo' },
              { icon: ZoomIn, label: 'Zoom In' },
              { icon: ZoomOut, label: 'Zoom Out' },
            ].map((tool) => (
              <button key={tool.label} className="flex items-center gap-1.5 px-3 py-2 rounded-lg surface-card border border-border text-sm hover:bg-secondary transition-colors">
                <tool.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tool.label}</span>
              </button>
            ))}
          </div>

          {/* Waveform area */}
          <div className="surface-card rounded-xl p-6 border border-border">
            {/* Timeline */}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2 px-1">
              {['0:00', '0:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:20'].map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
            {/* Waveform */}
            <div className="flex items-center gap-[1px] h-32 mb-4 relative">
              {Array.from({ length: 200 }).map((_, j) => {
                const h = 15 + Math.sin(j * 0.15) * 30 + Math.random() * 55;
                return (
                  <div key={j} className="flex-1 flex flex-col items-stretch gap-[1px]">
                    <div className="bg-primary/70 rounded-t-full" style={{ height: `${h / 2}%` }} />
                    <div className="bg-primary/70 rounded-b-full" style={{ height: `${h / 2}%` }} />
                  </div>
                );
              })}
              {/* Playhead */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-accent left-[35%]" />
            </div>
            {/* Controls */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">1:10 / 3:20</span>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                  <Play className="h-5 w-5 text-white ml-0.5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-secondary transition-colors flex items-center gap-1.5">
                  <Save className="h-3.5 w-3.5" /> Save
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg gradient-bg text-white flex items-center gap-1.5">
                  <ArrowDownToLine className="h-3.5 w-3.5" /> Export
                </button>
              </div>
            </div>
          </div>

          {/* Fade controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="surface-card rounded-xl p-4 border border-border">
              <p className="text-xs font-medium mb-2">Fade In</p>
              <Slider defaultValue={[0]} max={100} />
            </div>
            <div className="surface-card rounded-xl p-4 border border-border">
              <p className="text-xs font-medium mb-2">Fade Out</p>
              <Slider defaultValue={[0]} max={100} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// === EQ & EFFECTS TAB ===
function EQEffects() {
  const bands = [
    { freq: '60Hz', value: 50 },
    { freq: '170Hz', value: 55 },
    { freq: '310Hz', value: 60 },
    { freq: '600Hz', value: 50 },
    { freq: '1kHz', value: 65 },
    { freq: '3kHz', value: 55 },
    { freq: '6kHz', value: 45 },
  ];

  const presets = ['Flat', 'Bass Boost', 'Vocal Boost', 'Rock', 'Electronic', 'Acoustic'];
  const [activePreset, setActivePreset] = useState('Flat');

  const effects = [
    { name: 'Reverb', description: 'Room simulation', enabled: false, control: 'select', options: ['Small Room', 'Medium Room', 'Large Room'] },
    { name: 'Echo', description: 'Delay effect', enabled: false, control: 'slider' },
    { name: 'Pitch Shift', description: '-12 to +12 semitones', enabled: false, control: 'slider' },
    { name: 'Speed', description: '0.5x to 2.0x', enabled: true, control: 'slider' },
  ];

  return (
    <div className="space-y-6">
      {/* EQ */}
      <div className="surface-card rounded-xl p-6 border border-border">
        <h3 className="font-display font-bold mb-4">Equalizer</h3>
        <div className="flex items-end justify-between gap-4 h-48 mb-4 px-4">
          {bands.map((band) => (
            <div key={band.freq} className="flex flex-col items-center gap-2 flex-1">
              <div className="h-40 w-full flex items-end justify-center">
                <div className="w-full max-w-[8px] rounded-full bg-primary/70" style={{ height: `${band.value}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground">{band.freq}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setActivePreset(p)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                activePreset === p ? 'gradient-bg text-white' : 'surface-elevated text-muted-foreground hover:text-foreground border border-border'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Effects */}
      <div className="space-y-3">
        <h3 className="font-display font-bold">Effects Rack</h3>
        {effects.map((fx) => (
          <div key={fx.name} className="surface-card rounded-xl p-4 border border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{fx.name}</p>
              <p className="text-xs text-muted-foreground">{fx.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {fx.control === 'slider' && <Slider defaultValue={[50]} max={100} className="w-24" />}
              <Switch defaultChecked={fx.enabled} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Studio() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-display font-bold mb-6">
        Music Studio
      </motion.h1>

      <Tabs defaultValue="stems" className="w-full">
        <TabsList className="bg-secondary/50 mb-6">
          <TabsTrigger value="stems">Stem Separator</TabsTrigger>
          <TabsTrigger value="editor">Track Editor</TabsTrigger>
          <TabsTrigger value="eq">EQ & Effects</TabsTrigger>
        </TabsList>
        <TabsContent value="stems"><StemSeparator /></TabsContent>
        <TabsContent value="editor"><TrackEditor /></TabsContent>
        <TabsContent value="eq"><EQEffects /></TabsContent>
      </Tabs>
    </div>
  );
}
