import { Home, ListMusic, AudioWaveform, Search, Settings } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Home', to: '/', icon: Home },
  { title: 'Playlists', to: '/playlists', icon: ListMusic },
  { title: 'Studio', to: '/studio', icon: AudioWaveform },
  { title: 'Finder', to: '/recognize', icon: Search },
  { title: 'Settings', to: '/settings', icon: Settings },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-20 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-background/95 backdrop-blur-md py-2 px-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={cn(
            'flex flex-col items-center gap-0.5 text-[10px] font-medium text-muted-foreground transition-colors px-2 py-1 rounded-lg',
            'hover:text-foreground'
          )}
          activeClassName="!text-primary"
        >
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}
