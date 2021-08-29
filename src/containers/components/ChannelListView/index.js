import React from 'react';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
  getChannels,
  getMutedChannels,
  // getMoreChannels,
} from '../../../actions/channel';
import ChannelList from './ChannelList/index';
import Filter from './Filters/index';
import '../ChannelListView/ChannelList/styles.scss';
const ChannelListView = ({ stateChannels, history }) => {
  const {
    client,
    //  channels
  } = useSelector((state) => state.Channels, shallowEqual);

  const dispatch = useDispatch();

  const getChannelsFromGetStream = async () => {
    const offset = 0;
    dispatch(getChannels(client, offset));
    dispatch(getMutedChannels(client));
  };

  React.useEffect(() => {
    getChannelsFromGetStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="channel-list">
      <div className="search-filter">
        <Filter />
      </div>
      <div className="ant-scroll">
        <ChannelList />
      </div>
    </div>
  );
};

export default ChannelListView;
