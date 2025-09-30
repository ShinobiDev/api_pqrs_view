import React, { useState, useEffect } from 'react';
import { Button, Input, Spinner, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { updateClient } from '../../../store/apps/clients/ClientSlice';
import CreateUserModal from './CreateUserModal';
import UsersClientList from './UsersClientList';

const ClientDetails = ({ selectedClientId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: null, type: null });
  const [client, setClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [showUsersView, setShowUsersView] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchDocumentTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticación no encontrado");
      }

      const response = await fetch(`${process.env.REACT_APP_URL_API}users/form-data/client`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error de servidor! estado: ${response.status}`);
      }

      const data = await response.json();
      setDocumentTypes(data);
    } catch (err) {
      setAlert({
        message: `Error al cargar tipos de documento: ${err.message}`,
        type: 'danger'
      });
    }
  };

  useEffect(() => {
    if (isEditing) {
      fetchDocumentTypes();
    }
  }, [isEditing]);

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!selectedClientId) {
        setClient(null);
        setShowUsersView(false); // Resetear vista de usuarios cuando no hay cliente seleccionado
        setAlert({
          message: 'No se ha seleccionado ningún cliente',
          type: 'warning'
        });
        return;
      }
      
      if (!Number.isInteger(selectedClientId) || selectedClientId <= 0) {
        setAlert({
          message: 'ID de cliente inválido',
          type: 'danger'
        });
        setClient(null);
        setShowUsersView(false); // Resetear vista de usuarios
        return;
      }

      setLoading(true);
      setShowUsersView(false); // Resetear vista de usuarios cuando cambia el cliente
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const apiUrl = `${process.env.REACT_APP_URL_API}users/${selectedClientId}`;
        console.log('Intentando obtener cliente de:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          let errorMessage;
          try {
            const errorBody = await response.json();
            errorMessage = errorBody.message || response.statusText;
          } catch {
            errorMessage = response.statusText;
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        if (!data || !data.id) {
          throw new Error('Respuesta inválida del servidor');
        }
        
        const processedClient = {
          ...data,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          document: data.document || '',
          role: { ...data.role, id: 4 }, // Forzar rol 4 (Cliente)
          role_id: 4, // Forzar rol 4 (Cliente)
          document_type: data.document_type || null,
          status: data.status || null
        };
        
        setClient(processedClient);
        setEditedClient(processedClient);
        setSelectedUserId(null); // Resetear usuario seleccionado
        setAlert({ message: null, type: null });
      } catch (err) {
        console.error('Error al cargar cliente:', err);
        setAlert({
          message: err.message,
          type: 'danger'
        });
        setClient(null);
        setShowUsersView(false); // Resetear vista de usuarios en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [selectedClientId]);

  const handleUpdateClient = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const requestBody = {
        name: editedClient.name,
        user_type_id: editedClient.user_type_id || 7,
        document_type_id: editedClient.document_type_id,
        document: editedClient.document,
        role_id: 4, // Siempre rol 4 (Cliente)
        email: editedClient.email,
        phone: editedClient.phone,
        status_id: editedClient.status_id || 1,
        ...(editedClient.password && editedClient.password.length >= 8 ? { password: editedClient.password } : {})
      };

      const response = await fetch(`${process.env.REACT_APP_URL_API}users/${selectedClientId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el cliente');
      }
      
      dispatch(updateClient(data.user));
      setClient(data.user);
      setIsEditing(false);
      setAlert({ message: null, type: null });
      setAlert({
        message: data.message || 'Usuario actualizado exitosamente',
        type: 'success'
      });
    } catch (err) {
      console.error('Error al actualizar:', err);
      setAlert({
        message: `Error al actualizar cliente: ${err.message}`,
        type: 'danger'
      });
    }
  };

  const handleInputChange = (field, value) => {
    setEditedClient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewUsers = () => {
    setShowUsersView(true);
  };

  const handleBackToClientDetails = () => {
    setShowUsersView(false);
    setSelectedUserId(null);
  };

  return (
    <div className="h-100">
      {client && (
        <CreateUserModal
          isOpen={isCreateUserModalOpen}
          toggle={() => setIsCreateUserModalOpen(false)}
          clientId={client.id}
          clientName={client.name}
        />
      )}
      
      {showUsersView && client ? (
        <UsersClientList
          clientId={client.id}
          onUserSelect={setSelectedUserId}
          selectedUserId={selectedUserId}
          onBack={handleBackToClientDetails}
        />
      ) : (
        <div className="p-4">
          {alert.message && (
            <Alert color={alert.type} className="mb-4">
              {alert.message}
            </Alert>
          )}
          
          {loading ? (
            <div className="text-center">
              <Spinner color="primary" />
            </div>
          ) : !client ? (
            <div className="text-center text-muted">
              <i className="bi bi-person-circle" style={{ fontSize: '3rem' }}></i>
              <p className="mt-2">Por favor, seleccione un cliente</p>
            </div>
          ) : (
        <div>
          <div className="d-flex align-items-center p-3 border-bottom">
            <div className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: '46px',
                height: '46px',
                backgroundColor: '#f8f9fa'
              }}>
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div className="mx-2">
              <h5 className="mb-0">{client.name}</h5>
              <small>{client.role?.name}</small>
            </div>
          </div>

          <div className="p-4">
            {!isEditing ? (
            <>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td width="150">
                      <h6>Nombre</h6>
                    </td>
                    <td>: {client.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Email</h6>
                    </td>
                    <td>: {client.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Teléfono</h6>
                    </td>
                    <td>: {client.phone}</td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Rol</h6>
                    </td>
                    <td>: {client.role?.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Tipo Documento</h6>
                    </td>
                    <td>: {client.document_type?.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Documento</h6>
                    </td>
                    <td>: {client.document}</td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Estado</h6>
                    </td>
                    <td>
                      <span className={`badge ${client.status?.name === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                        {client.status?.name}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <Button color="primary" onClick={() => setIsEditing(true)}>
                          Editar Cliente
                        </Button>
                        <Button color="success" onClick={() => setIsCreateUserModalOpen(true)} disabled={!client}>
                          Crear Nuevo Usuario
                        </Button>
                        <Button color="info" onClick={() => handleViewUsers()} disabled={!client}>
                          <i className="bi bi-people me-1"></i>
                          Ver Usuarios
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
            ) : (
              <table className="table table-borderless align-middle">
                <tbody>
                  <tr>
                    <td width="150">
                      <h6>Nombre</h6>
                    </td>
                    <td>
                      <Input
                        type="text"
                        name="name"
                        value={editedClient.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        maxLength={100}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Tipo Documento</h6>
                    </td>
                    <td>
                      <Input
                        type="select"
                        name="document_type_id"
                        value={editedClient.document_type_id}
                        onChange={(e) => handleInputChange('document_type_id', e.target.value)}
                      >
                        <option value="">Seleccione...</option>
                        {documentTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </Input>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Documento</h6>
                    </td>
                    <td>
                      <Input
                        type="number"
                        name="document"
                        value={editedClient.document}
                        onChange={(e) => handleInputChange('document', e.target.value)}
                        maxLength={12}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Email</h6>
                    </td>
                    <td>
                      <Input
                        type="email"
                        name="email"
                        value={editedClient.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Teléfono</h6>
                    </td>
                    <td>
                      <Input
                        type="number"
                        name="phone"
                        value={editedClient.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        maxLength={10}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Contraseña</h6>
                    </td>
                    <td>
                      <Input
                        type="password"
                        name="password"
                        placeholder="Dejar vacío para mantener la contraseña actual"
                        value={editedClient.password || ''}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        minLength={8}
                      />
                      {editedClient.password && editedClient.password.length > 0 && editedClient.password.length < 8 && (
                        <small className="text-danger">
                          La contraseña debe tener al menos 8 caracteres
                        </small>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Estado</h6>
                    </td>
                    <td>
                      <Input
                        type="select"
                        name="status_id"
                        value={editedClient.status_id}
                        onChange={(e) => handleInputChange('status_id', e.target.value)}
                      >
                        <option value="1">Activo</option>
                        <option value="2">Inactivo</option>
                      </Input>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <Button color="success" className="me-2" onClick={handleUpdateClient}>
                        Guardar
                      </Button>
                      <Button color="secondary" onClick={() => {
                        setIsEditing(false);
                        setEditedClient(client);
                      }}>
                        Cancelar
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
};

ClientDetails.propTypes = {
  selectedClientId: PropTypes.number
};

export default ClientDetails;