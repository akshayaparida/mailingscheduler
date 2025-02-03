// layout.tsx
import React, { ReactNode } from 'react';
import './globals.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* Navigation */}
        <header className="bg-gray-700 text-white p-4">
          <h1 className="text-center text-2xl font-semibold">Mailing Scheduler</h1>
        </header>

        {/* Main content */}
        <main className="container mx-auto p-4">
          {children}
        </main>

        {/* Footer */}
       
       
      </body>
    </html>
  );
};

export default Layout;
