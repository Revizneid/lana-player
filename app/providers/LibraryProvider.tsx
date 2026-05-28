'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type DownloadedTrack = { title: string; url: string; bookTitle: string; bookId: string; cover: string; downloadedAt: number; };

interface LibraryContextType {
  favorites: string[];
  toggleFavorite: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;
  history: any[];
  addHistory: (item: any) => void;
  clearHistory: () => void;
  downloads: DownloadedTrack[];
  addDownload: (item: DownloadedTrack) => void;
  removeDownload: (url: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<DownloadedTrack[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedFav = localStorage.getItem('lana_favorites');
      const savedHis = localStorage.getItem('lana_history');
      const savedDl = localStorage.getItem('lana_downloads');
      if (savedFav) setFavorites(JSON.parse(savedFav));
      if (savedHis) setHistory(JSON.parse(savedHis));
      if (savedDl) setDownloads(JSON.parse(savedDl));
    } catch (e) { console.error("Failed to parse localStorage", e); }
    setIsLoaded(true);
  }, []);

  useEffect(() => { if (isLoaded) localStorage.setItem('lana_favorites', JSON.stringify(favorites)); }, [favorites, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('lana_history', JSON.stringify(history)); }, [history, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('lana_downloads', JSON.stringify(downloads)); }, [downloads, isLoaded]);

  const toggleFavorite = useCallback((bookId: string) => {
    setFavorites(prev => prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]);
  }, []);

  const isFavorite = useCallback((bookId: string) => favorites.includes(bookId), [favorites]);

  const addHistory = useCallback((item: any) => {
    setHistory(prev => [{ ...item, timestamp: Date.now() }, ...prev.filter(h => h.bookId !== item.bookId)].slice(0, 50));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const addDownload = useCallback((item: DownloadedTrack) => {
    setDownloads(prev => prev.some(d => d.url === item.url) ? prev : [item, ...prev]);
  }, []);

  const removeDownload = useCallback((url: string) => {
    setDownloads(prev => prev.filter(d => d.url !== url));
  }, []);

  if (!isLoaded) return null;

  return (
    <LibraryContext.Provider value={{ favorites, toggleFavorite, isFavorite, history, addHistory, clearHistory, downloads, addDownload, removeDownload }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within LibraryProvider');
  return context;
};