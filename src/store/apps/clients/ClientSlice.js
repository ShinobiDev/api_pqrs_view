import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clients: [],
  currentFilter: 'show_all',
  clientContent: 1,
  editClient: false,
  isLoading: false,
  error: null
};

export const ClientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setVisibilityFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    addClient: (state, action) => {
      const client = {
        ...action.payload,
        starred: false,
        status: { name: 'Activo' }
      };
      state.clients = [client, ...state.clients];
    },
    deleteClient: (state, action) => {
      state.clients = state.clients.filter(client => client.id !== action.payload);
    },
    updateClient: (state, action) => {
      const index = state.clients.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    toggleStarredClient: (state, action) => {
      const client = state.clients.find(c => c.id === action.payload);
      if (client) {
        client.starred = !client.starred;
      }
    },
    setClients: (state, action) => {
      state.clients = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setVisibilityFilter,
  addClient,
  deleteClient,
  updateClient,
  toggleStarredClient,
  setClients,
  setLoading,
  setError
} = ClientSlice.actions;

export default ClientSlice.reducer;