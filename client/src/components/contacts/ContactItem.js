import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ContactContext from '../../context/contact/contactContext';
import { useAuth0 } from '../../auth/react-auth0';
import Avatar from 'react-avatar';

const ContactItem = ({ contact }) => {
  const contactContext = useContext(ContactContext);
  const { deleteContact, setCurrent, clearCurrent } = contactContext;
  const { getIdTokenClaims } = useAuth0();
  const { contactId, name, email, phone, type, image } = contact;

  const onDelete = async () => {
    const rawToken = await getIdTokenClaims();
    const token = rawToken.__raw;
    deleteContact(contactId, token);
    clearCurrent();
  };

  return (
    <div className="card bg-light">
      {!image ? (
        <Avatar
          style={{ display: 'flex', margin: 'auto' }}
          name={name}
          size="100"
          round={true}
        />
      ) : (
        <Avatar
          style={{ display: 'flex', margin: 'auto' }}
          src={image}
          size="100"
          round={true}
        />
      )}
      <h3 className="text-primary text-left">
        {name}{' '}
        <span
          style={{ float: 'right' }}
          className={
            'badge ' +
            (type === 'professional' ? 'badge-success' : 'badge-primary')
          }
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </h3>
      <ul className="list">
        {email && (
          <li>
            <i className="fas fa-envelope-open" /> {email}
          </li>
        )}
        {phone && (
          <li>
            <i className="fas fa-phone" /> {phone}
          </li>
        )}
      </ul>
      <p>
        <button
          className="btn btn-dark btn-sm"
          onClick={() => setCurrent(contact)}
        >
          Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          Delete
        </button>
      </p>
    </div>
  );
};

ContactItem.propTypes = {
  contact: PropTypes.object.isRequired,
};

export default ContactItem;
