import React from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6" />;
      case 'error':
        return <XCircleIcon className="h-6 w-6" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6" />;
      case 'info':
        return <InformationCircleIcon className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${getStyles()} shadow-lg`}>
      {getIcon()}
      <span className="flex-1">{message}</span>
    </div>
  );
};

export default Toast;
