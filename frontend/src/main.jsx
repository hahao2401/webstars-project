import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AdminApp from './AdminApp';
import './index.css'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Routes cho người dùng */}
        <Route path='/*' element={<App />} />
        
        {/* Routes cho admin */}
        <Route path='/admin/*' element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
