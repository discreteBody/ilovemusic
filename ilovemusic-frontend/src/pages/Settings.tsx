import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const [quality, setQuality] = useState('high');

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-display font-bold mb-6">
        Settings
      </motion.h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-secondary/50 mb-6 flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
          <TabsTrigger value="audio">Audio Preferences</TabsTrigger>
          <TabsTrigger value="shortcuts">Keyboard Shortcuts</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="surface-card rounded-xl p-6 border border-border space-y-6">
            <div className="flex items-center gap-4">
              <img src={user?.avatar} alt="" className="w-16 h-16 rounded-full border-2 border-border" />
              <button className="text-sm text-primary hover:underline">Change avatar</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                <input defaultValue={user?.name} className="w-full px-3 py-2 rounded-lg surface-elevated border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                <input defaultValue={user?.email} className="w-full px-3 py-2 rounded-lg surface-elevated border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
            <button className="gradient-bg text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity">Save Changes</button>
          </div>
        </TabsContent>

        <TabsContent value="accounts">
          <div className="space-y-4">
            {[
              { name: 'Spotify', color: 'border-green-500/30', dot: 'bg-green-500', user: '@sai_music', synced: '2 hours ago' },
              { name: 'YouTube Music', color: 'border-red-500/30', dot: 'bg-red-500', user: 'Sai Music Channel', synced: '5 hours ago' },
            ].map((acc) => (
              <div key={acc.name} className={`surface-card rounded-xl p-5 border ${acc.color} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={cn('w-3 h-3 rounded-full', acc.dot)} />
                  <div>
                    <p className="font-semibold text-sm">{acc.name}</p>
                    <p className="text-xs text-muted-foreground">{acc.user} · Last synced {acc.synced}</p>
                  </div>
                </div>
                <button className="text-xs text-destructive hover:underline">Disconnect</button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audio">
          <div className="surface-card rounded-xl p-6 border border-border space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">Audio Quality</label>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High', 'Lossless'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q.toLowerCase())}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      quality === q.toLowerCase() ? 'gradient-bg text-white' : 'surface-elevated border border-border text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Crossfade</p>
                <p className="text-xs text-muted-foreground">0-12 seconds between tracks</p>
              </div>
              <Slider defaultValue={[3]} max={12} className="w-32" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Gapless Playback</p>
                <p className="text-xs text-muted-foreground">No silence between tracks</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Normalize Volume</p>
                <p className="text-xs text-muted-foreground">Keep consistent volume levels</p>
              </div>
              <Switch />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shortcuts">
          <div className="surface-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Action</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">Shortcut</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Play / Pause', 'Space'],
                  ['Mute', 'M'],
                  ['Toggle Stems', 'S'],
                  ['Open Studio', 'E'],
                  ['Next Track', '→'],
                  ['Previous Track', '←'],
                  ['Volume Up', '↑'],
                  ['Volume Down', '↓'],
                ].map(([action, key]) => (
                  <tr key={action} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3 text-sm">{action}</td>
                    <td className="px-5 py-3 text-right">
                      <kbd className="px-2 py-1 rounded surface-elevated border border-border text-xs font-mono">{key}</kbd>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="danger">
          <div className="surface-card rounded-xl p-6 border border-destructive/30">
            <h3 className="font-display font-bold text-destructive mb-2">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="px-6 py-2.5 rounded-lg bg-destructive text-white text-sm font-semibold hover:bg-destructive/90 transition-colors">
              Delete Account
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
