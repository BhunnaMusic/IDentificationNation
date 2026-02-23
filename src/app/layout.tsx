import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IdentificationNation — BPM, Key & Backstory for DJs",
  description:
    "One-Stop-Shop for track BPM, Camelot Key, Sub-genre, and cultural backstory. Built for professional DJs and music producers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
