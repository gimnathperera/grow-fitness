import { useContext } from 'react';
import { ToastContext } from './toast';

export function useToast() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}

export { ToastProvider } from './toast';
