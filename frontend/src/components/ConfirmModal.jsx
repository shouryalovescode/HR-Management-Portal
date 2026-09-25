import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  open,
  title = "Delete employee",
  message = "This action can't be undone.",
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onCancel
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm glass-card bg-white dark:bg-card-dark p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
          >
            <div className="flex items-start justify-between">
              <div className="h-11 w-11 rounded-xl2 bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle size={20} />
              </div>
              <button
                onClick={onCancel}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <h3 id="confirm-modal-title" className="font-semibold text-lg mt-4">
              {title}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{message}</p>
            <div className="flex gap-3 mt-6">
              <button className="btn-secondary flex-1" onClick={onCancel}>
                Cancel
              </button>
              <button
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl2 bg-red-500 text-white font-medium px-5 py-2.5 shadow-soft hover:bg-red-600 transition-colors disabled:opacity-60"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? "Deleting…" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
