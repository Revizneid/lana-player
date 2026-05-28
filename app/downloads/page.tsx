'use client';
import { useLibrary } from '../providers/LibraryProvider';
import { Trash2, Play, CheckCircle, FolderSync } from 'lucide-react';
import Link from 'next/link';

export default function DownloadsPage() {
  const { downloads, removeDownload } = useLibrary();

  return (
    <div className="p-8 pb-32 min-h-screen bg-background">
      <div className="mb-8"><h1 className="text-3xl font-bold text-white">Tải xuống</h1><p className="text-text-secondary mt-1">{downloads.length} tập đã tải</p></div>
      {downloads.length === 0 ? (<div className="flex flex-col items-center justify-center mt-20 text-center"><FolderSync size={40} className="text-text-secondary mb-4" /><h2 className="text-xl font-bold text-white mb-2">Chưa có tập nào</h2><Link href="/" className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-xl font-semibold mt-4">Khám phá Thư viện</Link></div>) : (
        <div className="space-y-3">{downloads.map((track) => (
          <div key={track.url} className="bg-white/5 rounded-2xl border border-white/5 p-4 flex items-center gap-4 hover:bg-white/10 transition group">
            <img src={track.cover} alt="" className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex-1 min-w-0"><h3 className="font-semibold text-white truncate">{track.title}</h3><p className="text-sm text-text-secondary truncate">{track.bookTitle}</p><div className="flex items-center gap-2 mt-1 text-xs text-green-400"><CheckCircle size={12} /><span>Đã tải</span></div></div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
              <Link href={`/player/${track.bookId}`} className="p-2 rounded-full bg-primary/20 text-primary"><Play size={18} /></Link>
              <button onClick={() => removeDownload(track.url)} className="p-2 rounded-full bg-white/10 text-red-400"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}</div>
      )}
    </div>
  );
}