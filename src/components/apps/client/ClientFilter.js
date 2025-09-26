import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListGroup, ListGroupItem, Button, Modal, ModalHeader } from 'reactstrap';
import { setVisibilityFilter } from '../../../store/apps/clients/ClientSlice';
import ClientAdd from './ClientAdd';

const ClientFilter = () => {
  const dispatch = useDispatch();
  const active = useSelector((state) => state.clientsReducer.currentFilter);
  const [modal, setModal] = React.useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <>
      <div className="p-3 border-bottom">
        <Button color="danger" block onClick={toggle}>
          Crear nuevo cliente
        </Button>
      </div>
      <ListGroup flush>
        <h6 className="px-3 pt-3">Filtros </h6>
        <ListGroupItem
          href="#"
          tag="a"
          className={active === 'show_all' ? 'bg-light py-3 border-0' : 'py-3 border-0'}
          onClick={() => dispatch(setVisibilityFilter('show_all'))}
        >
          <i className="bi bi-people mx-1" /> Activos
        </ListGroupItem>
        <ListGroupItem
          href="#"
          tag="a"
          className={active === 'frequent_client' ? 'bg-light py-3 border-0' : 'py-3 border-0'}
          onClick={() => dispatch(setVisibilityFilter('frequent_client'))}
        >
          <i className="bi bi-bezier mx-1" /> Inactivos
        </ListGroupItem>
        <ListGroupItem
          href="#"
          tag="a"
          className={active === 'starred_client' ? 'bg-light py-3 border-0' : 'py-3 border-0'}
          onClick={() => dispatch(setVisibilityFilter('starred_client'))}
        >
          <i className="bi bi-star mx-1" /> Starred
        </ListGroupItem>
        <div className="border-bottom py-2 mb-2" />
        <h6 className="px-3 pt-3">Filter By Type</h6>
        <ListGroupItem
          href="#"
          tag="a"
          className={active === 'regular_client' ? 'bg-light py-3 border-0' : 'py-3 border-0'}
          onClick={() => dispatch(setVisibilityFilter('regular_client'))}
        >
          <i className="bi bi-bookmark-star mx-1" /> Regular
        </ListGroupItem>
        <ListGroupItem
          href="#"
          tag="a"
          className={active === 'vip_client' ? 'bg-light py-3 border-0' : 'py-3 border-0'}
          onClick={() => dispatch(setVisibilityFilter('vip_client'))}
        >
          <i className="bi bi-bookmark-star mx-1" /> VIP
        </ListGroupItem>
        <ListGroupItem
          href="#"
          tag="a"
          className={active === 'corporate_client' ? 'bg-light py-3 border-0' : 'py-3 border-0'}
          onClick={() => dispatch(setVisibilityFilter('corporate_client'))}
        >
          <i className="bi bi-bookmark-star mx-1" /> Corporate
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