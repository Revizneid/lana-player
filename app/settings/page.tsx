'use client';
import { Settings, Gauge, Moon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8 pb-32 min-h-screen bg-background max-w-2xl">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-8"><Settings /> Cài đặt</h1>
      <div className="space-y-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-4"><Gauge className="text-primary" /><h2 className="text-xl font-semibold text-white">Tốc độ nghe mặc định</h2></div>
          <input type="range" min="0.8" max="2.0" step="0.1" defaultValue="1.0" className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" />
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-4"><Moon className="text-purple-400" /><h2 className="text-xl font-semibold text-white">Chế độ giao diện</h2></div>
          <div className="flex gap-4">
            <button className="flex-1 py-3 rounded-xl bg-primary text-white font-bold border border-primary">Dark Mode</button>
            <button className="flex-1 py-3 rounded-xl bg-white/5 text-text-secondary font-bold border border-white/10 hover:bg-white/10">AMOLED Black</button>
          </div>
        </div>
      </div>
    </div>
  );
}