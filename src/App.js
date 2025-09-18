import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import BookList from './components/BookList';
import BookModal from './components/BookModal';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';

function App() {
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleAddBook = () => {
    setSelectedBook(null);
    setBookModalOpen(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setBookModalOpen(true);
  };

  const handleDeleteBook = (book) => {
    setSelectedBook(book);
    setDeleteDialogOpen(true);
  };

  const handleCloseModal = () => {
    setBookModalOpen(false);
    setSelectedBook(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Book Management System
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Manage your library collection
                </p>
              </div>
            </div>
            
            {/* Mobile menu button could go here if needed */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-success-500 rounded-full"></span>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="animate-fade-in">
          <Routes>
            <Route
              path="/"
              element={
                <BookList
                  onAdd={handleAddBook}
                  onEdit={handleEditBook}
                  onDelete={handleDeleteBook}
                />
              }
            />
          </Routes>
        </div>
      </main>

      {/* Modals */}
      {bookModalOpen && (
        <BookModal
          open={bookModalOpen}
          onClose={handleCloseModal}
          book={selectedBook}
        />
      )}

      {deleteDialogOpen && (
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          book={selectedBook}
        />
      )}
    </div>
  );
}

export default App;
