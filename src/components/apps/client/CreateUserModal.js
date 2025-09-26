import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Row,
  Col
} from 'reactstrap';

const CreateUserModal = ({ isOpen, toggle, clientId, clientName }) => {
  const [alert, setAlert] = useState({ message: null, type: null });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    documentTypes: [],
    roles: [],
    statuses: []
  });
  const [values, setValues] = useState({
    name: "",
    document_type_id: "",
    document: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    client_id: clientId,
    user_type_id: 11, // Usuario de cliente
    role_id: "",
    status_id: ""
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmation: false
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token de autenticación no encontrado");
        }

        const response = await fetch(`${process.env.REACT_APP_URL_API}users/form-data/users`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error(`Error de servidor! estado: ${response.status}`);
        }

        const responseData = await response.json();
        
        if (!responseData.success) {
          throw new Error("Error al obtener los datos del formulario");
        }

        setFormData({
          documentTypes: responseData.data?.tipos || [],
          roles: responseData.data?.roles || [],
          statuses: responseData.data?.estados || []
        });

        // Establecer valores por defecto
        setValues(prev => ({
          ...prev,
          client_id: clientId,
          status_id: "1" // Activo por defecto
        }));
      } catch (err) {
        setAlert({
          message: `Error al cargar datos del formulario: ${err.message}`,
          type: 'danger'
        });
      }
    };

    if (isOpen) {
      fetchFormData();
    }
  }, [isOpen, clientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticación no encontrado");
      }

      // Preparar el body de la petición
      const requestBody = {
        user_type_id: 11,
        name: values.name,
        document_type_id: values.document_type_id,
        document: values.document,
        role_id: values.role_id,
        email: values.email,
        phone: values.phone,
        status_id: values.status_id,
        password: values.password,
        client_id: clientId
      };

      const response = await fetch(`${process.env.REACT_APP_URL_API}users`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error de servidor! estado: ${response.status}`);
      }

      setAlert({
        message: data.message || 'Usuario creado exitosamente',
        type: 'success'
      });

      setTimeout(() => {
        toggle();
      }, 2000);
    } catch (err) {
      setAlert({
        message: err.message,
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        Crear Usuario para Cliente: {clientName}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {alert.message && (
            <Alert color={alert.type} className="mb-4">
              {alert.message}
            </Alert>
          )}
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="name">Nombre</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={values.name}
                  onChange={(e) => {
                    if (e.target.value.length <= 100) {
                      setValues({ ...values, name: e.target.value });
                    }
                  }}
                  maxLength={100}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="document_type_id">Tipo de Documento</Label>
                <Input
                  type="select"
                  name="document_type_id"
                  id="document_type_id"
                  value={values.document_type_id}
                  onChange={(e) => setValues({ ...values, document_type_id: e.target.value })}
                  required
                >
                  <option value="">Seleccione...</option>
                  {formData.documentTypes && formData.documentTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="document">Documento</Label>
                <Input
                  type="number"
                  name="document"
                  id="document"
                  value={values.document}
                  onChange={(e) => {
                    if (e.target.value.length <= 12) {
                      setValues({ ...values, document: e.target.value });
                    }
                  }}
                  max="999999999999"
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={values.email}
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                  pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="role_id">Rol</Label>
                <Input
                  type="select"
                  name="role_id"
                  id="role_id"
                  value={values.role_id}
                  onChange={(e) => setValues({ ...values, role_id: e.target.value })}
                  required
                >
                  <option value="">Seleccione...</option>
                  {formData.roles && formData.roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="status_id">Estado</Label>
                <Input
                  type="select"
                  name="status_id"
                  id="status_id"
                  value={values.status_id}
                  onChange={(e) => setValues({ ...values, status_id: e.target.value })}
                  required
                >
                  <option value="">Seleccione...</option>
                  {formData.statuses && formData.statuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="password">Contraseña</Label>
                <div className="input-group">
                  <Input
                    type={showPassword.password ? "text" : "password"}
                    name="password"
                    id="password"
                    value={values.password}
                    onChange={(e) => setValues({ ...values, password: e.target.value })}
                    minLength={8}
                    required
                  />
                  <Button
                    type="button"
                    color="secondary"
                    onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}
                  >
                    <i className={`bi bi-eye${showPassword.password ? '-slash' : ''}`}></i>
                  </Button>
                </div>
                {values.password && values.password.length > 0 && values.password.length < 8 && (
                  <small className="text-danger">
                    La contraseña debe tener al menos 8 caracteres
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="password_confirmation">Confirmar Contraseña</Label>
                <div className="input-group">
                  <Input
                    type={showPassword.confirmation ? "text" : "password"}
                    name="password_confirmation"
                    id="password_confirmation"
                    value={values.password_confirmation}
                    onChange={(e) => setValues({ ...values, password_confirmation: e.target.value })}
                    minLength={8}
                    required
                  />
                  <Button
                    type="button"
                    color="secondary"
                    onClick={() => setShowPassword({ ...showPassword, confirmation: !showPassword.confirmation })}
                  >
                    <i className={`bi bi-eye${showPassword.confirmation ? '-slash' : ''}`}></i>
                  </Button>
                </div>
                {values.password_confirmation && values.password !== values.password_confirmation && (
                  <small className="text-danger">
                    Las contraseñas no coinciden
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="phone">Teléfono</Label>
                <Input
                  type="number"
                  name="phone"
                  id="phone"
                  value={values.phone}
                  onChange={(e) => {
                    if (e.target.value.length <= 10) {
                      setValues({ ...values, phone: e.target.value });
                    }
                  }}
                  max="9999999999"
                  required
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
          <Button
            color="primary"
            type="submit"
            disabled={loading || !values.name || !values.document_type_id || !values.document || 
                     !values.email || !values.phone || !values.password || values.password.length < 8 ||
                     !values.role_id || !values.status_id || !values.password_confirmation ||
                     values.password !== values.password_confirmation}
          >
            {loading ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

CreateUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  clientId: PropTypes.number.isRequired,
  clientName: PropTypes.string.isRequired
};

export default CreateUserModal;