'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Play, CheckCircle, FolderSync } from 'lucide-react';
import Link from 'next/link';

type DownloadedTrack = {
  title: string;
  url: string;
  bookTitle: string;
  bookId: string;
  cover: string;
  downloadedAt: number;
};

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadedTrack[]>([]);

  useEffect(() => {
    // Lấy dữ liệu từ LocalStorage khi trang load
    const saved = JSON.parse(localStorage.getItem('lana_downloads') || '[]');
    setDownloads(saved);
  }, []);

  const handleRemove = (url: string) => {
    const updated = downloads.filter(d => d.url !== url);
    setDownloads(updated);
    localStorage.setItem('lana_downloads', JSON.stringify(updated));
  };

  const clearAll = () => {
    if (confirm('Bạn có muốn xóa toàn bộ lịch sử tải xuống không? (File đã tải trên máy sẽ không bị xóa)')) {
      setDownloads([]);
      localStorage.setItem('lana_downloads', JSON.stringify([]));
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-8 pb-32 min-h-screen bg-gradient-to-b from-background via-background to-surface/30">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Tải xuống</h1>
          <p className="text-text-secondary mt-1">{downloads.length} tập đã được tải về thiết bị</p>
        </div>
        {downloads.length > 0 && (
          <button onClick={clearAll} className="text-red-400 hover:text-red-300 text-sm font-bold flex items-center gap-2 transition">
            <Trash2 size={16} /> Xóa lịch sử
          </button>
        )}
      </div>

      {/* Empty State */}
      {downloads.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <FolderSync size={40} className="text-text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Chưa có tập nào được tải</h2>
          <p className="text-text-secondary mb-6 max-w-sm">Khi bạn bấm "Tải tập này" trên trình phát, tập truyện sẽ xuất hiện tại đây để bạn dễ dàng quản lý.</p>
          <Link href="/" className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-xl font-semibold transition">
            Khám phá Thư viện
          </Link>
        </div>
      ) : (
        /* Danh sách đã tải */
        <div className="space-y-3">
          {downloads.map((track) => (
            <div key={track.url} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/5 p-4 flex items-center gap-4 hover:bg-white/10 transition group">
              <img src={track.cover} alt={track.bookTitle} className="w-16 h-16 rounded-xl object-cover shadow-md" />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{track.title}</h3>
                <p className="text-sm text-text-secondary truncate">{track.bookTitle}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-green-400">
                  <CheckCircle size={12} />
                  <span>Đã tải lúc {formatDate(track.downloadedAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                <Link href={`/player/${track.bookId}`} className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition" title="Đi đến trình phát">
                  <Play size={18} />
                </Link>
                <button onClick={() => handleRemove(track.url)} className="p-2 rounded-full bg-white/10 text-text-secondary hover:text-red-400 hover:bg-red-400/10 transition" title="Xóa khỏi danh sách">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}