import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    viewMode: 'table',
    page: 0,
    rowsPerPage: 10,
    searchTerm: '',
    genreFilter: '',
    statusFilter: '',
  },
  reducers: {
    setViewMode(state, action) {
      state.viewMode = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.page = 0;
    },
    setGenreFilter(state, action) {
      state.genreFilter = action.payload;
      state.page = 0;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
      state.page = 0;
    },
    resetFilters(state) {
      state.searchTerm = '';
      state.genreFilter = '';
      state.statusFilter = '';
      state.page = 0;
    },
  },
});

export const { setViewMode, setPage, setSearchTerm, setGenreFilter, setStatusFilter, resetFilters } = uiSlice.actions;

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="mt-16"
            toastClassName="bg-white shadow-medium rounded-lg"
          />
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
