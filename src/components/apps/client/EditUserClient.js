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
  Col,
  Spinner
} from 'reactstrap';

const EditUserClient = ({ isOpen, toggle, userId, clientId, onUserUpdated }) => {
  const [alert, setAlert] = useState({ message: null, type: null });
  const [loading, setLoading] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(false);
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
    user_type_id: 11, // Usuario de cliente
    role_id: "",
    status_id: "",
    client_id: ""
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmation: false
  });

  // Fetch user data when modal opens
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isOpen || !userId) return;

      setLoadingUserData(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token de autenticación no encontrado");
        }

        const response = await fetch(`${process.env.REACT_APP_URL_API}users/${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error de servidor! estado: ${response.status}`);
        }

        const userData = await response.json();
        
        // Populate form with user data
        setValues({
          name: userData.name || "",
          document_type_id: userData.document_type_id || "",
          document: userData.document || "",
          email: userData.email || "",
          phone: userData.phone || "",
          password: "",
          password_confirmation: "",
          user_type_id: userData.user_type_id || 11,
          role_id: userData.role_id || "",
          status_id: userData.status_id || "",
          client_id: userData.client_id || clientId || ""
        });

        setAlert({ message: null, type: null });
      } catch (err) {
        setAlert({
          message: `Error al cargar datos del usuario: ${err.message}`,
          type: 'danger'
        });
      } finally {
        setLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [isOpen, userId]);

  // Fetch form data (document types, roles, statuses)
  useEffect(() => {
    const fetchFormData = async () => {
      if (!isOpen) return;

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
          },
        });

        if (!response.ok) {
          throw new Error(`Error de servidor! estado: ${response.status}`);
        }

        const apiResponse = await response.json();
        console.log('Form data API response:', apiResponse);
        
        // Map API response to component structure
        if (apiResponse.success && apiResponse.data) {
          const formDataMapped = {
            documentTypes: apiResponse.data.tipos || [],
            roles: apiResponse.data.roles || [],
            statuses: apiResponse.data.estados || []
          };
          console.log('Mapped form data:', formDataMapped);
          setFormData(formDataMapped);
        } else {
          // Fallback for different response structure
          const formDataFallback = {
            documentTypes: apiResponse.documentTypes || apiResponse.tipos || [],
            roles: apiResponse.roles || [],
            statuses: apiResponse.statuses || apiResponse.estados || []
          };
          console.log('Fallback form data:', formDataFallback);
          setFormData(formDataFallback);
        }
      } catch (err) {
        console.error('Error fetching form data:', err);
        setAlert({
          message: `Error al cargar datos del formulario: ${err.message}`,
          type: 'danger'
        });
        // Set empty arrays as fallback
        setFormData({
          documentTypes: [],
          roles: [],
          statuses: []
        });
      }
    };

    fetchFormData();
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!values.name.trim()) {
      errors.push("El nombre es requerido");
    }

    if (!values.document_type_id) {
      errors.push("El tipo de documento es requerido");
    }

    if (!values.document.trim()) {
      errors.push("El documento es requerido");
    }

    if (!values.email.trim()) {
      errors.push("El email es requerido");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email)) {
        errors.push("El email no tiene un formato válido");
      }
    }

    if (!values.phone.trim()) {
      errors.push("El teléfono es requerido");
    }

    if (!values.role_id) {
      errors.push("El rol es requerido");
    }

    if (!values.status_id) {
      errors.push("El estado es requerido");
    }

    // Password validation only if password is provided
    if (values.password && values.password.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres");
    }

    if (values.password && values.password !== values.password_confirmation) {
      errors.push("Las contraseñas no coinciden");
    }

    return errors;
  };

  const resetForm = () => {
    setValues({
      name: "",
      document_type_id: "",
      document: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      user_type_id: 11,
      role_id: "",
      status_id: "",
      client_id: ""
    });
    setAlert({ message: null, type: null });
    setShowPassword({ password: false, confirmation: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setAlert({
        message: errors.join(", "),
        type: 'danger'
      });
      return;
    }

    setLoading(true);
    setAlert({ message: null, type: null });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticación no encontrado");
      }

      // Prepare request body - only include password if provided
      const requestBody = {
        name: values.name,
        user_type_id: Number(values.user_type_id),
        document_type_id: Number(values.document_type_id),
        document: values.document,
        role_id: Number(values.role_id),
        email: values.email,
        phone: values.phone,
        status_id: Number(values.status_id),
        client_id: Number(values.client_id || clientId)
      };

      // Only include password if provided
      if (values.password) {
        requestBody.password = values.password;
      }

      const response = await fetch(`${process.env.REACT_APP_URL_API}users/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different types of errors
        let errorMessage = "Error al actualizar el usuario";
        
        if (data.message) {
          errorMessage = data.message;
        } else if (data.errors) {
          // Handle validation errors
          const validationErrors = Object.values(data.errors).flat();
          errorMessage = validationErrors.join(", ");
        } else if (data.error) {
          errorMessage = data.error;
        }
        
        throw new Error(errorMessage);
      }

      // Success response
      const successMessage = data.message || "Usuario actualizado exitosamente.";
      
      setAlert({
        message: successMessage,
        type: 'success'
      });

      // Call callback to refresh user list with updated user data
      if (onUserUpdated && data.user) {
        onUserUpdated(data.user);
      }

      // Close modal after a short delay to show success message
      setTimeout(() => {
        toggle();
        resetForm();
      }, 2000);

    } catch (err) {
      setAlert({
        message: `Error: ${err.message}`,
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg" centered>
      <ModalHeader toggle={handleClose}>
        <i className="bi bi-person-gear me-2"></i>
        Editar Usuario
      </ModalHeader>
      
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {alert.message && (
            <Alert color={alert.type} className="mb-3">
              {alert.message}
            </Alert>
          )}

          {loadingUserData ? (
            <div className="text-center p-4">
              <Spinner color="primary" />
              <p className="mt-2">Cargando datos del usuario...</p>
            </div>
          ) : (
            <>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="name">
                      Nombre Completo <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={values.name}
                      onChange={handleInputChange}
                      placeholder="Ingrese el nombre completo"
                      maxLength={100}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">
                      Email <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      value={values.email}
                      onChange={handleInputChange}
                      placeholder="ejemplo@correo.com"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="document_type_id">
                      Tipo de Documento <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="select"
                      name="document_type_id"
                      id="document_type_id"
                      value={values.document_type_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione...</option>
                      {formData.documentTypes && formData.documentTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="document">
                      Número de Documento <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="number"
                      name="document"
                      id="document"
                      value={values.document}
                      onChange={handleInputChange}
                      placeholder="Ingrese el número de documento"
                      maxLength={12}
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="phone">
                      Teléfono <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="number"
                      name="phone"
                      id="phone"
                      value={values.phone}
                      onChange={handleInputChange}
                      placeholder="Ingrese el número de teléfono"
                      maxLength={10}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="role_id">
                      Rol <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="select"
                      name="role_id"
                      id="role_id"
                      value={values.role_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione...</option>
                      {formData.roles && formData.roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="status_id">
                      Estado <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="select"
                      name="status_id"
                      id="status_id"
                      value={values.status_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione...</option>
                      {formData.statuses && formData.statuses.map((status) => (
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
                    <Label for="password">
                      Nueva Contraseña (Opcional)
                    </Label>
                    <div className="input-group">
                      <Input
                        type={showPassword.password ? "text" : "password"}
                        name="password"
                        id="password"
                        value={values.password}
                        onChange={handleInputChange}
                        placeholder="Dejar vacío para mantener la actual"
                        minLength={8}
                      />
                      <Button
                        type="button"
                        color="outline-secondary"
                        onClick={() => togglePasswordVisibility('password')}
                      >
                        <i className={`bi bi-eye${showPassword.password ? '-slash' : ''}`}></i>
                      </Button>
                    </div>
                    <small className="text-muted">
                      Mínimo 8 caracteres. Dejar vacío para no cambiar.
                    </small>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="password_confirmation">
                      Confirmar Nueva Contraseña
                    </Label>
                    <div className="input-group">
                      <Input
                        type={showPassword.confirmation ? "text" : "password"}
                        name="password_confirmation"
                        id="password_confirmation"
                        value={values.password_confirmation}
                        onChange={handleInputChange}
                        placeholder="Confirme la nueva contraseña"
                        disabled={!values.password}
                      />
                      <Button
                        type="button"
                        color="outline-secondary"
                        onClick={() => togglePasswordVisibility('confirmation')}
                        disabled={!values.password}
                      >
                        <i className={`bi bi-eye${showPassword.confirmation ? '-slash' : ''}`}></i>
                      </Button>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" type="button" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            color="primary" 
            type="submit" 
            disabled={loading || loadingUserData}
            className="d-flex align-items-center"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Actualizando...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Actualizar Usuario
              </>
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

EditUserClient.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  userId: PropTypes.number,
  clientId: PropTypes.number,
  onUserUpdated: PropTypes.func,
};

export default EditUserClient;