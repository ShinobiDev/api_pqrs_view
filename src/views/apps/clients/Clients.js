import { Card, CardBody } from 'reactstrap';
import { useState } from 'react';
import ClientList from '../../../components/apps/client/ClientList';
import ClientDetails from '../../../components/apps/client/ClientDetails';
import ThreeColumn from '../../../components/threeColumn/ThreeColumn';
import ClientFilter from '../../../components/apps/client/ClientFilter';

const Clients = () => {
  const [selectedClientId, setSelectedClientId] = useState(null);

  return (
    <Card>
      <CardBody>
        <ThreeColumn
          leftContent={<ClientFilter />}
          middleContent={
            <ClientList onClientSelect={setSelectedClientId} selectedClientId={selectedClientId} />
          }
          rightContent={<ClientDetails selectedClientId={selectedClientId} />}
        />
      </CardBody>
    </Card>
  );
};

export default Clients;