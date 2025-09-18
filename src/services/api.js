import axios from 'axios';

// JSON Server API configuration
const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const bookAPI = {
  // Get all books
  getAllBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },

  // Add a new book
  addBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  // Update an existing book
  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  // Delete a book
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};

export default api;
