'use client';

import { Search, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Library() {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error("Lỗi tải dữ liệu:", err));
  }, []);

  return (
    <div className="p-8 pb-32 min-h-screen bg-gradient-to-b from-background via-background to-surface/30 relative">
      
      {/* HEADER */}
      <div className="relative z-10 flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Chào buổi tối 👋</h1>
          <p className="text-text-secondary mt-1">Tiếp tục nghe truyện của bạn</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition text-white">
            <Search size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition text-white">
            <UserCircle size={20} />
          </button>
        </div>
      </div>

      {/* SECTION: TIẾP TỤC NGHE */}
      <div className="relative z-10 mb-12">
        <h2 className="text-xl font-bold mb-6 text-white">Tiếp tục nghe</h2>
        
        {books.length === 0 ? (
           <div className="text-text-secondary">Đang tải thư viện...</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <Link href={`/player/${book.id}`} key={book.id}>
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group cursor-pointer relative h-full"
                >
                  <div className="aspect-[2/3] relative overflow-hidden">
                    <img 
                      src={book.cover} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={book.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold border border-white/10 text-white">
                      MỚI
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-lg leading-tight text-white drop-shadow-md">{book.title}</h3>
                      <p className="text-text-secondary text-sm mt-1">{book.author} • {book.tracks.length} tập</p>
                      <div className="w-full h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                        <div className="w-[30%] h-full bg-primary rounded-full shadow-[0_0_10px_rgba(255,90,95,0.7)]"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* SECTION: GỢI Ý CHO BẠN */}
      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-6 text-white">Gợi ý cho bạn</h2>
        <div className="flex space-x-5 overflow-x-auto pb-4 scrollbar-hide">
          {books.map((book) => (
            <Link href={`/player/${book.id}`} key={`rec-${book.id}`}>
              <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0 w-36 cursor-pointer">
                <img 
                  src={book.cover} 
                  className="w-36 h-52 object-cover rounded-2xl shadow-lg mb-3 border border-white/5" 
                  alt={book.title} 
                />
                <h4 className="text-sm font-semibold truncate text-white">{book.title}</h4>
                <p className="text-xs text-text-secondary">{book.author}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}