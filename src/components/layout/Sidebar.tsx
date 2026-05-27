'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, PiggyBank, RefreshCw, Download, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/budgets', label: 'Budgets', icon: PiggyBank },
  { href: '/recurring', label: 'Recurring', icon: RefreshCw },
  { href: '/export', label: 'Export', icon: Download },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const initials = user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant/10 bg-surface-container-low flex flex-col py-8 px-4 z-40 hidden md:flex">
      <div className="mb-10 px-4">
        <h1 className="font-headline-md text-headline-md text-primary tracking-tight font-bold">Smart Money Tracker</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} className={active ? "flex items-center gap-4 px-4 py-3 rounded-lg text-primary font-bold border-r-4 border-primary bg-primary-container/10 transition-colors duration-200" : "flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors duration-200"}>
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {user && (
        <div className="mt-auto px-4 py-4 rounded-lg bg-surface-container flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold overflow-hidden">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user.displayName || 'User'}</p>
            <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
          </div>
          <button className="text-error hover:opacity-80 transition-opacity" onClick={() => signOut()} title="Sign out"><LogOut size={18} /></button>
        </div>
      )}
    </aside>
  );
}
