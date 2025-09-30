import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Nav,
  Spinner,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap';
import { setClients, setLoading, setError, toggleStarredClient, deleteClient } from '../../../store/apps/clients/ClientSlice';

// Definición de PropTypes para el objeto client
const clientShape = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  document: PropTypes.string.isRequired,
  starred: PropTypes.bool,
  role: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  document_type: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  status: PropTypes.shape({
    name: PropTypes.string.isRequired
  })
};

// Componente para cada item de la lista
const ClientListItem = ({ client, onClientClick, onDeleteClick, onStarredClick, active }) => {
  return (
    <div 
      className={`p-3 border-bottom d-flex align-items-center contact-item ${active === client.id ? 'bg-light border shadow-sm' : ''}`}
      style={{ 
        cursor: 'pointer',
        width: '100%',
        ...(active === client.id ? {
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '4px',
          transform: 'translateX(4px)',
          transition: 'all 0.2s ease-in-out',
          borderLeft: '4px solid #3699ff'
        } : {})
      }}
    >
      <div className="d-flex align-items-center flex-grow-1" onClick={onClientClick}>
        <div 
          className="rounded-circle me-3 d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ 
            width: '45px', 
            height: '45px',
            backgroundColor: '#f8f9fa'
          }}
        >
          {client.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h6 className="mb-1">{client.name}</h6>
          <small className="text-muted">{client.email}</small>
          <div>
            <small className="text-muted">
              {client.role?.name} | {client.document_type?.name}: {client.document}
            </small>
          </div>
          <span className={`badge ${client.status?.name === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
            {client.status?.name}
          </span>
        </div>
      </div>
      <div className="ms-auto">
        <i 
          className={`bi bi-star${client.starred ? '-fill text-warning' : ''} me-2`}
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation(); // Evitar que se active la selección del cliente
            onStarredClick();
          }}
        />
        <i 
          className="bi bi-trash text-danger"
          style={{ cursor: 'pointer' }}
          onClick={onDeleteClick}
        />
      </div>
    </div>
  );
};

// PropTypes para el componente ClientListItem
ClientListItem.propTypes = {
  client: PropTypes.shape(clientShape).isRequired,
  onClientClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onStarredClick: PropTypes.func.isRequired,
  active: PropTypes.number
};

const ClientList = ({ onClientSelect, selectedClientId }) => {
  const dispatch = useDispatch();
  const { clients, isLoading, error } = useSelector(state => state.clientsReducer || { clients: [], isLoading: false, error: null });
  const [searchText, setSearchText] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    clientToDelete: null,
    isDeleting: false
  });

  const fetchClients = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_URL_API}users/clients`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch(setClients(data));
      if (data && data.length > 0) {
        onClientSelect(data[0].id);
      }
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(`Error fetching clients: ${err.message}`));
    } finally {
      dispatch(setLoading(false));
    }
  }, [onClientSelect]);

  const openDeleteModal = (client) => {
    setDeleteModal({
      isOpen: true,
      clientToDelete: client,
      isDeleting: false
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      clientToDelete: null,
      isDeleting: false
    });
  };

  const confirmDeleteClient = async () => {
    if (!deleteModal.clientToDelete) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch(setError('No authentication token found. Please login again.'));
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_URL_API}users/${deleteModal.clientToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error de servidor! estado: ${response.status}. Respuesta: ${errorText.substring(0, 200)}`);
      }

      const data = await response.json();
      
      // Eliminar el cliente del estado
      dispatch(deleteClient(deleteModal.clientToDelete.id));
      
      // Si el cliente eliminado era el seleccionado, limpiar la selección
      if (selectedClientId === deleteModal.clientToDelete.id) {
        onClientSelect(null);
      }
      
      dispatch(setError(null));
      
      // Cerrar el modal
      closeDeleteModal();
      
      // Opcional: mostrar mensaje de éxito
      console.log(data.message || 'Cliente eliminado exitosamente');
      
    } catch (err) {
      dispatch(setError(`Error al eliminar cliente: ${err.message}`));
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="contact-list-container" style={{ width: '100%' }}>
      {error && (
        <Alert color="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center p-5">
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          <div className="contact-list-header p-3 border-bottom" style={{ width: '100%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar clientes..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <Nav className="contact-list" style={{ width: '100%' }}>
            {(clients || [])
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter(client => 
                client.name.toLowerCase().includes(searchText.toLowerCase()) ||
                client.email.toLowerCase().includes(searchText.toLowerCase()) ||
                client.document.toLowerCase().includes(searchText.toLowerCase())
              )
              .map(client => (
                <ClientListItem
                  key={client.id}
                  client={client}
                  active={selectedClientId}
                  onClientClick={() => onClientSelect(client.id)}
                  onDeleteClick={(e) => {
                    e.stopPropagation(); // Evitar que se active la selección del cliente
                    openDeleteModal(client);
                  }}
                  onStarredClick={() => dispatch(toggleStarredClient(client.id))}
                />
              ))}
          </Nav>
        </>
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={deleteModal.isOpen} toggle={closeDeleteModal} centered>
        <ModalHeader toggle={closeDeleteModal}>
          <i className="bi bi-exclamation-triangle text-warning me-2"></i>
          Confirmar Eliminación
        </ModalHeader>
        <ModalBody>
          {deleteModal.clientToDelete && (
            <div>
              <p className="mb-3">
                ¿Está seguro que desea eliminar al cliente <strong>{deleteModal.clientToDelete.name}</strong>?
              </p>
              <div className="bg-light p-3 rounded mb-3">
                <small className="text-muted">
                  <strong>Email:</strong> {deleteModal.clientToDelete.email}<br/>
                  <strong>Documento:</strong> {deleteModal.clientToDelete.document_type?.name}: {deleteModal.clientToDelete.document}
                </small>
              </div>
              <div className="alert alert-warning small mb-0">
                <i className="bi bi-info-circle me-1"></i>
                Esta acción no se puede deshacer. El cliente será eliminado del sistema.
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button 
            color="secondary" 
            onClick={closeDeleteModal}
            disabled={deleteModal.isDeleting}
          >
            Cancelar
          </Button>
          <Button 
            color="danger" 
            onClick={confirmDeleteClient}
            disabled={deleteModal.isDeleting}
            className="d-flex align-items-center"
          >
            {deleteModal.isDeleting ? (
              <>
                <Spinner size="sm" className="me-2" />
                Eliminando...
              </>
            ) : (
              <>
                <i className="bi bi-trash me-2"></i>
                Eliminar Cliente
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

ClientList.propTypes = {
  onClientSelect: PropTypes.func.isRequired,
  selectedClientId: PropTypes.number
};

export default ClientList;