import React from "react";
import { motion } from "framer-motion";
import { UserSearch } from "lucide-react";

export default function EmptyState({
  title = "No employees found",
  message = "Try adjusting your search, or add a new employee to get started.",
  actionLabel,
  onAction
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="h-16 w-16 rounded-full bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-500 mb-4">
        <UserSearch size={28} />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-400 mt-1 max-w-sm">{message}</p>
      {actionLabel && (
        <button onClick={onAction} className="btn-primary mt-5">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
