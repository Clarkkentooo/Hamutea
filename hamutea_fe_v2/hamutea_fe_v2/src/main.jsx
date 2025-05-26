import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { Suspense } from 'react';
import router from './router';
import './index.css'
import { ClientProvider } from './context/ClientContext';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <ClientProvider>
          <RouterProvider router={router} />
        </ClientProvider>
      </AuthProvider>
    </Suspense>
  </StrictMode>,
)