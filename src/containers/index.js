import React, { useEffect, useState } from 'react';

import { Auth } from 'aws-amplify';
import { Notifications } from 'react-push-notification';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

// import { Route, Switch, Redirect } from 'react-router-dom';
import { clientDisConnect, getChannels } from '../actions/channel';
import { getChatToken, chatCustomEventSubscription } from '../graphql/message';
import ChatContainerUI from './components';

const App = ({ match }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(
    localStorage.getItem('stream-token') ? false : true,
  );
  const { client } = useSelector(
    ({ Channels }) => ({
      client: Channels.client,
    }),
    shallowEqual,
  );

  useEffect(() => {
    setLoading(true);
    Auth.currentAuthenticatedUser()
      .then(async (res) => {
        console.log('User is live');
        // console.log('res', res);
        const { username, attributes } = res;
        const { given_name, family_name } = attributes;
        let token = await getChatToken();
        localStorage.setItem('stream-userName', username);
        localStorage.setItem('stream-token', token);
        localStorage.setItem('stream-name', `${given_name} ${family_name}`);
        setLoading(false);
      })
      .catch(async (err) => {
        console.log('Logout User', err);
        if (window.location.hostname === 'localhost') {
          // for admin
          // localStorage.setItem(
          //   'stream-userName',
          //   'b42b051f-49da-4ce9-a673-eb2fb6fc5665',
          // );
          // localStorage.setItem(
          //   'stream-token',
          //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYjQyYjA1MWYtNDlkYS00Y2U5LWE2NzMtZWIyZmI2ZmM1NjY1In0.SdpZmAUHoQYyDCxOvf8wD4AXvDJtFw8Rl5Eqt_27mSM',
          // );
          // localStorage.setItem('stream-name', 'Thinksabio Admin');
          // for User
          localStorage.setItem(
            'stream-userName',
            '8204c03f-cf7e-473d-bbc2-1e437dbdd49b',
          );
          localStorage.setItem(
            'stream-token',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODIwNGMwM2YtY2Y3ZS00NzNkLWJiYzItMWU0MzdkYmRkNDliIn0.mjazk3q3KhI0voTMSHmdu6uauD7GrvZTcv3Wt13-V1A',
          );
          localStorage.setItem('stream-name', 'Ankur Jain');
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    chatCustomEventSubscription(async (value) => {
      console.log('value', value);
      await dispatch(getChannels(client));
    });
  }, [client, dispatch]);

  useEffect(() => {
    setInterval(() => {
      Auth.currentAuthenticatedUser()
        .then(async (res) => {
          console.log('User is live');
        })
        .catch(async (err) => {
          console.log('Logout User', err);
          if (window.location.hostname !== 'localhost') {
            localStorage.clear();
            dispatch(clientDisConnect());
            window.location.reload();
          }
        });
    }, 5000);
  }, [dispatch]);
  return (
    <div className="app-main">
      <Notifications />
      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="app-main">
          <ChatContainerUI />
        </div>
      )}
    </div>
  );
};

export default App;
