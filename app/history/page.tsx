'use client';
import { useLibrary } from '../providers/LibraryProvider';
import { History, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HistoryPage() {
  const { history, clearHistory } = useLibrary();
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => { fetch('/data.json').then(res => res.json()).then(data => setBooks(data)); }, []);

  const historyBooks = history.map(h => { const book = books.find(b => b.id === h.bookId); return book ? { ...book, progress: h.progress, timestamp: h.timestamp } : null; }).filter(Boolean);

  return (
    <div className="p-8 pb-32 min-h-screen bg-background">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3"><History /> Lịch sử</h1>
        {historyBooks.length > 0 && <button onClick={clearHistory} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"><Trash2 size={14} /> Xóa lịch sử</button>}
      </div>
      {historyBooks.length === 0 ? (
        <div className="text-center text-text-secondary mt-20"><p className="text-xl">Chưa có lịch sử nghe.</p></div>
      ) : (
        <div className="space-y-4">
          {historyBooks.map(book => book && (
            <Link key={book.id} href={`/player/${book.id}`} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition">
              <img src={book.cover} className="w-16 h-16 rounded-xl object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{book.title}</h3>
                <p className="text-sm text-text-secondary mt-1">Đã nghe {Math.round(book.progress * 100)}%</p>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-2"><div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.round(book.progress * 100)}%` }}></div></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}