'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, PiggyBank, RefreshCw, Settings } from 'lucide-react';
import Sidebar from './Sidebar';

const MOBILE_NAV = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/transactions', label: 'Txns', icon: ArrowLeftRight },
  { href: '/budgets', label: 'Budget', icon: PiggyBank },
  { href: '/recurring', label: 'Repeat', icon: RefreshCw },
  { href: '/settings', label: 'More', icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Format pathname for header title
  const title = pathname === '/' ? 'Dashboard' : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2).split('/')[0];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row relative">
      <div className="grain-overlay"></div>
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full">
        {/* Top AppBar */}
        <header className="hidden md:flex justify-between items-center w-full h-20 px-container-padding-desktop bg-background/80 backdrop-blur-md sticky top-0 z-30 border-b border-white/5">
          <div className="flex items-center gap-6">
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">{title}</h2>
          </div>
          <div id="header-portal"></div>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-1 p-container-padding-mobile md:p-container-padding-desktop pb-24 md:pb-container-padding-desktop">
          {children}
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-low border-t border-outline-variant/10 flex justify-around items-center h-16 z-50 px-2 pb-safe">
        {MOBILE_NAV.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${active ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
