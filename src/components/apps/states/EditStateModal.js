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
  Button
} from 'reactstrap';

const EditStateModal = ({ 
  isOpen, 
  toggle, 
  formData, 
  onFormChange, 
  onSubmit 
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Editar Estado: {formData.name}</ModalHeader>
      <Form onSubmit={onSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="name">Estado</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={onFormChange}
              placeholder="Ingrese el nuevo nombre del estado"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            Guardar
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

EditStateModal.defaultProps = {
  isOpen: false,
  formData: {
    name: ''
  }
};

EditStateModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    name: PropTypes.string
  }),
  onFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default EditStateModal;