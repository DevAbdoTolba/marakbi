"use client";
import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: "danger" | "primary";
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmVariant = "danger",
    onConfirm,
    onCancel,
    isLoading = false,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const confirmButtonClass =
        confirmVariant === "danger"
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${confirmVariant === "danger" ? "bg-red-100" : "bg-blue-100"}`}>
                            <FiAlertTriangle className={confirmVariant === "danger" ? "text-red-600" : "text-blue-600"} size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2 ${confirmButtonClass}`}
                    >
                        {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
