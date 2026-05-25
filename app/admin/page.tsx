'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Edit3, Save, X } from 'lucide-react';

type Track = { title: string; url: string };
type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  tracks: Track[];
};

export default function AdminDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isEditing, setIsEditing] = useState<Book | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error("Lỗi tải dữ liệu:", err));
  }, []);

  const handleExport = () => {
    const jsonStr = JSON.stringify(books, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteBook = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa cuốn truyện này?')) {
      setBooks(books.filter(b => b.id !== id));
    }
  };

  const handleSave = (book: Book) => {
    if (isNew) {
      setBooks([...books, book]);
    } else {
      setBooks(books.map(b => (b.id === book.id ? book : b)));
    }
    setIsEditing(null);
    setIsNew(false);
  };

  const startNewBook = () => {
    setIsNew(true);
    setIsEditing({
      id: `book-${Date.now()}`,
      title: '',
      author: '',
      cover: 'https://images.unsplash.com/photo-1614064542512-57f8fc634580?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      tracks: []
    });
  };

  return (
    <div className="p-8 pb-32 min-h-screen bg-background text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản trị hệ thống</h1>
          <p className="text-text-secondary mt-1">Quản lý cơ sở dữ liệu Audiobook</p>
        </div>
        <div className="flex gap-3">
          <button onClick={startNewBook} className="bg-primary hover:bg-primary/80 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition"><Plus size={18} /> Thêm truyện</button>
          <button onClick={handleExport} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition border border-white/10"><Download size={18} /> Xuất data.json</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface p-6 rounded-2xl border border-white/5 shadow-lg">
          <p className="text-text-secondary text-sm mb-1">Tổng số truyện</p>
          <h3 className="text-3xl font-bold">{books.length}</h3>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-white/5 shadow-lg">
          <p className="text-text-secondary text-sm mb-1">Tổng số tập</p>
          <h3 className="text-3xl font-bold">{books.reduce((acc, b) => acc + b.tracks.length, 0)}</h3>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-white/5 shadow-lg">
          <p className="text-text-secondary text-sm mb-1">Trạng thái</p>
          <h3 className="text-xl font-bold text-green-400">Đang hoạt động</h3>
        </div>
      </div>

      {/* Book List Table */}
      <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden shadow-lg">
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="font-bold text-lg">Danh sách Audiobooks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-text-secondary text-sm">
                <th className="p-4">Tên truyện</th>
                <th className="p-4 hidden md:table-cell">Tác giả</th>
                <th className="p-4 text-center">Số tập</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-4 font-medium">{book.title}</td>
                  <td className="p-4 hidden md:table-cell text-text-secondary">{book.author}</td>
                  <td className="p-4 text-center">{book.tracks.length}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setIsNew(false); setIsEditing(book); }} className="text-blue-400 hover:text-blue-300 mr-4 transition"><Edit3 size={18} /></button>
                    <button onClick={() => handleDeleteBook(book.id)} className="text-red-400 hover:text-red-300 transition"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setIsEditing(null); setIsNew(false); }}>
          <div className="bg-surface rounded-3xl p-8 w-full max-w-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{isNew ? 'Thêm truyện mới' : 'Chỉnh sửa truyện'}</h2>
              <button onClick={() => { setIsEditing(null); setIsNew(false); }}><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">ID (Dùng cho URL, không có khoảng trắng)</label>
                <input type="text" value={isEditing.id} onChange={e => setIsEditing({...isEditing, id: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl p-3 text-white" readOnly={!isNew} />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Tên truyện</label>
                <input type="text" value={isEditing.title} onChange={e => setIsEditing({...isEditing, title: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Tác giả / Người đọc</label>
                <input type="text" value={isEditing.author} onChange={e => setIsEditing({...isEditing, author: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Link Ảnh bìa (Cover URL)</label>
                <input type="text" value={isEditing.cover} onChange={e => setIsEditing({...isEditing, cover: e.target.value})} className="w-full bg-background border border-white/10 rounded-xl p-3 text-white" />
              </div>
              
              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Danh sách tập ({isEditing.tracks.length})</h3>
                  <button onClick={() => {
                    const newTrack = { title: `Tập ${isEditing.tracks.length + 1}`, url: '' };
                    setIsEditing({...isEditing, tracks: [...isEditing.tracks, newTrack]});
                  }} className="text-primary hover:text-primary/80 text-sm font-bold flex items-center gap-1"><Plus size={16} /> Thêm tập</button>
                </div>
                
                <div className="space-y-3">
                  {isEditing.tracks.map((track, index) => (
                    <div key={index} className="bg-background p-4 rounded-xl border border-white/5 flex gap-3">
                      <div className="flex-1 space-y-2">
                        <input type="text" value={track.title} onChange={e => {
                          const newTracks = [...isEditing.tracks];
                          newTracks[index].title = e.target.value;
                          setIsEditing({...isEditing, tracks: newTracks});
                        }} placeholder="Tên tập" className="w-full bg-surface border border-white/10 rounded-lg p-2 text-white text-sm" />
                        <input type="text" value={track.url} onChange={e => {
                          const newTracks = [...isEditing.tracks];
                          newTracks[index].url = e.target.value;
                          setIsEditing({...isEditing, tracks: newTracks});
                        }} placeholder="Link tải MP3 (GitHub Releases)" className="w-full bg-surface border border-white/10 rounded-lg p-2 text-white text-sm" />
                      </div>
                      <button onClick={() => {
                        const newTracks = isEditing.tracks.filter((_, i) => i !== index);
                        setIsEditing({...isEditing, tracks: newTracks});
                      }} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => { setIsEditing(null); setIsNew(false); }} className="px-6 py-2.5 rounded-xl border border-white/10 text-text-secondary hover:bg-white/5 transition">Hủy</button>
              <button onClick={() => handleSave(isEditing)} className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/80 transition flex items-center gap-2"><Save size={18} /> Lưu lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}