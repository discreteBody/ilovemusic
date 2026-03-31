import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import MobileNav from './MobileNav';
import BottomPlayer from '../player/BottomPlayer';

export default function AppLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-20">
        <Outlet />
      </main>
      <MobileNav />
      <BottomPlayer />
    </div>
  );
}
