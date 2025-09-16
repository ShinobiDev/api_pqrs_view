import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback
} from 'reactstrap';

const CreateStateModal = ({ 
  isOpen, 
  toggle, 
  onSubmit 
}) => {
  const [formData, setFormData] = React.useState({ name: '' });
  const [error, setError] = React.useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('El nombre del estado es obligatorio');
      return;
    }
    onSubmit(formData);
    setFormData({ name: '' }); // Limpiar el formulario después del envío
  };

  const handleCancel = () => {
    setFormData({ name: '' }); // Limpiar el formulario al cancelar
    setError('');
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleCancel}>
      <ModalHeader toggle={handleCancel}>Nuevo Estado</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="name">Nombre del Estado *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingrese el nombre del nuevo estado"
              invalid={!!error}
            />
            {error && <FormFeedback>{error}</FormFeedback>}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Crear
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

CreateStateModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

CreateStateModal.defaultProps = {
  isOpen: false
};

export default CreateStateModal;