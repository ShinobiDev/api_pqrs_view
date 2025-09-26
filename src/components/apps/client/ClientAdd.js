import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Button,
  Input,
  ModalBody,
  ModalFooter,
  Alert
} from "reactstrap";
import { useDispatch } from "react-redux";
import { addClient } from "../../../store/apps/clients/ClientSlice";

const ClientAdd = ({ click }) => {
  const dispatch = useDispatch();
  const [alert, setAlert] = React.useState({ message: null, type: 'danger' });
  const [documentTypes, setDocumentTypes] = React.useState([]);
  const [values, setValues] = React.useState({
    user_type_id: 11, // Usuario de cliente
    name: "",
    document_type_id: "",
    document: "",
    role_id: 4, // Cliente regular
    email: "",
    phone: "",
    status_id: 1, // Activo
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = React.useState({
    password: false,
    confirmation: false
  });

  React.useEffect(() => {
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
            "Accept": "application/json"
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Error de servidor! estado: ${response.status}. Respuesta: ${errorText.substring(0, 200)}`);
        }

        const responseData = await response.json();
        if (!responseData.success) {
          throw new Error("Error al obtener los datos del formulario");
        }
        setDocumentTypes(responseData.data);
      } catch (err) {
        setAlert({
          message: `Error al cargar tipos de documento: ${err.message}`,
          type: 'danger'
        });
      }
    };

    fetchDocumentTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticación no encontrado");
      }

      const response = await fetch(`${process.env.REACT_APP_URL_API}users`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error de servidor! estado: ${response.status}. Respuesta: ${errorText.substring(0, 200)}`);
      }

      const data = await response.json();
      dispatch(addClient(data.user));
      setAlert({
        message: data.message || 'Usuario creado exitosamente',
        type: 'success'
      });
      setTimeout(() => {
        click();
      }, 2000);
    } catch (err) {
      setAlert({
        message: err.message,
        type: 'danger'
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <ModalBody>
        {alert.message && (
          <Alert color={alert.type} className="mb-3">
            {alert.message}
          </Alert>
        )}
        <Row>
          <Col md={12}>
            <FormGroup>
              <Label for="name">Nombre</Label>
              <Input
                className="form-control"
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
              <Label for="documentType">Tipo de Documento</Label>
              <Input
                className="form-control"
                type="select"
                name="document_type_id"
                id="document_type_id"
                value={values.document_type_id}
                onChange={(e) => setValues({ ...values, document_type_id: e.target.value })}
                required
              >
                <option value="">Seleccione...</option>
                {documentTypes.map(type => (
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
                className="form-control"
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
                className="form-control"
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
              <Label for="password">Contraseña</Label>
              <div className="input-group">
                <Input
                  className="form-control"
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
                  className="form-control"
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
          <Col md={12}>
            <FormGroup>
              <Label for="phone">Teléfono</Label>
              <Input
                className="form-control"
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
        <Button
          color="primary"
          type="submit"
          disabled={!values.name || !values.document_type_id || !values.document || !values.email || 
                   !values.phone || !values.password || values.password.length < 8 || 
                   !values.password_confirmation || values.password !== values.password_confirmation}
        >
          Agregar Cliente
        </Button>
      </ModalFooter>
    </Form>
  );
};

ClientAdd.propTypes = {
  click: PropTypes.any,
};

export default ClientAdd;
