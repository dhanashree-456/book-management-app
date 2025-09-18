import React, { useEffect } from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDeleteBook } from '../hooks/useBooks';

const DeleteConfirmDialog = ({ open, onClose, book }) => {
  const deleteBookMutation = useDeleteBook();

  const handleDelete = async () => {
    try {
      await deleteBookMutation.mutateAsync(book.id);
      onClose();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const isLoading = deleteBookMutation.isPending;

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open || !book) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="modal-content w-full max-w-md mx-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-warning-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Confirm Delete
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            disabled={isLoading}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <p className="text-gray-900">
              Are you sure you want to delete the book{' '}
              <span className="font-semibold">"{book.title}"</span> by{' '}
              <span className="font-semibold">{book.author}</span>?
            </p>
            <div className="bg-error-50 border border-error-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-error-800">
                    This action cannot be undone
                  </p>
                  <p className="text-sm text-error-700 mt-1">
                    The book will be permanently removed from your library.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn-secondary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="btn-danger w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && (
              <div className="loading-spinner w-4 h-4 border-white border-t-transparent"></div>
            )}
            {isLoading ? 'Deleting...' : 'Delete Book'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
