'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, PiggyBank, RefreshCw, Download, Settings } from 'lucide-react';
import Sidebar from './Sidebar';
import styles from './AppShell.module.css';

const MOBILE_NAV = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/transactions', label: 'Txns', icon: ArrowLeftRight },
  { href: '/budgets', label: 'Budget', icon: PiggyBank },
  { href: '/recurring', label: 'Repeat', icon: RefreshCw },
  { href: '/settings', label: 'More', icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>{children}</main>
      <nav className={styles.mobileNav}>
        {MOBILE_NAV.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} className={styles.mobileLink + (active ? ' ' + styles.mobileLinkActive : '')}>
              <Icon size={20} /><span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
