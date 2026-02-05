import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const styles = {
    success: "border-l-[#00FF00]",
    error: "border-l-[#E91E63]",
    info: "border-l-[#FFFF00]"
  };

  const icons = {
    success: <CheckCircle className="text-[#00FF00]" size={20} />,
    error: <AlertTriangle className="text-[#E91E63]" size={20} />,
    info: <Info className="text-[#FFFF00]" size={20} />
  };

  return (
    <div className={`
      flex items-center gap-3 bg-black text-white p-4 min-w-[300px] border-2 border-white 
      border-l-8 ${styles[toast.type]} shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]
      animate-[slideIn_0.3s_ease-out] relative font-mono text-sm
    `}>
      {icons[toast.type]}
      <span className="font-bold uppercase flex-1">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="hover:text-gray-300">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;