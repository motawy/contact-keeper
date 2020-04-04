import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ContactContext from '../../context/contact/contactContext';
import { useAuth0 } from '../../auth/react-auth0';
import history from '../../utils/history';

const Navbar = ({ title, icon }) => {
  const contactContext = useContext(ContactContext);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { clearContacts } = contactContext;

  const onLogout = () => {
    logout();
    clearContacts();
    history.push('/');
  };

  const onLogin = () => {
    loginWithRedirect();
    history.push('/');
  };

  const authLinks = (
    <Fragment>
      <li>
        <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt" />
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <li>
        <a onClick={onLogin} href="#!">
          <i className="fas fa-sign-in-alt" />
          <span className="hide-sm">Log in</span>
        </a>
      </li>
    </Fragment>
  );

  return (
    <div className="navbar bg-primary">
      <h1>
        <Link to="/">
          <i className={icon} /> {title}
        </Link>
      </h1>
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </div>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

Navbar.defaultProps = {
  title: 'Contact Keeper',
  icon: 'fas fa-id-card-alt',
};

export default Navbar;
