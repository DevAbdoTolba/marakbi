"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newToast: Toast = { id, message, type };

        setToasts((prev) => [...prev, newToast]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, [removeToast]);

    const showSuccess = useCallback((message: string) => showToast(message, "success"), [showToast]);
    const showError = useCallback((message: string) => showToast(message, "error"), [showToast]);
    const showInfo = useCallback((message: string) => showToast(message, "info"), [showToast]);

    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case "success":
                return "bg-green-50 border-green-200 text-green-800";
            case "error":
                return "bg-red-50 border-red-200 text-red-800";
            case "warning":
                return "bg-yellow-50 border-yellow-200 text-yellow-800";
            default:
                return "bg-blue-50 border-blue-200 text-blue-800";
        }
    };

    const getToastIcon = (type: ToastType) => {
        switch (type) {
            case "success":
                return <FiCheckCircle className="text-green-500" size={20} />;
            case "error":
                return <FiAlertCircle className="text-red-500" size={20} />;
            case "warning":
                return <FiAlertCircle className="text-yellow-500" size={20} />;
            default:
                return <FiInfo className="text-blue-500" size={20} />;
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${getToastStyles(toast.type)}`}
                        style={{
                            animation: "slideIn 0.3s ease-out"
                        }}
                    >
                        {getToastIcon(toast.type)}
                        <p className="flex-1 text-sm font-medium">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-black/5 rounded transition"
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Animation styles */}
            <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
        </ToastContext.Provider>
    );
}
