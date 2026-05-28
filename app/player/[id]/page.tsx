'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, MoreHorizontal, Heart, Timer, ListMusic, Shuffle, SkipBack, RotateCcw, Play, Pause, RotateCw, SkipForward, Repeat, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLibrary } from '../../providers/LibraryProvider';

export default function Player({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { toggleFavorite, isFavorite, addHistory, addDownload } = useLibrary();
  
  const [bookData, setBookData] = useState<any>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeSpeed, setActiveSpeed] = useState(1);
  const speeds = [0.8, 1, 1.2, 1.5, 2];

  const [showChapters, setShowChapters] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedHistoryRef = useRef(0);

  useEffect(() => {
    fetch('/data.json').then(res => res.json()).then(data => {
      const foundBook = data.find((b: any) => b.id === id);
      if (foundBook) { setBookData(foundBook); document.title = `${foundBook.title} - Lana Player`; }
    });
  }, [id]);

  useEffect(() => {
    if (audioRef.current && bookData) { audioRef.current.load(); audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); lastSavedHistoryRef.current = 0; }
  }, [currentTrackIndex, bookData]);

  useEffect(() => {
    if (timerMinutes === null) return;
    setTimeLeft(timerMinutes * 60);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(timerIntervalRef.current!); audioRef.current?.pause(); setIsPlaying(false); setTimerMinutes(null); return 0; } return prev - 1; });
    }, 1000);
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [timerMinutes]);

  const togglePlayPause = () => { if (!audioRef.current) return; if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); } setIsPlaying(!isPlaying); };
  const playNext = () => { if (bookData) setCurrentTrackIndex((prev) => (prev + 1) % bookData.tracks.length); };
  const playPrev = () => { if (bookData) setCurrentTrackIndex((prev) => (prev - 1 + bookData.tracks.length) % bookData.tracks.length); };
  const seek = (seconds: number) => { if (audioRef.current) audioRef.current.currentTime += seconds; };
  const changeSpeed = (index: number) => { setActiveSpeed(index); if (audioRef.current) audioRef.current.playbackRate = speeds[index]; };

  const handleTimeUpdate = () => { 
    if (!audioRef.current) return;
    const ct = audioRef.current.currentTime;
    setCurrentTime(ct);
    if (ct - lastSavedHistoryRef.current > 5 && bookData && audioRef.current.duration) {
      addHistory({ bookId: bookData.id, trackIndex: currentTrackIndex, progress: ct / audioRef.current.duration, timestamp: Date.now() });
      lastSavedHistoryRef.current = ct;
    }
  };

  const handleLoadedMetadata = () => { if (audioRef.current) { setDuration(audioRef.current.duration); audioRef.current.playbackRate = speeds[activeSpeed]; } };
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => { if (!audioRef.current || duration === 0) return; const rect = e.currentTarget.getBoundingClientRect(); audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration; };
  const formatTime = (seconds: number) => { if (isNaN(seconds)) return "0:00"; const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = Math.floor(seconds % 60); if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`; return `${m}:${s < 10 ? '0' : ''}${s}`; };

  // FIX LỖI WAVEFORM NHÁY
  const waveformHeights = useMemo(() => Array.from({ length: 60 }).map(() => Math.random() * 100), [currentTrackIndex]);

  if (!bookData) return <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary">Đang tải...</div>;
  const currentTrack = bookData.tracks[currentTrackIndex];
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-6 pb-40 overflow-hidden bg-background">
      <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={playNext} />
      <div className="absolute inset-0 z-0"><img src={bookData.cover} className="w-full h-full object-cover scale-125 blur-3xl opacity-20" alt="bg" /><div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background"></div></div>
      
      <div className="relative z-10 w-full flex items-center justify-between mb-8 mt-2">
        <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-white transition"><ArrowLeft size={22} /> <span className="text-sm font-medium">Thư viện</span></Link>
        <span className="text-xs font-bold tracking-[0.2em] text-text-secondary uppercase">Đang phát</span>
        <button className="text-text-secondary hover:text-white transition"><MoreHorizontal size={22} /></button>
      </div>

      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 w-full max-w-[340px] mx-auto mb-10">
        <div className="aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"><img src={bookData.cover} className="w-full h-full object-cover" alt={bookData.title} /></div>
      </motion.div>

      <div className="relative z-10 w-full max-w-[380px] text-center mb-6">
        <h1 className="text-xl font-bold tracking-tight mb-1 text-white">{currentTrack.title}</h1>
        <p className="text-primary text-sm font-bold tracking-widest uppercase">{bookData.author}</p>
      </div>

      <div className="relative z-10 flex items-center gap-3 mb-8 flex-wrap justify-center">
        <button onClick={() => toggleFavorite(bookData.id)} className={`bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition ${isFavorite(bookData.id) ? 'text-primary' : 'text-white'}`}><Heart size={16} fill={isFavorite(bookData.id) ? 'currentColor' : 'none'} /> {isFavorite(bookData.id) ? 'Đã thích' : 'Yêu thích'}</button>
        <button onClick={() => setShowTimer(true)} className="bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition text-white"><Timer size={16} /> Hẹn giờ {timeLeft > 0 && `(${formatTime(timeLeft)})`}</button>
        <button onClick={() => setShowChapters(true)} className="bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition text-white"><ListMusic size={16} /> Chương</button>
        <button onClick={() => {
          const a = document.createElement('a'); a.href = currentTrack.url; a.download = `${currentTrack.title}.mp3`; a.click();
          addDownload({ title: currentTrack.title, url: currentTrack.url, bookTitle: bookData.title, bookId: bookData.id, cover: bookData.cover, downloadedAt: Date.now() });
        }} className="bg-primary/20 border border-primary/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-primary/30 transition text-primary"><Download size={16} /> Tải tập này</button>
      </div>

      <div className="relative z-10 w-full max-w-[380px] mb-8">
        <div className="flex items-end justify-between h-8 gap-[2px] px-4 cursor-pointer group" onClick={handleProgressClick}>
          {waveformHeights.map((height, i) => { const isPlayed = (i / 60) * 100 < progressPercent; return <div key={i} className={`flex-1 rounded-full transition-colors duration-200 ${isPlayed ? 'bg-primary' : 'bg-white/20'}`} style={{ height: `${Math.max(10, height)}%` }}></div>; })}
        </div>
        <div className="flex justify-between mt-2 px-4"><span className="text-xs text-text-secondary font-medium">{formatTime(currentTime)}</span><span className="text-xs text-text-secondary font-medium">{formatTime(duration)}</span></div>
      </div>

      <div className="relative z-10 flex items-center justify-between w-full max-w-[380px] mb-8">
        <button className="text-text-secondary hover:text-white transition"><Shuffle size={18} /></button>
        <button onClick={playPrev} className="text-white hover:text-primary transition"><SkipBack size={22} fill="currentColor" /></button>
        <button onClick={() => seek(-10)} className="text-text-secondary hover:text-white transition"><RotateCcw size={22} /></button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={togglePlayPause} className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-[#d64045] flex items-center justify-center shadow-[0_0_40px_rgba(255,90,95,0.6)] text-white">
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </motion.button>
        <button onClick={() => seek(10)} className="text-text-secondary hover:text-white transition"><RotateCw size={22} /></button>
        <button onClick={playNext} className="text-white hover:text-primary transition"><SkipForward size={22} fill="currentColor" /></button>
        <button className="text-text-secondary hover:text-white transition"><Repeat size={18} /></button>
      </div>

      <div className="relative z-10 flex items-center bg-white/5 rounded-full p-1 border border-white/5 mb-6">
        {speeds.map((speed, index) => (<button key={index} onClick={() => changeSpeed(index)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${activeSpeed === index ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,90,95,0.4)]' : 'text-text-secondary hover:text-white'}`}>{speed}x</button>))}
      </div>

      <div className="relative z-10 w-full max-w-[380px] bg-white/5 backdrop-blur-xl rounded-2xl border border-white/5 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div><span className="text-xs text-text-secondary">Chương {currentTrackIndex + 1}/{bookData.tracks.length}</span></div>
        <div className="text-xs text-text-secondary">192 kbps</div>
      </div>

      <AnimatePresence>
        {showChapters && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center" onClick={() => setShowChapters(false)}><motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} className="w-full max-w-lg bg-surface rounded-t-3xl p-6 max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold">Danh sách chương</h2><button onClick={() => setShowChapters(false)}><X size={24} /></button></div><div className="overflow-y-auto flex-1 space-y-2">{bookData.tracks.map((track: any, index: number) => (<button key={index} onClick={() => { setCurrentTrackIndex(index); setShowChapters(false); }} className={`w-full text-left p-4 rounded-xl transition flex items-center gap-4 ${currentTrackIndex === index ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-white/5 text-white'}`}><span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentTrackIndex === index ? 'bg-primary text-white' : 'bg-white/10'}`}>{index + 1}</span><span className="font-medium truncate">{track.title}</span></button>))}</div></motion.div></motion.div>)}
      </AnimatePresence>

      <AnimatePresence>
        {showTimer && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowTimer(false)}><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-xs bg-surface rounded-3xl p-6 border border-white/10" onClick={e => e.stopPropagation()}><h3 className="text-lg font-bold text-center mb-6">Hẹn giờ tắt nhạc</h3><div className="grid grid-cols-2 gap-3">{[15, 30, 45, 60].map(min => (<button key={min} onClick={() => { setTimerMinutes(min); setShowTimer(false); }} className={`py-3 rounded-xl font-bold transition ${timerMinutes === min ? 'bg-primary text-white' : 'bg-white/5 hover:bg-white/10 text-white'}`}>{min} phút</button>))}</div><button onClick={() => { setTimerMinutes(null); setShowTimer(false); }} className="w-full mt-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary font-bold transition">Tắt hẹn giờ</button></motion.div></motion.div>)}
      </AnimatePresence>
    </div>
  );
}