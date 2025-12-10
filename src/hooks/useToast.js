import { useState, useCallback } from 'react';
import { generateId } from '../utils/helpers';
import { TOAST_DURATION } from '../utils/constants';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = null) => {
    const id = generateId();
    const toast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration: duration || TOAST_DURATION[type.toUpperCase()] || TOAST_DURATION.INFO,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    clearToasts,
  };
};
