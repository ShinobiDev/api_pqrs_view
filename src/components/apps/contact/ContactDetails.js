import React, { useState, useEffect } from 'react';
import { Button, Input, Spinner, Alert } from 'reactstrap';
import PropTypes from 'prop-types';

const ContactDetails = ({ selectedUserId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  // Cargar los detalles del usuario cuando cambia la selección
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!selectedUserId) {
        setUser(null);
        setError('No se ha seleccionado ningún usuario');
        return;
      }
      
      // Validar que el ID sea un número válido
      if (!Number.isInteger(selectedUserId) || selectedUserId <= 0) {
        setError('ID de usuario inválido');
        setUser(null);
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const apiUrl = `${process.env.REACT_APP_URL_API}users/${selectedUserId}`;
        console.log('Intentando obtener usuario de:', apiUrl);
        
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
        
        // Procesar los datos recibidos
        const processedUser = {
          ...data,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          document: data.document || '',
          role: data.role || null,
          document_type: data.document_type || null,
          status: data.status || null
        };
        
        setUser(processedUser);
        setEditedUser(processedUser);
        setError(null);
      } catch (err) {
        console.error('Error al cargar usuario:', err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [selectedUserId]);

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_URL_API}users/${selectedUserId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser)
      });

      if (!response.ok) throw new Error('Error al actualizar el usuario');
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
    } catch (errorActualizar) {
      console.error('Error al actualizar:', errorActualizar);
      setError(`Error al actualizar usuario: ${errorActualizar.message}`);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="h-100 p-4">
      {error && (
        <Alert color="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      ) : !user ? (
        <div className="text-center text-muted">
          <i className="bi bi-person-circle" style={{ fontSize: '3rem' }}></i>
          <p className="mt-2">Por favor, seleccione un usuario</p>
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
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="mx-2">
              <h5 className="mb-0">{user.name}</h5>
              <small>{user.role?.name}</small>
            </div>
          </div>

          <div className="p-4">
            {!isEditing ? (
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td width="150">
                      <h6>Nombre</h6>
                    </td>
                    <td>: {user.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Email</h6>
                    </td>
                    <td>: {user.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Teléfono</h6>
                    </td>
                    <td>: {user.phone}</td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Rol</h6>
                    </td>
                    <td>: {user.role?.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Tipo Documento</h6>
                    </td>
                    <td>: {user.document_type?.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Documento</h6>
                    </td>
                    <td>: {user.document}</td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Estado</h6>
                    </td>
                    <td>
                      <span className={`badge ${user.status?.name === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                        {user.status?.name}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <Button color="primary" onClick={() => setIsEditing(true)}>
                        Editar Usuario
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
                        value={editedUser.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
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
                        value={editedUser.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Teléfono</h6>
                    </td>
                    <td>
                      <Input
                        type="text"
                        name="phone"
                        value={editedUser.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Documento</h6>
                    </td>
                    <td>
                      <Input
                        type="text"
                        name="document"
                        value={editedUser.document}
                        onChange={(e) => handleInputChange('document', e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <Button color="success" className="me-2" onClick={handleUpdateUser}>
                        Guardar
                      </Button>
                      <Button color="secondary" onClick={() => {
                        setIsEditing(false);
                        setEditedUser(user);
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
  );
};

ContactDetails.propTypes = {
  selectedUserId: PropTypes.number
};

export default ContactDetails;
