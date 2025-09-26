import { Card, CardBody } from 'reactstrap';
import { useState } from 'react';
import ContactList from '../../../components/apps/contact/ContactList';
import ContactSearch from '../../../components/apps/contact/ContactSerch';
import ContactDetails from '../../../components/apps/contact/ContactDetails';
import ThreeColumn from '../../../components/threeColumn/ThreeColumn';
import ContactFilter from '../../../components/apps/contact/ContactFilter';

const Contacts = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <Card>
      <CardBody>
        <ThreeColumn
          leftContent={<ContactFilter />}
          middleContent={
            <>
              <ContactSearch />
              <ContactList onUserSelect={setSelectedUserId} selectedUserId={selectedUserId} />
            </>
          }
          rightContent={<ContactDetails selectedUserId={selectedUserId} />}
        />
      </CardBody>
    </Card>
  );
};

export default Contacts;
