'use client';
import { useLibrary } from '../providers/LibraryProvider';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useLibrary();
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/data.json').then(res => res.json()).then(data => setBooks(data));
  }, []);

  const favBooks = books.filter(book => favorites.includes(book.id));

  return (
    <div className="p-8 pb-32 min-h-screen bg-background">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-8"><Heart className="text-primary fill-primary" /> Sách Yêu Thích</h1>
      {favBooks.length === 0 ? (
        <div className="text-center text-text-secondary mt-20"><p className="text-xl">Chưa có sách yêu thích.</p><Link href="/" className="text-primary hover:underline mt-4 block">Khám phá ngay</Link></div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {favBooks.map(book => (
            <div key={book.id} className="relative group bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all">
              <Link href={`/player/${book.id}`}><div className="aspect-[2/3] relative"><img src={book.cover} className="w-full h-full object-cover" alt={book.title} /><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" /><div className="absolute bottom-0 p-4"><h3 className="font-bold text-white truncate">{book.title}</h3></div></div></Link>
              <button onClick={() => toggleFavorite(book.id)} className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-red-500/50 transition-colors"><Heart size={18} className="text-primary fill-primary" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}