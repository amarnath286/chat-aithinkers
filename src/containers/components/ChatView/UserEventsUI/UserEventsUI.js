import React, { memo, useEffect } from 'react';

import { useSelector, shallowEqual } from 'react-redux';

const UserEventsUI = memo(() => {
  const { activeChannel, userDetails } = useSelector(
    ({ Channels }) => ({
      activeChannel: Channels.activeChannel,
      userDetails: Channels.userDetails,
    }),
    shallowEqual,
  );

  const [userEvent, setUserEvent] = React.useState([]);

  const handleUsersEvents = ({ name, id }, type, channelId) => {
    let captureEvents = [];
    if (type === 'start') {
      if (userDetails.id !== id) {
        captureEvents = [
          ...userEvent,
          {
            name: name,
            id: id,
            channelId: channelId,
          },
        ];
      } else {
        captureEvents = [];
      }
    } else if (type === 'stop') {
      captureEvents = [...userEvent].filter((i) => i.id !== id);
    }
    setUserEvent(captureEvents);
  };
  useEffect(() => {
    activeChannel.watch();
    activeChannel.on('typing.start', (e) => {
      handleUsersEvents(e.user, 'start', activeChannel.data.id);
    });
    activeChannel.on('typing.stop', (e) => {
      handleUsersEvents(e.user, 'stop', activeChannel.data.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChannel]);
  return (
    <div className="inputUserTypingBox">
      {userEvent.length > 0 &&
      userEvent[0].channelId === activeChannel.data.id ? (
        <span style={{ fontWeight: 500 }}>{`${
          userEvent.length > 1
            ? `${userEvent[0].name} and ${userEvent.length - 1} others`
            : `${userEvent[0].name} is`
        }  typing...`}</span>
      ) : null}
    </div>
  );
});

export default UserEventsUI;
