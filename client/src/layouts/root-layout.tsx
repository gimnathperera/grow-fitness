import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navbar';
import { Footer } from '@/components/footer';
import GrowChatbot from '@/components/chatbot/grow-chatbot';

const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <Navbar />
      {/* Main Content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      {/* Footer */}
      <footer className="border-t mt-auto bg-background">
        <Footer />
      </footer>
      <GrowChatbot />
    </div>
  );
};

export default RootLayout;
