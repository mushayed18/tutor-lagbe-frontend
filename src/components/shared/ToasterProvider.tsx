"use client"; 

import { Toaster } from "sonner";

export default function ToasterProvider() {
  return (
    <Toaster 
      position="top-right" 
      theme="dark" 
      richColors 
      closeButton
      toastOptions={{
        style: {
          background: 'var(--color-surface)',
          border: '1px solid #333',
          color: 'var(--color-text-main)',
        },
      }}
    />
  );
}