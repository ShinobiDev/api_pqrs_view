import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Spinner,
  Alert
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import EditTypeModal from './EditTypeModal';
import CreateTypeModal from './CreateTypeModal';

const TypesPqrs = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const fetchTypes = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_URL_API}types`, {
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
      setTypes(data);
      setError(null);
    } catch (err) {
      setError(`Error fetching types: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClear = () => {
    setFilterText('');
    setResetPaginationToggle(!resetPaginationToggle);
  };

  // Estilos personalizados para el DataTable
  const customStyles = {
    rows: {
      style: {
        minHeight: '60px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
  };

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const toggleCreateModal = () => {
    setCreateModalOpen(!createModalOpen);
    setError(null);
  };

  const handleCreateSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_URL_API}types`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setSuccessMessage(`Tipo "${responseData.name}" creado exitosamente`);
      toggleCreateModal();
      fetchTypes();
    } catch (err) {
      setError(`Error creating type: ${err.message}`);
    }
  };

  const handleEdit = (type) => {
    setSelectedType(type);
    setEditModalOpen(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este tipo?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_URL_API}types/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setSuccessMessage('Tipo eliminado exitosamente');
        fetchTypes();
      } catch (err) {
        setError(`Error deleting type: ${err.message}`);
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
        <div className="d-flex justify-content-between align-items-center">
          <CardTitle tag="h4">Tipos PQRS</CardTitle>
          <Button color="primary" onClick={toggleCreateModal}>
            Crear Nuevo
          </Button>
        </div>
        
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

        <div className="mt-4">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Filtrar por nombre..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
          {filterText && (
            <Button color="secondary" className="mb-3" onClick={handleClear}>
              Limpiar
            </Button>
          )}
        </div>

        <DataTable
          columns={[
            {
              name: 'ID',
              selector: row => row.id,
              sortable: true,
              width: '100px'
            },
            {
              name: 'Nombre',
              selector: row => row.name,
              sortable: true,
              grow: 2
            },
            {
              name: 'Fecha Creación',
              selector: row => row.created_at,
              sortable: true,
              format: row => new Date(row.created_at).toLocaleDateString()
            },
            {
              name: 'Última Actualización',
              selector: row => row.updated_at,
              sortable: true,
              format: row => new Date(row.updated_at).toLocaleDateString()
            },
            {
              name: 'Acciones',
              cell: row => (
                <>
                  <Button
                    color="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(row)}
                  >
                    Editar
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(row.id)}
                  >
                    Eliminar
                  </Button>
                </>
              ),
              width: '200px'
            }
          ]}
          data={types.filter(
            item => item.name.toLowerCase().includes(filterText.toLowerCase())
          )}
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          persistTableHead
          customStyles={customStyles}
          highlightOnHover
          pointerOnHover
          responsive
          striped
          noDataComponent={<div className="p-4">No hay registros para mostrar</div>}
        />

        <EditTypeModal
          isOpen={editModalOpen}
          toggle={() => setEditModalOpen(!editModalOpen)}
          type={selectedType}
          onSubmit={async (formData) => {
            try {
              const token = localStorage.getItem('token');
              const response = await fetch(`${process.env.REACT_APP_URL_API}types/${selectedType.id}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const responseData = await response.json();
              setSuccessMessage(`Tipo "${responseData.name}" actualizado exitosamente`);
              setEditModalOpen(false);
              fetchTypes();
            } catch (err) {
              setError(`Error updating type: ${err.message}`);
            }
          }}
        />

        <CreateTypeModal
          isOpen={createModalOpen}
          toggle={toggleCreateModal}
          onSubmit={handleCreateSubmit}
        />
      </CardBody>
    </Card>
  );
};

export default TypesPqrs;