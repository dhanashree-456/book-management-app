import React, { useMemo, useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  TableCellsIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { useBooks } from '../hooks/useBooks';
import { useDispatch, useSelector } from 'react-redux';
import { setViewMode, setPage, setSearchTerm, setGenreFilter, setStatusFilter } from '../index';

const BookList = ({ onEdit, onDelete, onAdd }) => {
  const dispatch = useDispatch();
  const { viewMode, page, rowsPerPage, searchTerm, genreFilter, statusFilter } = useSelector(
    (state) => state.ui
  );
  const { data: books = [], isLoading, error } = useBooks();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const uniqueGenres = useMemo(() => {
    const genres = books.map(book => book.genre).filter(Boolean);
    return [...new Set(genres)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = 
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = !genreFilter || book.genre === genreFilter;
      const matchesStatus = !statusFilter || book.status === statusFilter;
      
      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [books, searchTerm, genreFilter, statusFilter]);

  const paginatedBooks = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredBooks.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredBooks, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredBooks.length / rowsPerPage);

  const handleChangePage = (newPage) => {
    dispatch(setPage(newPage));
  };

  const getStatusColor = (status) => {
    return status === 'Available' ? 'status-available' : 'status-issued';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-error-800 font-medium">Error loading books</p>
          <p className="text-error-600 text-sm mt-1">
            Please make sure json-server is running on port 3001.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Book Management Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => dispatch(setViewMode('table'))}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TableCellsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => dispatch(setViewMode('grid'))}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={onAdd}
            className="btn-primary flex items-center gap-2 text-sm sm:text-base"
          >
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Book</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="card p-4 sm:p-6">
        <div className="space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="input-field pl-10 text-sm sm:text-base"
            />
          </div>

          <div className="sm:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              Filters
            </button>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${showMobileFilters ? 'block' : 'hidden sm:grid'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <select
                value={genreFilter}
                onChange={(e) => dispatch(setGenreFilter(e.target.value))}
                className="input-field text-sm"
              >
                <option value="">All Genres</option>
                {uniqueGenres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                className="input-field text-sm"
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Issued">Issued</option>
              </select>
            </div>
            
            <div className="sm:flex sm:items-end">
              <div className="text-sm text-gray-600 py-2">
                Showing {paginatedBooks.length} of {filteredBooks.length} books
              </div>
            </div>
          </div>
        </div>
      </div>

      {paginatedBooks.length === 0 ? (
        <div className="card p-8 text-center">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600">
            {books.length === 0 
              ? 'Add your first book to get started!' 
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      ) : (
        <>
          <div className="sm:hidden space-y-4">
            {paginatedBooks.map((book) => (
              <div key={book.id} className="card p-4 animate-slide-up">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-16 h-20 bg-gray-200 rounded-md overflow-hidden">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={`${book.title} cover`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full ${book.coverImage ? 'hidden' : 'flex'} items-center justify-center bg-gray-200`}>
                      <PhotoIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{book.author}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {book.genre}
                      </span>
                      <span className="text-xs text-gray-500">{book.publishedYear}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`status-badge ${getStatusColor(book.status)}`}>
                        {book.status}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(book)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(book)}
                          className="p-2 text-error-600 hover:bg-error-50 rounded-md transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:block">
            {viewMode === 'table' ? (
              <div className="card overflow-hidden">
                <div className="table-responsive">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cover
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Author
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Genre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedBooks.map((book) => (
                        <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden">
                              {book.coverImage ? (
                                <img
                                  src={book.coverImage}
                                  alt={`${book.title} cover`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className={`w-full h-full ${book.coverImage ? 'hidden' : 'flex'} items-center justify-center bg-gray-200`}>
                                <PhotoIcon className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{book.title}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">{book.author}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">{book.genre}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">{book.publishedYear}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`status-badge ${getStatusColor(book.status)}`}>
                              {book.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => onEdit(book)}
                                className="p-2 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDelete(book)}
                                className="p-2 text-error-600 hover:bg-error-50 rounded-md transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="desktop-card-grid">
                {paginatedBooks.map((book) => (
                  <div key={book.id} className="card p-6 animate-slide-up">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-4">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={`${book.title} cover`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full ${book.coverImage ? 'hidden' : 'flex'} items-center justify-center bg-gray-200`}>
                        <PhotoIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {book.genre}
                      </span>
                      <span className="text-xs text-gray-500">{book.publishedYear}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`status-badge ${getStatusColor(book.status)}`}>
                        {book.status}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(book)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(book)}
                          className="p-2 text-error-600 hover:bg-error-50 rounded-md transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {book.description && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                        {book.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {page + 1} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= totalPages - 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
