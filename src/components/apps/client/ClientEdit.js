import React, { useEffect } from 'react';
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
import { updateClient } from "../../../store/apps/clients/ClientSlice";

const ClientEdit = ({ click, client }) => {
  const dispatch = useDispatch();
  const [alert, setAlert] = React.useState({ message: null, type: 'danger' });
  const [documentTypes, setDocumentTypes] = React.useState([]);
  const [values, setValues] = React.useState({
    id: '',
    user_type_id: 7, // Cliente
    name: "",
    document_type_id: "",
    document: "",
    role_id: 4, // Cliente regular
    email: "",
    phone: "",
    status_id: 1, // Activo
  });

  useEffect(() => {
    if (client) {
      setValues({
        id: client.id,
        user_type_id: client.user_type_id || 7,
        name: client.name || "",
        document_type_id: client.document_type_id || "",
        document: client.document || "",
        role_id: client.role_id || 4,
        email: client.email || "",
        phone: client.phone || "",
        status_id: client.status_id || 1,
      });
    }
  }, [client]);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token de autenticación no encontrado");
        }

        const response = await fetch('http://localhost:8000/api/users/form-data/client', {
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

    fetchDocumentTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticación no encontrado");
      }

      const response = await fetch(`http://localhost:8000/api/users/${values.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error de servidor! estado: ${response.status}`);
      }

      dispatch(updateClient(data.user));
      setAlert({
        message: data.message || 'Usuario actualizado exitosamente',
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
              <Label for="document_type_id">Tipo de Documento</Label>
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
          color="secondary"
          onClick={click}
        >
          Cancelar
        </Button>
        <Button
          color="primary"
          type="submit"
          disabled={!values.name || !values.document_type_id || !values.document || !values.email || !values.phone}
        >
          Actualizar Cliente
        </Button>
      </ModalFooter>
    </Form>
  );
};

ClientEdit.propTypes = {
  click: PropTypes.func.isRequired,
  client: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    document_type_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    document: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    user_type_id: PropTypes.number,
    role_id: PropTypes.number,
    status_id: PropTypes.number
  }).isRequired,
};

export default ClientEdit;