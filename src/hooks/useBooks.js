import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookAPI } from '../services/api';
import { toast } from 'react-toastify';

export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: bookAPI.getAllBooks,
    onError: (error) => {
      toast.error('Failed to fetch books');
      console.error('Error fetching books:', error);
    },
  });
};

export const useAddBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bookAPI.addBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      toast.success('Book added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add book');
      console.error('Error adding book:', error);
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => bookAPI.updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      toast.success('Book updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update book');
      console.error('Error updating book:', error);
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bookAPI.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      toast.success('Book deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete book');
      console.error('Error deleting book:', error);
    },
  });
};
