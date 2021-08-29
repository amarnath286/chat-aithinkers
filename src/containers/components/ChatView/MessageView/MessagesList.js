import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  Fragment,
} from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { Row, message, Spin } from 'antd';
import { mapValues, groupBy } from 'lodash';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import {
  getMessagesByChannel,
  pinnedMsgIdModal,
} from '../../../../actions/channel';
import ImagePreview from './ImagePreviewModal';
import { getFormattedDate } from './MessageView.helper';

import MessageView from './index';

let messagesEnd;

const MessagesListUI = ({
  handleUpdateMessage,
  userName,
  handleMessageActions,
  handleModalVisible,
  handleRemoveMessages,
  loading,
  listInnerRef,
}) => {
  const {
    activeChannelId,
    activeChannel,
    searchResults,
    channelByMessages,
    channelSearchMsg,
    userDetails,
    msgNotification,
    pinnedMsgId,
  } = useSelector((st) => st.Channels);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const dispatch = useDispatch();
  const [activeId, setActiveId] = useState('');
  const messageRef = useRef(null);
  let dateRefs = useRef([]);
  const topLabelRef = useRef(null);
  let scrolling = useRef(false);
  const rollMessagesRef = useRef(false);
  let activeBucket = [],
    messages = [];
  const messagesList = [];

  const { state } = activeChannel;

  if (activeChannelId) {
    Object.keys(state.messages).map((d) =>
      messagesList.push(state.messages[d]),
    );
    activeBucket = channelByMessages.filter((i) => i.id === activeChannelId);
    messages = activeBucket && activeBucket[0].messages;
  }

  const handleCallbackModal = useCallback(
    (m) => {
      handleModalVisible(m);
    },
    [handleModalVisible],
  );

  useEffect(() => {
    dateRefs.current = [];
  }, [activeChannelId]);

  useEffect(() => {
    if (
      activeChannelId !== activeId &&
      !scrolling.current &&
      !rollMessagesRef.current
    ) {
      messagesEnd &&
        messagesEnd.scrollIntoView({ behavior: 'auto', block: 'end' });
      rollMessagesRef.current = true;
    }
    setActiveId(activeChannelId);
  }, [activeChannelId, activeId]);

  useEffect(() => {
    if ((searchResults && searchResults.length > 0) || msgNotification) {
      let msgId = channelSearchMsg
        ? channelSearchMsg.id
        : msgNotification.message.id;
      const messageChannel = messages.find((v) => v.id === msgId);
      if (!messageChannel) {
        return false;
      } else {
        setTimeout(() => {
          const messageElem = document.getElementById(messageChannel.id);
          if (messageElem) {
            scrolling.current = true;
            messageElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              messageElem.classList.add('highlight-message');
              setTimeout(() => {
                messageElem.classList.remove('highlight-message');
              }, 5000);
            }, 200);
          }
        }, 300);
      }
    }
  }, [
    channelSearchMsg,
    messages,
    activeChannelId,
    msgNotification,
    searchResults,
  ]);

  useEffect(() => {
    if (pinnedMsgId) {
      if (messages) {
        const pinMessageChannel = messages.find((v) => v.id === pinnedMsgId);
        if (!pinMessageChannel) {
          message.error('This message has been deleted');
        } else {
          setTimeout(() => {
            const messageElem = document.getElementById(pinMessageChannel.id);
            if (messageElem) {
              scrolling.current = true;
              messageElem.scrollIntoView({
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
    }
    dispatch(pinnedMsgIdModal(''));
  }, [dispatch, messages, pinnedMsgId]);

  const rollPinMessage = (pinnedId) => {
    if (messages) {
      const pinMessageChannel = messages.find((v) => v.id === pinnedId);
      if (!pinMessageChannel) {
        // message.error('This message has been deleted');
      } else {
        setTimeout(() => {
          const messageElem = document.getElementById(pinMessageChannel.id);
          if (messageElem) {
            scrolling.current = true;
            messageElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  const rollReplyMessage = (quoted_message_id) => {
    if (messages) {
      const replyMessage = messages.find((v) => v.id === quoted_message_id);
      if (!replyMessage) {
        message.success('This message has been deleted');
      } else {
        setTimeout(() => {
          const messageElem = document.getElementById(replyMessage.id);
          if (messageElem) {
            scrolling.current = true;
            messageElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  useEffect(() => {
    if (loading && listInnerRef.current) {
      if (activeChannel.query) {
        dispatch(getMessagesByChannel(activeChannel));
      }
    } else {
      return false;
    }
  }, [activeChannel, dispatch, listInnerRef, loading]);

  const onScroll = () => {
    const messageBox = messageRef.current;
    const topLabelDate = topLabelRef.current;
    const dateLabels = (dateRefs.current || []).filter((d) => d !== null);
    let currentLabel = null;
    dateLabels.forEach((dateLabel) => {
      if (messageBox.scrollTop >= dateLabel.offsetTop) {
        currentLabel = dateLabel;
      }
    });
    if (currentLabel) {
      topLabelDate.style.opacity = '1';
      topLabelDate.innerText = currentLabel.innerText;
    } else {
      topLabelDate.style.opacity = '0';
    }
  };

  // const getIsPinnedMessageDeleted = (message) => {
  //   return false;
  // };

  let messagesGroupedByDate = mapValues(
    groupBy(messagesList, (record) => moment(record.created_at).format('LL')),
  );
  // console.log('messagesGroupedByDate', messagesGroupedByDate);
  const lastReadMsg = messagesList.slice(-state.unreadCount);
  const renderMessages = (data) =>
    Object.keys(data).map((key, i) => (
      <Fragment key={key}>
        <p ref={(ref) => dateRefs.current.push(ref)} className="pinnedTimeDate">
          {getFormattedDate(key)}
        </p>
        {data[key] &&
          data[key].map((channelMsg, i) => {
            return (
              <>
                {state.unreadCount &&
                  lastReadMsg &&
                  lastReadMsg.length &&
                  channelMsg.id === lastReadMsg[0].id ? (
                  <Row
                    // ref={dividerRef}
                    key={`unread-${i}`}
                    justify="center"
                    className="dayAndDate timeAndDateAndDay"
                  //className={`dayAndDate ${stickDate}`}
                  // ref={(ref) => dateRefs.current.push(ref)}
                  >
                    <span>{state.unreadCount} Unread Messages</span>
                  </Row>
                ) : (
                  ''
                )}
                <div
                  key={`${channelMsg.id}-message-${i}`}
                  className="viewMsgList"
                  style={{ padding: '0 0px 15px 0px', position: 'relative' }}
                >
                  {!channelMsg._type &&
                    (channelMsg.type === 'regular' || 'deleted') &&
                    userDetails.id === channelMsg.user.id ? (
                    <div className="chatMsgRight">
                      <MessageView
                        key={channelMsg.id}
                        channelMsg={channelMsg}
                        userName={userName}
                        handleModalVisible={handleCallbackModal}
                        handleRemoveMessages={handleRemoveMessages}
                        userDetails={userDetails}
                        activeChannelId={activeChannelId}
                        rollPinMessage={rollPinMessage}
                        rollReplyMessage={rollReplyMessage}
                        messagesEnd={messagesEnd}
                        activeId={activeId}
                        rollMessagesRef={rollMessagesRef}
                      />
                    </div>
                  ) : channelMsg._type === 'pinned' &&
                    channelMsg.type === 'regular' ? (
                    <div className="chatMsgCenter">
                      <MessageView
                        key={channelMsg.id}
                        channelMsg={channelMsg}
                        userName={userName}
                        handleModalVisible={handleCallbackModal}
                        handleRemoveMessages={handleRemoveMessages}
                        userDetails={userDetails}
                        activeChannelId={activeChannelId}
                        rollPinMessage={rollPinMessage}
                        rollReplyMessage={rollReplyMessage}
                        messagesEnd={messagesEnd}
                        activeId={activeId}
                      />
                    </div>
                  ) : (
                    <div className="chatMsgLeft">
                      <MessageView
                        key={channelMsg.id}
                        channelMsg={channelMsg}
                        userName={userName}
                        handleModalVisible={handleCallbackModal}
                        handleRemoveMessages={handleRemoveMessages}
                        userDetails={userDetails}
                        activeChannelId={activeChannelId}
                        rollPinMessage={rollPinMessage}
                        rollReplyMessage={rollReplyMessage}
                        messagesEnd={messagesEnd}
                        activeId={activeId}
                      // isPinnedMessageDeleted={getIsPinnedMessageDeleted(
                      //   channelMsg,
                      // )}
                      />
                    </div>
                  )}
                </div>
              </>
            );
          })}
      </Fragment>
    ));

  return (
    <>
      <div
        style={{
          // padding: '10px',
          textAlign: 'center',
        }}
      >
        {loading ? <Spin indicator={antIcon} /> : ''}
      </div>
      <div className="messageContainer" id="messageContainer">
        <div className="divider sticky">
          <span
            ref={topLabelRef}
            id="date-label"
            style={{
              opacity: 0,
            }}
          ></span>
        </div>
        <div
          className="messagesList"
          ref={messageRef}
          onScroll={() => onScroll()}
        >
          {!messages.length ? (
            <p className="createGroupText">
              {' '}
              ThinkSabio Admin created a new group{' '}
            </p>
          ) : messagesList.length && messagesList ? (
            renderMessages(messagesGroupedByDate)
          ) : (
            []
          )}
        </div>
      </div>
      <div
        style={{ float: 'left', clear: 'both' }}
        ref={(el) => {
          messagesEnd = el;
        }}
      />
      <ImagePreview />
    </>
  );
};
export default MessagesListUI;
