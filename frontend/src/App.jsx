import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

// Placeholder pages
const Home = () => <div className="p-8">AgroLK Home</div>;
const Login = () => <div className="p-8">Login Page</div>;

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* More routes will be added in later phases */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}