'use client';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, CATEGORY_COLORS } from '@/types';
import { Briefcase, Laptop, TrendingUp, Gift, RotateCcw, Plus, UtensilsCrossed, Car, Home, Gamepad2, Heart, ShoppingBag, Zap, GraduationCap, Plane, MoreHorizontal } from 'lucide-react';
import styles from './CategoryBadge.module.css';

const ICON_MAP: Record<string, React.ComponentType<{size?: number}>> = {
  Briefcase, Laptop, TrendingUp, Gift, RotateCcw, Plus, UtensilsCrossed, Car, Home, Gamepad2, Heart, ShoppingBag, Zap, GraduationCap, Plane, MoreHorizontal,
};

export default function CategoryBadge({ category, size = 'sm' }: { category: string; size?: 'sm' | 'md' }) {
  const allCats = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  const cat = allCats.find(c => c.value === category);
  const color = CATEGORY_COLORS[category] || '#6b7280';
  const IconComp = cat ? ICON_MAP[cat.icon] : MoreHorizontal;
  const iconSize = size === 'sm' ? 12 : 16;
  return (
    <span className={styles.badge} style={{ color, borderColor: color + '30', background: color + '15' }}>
      {IconComp && <IconComp size={iconSize} />}
      {cat?.label || category}
    </span>
  );
}
