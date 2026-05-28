import type { Metadata } from "next";
import './globals.css';
import AppShell from './components/AppShell';
import { LibraryProvider } from './providers/LibraryProvider'; // Sửa đường dẫn này

export const metadata: Metadata = {
  title: "Lana Player - Premium Audiobook",
  description: "Cinematic Audiobook Experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-background text-white font-sans flex h-screen overflow-hidden antialiased">
        <LibraryProvider>
          <AppShell>{children}</AppShell>
        </LibraryProvider>
      </body>
    </html>
  );
}