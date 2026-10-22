'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { startTheme, refreshTheme } from '@/lib/theme-browser';

export function ThemeController() {
  const path = usePathname();
  useEffect(startTheme, []);
  useEffect(() => { refreshTheme(); }, [path]);
  return null;
}
