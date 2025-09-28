import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clients: [],
  activeClients: [],
  inactiveClients: [],
  deletedClients: [],
  allClients: [],
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
      state.clients = Array.isArray(action.payload) ? action.payload : [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setActiveClients: (state, action) => {
      const clients = Array.isArray(action.payload) ? action.payload : [];
      state.activeClients = clients;
      state.clients = clients; // También actualizar la lista principal
    },
    setInactiveClients: (state, action) => {
      const clients = Array.isArray(action.payload) ? action.payload : [];
      state.inactiveClients = clients;
      state.clients = clients; // También actualizar la lista principal
    },
    setDeletedClients: (state, action) => {
      const clients = Array.isArray(action.payload) ? action.payload : [];
      state.deletedClients = clients;
      state.clients = clients; // También actualizar la lista principal
    },
    setAllClients: (state, action) => {
      const clients = Array.isArray(action.payload) ? action.payload : [];
      state.allClients = clients;
      state.clients = clients; // También actualizar la lista principal
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
  setError,
  setActiveClients,
  setInactiveClients,
  setDeletedClients,
  setAllClients
} = ClientSlice.actions;

export default ClientSlice.reducer;