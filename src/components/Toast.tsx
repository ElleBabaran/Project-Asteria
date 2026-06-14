"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Download, X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
  icon?: "download" | "check";
}

export function Toast({ message, onClose, duration = 3000, icon = "download" }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Animate out then unmount
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 350);
    }, duration);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`flex items-center gap-3 rounded-card border border-leaf/30 bg-paper px-4 py-3 shadow-card transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-light text-sage-dark">
        {icon === "download" ? <Download size={15} /> : <CheckCircle size={15} />}
      </span>
      <p className="text-sm font-medium text-sage-dark">{message}</p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 350);
        }}
        className="ml-auto shrink-0 text-ink/40 transition-colors hover:text-ink"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// Global toast container that sits fixed at bottom-right
interface ToastItem {
  id: string;
  message: string;
  icon?: "download" | "check";
}

interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed bottom-24 right-6 z-[60] flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast message={t.message} icon={t.icon} onClose={() => removeToast(t.id)} />
        </div>
      ))}
    </div>
  );
}

// Hook for using toasts
import { useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, icon?: "download" | "check") => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, icon }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
