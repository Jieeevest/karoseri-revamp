"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Loader2 } from "lucide-react";

/**
 * Props interface for DeleteConfirmationModal component
 */
interface DeleteConfirmationModalProps {
  /**
   * Controls the visibility of the modal
   */
  isOpen: boolean;

  /**
   * Callback function when modal is closed
   */
  onClose: () => void;

  /**
   * Async callback function when delete is confirmed
   */
  onConfirm: () => Promise<void>;

  /**
   * Optional custom title for the modal
   * @default "Konfirmasi Hapus"
   */
  title?: string;

  /**
   * Optional custom description for the modal
   */
  description?: string;

  /**
   * Optional name of the item being deleted (for better UX messaging)
   */
  itemName?: string;
}

/**
 * Reusable delete confirmation modal component
 *
 * This component provides a consistent, premium UI/UX for delete confirmations
 * across all CMS pages. It uses shadcn/ui's AlertDialog with a danger theme.
 *
 * @example
 * ```tsx
 * const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 * const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
 *
 * const handleDeleteConfirm = async () => {
 *   await deleteItem(deletingItemId);
 *   setIsDeleteModalOpen(false);
 *   setDeletingItemId(null);
 * };
 *
 * <DeleteConfirmationModal
 *   isOpen={isDeleteModalOpen}
 *   onClose={() => setIsDeleteModalOpen(false)}
 *   onConfirm={handleDeleteConfirm}
 *   itemName="Customer ABC"
 * />
 * ```
 */
export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Hapus",
  description,
  itemName,
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Handles the delete confirmation action
   * Sets loading state and calls the onConfirm callback
   */
  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handles modal close action
   * Only allows closing when not in deleting state
   */
  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  const defaultDescription = itemName
    ? `Apakah Anda yakin ingin menghapus "${itemName}"? Tindakan ini tidak dapat dibatalkan.`
    : "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.";

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-[425px] rounded-xl border-red-100 bg-white shadow-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 border border-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-xl font-bold text-slate-900">
                {title}
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-slate-600 pt-2 text-left">
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 pt-4">
          <AlertDialogCancel
            onClick={handleClose}
            disabled={isDeleting}
            className="rounded-xl cursor-pointer border-slate-200 hover:bg-slate-50"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md shadow-red-200 cursor-pointer min-w-[100px]"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Menghapus...
              </span>
            ) : (
              "Hapus"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
