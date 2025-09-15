import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Spinner,
  Alert,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';

const StatesPqrs = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const fetchStates = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_URL_API}statuses`, {
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
      setStates(data);
      setError(null);
    } catch (err) {
      setError(`Error fetching states: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      setEditFormData({ name: '' });
      setError(null);
    }
  };

  const handleEdit = (state) => {
    setSelectedState(state);
    setEditFormData({ name: state.name });
    toggleModal();
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_URL_API}statuses/${selectedState.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedState.id,
          name: editFormData.name
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      toggleModal();
      fetchStates();
    } catch (err) {
      setError(`Error updating state: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este estado?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_URL_API}statuses/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSuccessMessage(data.message);
        fetchStates();
      } catch (err) {
        setError(`Error deleting state: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Estados PQRS</CardTitle>
        
        {error && (
          <Alert color="danger" className="mt-3">
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert color="success" className="mt-3">
            {successMessage}
          </Alert>
        )}

        <div className="table-responsive">
          <Table className="text-nowrap mt-3 align-middle" borderless>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Fecha Creación</th>
                <th>Última Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr key={state.id}>
                  <td>{state.id}</td>
                  <td>{state.name}</td>
                  <td>{new Date(state.created_at).toLocaleDateString()}</td>
                  <td>{new Date(state.updated_at).toLocaleDateString()}</td>
                  <td>
                    <Button
                      color="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(state)}
                    >
                      Editar
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(state.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Editar Estado</ModalHeader>
          <Form onSubmit={handleSubmitEdit}>
            <ModalBody>
              <FormGroup>
                <Label for="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  placeholder="Ingrese el nombre del estado"
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>
                Cancelar
              </Button>
              <Button color="primary" type="submit">
                Guardar
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default StatesPqrs;