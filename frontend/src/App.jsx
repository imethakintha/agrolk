import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import Home from '@/pages/Tourist/Home';
import SearchResults from '@/pages/Tourist/SearchResults';
import FarmDetail from '@/pages/Tourist/FarmDetail';
import Checkout from '@/pages/Tourist/Checkout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/farm/:slug" element={<FarmDetail />} />
        <Route path="/checkout/:bookingId" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}

