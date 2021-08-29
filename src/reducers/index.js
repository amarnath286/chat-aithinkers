import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import Channels from './channels';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    Channels,
  });
