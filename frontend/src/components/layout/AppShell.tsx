import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#0B0B0C] text-[#E5E2E3] overflow-hidden select-none">
      <Header />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-[#0B0B0C] relative">
          {children}
        </main>
      </div>
    </div>
  );
};
