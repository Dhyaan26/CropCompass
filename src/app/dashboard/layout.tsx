
"use client";

import AppHeader from "@/components/header";
import dynamic from 'next/dynamic';

const ChatWidget = dynamic(() => import('@/components/chat-widget'), { ssr: false });


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1 overflow-auto">
            {children}
        </main>
        <ChatWidget />
      </div>
  );
}
