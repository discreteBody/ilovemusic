import { Home, ListMusic, AudioWaveform, Search, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Dashboard', to: '/', icon: Home },
  { title: 'My Playlists', to: '/playlists', icon: ListMusic },
  { title: 'Music Studio', to: '/studio', icon: AudioWaveform },
  { title: 'Song Finder', to: '/recognize', icon: Search },
  { title: 'Settings', to: '/settings', icon: Settings },
];

export default function AppSidebar() {
  const { isOpen, toggle } = useSidebarStore();

  return (
    <motion.aside
      animate={{ width: isOpen ? 240 : 64 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-full border-r border-border bg-sidebar overflow-hidden flex-shrink-0"
    >
      <div className="flex items-center justify-between p-4 h-16">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <AudioWaveform className="h-6 w-6 text-primary flex-shrink-0" />
              <span className="font-display font-bold text-lg whitespace-nowrap gradient-text">
                ilovemusic
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <AudioWaveform className="h-6 w-6 text-primary mx-auto" />
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
              'text-muted-foreground hover:text-foreground hover:bg-secondary',
              !isOpen && 'justify-center px-0'
            )}
            activeClassName="!text-primary bg-primary/10 hover:bg-primary/15"
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.title}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={toggle}
        className="flex items-center justify-center p-3 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </motion.aside>
  );
}
