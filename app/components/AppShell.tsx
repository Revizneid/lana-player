'use client';

import { LayoutGrid, Compass, List, Heart, Clock, Download, Settings, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {/* SIDEBAR - Desktop Only */}
      <aside className="hidden lg:flex flex-col w-24 h-full bg-surface/50 backdrop-blur-2xl border-r border-white/5 items-center py-8 gap-6">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-[0_0_20px_rgba(255,90,95,0.4)] mb-4">L</div>
        {[
          { icon: LayoutGrid, label: 'Thư viện', path: '/' },
          { icon: Compass, label: 'Khám phá', path: '/discover' },
          { icon: List, label: 'Danh sách', path: '/playlists' },
          { icon: Heart, label: 'Yêu thích', path: '/favorites' },
          { icon: Clock, label: 'Lịch sử', path: '/history' },
          { icon: Download, label: 'Tải xuống', path: '/downloads' },
          { icon: ShieldCheck, label: 'Quản trị', path: '/admin' },
          { icon: Settings, label: 'Cài đặt', path: '/settings' },
        ].map((item, i) => (
          <Link key={i} href={item.path} title={item.label} className={`p-3 rounded-2xl transition-all duration-300 group relative ${pathname === item.path ? 'bg-white/10 text-primary' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}>
            <item.icon size={22} />
            {pathname === item.path && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"></div>}
          </Link>
        ))}
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>

      {/* Đã xóa thanh Mini Player giả ở đây */}
    </>
  );
}