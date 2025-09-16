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
  Input
} from 'reactstrap';

const EditTypeModal = ({ isOpen, toggle, type, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (type) {
      setFormData({ name: type.name });
    }
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>Editar Tipo PQRS</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="name">Nombre</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">
            Guardar
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

EditTypeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  type: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired
};

export default EditTypeModal;