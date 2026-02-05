import React from 'react';
import { ToastProvider as ContextProvider } from '../context/ToastContext';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';

const ToastDisplay: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ContextProvider>
      {children}
      <ToastDisplay />
    </ContextProvider>
  );
};