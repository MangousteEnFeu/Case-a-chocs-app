import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-black border-4 border-white p-0 w-full max-w-md shadow-[10px_10px_0px_0px_#E91E63] animate-[fadeIn_0.2s_ease-out]">
        <div className="bg-white text-black p-3 font-bold font-mono uppercase flex justify-between items-center border-b-2 border-black">
            <span>{title}</span>
            <button onClick={onClose} className="hover:bg-black hover:text-white transition-colors p-1"><X size={20}/></button>
        </div>
        
        <div className="p-6">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;