
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  // Only use basename in production (GitHub Pages)
  const basename = import.meta.env.PROD ? '/torrentlight-hub' : '';
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename={basename}>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
