import React, { useCallback, memo, useState, useRef, useEffect } from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Modal } from 'antd';
import { get } from 'lodash';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
  messageActions,
  removeSelectMessages,
  setIsModalVisible,
  addQuotedMessageId,
  deleteMessageById,
  addMessagetoChannelLocal,
  getMessagesByChannel,
  setPinnedMessagesModalVisible,
  unpinMessage,
  getPinnedMessagesByChannel,
  replyMsgFlag,
  pinnedMsgIdModal,
} from '../../../actions/channel';
import DeletePinnedMessage from '../OnePinnedMessage';
import PinnedMessages from '../PinMessages/PinMessages';
import InputView from './InputView';
import MessageOptions from './MessageOption';
import MessageList from './MessageView/MessagesList';
import ReplyTo from './ReplyToMessage';
import UserEventsUI from './UserEventsUI';

const componentRender = (prev, next) => {
  return prev.activeChannelId !== next.activeChannelId;
};

// eslint-disable-next-line react/display-name
const ChatView = memo(() => {
  const dispatch = useDispatch();
  const [replyOption, setReplyOption] = useState(false);
  const listInnerRef = useRef();
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = React.useState(0);
  const [isScrolledToBottom, setScrolledToBottom] = useState(true);
  const {
    client,
    messageActionsData,
    activeChannel,
    activeChannelId,
    channelByMessages,
    userDetails,
    replyFlag,
    // banned_user,
    channels,
  } = useSelector(
    ({ Channels }) => ({
      images: Channels.images,
      client: Channels.client,
      messageActionsData: Channels.messageActionsData,
      pinnedMsg: Channels.pinnedMsg,
      activeChannel: Channels.activeChannel,
      activeChannelId: Channels.activeChannelId,
      channelByMessages: Channels.channelByMessages,
      userDetails: Channels.userDetails,
      replyFlag: Channels.replyFlag,
      // banned_user: Channels.banned_user,
      channels: Channels.channels,
    }),
    shallowEqual,
  );
  console.log(channels, 'channelsssssssssss');
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  let activeChannelMsgs =
    channelByMessages && channelByMessages.length
      ? channelByMessages.filter((x) => x.id === activeChannelId)
      : '';
  const handleMessageActions = useCallback(
    (message) => {
      dispatch(messageActions(message));
    },
    [dispatch],
  );
  const { state } = activeChannel;
  const users = [];
  if (get(state, 'members', null)) {
    Object.keys(get(state, 'members', {})).forEach((d) =>
      users.push(state.members[d].user_id),
    );
  }

  const pinnedMessages = state.pinnedMessages;
  const all_pinned_messages = [];

  if (activeChannelId) {
    pinnedMessages.map((d) =>
      all_pinned_messages.push({
        id: d.id,
        user_id: d.user.id,
        text: d.text,
        user: d.user.name,
        pinned_at: d.pinned_at,
        html: d.html,
        isEdited: d._is_text_updated,
        attachments: get(d, 'attachments', []),
      }),
    );
  }
  const message = all_pinned_messages[index];
  const slideRight = (id) => {
    dispatch(pinnedMsgIdModal(id));
    const nextIndex = index + 1;
    if (nextIndex >= all_pinned_messages.length) {
      setIndex(0);
    } else {
      setIndex(nextIndex);
    }
  };

  const handleModalVisible = useCallback(
    (message) => {
      dispatch(setIsModalVisible(true, message));
    },
    [dispatch],
  );

  const handleOpenPinnedModal = () => {
    dispatch(
      getPinnedMessagesByChannel({
        activeChannelId,
        client,
      }),
    );
    dispatch(setPinnedMessagesModalVisible(true));
  };

  const handleRemoveMessages = (messageToRemove) => {
    setReplyOption(false);
    dispatch(removeSelectMessages(messageToRemove));
    dispatch(addQuotedMessageId(''));
    dispatch(replyMsgFlag(false));
  };

  useEffect(() => {
    if (replyFlag && messageActionsData.length) {
      const { id } = messageActionsData[0];
      setReplyOption(true);
      dispatch(addQuotedMessageId(id));
    }
  }, [replyFlag, messageActionsData, dispatch]);

  // const removeMessagesByJavascriptDom = (data) => {
  //   const { message } = data;
  //   const element = document.getElementById(message.id);
  //   element.style.display = 'none';
  // };
  const handleDeleteMessage = () =>
    Modal.confirm({
      title: 'Delete',
      content: <p>Are you sure you want to delete ?</p>,
      onOk: () => deleteMessages(),
    });

  const deleteMessages = async () => {
    let ids = messageActionsData.filter((i) => i.id);
    let promises = ids.map(async (i) => {
      let response = await deleteMessageById(client, i.id);
      // removeMessagesByJavascriptDom(response);
      dispatch(
        addMessagetoChannelLocal({
          id: activeChannelId,
          message: response.message,
        }),
      );
      return response;
    });
    await Promise.all(promises);
    message.success('Message deleted successfully');
    dispatch(removeSelectMessages());
    if (activeChannel.query) {
      dispatch(getMessagesByChannel(activeChannel));
    }
    setReplyOption(false);
  };

  // const handlePinMessage = async () => {
  //   const message = messageActionsData[0];
  //   await dispatch(
  //     pinMessage({
  //       message: message,
  //       client,
  //     }),
  //   );
  //   await dispatch(
  //     sendPinMessage({
  //       channel: activeChannel,
  //       message_new: {
  //         _type: 'pinned',
  //         text: message.text,
  //         _pinned_message_data: { ...message },
  //       },
  //     }),
  //   );
  //   await dispatch(removeSelectMessages());
  // };

  const handleUnPinMessage = async () => {
    const message = messageActionsData[0];
    await dispatch(
      unpinMessage({
        message: message,
        client,
      }),
    );
    await dispatch(removeSelectMessages());
  };

  const selectedChannel = channels.filter(
    (item) => item.id === activeChannelId,
  );

  const rollToStartOfUnreadMessages = () => {
    if (selectedChannel && selectedChannel.length) {
      const selectedChannelMessages = selectedChannel[0].state.messages;
      let unreadCount = selectedChannel[0].state.unreadCount;
      if (unreadCount) {
        unreadCount = unreadCount * -1;
      } else {
        unreadCount = 0;
      }
      const firstUnreadMsg = selectedChannelMessages.slice(unreadCount);
      if (firstUnreadMsg && firstUnreadMsg.length) {
        setTimeout(() => {
          const messageElem = document.getElementById(firstUnreadMsg[0].id);
          if (messageElem) {
            messageElem.scrollIntoView({
              top: '1000',
              behavior: 'smooth',
              block: 'center',
            });
            setTimeout(() => {
              messageElem.classList.add('highlight-message');
              setTimeout(() => {
                messageElem.classList.remove('highlight-message');
              }, 2000);
            }, 200);
          }
        }, 300);
      }
    }
  };

  const onScroll = () => {
    if (listInnerRef.current && activeChannelMsgs) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (selectedChannel && selectedChannel.length) {
        const unreadCount = selectedChannel[0].state.unreadCount;
        if (unreadCount) {
          rollToStartOfUnreadMessages();
        }
      } else if (scrollTop + clientHeight >= scrollHeight - 100) {
        setScrolledToBottom(true);
        setLoading(false);
      } else {
        setScrolledToBottom(false);
        if (scrollTop === 0 && activeChannelMsgs[0].messages.length > 23) {
          setLoading(true);
        }
      }
    }
  };

  const scrollToBottom = () => {
    listInnerRef.current.scrollTop =
      listInnerRef.current.scrollHeight - listInnerRef.current.clientHeight;
  };

  return (
    <>
      <div className="chatViewBody">
        {activeChannelId ? (
          <>
            {all_pinned_messages.length &&
              message &&
              users.includes(userDetails.id) ? (
              <div className="allPinMsgBox">
                <div className="allPinMsgBoxContent">
                  <div
                    onClick={() => slideRight(message.id)}
                    className="allPinMsgBoxLeft"
                  >
                    <p> Pinned Message #{index + 1}</p>
                    {message && message.text.length > 80 ? (
                      <p>{message.text.slice(0, 79)}...</p>
                    ) : (
                      <p>{message.text}</p>
                    )}
                  </div>
                  <div
                    onClick={handleOpenPinnedModal}
                    className="allPinMsgBoxRight"
                  >
                    <p>View all</p>
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
            <div
              className={
                state.pinnedMessages.length > 0
                  ? 'pinnedMessagesText'
                  : 'chatViewBodyText'
              }
              onScroll={onScroll}
              ref={listInnerRef}
              style={{ overflowY: 'overlay', maxHeight: '1000px' }}
            >
              {(users.includes(userDetails.id) ||
                activeChannel.data.is_broadcast) && (
                  <MessageList
                    userName={userDetails.name}
                    handleMessageActions={(m) => handleMessageActions(m)}
                    handleModalVisible={(m) => handleModalVisible(m)}
                    handleRemoveMessages={(m) => handleRemoveMessages(m)}
                    loading={loading}
                    listInnerRef={listInnerRef}
                  />
                )}
            </div>
            {!isScrolledToBottom && (
              <div className="scrollDown" onClick={scrollToBottom}>
                <i className="fa fa-arrow-down" aria-hidden="true" />
              </div>
            )}
            {(activeChannel.data.is_broadcast === false ||
              userDetails.role === 'admin') && (
                <div className="chatBox">
                  <div className="chatBoxContent">
                    <div className="chatInputBox">
                      <UserEventsUI />
                    </div>
                    {messageActionsData &&
                      messageActionsData.length &&
                      !replyOption ? (
                      <MessageOptions
                        messages={messageActionsData}
                        userDetails={userDetails}
                        handleRemoveMessages={handleRemoveMessages}
                        handleDeleteMessage={() => handleDeleteMessage()}
                        handleUnPinMessage={() => handleUnPinMessage()}
                      />
                    ) : (
                      <>
                        <ReplyTo
                          replyOption={replyOption}
                          messageActionsData={messageActionsData}
                          handleRemoveMessages={handleRemoveMessages}
                        />
                        <InputView
                          channel={activeChannel}
                          setReplyOption={setReplyOption}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
          </>
        ) : (
          <div
            style={{
              width: '100%',
              height: '680px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spin indicator={antIcon} />
          </div>
        )}
      </div>
      {pinnedMessagesModal && (
        <PinnedMessages
          activeChannel={activeChannel}
          userDetails={userDetails}
        />
      )}
      <DeletePinnedMessage />
    </>
  );
}, componentRender);

export default ChatView;
