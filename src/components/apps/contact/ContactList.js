import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Nav,
  Spinner,
  Alert
} from 'reactstrap';

// Definición de PropTypes para el objeto user
const userShape = {
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
const ContactListItem = ({ user, onContactClick, onDeleteClick, onStarredClick, active }) => {
  return (
    <div 
      className={`p-3 border-bottom d-flex align-items-center contact-item ${active === user.id ? 'selected' : ''}`}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex align-items-center" onClick={onContactClick}>
        <div 
          className="rounded-circle me-3 d-flex align-items-center justify-content-center"
          style={{ 
            width: '45px', 
            height: '45px',
            backgroundColor: '#f8f9fa'
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
      <div className="ms-auto">
        <i 
          className={`bi bi-star${user.starred ? '-fill text-warning' : ''} me-2`}
          onClick={onStarredClick}
        />
        <i 
          className="bi bi-trash text-danger"
          onClick={onDeleteClick}
        />
      </div>
    </div>
  );
};

// PropTypes para el componente ContactListItem
ContactListItem.propTypes = {
  user: PropTypes.shape(userShape).isRequired,
  onContactClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onStarredClick: PropTypes.func.isRequired,
  active: PropTypes.number
};

const ContactList = ({ onUserSelect, selectedUserId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [starredUsers, setStarredUsers] = useState(new Set());

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_URL_API}users`, {
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
      setUsers(data);
      // Seleccionar automáticamente el primer usuario si existe
      if (data && data.length > 0) {
        onUserSelect(data[0].id);
      }
      setError(null);
    } catch (err) {
      setError(`Error fetching users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="contact-list-container">
      {error && (
        <Alert color="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center p-5">
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          <div className="contact-list-header p-3 border-bottom">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar usuarios..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <Nav className="contact-list">
            {users
              .filter(user => 
                user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                user.document.toLowerCase().includes(searchText.toLowerCase())
              )
              .map(user => (
                <ContactListItem
                  key={user.id}
                  user={user}
                  active={selectedUserId}
                  onContactClick={() => onUserSelect(user.id)}
                  onDeleteClick={() => {/* Función para eliminar */}}
                  onStarredClick={() => {
                    const newStarred = new Set(starredUsers);
                    if (newStarred.has(user.id)) {
                      newStarred.delete(user.id);
                    } else {
                      newStarred.add(user.id);
                    }
                    setStarredUsers(newStarred);
                  }}
                />
              ))}
          </Nav>
        </>
      )}
    </div>
  );
};

ContactList.propTypes = {
  onUserSelect: PropTypes.func.isRequired,
  selectedUserId: PropTypes.number
};

export default ContactList;

