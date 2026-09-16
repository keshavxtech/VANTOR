import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WorkspaceShell } from "@/components/layout/workspace-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VANTOR — AI Engineering Workspace",
  description: "Premium, minimal, technical AI engineering workspace foundation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0A0E14] text-white selection:bg-[#7C3AED]/30 selection:text-white`}
      >
        <WorkspaceShell>{children}</WorkspaceShell>
      </body>
    </html>
  );
}
