import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IDentificationNation",
  description: "One-stop shop for track BPM, Key, Sub-genre & deep cultural backstory for DJs and Music Producers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
