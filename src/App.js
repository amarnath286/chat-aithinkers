import React, { useEffect } from 'react';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import {
  Authenticator,
  SignIn as AwsSignIn,
  Greetings,
} from 'aws-amplify-react';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import authenticatorConfig from './config/authenticatorConfig';
import App from './containers';
import configureStore, { history } from './store';
import { useTheme } from './ThemeContext';

export const store = configureStore();

const MainApp = () => {
  const { setTheme } = useTheme();

  const loadProfile = async (authState) => {
    let promises = [];
    console.log('authState', authState);
    if (authState === 'signedIn') {
      // const user = await getCustomerSubscriptionInfo();
      // promises.concat([store.dispatch(setUserProfile(user))]);
    }
    return Promise.all(promises);
  };
  useEffect(() => {
    Notification.requestPermission();
  }, []);

  const defaultTheme = localStorage.getItem('theme') || 'light';
  useEffect(() => {
    setTheme(defaultTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY,
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],
    environment: process.env.REACT_APP_ENVIRONMENT,

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Authenticator
          hide={[AwsSignIn, Greetings]}
          amplifyConfig={authenticatorConfig}
          onStateChange={loadProfile}
        >
          <Switch>
            <Route path="/" component={App} />
          </Switch>
        </Authenticator>
      </ConnectedRouter>
    </Provider>
  );
};

export default MainApp;
