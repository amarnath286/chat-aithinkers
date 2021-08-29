import React, { useContext, useEffect, useState } from 'react';

import { CameraOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import moment from 'moment';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Chat, Channel, MessageInput, ChatContext } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';

import {
  sendMessage,
  addQuotedMessageId,
  removeSelectMessages,
  sendImage,
  sendFile,
  addMemberToChannel,
  editMessage,
  // draftMessage,
  // editMessage,
} from '../../../../actions/channel';

let timerId;

class Message {
  text = '';
  attachments = [];
  mentioned_users = [];
  quoted_message_id = '';
}

const onEditFocus = (messageText) => {
  const streamInput = document.getElementsByClassName(
    'str-chat__textarea__textarea',
  );
  if (streamInput && streamInput[0]) {
    const strLength = messageText.text.length * 2;
    streamInput[0].setSelectionRange(strLength, strLength);
  }
};

const InputView = ({ messagesEnd, setReplyOption }) => {
  const {
    client,
    activeChannel,
    quoted_message_id,
    userDetails,
    activeChannelMembers,
    messageToEdit,
    // draftMessages,
  } = useSelector(
    ({ Channels }) => ({
      client: Channels.client,
      activeChannel: Channels.activeChannel,
      quoted_message_id: Channels.quoted_message_id,
      userDetails: Channels.userDetails,
      activeChannelMembers: Channels.activeChannelMembers,
      messageToEdit: Channels.messageToEdit,
      draftMessages: Channels.draftMessages,
    }),
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [fileType, setFileType] = useState('');
  const [images, setImages] = React.useState('');

  const [editMode, setEditMode] = React.useState(false);
  const [message, setMessage] = React.useState(new Message());

  useEffect(() => {
    const enableEditMode = async () => {
      if (messageToEdit) {
        setMessage(messageToEdit);
        setEditMode(true);
        onEditFocus(messageToEdit);
      } else {
        setEditMode(false);
      }
    };

    enableEditMode();
  }, [message, messageToEdit]);

  const { state } = activeChannel;
  const users = [];
  Object.keys(state.members).forEach((d) =>
    users.push(state.members[d].user_id),
  );
  const blockedList = Object.keys(state.members).filter(
    (d) => state.members[d].banned === true,
  );
  const makeAPICall = async () => {
    await activeChannel.stopTyping();
  };

  const debounceFunction = (func, delay) => {
    clearTimeout(timerId);
    timerId = setTimeout(func, delay);
  };

  const onPressEnter = (message) => {
    const { state } = activeChannel;
    let lastMessage =
      state.messages && state.messages.length
        ? state.messages[state.messages.length - 1]
        : {};

    let obj = {};

    if (!activeChannel.state.messages.length) {
      obj['DateField'] = moment().format();
    }

    if (moment(lastMessage.created_at).format('DD') !== moment().format('DD')) {
      obj['DateField'] = moment().format();
    }
    if (moment(lastMessage.created_at).format('DD') === moment().format('DD')) {
      obj['DateField'] = 'today';
    }

    dispatch(
      sendMessage({
        channel: activeChannel,
        message_new: {
          ...message,
          quoted_message_id,
          mentioned_users: message.mentioned_users.map((d) => d.id),
          skip_push: false,
          attachments: message.attachments,
          ...obj,
        },
      }),
    );
    setReplyOption(false);
    handleRemoveMessages();
    dispatch(addQuotedMessageId(''));
  };

  const onChange = async (e, newText) => {
    activeChannel.keystroke();
    setMessage({
      ...message,
      text: e.target.value,
    });
    // dispatch(draftMessage(activeChannel, { ...message, text: e.target.value }));

    debounceFunction(makeAPICall, 200);
  };

  const autoScroll = () => {
    messagesEnd && messagesEnd.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRemoveMessages = () => {
    setReplyOption(false);
    dispatch(removeSelectMessages());
  };

  const handleSelectImage = async (event) => {
    let data = Object.values(event.target.files);

    fileType === 'image'
      ? dispatch(sendImage(activeChannel, data))
      : dispatch(sendFile(activeChannel, data));
    setImages('');
    setTimeout(() => autoScroll(), 1000);
  };

  const joinGroup = async () => {
    await dispatch(
      addMemberToChannel({
        channel: activeChannel,
        user_id: userDetails.id,
      }),
    );
    await Object.keys(activeChannelMembers).forEach((d) =>
      users.push(activeChannelMembers[d].user_id),
    );
  };

  const onMessageUpdate = async () => {
    await dispatch(editMessage()); // @Kiran, we need this to clear editing state
    setEditMode(false);
  };

  const customDoUpdateMessageRequest = (cid, updatedMessage) => {
    // todo: better way to update would be to see which fields are getting updated while editing and only update those
    //  for that need to try variety of message and check, will do that when I have some free time
    const myUpdatedMessage = {
      ...updatedMessage,
      ...{
        _is_text_updated: true,
        pinned: messageToEdit.pinned,
        pinned_at: messageToEdit.pinned_at,
        pinned_by: messageToEdit.pinned_by,
      },
    };
    client.updateMessage(myUpdatedMessage);
  };

  const ActiveChannelSetter = ({ activeChannel }) => {
    const { setActiveChannel } = useContext(ChatContext);
    useEffect(() => {
      setActiveChannel(activeChannel);
    }, [activeChannel]); // eslint-disable-line
    return null;
  };

  return (
    <>
      {!users.includes(userDetails.id) ? (
        <Button className="joinChatButton" onClick={joinGroup} block>
          Join Group
        </Button>
      ) : (
        <div className="inputViewChatBox">
          {!blockedList.includes(userDetails.id) ? (
            <>
              <div className="cameraIcon">
                <CameraOutlined
                  style={{ color: 'grey' }}
                  onClick={() => {
                    setFileType('image');
                    document.getElementById('fileType').click();
                  }}
                  size={50}
                />
              </div>
              <Chat client={client}>
                <ActiveChannelSetter activeChannel={activeChannel} />
                <Channel
                  channel={activeChannel}
                  doUpdateMessageRequest={customDoUpdateMessageRequest}
                >
                  {editMode ? (
                    <MessageInput
                      focus={true}
                      key={message.id}
                      message={message}
                      onChangeText={(text) => onChange(text)}
                      clearEditingState={onMessageUpdate}
                    />
                  ) : (
                    <MessageInput
                      onChangeText={(text) => onChange(text)}
                      overrideSubmitHandler={onPressEnter}
                    />
                  )}
                </Channel>
              </Chat>
              <input
                type="file"
                id="fileType"
                multiple
                value={images}
                onChange={handleSelectImage}
                style={{ display: 'none' }}
              />
            </>
          ) : (
            <Chat client={client}>
              <Channel channel={activeChannel}>
                <p>
                  {' '}
                  Oops! You are blocked in this channel by Thinksabio admin.
                  Click {}
                  {window.location.origin ===
                  'https://www.chat.test.thinksabio.com' ? (
                    <a
                      href="https://www.test.thinksabio.com/contact-us"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>
                  ) : window.location.origin ===
                    'https://www.chat.stage.thinksabio.com' ? (
                    <a
                      href="https://www.stage.thinksabio.com/contact-us"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>
                  ) : window.location.origin ===
                    'https://www.chat.thinksabio.com' ? (
                    <a
                      href="https://www.thinksabio.com/contact-us"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>
                  ) : (
                    <a
                      href="https://www.thinksabio.com/contact-us"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>
                  )}
                  {} to contact admin
                </p>
              </Channel>
            </Chat>
          )}
        </div>
      )}
    </>
  );
};

export default InputView;
