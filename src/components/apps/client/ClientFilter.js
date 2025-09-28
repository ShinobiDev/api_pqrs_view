import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListGroup, ListGroupItem, Button, Modal, ModalHeader, Alert } from 'reactstrap';
import * as ClientActions from '../../../store/apps/clients/ClientSlice';
import ClientAdd from './ClientAdd';

const ClientFilter = () => {
  const dispatch = useDispatch();
  const active = useSelector((state) => state.clientsReducer.currentFilter);
  const error = useSelector((state) => state.clientsReducer.error);
  const [modal, setModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  // Función para obtener clientes activos
  const fetchActiveClients = async () => {
    setLoading(true);
    dispatch(ClientActions.setError(null));
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch(`${process.env.REACT_APP_URL_API}users/clients/active`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener clientes activos');
      }

      // Almacenar los clientes activos en el store
      dispatch(ClientActions.setActiveClients(data.data || []));
      console.log('Clientes activos obtenidos:', data.data);
      
    } catch (err) {
      console.error('Error fetching active clients:', err);
      dispatch(ClientActions.setError(`Error al obtener clientes activos: ${err.message}`));
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener clientes inactivos
  const fetchInactiveClients = async () => {
    setLoading(true);
    dispatch(ClientActions.setError(null));
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch(`${process.env.REACT_APP_URL_API}users/clients/inactive`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener clientes inactivos');
      }

      // Almacenar los clientes inactivos en el store
      dispatch(ClientActions.setInactiveClients(data.data || []));
      console.log('Clientes inactivos obtenidos:', data.data);
      
    } catch (err) {
      console.error('Error fetching inactive clients:', err);
      dispatch(ClientActions.setError(`Error al obtener clientes inactivos: ${err.message}`));
    } finally {
      setLoading(false);
    }
  };

  // Handler para el filtro de activos
  const handleActiveFilter = () => {
    dispatch(ClientActions.setVisibilityFilter('show_all'));
    fetchActiveClients();
  };

  // Función para obtener clientes eliminados
  const fetchDeletedClients = async () => {
    setLoading(true);
    dispatch(ClientActions.setError(null));
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch(`${process.env.REACT_APP_URL_API}users/clients/deleted`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener clientes eliminados');
      }

      // Almacenar los clientes eliminados en el store
      dispatch(ClientActions.setDeletedClients(data.data || []));
      console.log('Clientes eliminados obtenidos:', data.data);
      
    } catch (err) {
      console.error('Error fetching deleted clients:', err);
      dispatch(ClientActions.setError(`Error al obtener clientes eliminados: ${err.message}`));
    } finally {
      setLoading(false);
    }
  };

  // Handler para el filtro de inactivos
  const handleInactiveFilter = () => {
    dispatch(ClientActions.setVisibilityFilter('frequent_client'));
    fetchInactiveClients();
  };

  // Función para obtener todos los clientes
  const fetchAllClients = async () => {
    setLoading(true);
    dispatch(ClientActions.setError(null));
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch(`${process.env.REACT_APP_URL_API}users/clients/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener todos los clientes');
      }

      // La API retorna un objeto con active, inactive, deleted
      // Necesitamos combinar todos los arrays en uno solo
      const allClientsArray = [];
      
      if (data.data) {
        if (Array.isArray(data.data.active)) {
          allClientsArray.push(...data.data.active);
        }
        if (Array.isArray(data.data.inactive)) {
          allClientsArray.push(...data.data.inactive);
        }
        if (Array.isArray(data.data.deleted)) {
          allClientsArray.push(...data.data.deleted);
        }
      }

      // Almacenar todos los clientes combinados en el store
      dispatch(ClientActions.setAllClients(allClientsArray));
      console.log('Todos los clientes obtenidos:', {
        combined: allClientsArray,
        original: data.data,
        counts: data.data?.counts
      });
      
    } catch (err) {
      console.error('Error fetching all clients:', err);
      dispatch(ClientActions.setError(`Error al obtener todos los clientes: ${err.message}`));
    } finally {
      setLoading(false);
    }
  };

  // Handler para el filtro de eliminados
  const handleDeletedFilter = () => {
    dispatch(ClientActions.setVisibilityFilter('deleted_client'));
    fetchDeletedClients();
  };

  // Handler para el filtro de todos
  const handleAllFilter = () => {
    dispatch(ClientActions.setVisibilityFilter('starred_client'));
    fetchAllClients();
  };

  return (
    <>
      <div className="p-3 border-bottom">
        <Button color="danger" block onClick={toggle}>
          Crear nuevo cliente
        </Button>
      </div>
      
      {error && (
        <div className="p-3">
          <Alert color="danger" className="mb-0">
            {error}
          </Alert>
        </div>
      )}
      <ListGroup flush>
        <h6 className="px-3 pt-3">Filtros </h6>
        <ListGroupItem
          href="#"
          tag="a"
          className={active === 'show_all' ? 'bg-light py-3 border-0' : 'py-3 border-0'}
          onClick={handleActiveFilter}
          disabled={loading}
        >
          <i className="bi bi-people mx-1" /> 
          {loading && active === 'show_all' ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Cargando...
            </>
          ) : (
            'Activos'
          )}
        </ListGroupItem>
        <ListGroupItem
          href="#"
          tag="a"
          className={active === 'frequent_client' ? 'bg-light py-3 border-0' : 'py-3 border-0'}
          onClick={handleInactiveFilter}
          disabled={loading}
        >
          <i className="bi bi-bezier mx-1" /> 
          {loading && active === 'frequent_client' ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Cargando...
            </>
          ) : (
            'Inactivos'
          )}
        </ListGroupItem>
        <ListGroupItem
          href="#"
          tag="a"
          className={active === 'deleted_client' ? 'bg-light py-3 border-0' : 'py-3 border-0'}
          onClick={handleDeletedFilter}
          disabled={loading}
        >
          <i className="bi bi-trash mx-1" /> 
          {loading && active === 'deleted_client' ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Cargando...
            </>
          ) : (
            'Eliminados'
          )}
        </ListGroupItem>
        <ListGroupItem
          href="#"
          tag="a"
          className={active === 'starred_client' ? 'bg-light py-3 border-0' : 'py-3 border-0'}
          onClick={handleAllFilter}
          disabled={loading}
        >
          <i className="bi bi-star mx-1" /> 
          {loading && active === 'starred_client' ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Cargando...
            </>
          ) : (
            'Todos'
          )}
        </ListGroupItem>
      </ListGroup>
      
      {/***********Client Add Box**************/}
      <Modal isOpen={modal} toggle={toggle} size="md">
        <ModalHeader toggle={toggle}>Nuevo cliente</ModalHeader>
        <ClientAdd click={toggle} />
      </Modal>
      {/***********Client Add Box End**************/}
    </>
  );
};

export default ClientFilter;