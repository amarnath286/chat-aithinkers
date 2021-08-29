import React, { useEffect } from 'react';

import { Layout, Row } from 'antd';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { clientConnect } from '../../actions/channel';
import ChatView from './ChatView';
import { HeaderComponent, ChannelListView } from './exports';

// var CryptoJS = require('crypto-js');

const { Header } = Layout;

const App = ({ match, history }) => {
  const dispatch = useDispatch();
  const { clientConnectLoader, clientError, errorMessage, userDetails } =
    useSelector(
      ({ Channels }) => ({
        clientConnectLoader: Channels.clientConnectLoader,
        clientError: Channels.clientError,
        errorMessage: Channels.errorMessage,
        userDetails: Channels.userDetails,
      }),
      shallowEqual,
    );

  useEffect(() => {
    let username = localStorage.getItem('stream-userName');
    let token = localStorage.getItem('stream-token');
    if (username && token) {
      dispatch(clientConnect({ username, token }));
    } else {
      dispatch({
        type: 'CLIENT_ERROR',
      });
    }
  }, [dispatch, match]);

  if (clientConnectLoader) {
    return <div className="loader"></div>;
  }

  if (clientError) {
    return (
      <Row justify="center">
        <div style={{ marginTop: '50px' }}>
          <h3>
            {errorMessage ? (
              'Unable to initiate the chat, sorry for inconvenience please try again later'
            ) : (
              <div className="loader"></div>
            )}
          </h3>
        </div>
      </Row>
    );
  }

  return (
    <div style={{ backgroundColor: '#e7ebf0', width: '100%' }}>
      <div id="container">
        <div className="chatMainContainer">
          <Header
            style={{
              padding: '0px',
              margin: '0px',
              // height: '48px',
              backgroundColor:
                userDetails.role !== 'admin' ? '#5682a3' : '#3955dc',
            }}
          >
            <HeaderComponent />
          </Header>
          <div className="chatViewContent">
            <ChannelListView />
            <ChatView />
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
