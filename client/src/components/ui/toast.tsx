import * as React from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  onDismiss: (id: string) => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  onDismiss,
  duration = 5000,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const variantClasses = {
    default: 'bg-white border-gray-200',
    destructive: 'bg-red-50 border-red-200',
  };

  const textClasses = {
    default: 'text-gray-900',
    destructive: 'text-red-900',
  };

  return (
    <div
      className={`relative mb-2 flex w-full flex-col space-y-2 rounded-lg border p-4 shadow-lg ${variantClasses[variant]}`}
    >
      <div className="flex items-center justify-between">
        {title && <div className={`font-medium ${textClasses[variant]}`}>{title}</div>}
        <button
          onClick={() => onDismiss(id)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {description && <div className={`text-sm ${textClasses[variant]}`}>{description}</div>}
    </div>
  );
};

type ToastType = Omit<ToastProps, 'onDismiss'>;

interface ToastContextType {
  toasts: ToastType[];
  toast: (props: Omit<ToastType, 'id'>) => void;
  dismiss: (id: string) => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastType[]>([]);

  const toast = React.useCallback((props: Omit<ToastType, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((currentToasts) => [...currentToasts, { ...props, id }]);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const value = React.useMemo(
    () => ({
      toasts,
      toast,
      dismiss,
    }),
    [toasts, toast, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 max-h-screen w-full max-w-md overflow-y-auto p-4">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
