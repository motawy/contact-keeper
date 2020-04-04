import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import ContactContext from '../../context/contact/contactContext';
import { useAuth0 } from '../../auth/react-auth0';
import Avatar from 'react-avatar';
import axios from 'axios';
import { apiEndpoint } from '../../utils/config';

const ContactItem = ({ contact }) => {
  const contactContext = useContext(ContactContext);
  const { deleteContact, setCurrent, clearCurrent } = contactContext;
  const { getIdTokenClaims } = useAuth0();
  const { contactId, name, email, phone, type, attachmentUrl } = contact;

  const [file, setfile] = useState();

  const getUploadUrl = async (token, contactId) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.post(
        `${apiEndpoint}/contacts/${contactId}/attachment`,
        '',
        config
      );
      console.log(res);
      return res.data.uploadUrl
    } catch (err) {
      alert(err);
    }
  };

  const onDelete = async () => {
    const rawToken = await getIdTokenClaims();
    const token = rawToken.__raw;
    deleteContact(contactId, token);
    clearCurrent();
  };

  const onChange = (e) => {
    const files = e.target.files;
    if (!files) return;
    setfile(files[0]);
  };

  const onUpload = async () => {
    const rawToken = await getIdTokenClaims();
    const token = rawToken.__raw;
    const uploadUrl = await getUploadUrl(token, contactId);
    await axios.put(uploadUrl, file);
  };

  return (
    <div className="card bg-light">
      {!attachmentUrl ? (
        <div>
          <Avatar
            style={{ display: 'flex', margin: 'auto' }}
            name={name}
            size="100"
            round={true}
          />
          <input
            style={{ marginLeft: '16px' }}
            type="file"
            name="attachmentUrl"
            accept="image/*"
            onChange={onChange}
          />
          <button type="button" onClick={onUpload}>
            Upload photo
          </button>
        </div>
      ) : (
        <Avatar
          style={{ display: 'flex', margin: 'auto' }}
          src={attachmentUrl}
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
