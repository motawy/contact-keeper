import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Auth0Provider } from './auth/react-auth0';
import { authConfig } from './utils/config';
import history from './utils/history';

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={authConfig.domain}
    client_id={authConfig.clientId}
    redirect_uri={authConfig.callbackUrl}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);
