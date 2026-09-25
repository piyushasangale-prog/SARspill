import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#F5F9FC] text-[#06283D] overflow-hidden select-none font-body relative">
      {/* Fluid ambient ocean glows in the background that shimmer as page scrolls */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#18C7E8]/10 blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] rounded-full bg-[#087EA4]/8 blur-[130px] animate-[pulse_10s_ease-in-out_infinite_1s]" />
        <div className="absolute -bottom-32 left-1/3 w-[28rem] h-[28rem] rounded-full bg-[#18C7E8]/8 blur-[110px] animate-[pulse_12s_ease-in-out_infinite_2s]" />
      </div>

      <Header />
      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth overscroll-contain">
          {children}
        </main>
      </div>
    </div>
  );
};
