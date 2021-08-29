import React from 'react';

import { useSelector, shallowEqual } from 'react-redux';

import { userEvents } from '../../../actions/channel';
// import { userEvent } from '../../../actions/channel';

const TriggerUI = () => {
  const { usersEvent } = useSelector((state) => state.Channels, shallowEqual);
  return (
    <div>
      <p>
        {usersEvent && userEvents.length
          ? `${usersEvent[0] ? `${usersEvent[0].name} is typing ` : ''}`
          : ''}
      </p>
    </div>
  );
};
export default TriggerUI;
