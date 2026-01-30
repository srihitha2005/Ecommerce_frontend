import React, { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  closeButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, children, onClose, closeButton = true }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto m-4">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">{title}</h2>
            {closeButton && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
