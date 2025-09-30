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
import { setError } from '../../../store/apps/clients/ClientSlice';
import EditUserClient from './EditUserClient';

// Definición de PropTypes para el objeto user
const userShape = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  document: PropTypes.string.isRequired,
  phone: PropTypes.string,
  type: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  document_type: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  role: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  status: PropTypes.shape({
    name: PropTypes.string.isRequired
  })
};

// Componente para cada item de la lista
const UserClientListItem = ({ user, onUserClick, onDeleteClick, onEditClick, active }) => {
  return (
    <div 
      className={`p-3 border-bottom d-flex align-items-center contact-item ${active === user.id ? 'bg-light border shadow-sm' : ''}`}
      style={{ 
        cursor: 'pointer',
        width: '100%',
        ...(active === user.id ? {
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '4px',
          transform: 'translateX(4px)',
          transition: 'all 0.2s ease-in-out',
          borderLeft: '4px solid #17a2b8'
        } : {})
      }}
    >
      <div className="d-flex align-items-center flex-grow-1" onClick={onUserClick}>
        <div 
          className="rounded-circle me-3 d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ 
            width: '45px', 
            height: '45px',
            backgroundColor: '#e3f2fd'
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h6 className="mb-1">{user.name}</h6>
          <small className="text-muted">{user.email}</small>
          <div>
            <small className="text-muted">
              {user.role?.name} | {user.document_type?.name}: {user.document}
            </small>
          </div>
          <span className={`badge ${user.status?.name === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
            {user.status?.name}
          </span>
        </div>
      </div>
      <div className="ms-auto d-flex gap-2">
        <i 
          className="bi bi-pencil text-primary"
          style={{ cursor: 'pointer' }}
          onClick={onEditClick}
          title="Editar usuario"
        />
        <i 
          className="bi bi-trash text-danger"
          style={{ cursor: 'pointer' }}
          onClick={onDeleteClick}
          title="Eliminar usuario"
        />
      </div>
    </div>
  );
};

// PropTypes para el componente UserClientListItem
UserClientListItem.propTypes = {
  user: PropTypes.shape(userShape).isRequired,
  onUserClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  active: PropTypes.number
};

const UsersClientList = ({ clientId, onUserSelect, selectedUserId, onBack }) => {
  const dispatch = useDispatch();
  const { error } = useSelector(state => state.clientsReducer || { error: null });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userToDelete: null,
    isDeleting: false
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    userToEdit: null
  });
  const [successMessage, setSuccessMessage] = useState('');

  const fetchClientUsers = useCallback(async () => {
    if (!clientId) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch(setError('No authentication token found. Please login again.'));
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_URL_API}users/client/${clientId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (!responseData.success) {
        throw new Error(responseData.message || 'Error al obtener usuarios del cliente');
      }

      setUsers(responseData.data || []);
      if (responseData.data && responseData.data.length > 0 && onUserSelect) {
        onUserSelect(responseData.data[0].id);
      }
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(`Error fetching client users: ${err.message}`));
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [clientId, onUserSelect, dispatch]);

  const openDeleteModal = (user) => {
    setDeleteModal({
      isOpen: true,
      userToDelete: user,
      isDeleting: false
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      userToDelete: null,
      isDeleting: false
    });
    setSuccessMessage('');
  };

  const openEditModal = (user) => {
    setEditModal({
      isOpen: true,
      userToEdit: user
    });
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      userToEdit: null
    });
  };

  const handleUserUpdated = (updatedUser) => {
    // Update the user in the local state
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    
    setSuccessMessage('Usuario actualizado exitosamente');
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const confirmDeleteUser = async () => {
    if (!deleteModal.userToDelete) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch(setError('No authentication token found. Please login again.'));
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_URL_API}users/${deleteModal.userToDelete.id}`, {
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
      
      // Eliminar el usuario de la lista local
      setUsers(prevUsers => prevUsers.filter(user => user.id !== deleteModal.userToDelete.id));
      
      // Si el usuario eliminado era el seleccionado, limpiar la selección
      if (selectedUserId === deleteModal.userToDelete.id && onUserSelect) {
        onUserSelect(null);
      }
      
      dispatch(setError(null));
      
      // Cerrar el modal
      closeDeleteModal();
      
      // Mostrar mensaje de éxito
      setSuccessMessage(data.message || 'Usuario eliminado exitosamente');
      
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (err) {
      dispatch(setError(`Error al eliminar usuario: ${err.message}`));
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  useEffect(() => {
    fetchClientUsers();
  }, [fetchClientUsers]);

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="contact-list-container" style={{ width: '100%' }}>
      {/* Modal de edición de usuario */}
      <EditUserClient
        isOpen={editModal.isOpen}
        toggle={closeEditModal}
        userId={editModal.userToEdit?.id}
        clientId={clientId}
        onUserUpdated={handleUserUpdated}
      />

      {error && (
        <Alert color="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert 
          color="success" 
          className="mb-3 d-flex align-items-center justify-content-between"
          toggle={() => setSuccessMessage('')}
        >
          <div>
            <i className="bi bi-check-circle me-2"></i>
            {successMessage}
          </div>
        </Alert>
      )}

      <div className="contact-list-header p-3 border-bottom d-flex align-items-center justify-content-between" style={{ width: '100%' }}>
        <Button color="secondary" size="sm" onClick={onBack}>
          <i className="bi bi-arrow-left me-1"></i>
          Volver a Clientes
        </Button>
        <h6 className="mb-0">Usuarios del Cliente</h6>
      </div>

      <div className="contact-list-header p-3 border-bottom" style={{ width: '100%' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar usuarios..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <Nav className="contact-list" style={{ width: '100%' }}>
        {users
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(user => 
            user.name.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            user.document.toLowerCase().includes(searchText.toLowerCase())
          )
          .map(user => (
            <UserClientListItem
              key={user.id}
              user={user}
              active={selectedUserId}
              onUserClick={() => onUserSelect && onUserSelect(user.id)}
              onEditClick={(e) => {
                e.stopPropagation();
                openEditModal(user);
              }}
              onDeleteClick={(e) => {
                e.stopPropagation();
                openDeleteModal(user);
              }}
            />
          ))}
      </Nav>

      {users.length === 0 && !isLoading && (
        <div className="text-center text-muted p-4">
          <i className="bi bi-people" style={{ fontSize: '2rem' }}></i>
          <p className="mt-2">No hay usuarios para este cliente</p>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={deleteModal.isOpen} toggle={closeDeleteModal} centered>
        <ModalHeader toggle={closeDeleteModal}>
          <i className="bi bi-exclamation-triangle text-warning me-2"></i>
          Confirmar Eliminación
        </ModalHeader>
        <ModalBody>
          {deleteModal.userToDelete && (
            <div>
              <p className="mb-3">
                ¿Está seguro que desea eliminar al usuario <strong>{deleteModal.userToDelete.name}</strong>?
              </p>
              <div className="bg-light p-3 rounded mb-3">
                <small className="text-muted">
                  <strong>Email:</strong> {deleteModal.userToDelete.email}<br/>
                  <strong>Documento:</strong> {deleteModal.userToDelete.document_type?.name}: {deleteModal.userToDelete.document}
                </small>
              </div>
              <div className="alert alert-warning small mb-0">
                <i className="bi bi-info-circle me-1"></i>
                Esta acción no se puede deshacer. El usuario será eliminado del sistema.
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
            onClick={confirmDeleteUser}
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
                Eliminar Usuario
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

UsersClientList.propTypes = {
  clientId: PropTypes.number.isRequired,
  onUserSelect: PropTypes.func,
  selectedUserId: PropTypes.number,
  onBack: PropTypes.func.isRequired,
};

export default UsersClientList;