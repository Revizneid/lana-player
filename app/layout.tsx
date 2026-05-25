import type { Metadata } from "next";
import './globals.css';
import AppShell from './components/AppShell'; // Import component vừa tạo

export const metadata: Metadata = {
  title: "Lana Player - Premium Audiobook",
  description: "Cinematic Audiobook Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-background text-white font-sans flex h-screen overflow-hidden antialiased">
        {/* Gọi Client Component chứa Sidebar và Mini Player */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}