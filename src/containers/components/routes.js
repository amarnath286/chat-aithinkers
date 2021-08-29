import React from 'react';

// import { Route, Switch } from 'react-router-dom';

import ChatContainerUI from './index';

const App = ({ match }) => {
  return (
    <div className="app-main">
      <ChatContainerUI />
    </div>
  );
};

export default App;
