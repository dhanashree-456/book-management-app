import React, { useEffect, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAddBook, useUpdateBook } from '../hooks/useBooks';

const BookModal = ({ open, onClose, book = null }) => {
  const isEditing = Boolean(book);
  const addBookMutation = useAddBook();
  const updateBookMutation = useUpdateBook();

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    author: Yup.string().required('Author is required'),
    genre: Yup.string().required('Genre is required'),
    publishedYear: Yup.number()
      .typeError('Please enter a valid 4-digit year')
      .required('Published year is required')
      .integer('Year must be an integer')
      .min(1000, 'Year must be at least 1000')
      .max(new Date().getFullYear(), 'Year cannot be in the future'),
    status: Yup.string().required('Status is required'),
    coverImage: Yup.string().url('Please enter a valid URL'),
    description: Yup.string(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: book?.title || '',
      author: book?.author || '',
      genre: book?.genre || '',
      publishedYear: book?.publishedYear || '',
      status: book?.status || 'Available',
      coverImage: book?.coverImage || '',
      description: book?.description || '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (isEditing) {
          await updateBookMutation.mutateAsync({ id: book.id, data: values });
        } else {
          await addBookMutation.mutateAsync(values);
        }
        resetForm();
        onClose();
      } catch (error) {
        console.error('Error saving book:', error);
      }
    },
  });

  const handleClose = useCallback(() => {
    formik.resetForm();
    onClose();
  }, [formik, onClose]);

  const isLoading = addBookMutation.isPending || updateBookMutation.isPending;

  const genres = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Romance',
    'Thriller',
    'Biography',
    'Historical Fiction',
    'History',
    'Science',
    'Technology',
    'Self-Help',
    'Business',
    'Health',
    'Travel',
    'Other',
  ];

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
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
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={handleClose}>
      <div 
        className="modal-content w-full max-w-2xl mx-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            disabled={isLoading}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`input-field ${
                  formik.touched.title && formik.errors.title ? 'input-error' : ''
                }`}
                placeholder="Enter book title"
              />
              {formik.touched.title && formik.errors.title && (
                <p className="mt-1 text-sm text-error-600">{formik.errors.title}</p>
              )}
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                id="author"
                name="author"
                type="text"
                value={formik.values.author}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`input-field ${
                  formik.touched.author && formik.errors.author ? 'input-error' : ''
                }`}
                placeholder="Enter author name"
              />
              {formik.touched.author && formik.errors.author && (
                <p className="mt-1 text-sm text-error-600">{formik.errors.author}</p>
              )}
            </div>

            {/* Genre and Year Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                  Genre *
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={formik.values.genre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`input-field ${
                    formik.touched.genre && formik.errors.genre ? 'input-error' : ''
                  }`}
                >
                  <option value="">Select a genre</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                {formik.touched.genre && formik.errors.genre && (
                  <p className="mt-1 text-sm text-error-600">{formik.errors.genre}</p>
                )}
              </div>

              <div>
                <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Published Year *
                </label>
                <input
                  id="publishedYear"
                  name="publishedYear"
                  type="number"
                  value={formik.values.publishedYear}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`input-field ${
                    formik.touched.publishedYear && formik.errors.publishedYear ? 'input-error' : ''
                  }`}
                  placeholder="e.g., 2023"
                  min="1000"
                  max={new Date().getFullYear()}
                />
                {formik.touched.publishedYear && formik.errors.publishedYear && (
                  <p className="mt-1 text-sm text-error-600">{formik.errors.publishedYear}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`input-field ${
                  formik.touched.status && formik.errors.status ? 'input-error' : ''
                }`}
              >
                <option value="Available">Available</option>
                <option value="Issued">Issued</option>
              </select>
              {formik.touched.status && formik.errors.status && (
                <p className="mt-1 text-sm text-error-600">{formik.errors.status}</p>
              )}
            </div>

            {/* Cover Image URL */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL
              </label>
              <input
                id="coverImage"
                name="coverImage"
                type="url"
                value={formik.values.coverImage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`input-field ${
                  formik.touched.coverImage && formik.errors.coverImage ? 'input-error' : ''
                }`}
                placeholder="https://example.com/book-cover.jpg"
              />
              {formik.touched.coverImage && formik.errors.coverImage && (
                <p className="mt-1 text-sm text-error-600">{formik.errors.coverImage}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Optional: Add a URL to display the book cover image
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`input-field resize-none ${
                  formik.touched.description && formik.errors.description ? 'input-error' : ''
                }`}
                placeholder="Brief description of the book..."
              />
              {formik.touched.description && formik.errors.description && (
                <p className="mt-1 text-sm text-error-600">{formik.errors.description}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="btn-secondary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formik.isValid}
              className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <div className="loading-spinner w-4 h-4"></div>
              )}
              {isLoading ? 'Saving...' : (isEditing ? 'Update Book' : 'Add Book')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
