import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import router from './router';
import { ClientProvider } from '@context/ClientContext';
import { AuthProvider } from '@context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AuthProvider>
        <ClientProvider>
          <RouterProvider router={router} />
        </ClientProvider>
      </AuthProvider>
    </Suspense>
  </StrictMode>
);