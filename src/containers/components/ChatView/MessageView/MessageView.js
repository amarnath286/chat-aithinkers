import React, { memo, useEffect, useState } from 'react';

import {
  CheckCircleFilled,
  FileFilled,
  StopOutlined,
  // PushpinOutlined,
  // EditOutlined,
  // CheckCircleOutlined,
  // DeleteOutlined,
  PushpinFilled,
} from '@ant-design/icons';
import { Row, Col, Avatar, message, Dropdown, Modal } from 'antd';
import { get, find } from 'lodash';
import moment from 'moment';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
  messageActions,
  pinMessage,
  sendPinMessage,
  removeSelectMessages,
  unpinMessage,
  replyMsgFlag,
  editMessage,
  deleteMessageById,
  addMessagetoChannelLocal,
} from '../../../../actions/channel';
import {
  getRandomColor,
  getFormattedHTML,
} from '../../../../utils/utilityFunctions';
import { RightClickMenu } from './MessageView.helper';
const color = getRandomColor();

// eslint-disable-next-line react/display-name
const MessageView = memo(
  ({
    channelMsg,
    userDetails,
    handleModalVisible,
    handleRemoveMessages,
    rollPinMessage,
    rollReplyMessage,
    messagesEnd,
    activeId,
  }) => {
    let dispatch = useDispatch();
    const [selectedMessage, setSelectedMessage] = useState(false);
    const [updateMessage, setUpdateMessage] = useState(channelMsg);
    const [rightMenuOpen, setRightMenuOpen] = useState(false);

    const {
      client,
      activeChannel,
      messageActionsData,
      activeChannelId,
      replyFlag,
      messageToEdit,
    } = useSelector(
      ({ Channels }) => ({
        client: Channels.client,
        activeChannel: Channels.activeChannel,
        search: Channels.search,
        searchResults: Channels.searchResults,
        messageActionsData: Channels.messageActionsData,
        activeChannelId: Channels.activeChannelId,
        replyFlag: Channels.replyFlag,
        messageToEdit: Channels.messageToEdit,
      }),
      shallowEqual,
    );
    const { state } = activeChannel;
    const is_broadcast = state._channel.data.is_broadcast;
    const defaultTheme = localStorage.getItem('theme');
    const users = [];
    Object.keys(state.members).forEach((d) =>
      users.push(state.members[d].user.id),
    );
    const blockedList = Object.keys(state.members).filter(
      (d) => state.members[d].banned === true,
    );
    useEffect(() => {
      setUpdateMessage(channelMsg);
      if (!messageActionsData.length) {
        setSelectedMessage(false);
      }
    }, [channelMsg, messageActionsData]);

    useEffect(() => {
      if (activeChannelId === activeId) {
        messagesEnd &&
          messagesEnd.scrollIntoView({ behavior: 'auto', block: 'end' });
      }
    }, [activeChannelId, activeId, messagesEnd]);

    useEffect(() => {
      document.addEventListener('contextmenu', (e) => {
        // if (e.target) {
        //   handleSelectMessage()
        // }
        e.preventDefault();
      });
    }, []);

    const handlePinSelectMessage = () => {
      const pinnedId = updateMessage._pinned_message_data.id;
      rollPinMessage(pinnedId);
    };

    const handleReplyMessageSelect = () => {
      const replyMessageId = updateMessage.quoted_message.id;
      rollReplyMessage(replyMessageId);
    };

    const handleSelectMessage = () => {
      setSelectedMessage(selectedMessage ? false : true);
      dispatch(messageActions(updateMessage));
      if (selectedMessage) {
        handleRemoveMessages();
      }
    };
    const handleUnSelectMessage = () => {
      setSelectedMessage(false);
      handleRemoveMessages(updateMessage);
    };
    const handlePinMessage = async (updateMessage) => {
      let pinMsg;
      if (updateMessage.quoted_message) {
        delete updateMessage.quoted_message;
        pinMsg = updateMessage;
      } else {
        pinMsg = updateMessage;
      }
      await dispatch(
        pinMessage({
          message: pinMsg,
          client,
        }),
      );
      await dispatch(
        sendPinMessage({
          channel: activeChannel,
          message_new: {
            _type: 'pinned',
            text: updateMessage.text,
            _pinned_message_data: { ...updateMessage },
          },
        }),
      );
      await dispatch(removeSelectMessages());
    };

    const handleUnPinMessage = async (updateMessage) => {
      await dispatch(
        unpinMessage({
          message: updateMessage,
          client,
        }),
      );
      await dispatch(removeSelectMessages());
    };

    const handleReplyOption = async (updateMessage) => {
      await cancelCurrentMessageAction();

      await dispatch(messageActions(updateMessage));
      await dispatch(replyMsgFlag(true));
    };

    const handleEditMessage = async () => {
      await cancelCurrentMessageAction();

      await dispatch(editMessage(updateMessage));
    };

    const cancelCurrentMessageAction = async () => {
      if (messageToEdit) {
        await dispatch(editMessage());
      }
      if (replyFlag) {
        handleRemoveMessages();
      }
    };

    const handleCopyMessage = async (message) => {
      await navigator.clipboard.writeText(message.text);
    };

    const ReplyThread = (quoted_message) => {
      if (!quoted_message) {
        return null;
      }

      let type = get(quoted_message, 'attachments[0].type');
      let msgtype = get(quoted_message, 'type');
      let userName = get(quoted_message, 'user.name');
      let message = get(quoted_message, 'text');
      let image =
        type === 'image'
          ? get(quoted_message, 'attachments[0].image_url')
          : type === 'file'
          ? get(quoted_message, 'attachments[0].name')
          : '';
      return (
        <Row
          id={`message-${message.id}`}
          style={{
            borderLeft: '3px solid #3a6d99',
            margin: '5px',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleReplyMessageSelect(id);
          }}
        >
          <Col span={24}>
            <Row>
              <Col>
                {' '}
                <div style={{ paddingLeft: '10px' }}></div>
              </Col>
              {msgtype === 'deleted' ? (
                <Col style={{ paddingLeft: '5px' }}>
                  {' '}
                  <div className="deleteMsgText">
                    <StopOutlined />
                    <span className="delteIconStop">
                      This message was deleted
                    </span>
                  </div>
                </Col>
              ) : (
                <Col style={{ paddingLeft: '5px', overflow: 'hidden' }}>
                  {' '}
                  <span className="userNameText">{userName}</span>
                  <br />
                  <span style={{ fontWeight: 500, color: '#a3b3a9' }}>
                    {type === 'image' ? (
                      <img
                        src={image}
                        style={{ width: '70px', height: '70px' }}
                        alt={image}
                      />
                    ) : type === 'file' ? (
                      <a href={image} alt={image}>
                        {image}
                      </a>
                    ) : (
                      ''
                    )}
                  </span>
                  <span className="subMsgText  replyMessage">
                    {message.substring(0, 20)}
                  </span>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      );
    };

    const handleDeleteMessage = () =>
      Modal.confirm({
        title: 'Delete',
        content: <p>Are you sure you want to delete ?</p>,
        onOk: () => deleteMessages(),
      });

    const deleteMessages = async () => {
      let id = updateMessage.id;
      let response = await deleteMessageById(client, id);
      await dispatch(
        addMessagetoChannelLocal({
          id: activeChannelId,
          message: response.message,
        }),
      );
      handleRemoveMessages(updateMessage);
      message.success('Message deleted successfully');
      return;
    };

    let {
      quoted_message,
      type,
      _type,
      created_at,
      text,
      user,
      id,
      attachments,
      _pinned_message_data,
      html,
      _is_text_updated,
      pinned,
    } = updateMessage;
    const handleViewMessageText = () => {
      return (
        <>
          {_is_text_updated ? (
            <span id={`message-div-${id}`}>
              <div
                dangerouslySetInnerHTML={{ __html: getFormattedHTML(html) }}
              />
              <span className="message-editor" id={`message-editor-${id}`}>
                (edited){' '}
              </span>
            </span>
          ) : (
            <span
              id={`message-div-${id}`}
              style={{
                fontSize: '13px',
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: getFormattedHTML(html) }}
              />
            </span>
          )}
        </>
      );
    };
    return (
      <>
        {type === 'regular' && !_type ? (
          <Dropdown
            disabled={(messageActionsData || []).length > 0}
            overlay={RightClickMenu(
              blockedList,
              userDetails,
              is_broadcast,
              updateMessage,
              users,
              user,
              id,
              handleReplyOption,
              handleUnPinMessage,
              handlePinMessage,
              handleUnSelectMessage,
              messageActionsData,
              handleEditMessage,
              handleSelectMessage,
              handleCopyMessage,
              handleDeleteMessage,
            )}
            trigger={['contextMenu']}
            onVisibleChange={(e) => setRightMenuOpen(e)}
          >
            <div
              className={id ? id : ''}
              style={{
                backgroundColor:
                  ((messageActionsData.length && selectedMessage) ||
                    rightMenuOpen) &&
                  defaultTheme === 'light'
                    ? '#ebebeb'
                    : ((messageActionsData.length && selectedMessage) ||
                        rightMenuOpen) &&
                      defaultTheme === 'dark'
                    ? '#2b343d'
                    : messageActionsData.length && selectedMessage
                    ? 'red'
                    : '',
              }}
              id={id ? id : ''}
            >
              <div className="centerViewMsgBox">
                <div
                  className="circleViewMsgSelect"
                  style={{ alignSelf: 'center', textAlign: 'center' }}
                >
                  {messageActionsData.length ? (
                    selectedMessage ? (
                      <CheckCircleFilled
                        size={25}
                        style={{
                          fontSize: '25px',
                          color: '#2FC058',
                          opacity: 1,
                        }}
                        onClick={() => handleUnSelectMessage()}
                      />
                    ) : (
                      (userDetails.id === user.id ||
                        userDetails.role === 'admin') && (
                        <i
                          className="fa fa-circle-thin"
                          style={{
                            fontSize: '25px',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleSelectMessage()}
                          aria-hidden="true"
                        />
                      )
                    )
                  ) : null}
                </div>
                <div
                  className="msgViewTestContent"
                  onClick={
                    messageActionsData.length &&
                    !selectedMessage &&
                    (userDetails.id === user.id || userDetails.role === 'admin')
                      ? () => handleSelectMessage()
                      : () => {}
                  }
                  style={{
                    cursor:
                      messageActionsData.length &&
                      !selectedMessage &&
                      (userDetails.id === user.id ||
                        userDetails.role === 'admin')
                        ? 'pointer'
                        : 'auto',
                  }}
                >
                  {userDetails.id === user.id ? (
                    ''
                  ) : user.image ? (
                    <div className="msgViewAvatar">
                      <Avatar size={42} src={user.image} />
                    </div>
                  ) : (
                    <div className="msgViewAvatar">
                      <Avatar
                        style={{
                          color: 'black',
                          backgroundColor: get(user, 'color')
                            ? get(user, 'color')
                            : color,
                          opacity: '1.2',
                          fontSize: 16,
                        }}
                        size={42}
                      >
                        <span>
                          {user.name
                            ? user.name.slice(0, 1).toUpperCase()
                            : user.first_name
                            ? user.first_name.slice(0, 1).toUpperCase()
                            : '-'}
                        </span>
                      </Avatar>
                    </div>
                  )}
                  <div className="msgViewNameText">
                    {' '}
                    <h3>
                      {userDetails.id === user.id
                        ? 'Me'
                        : is_broadcast
                        ? 'ThinkSabio-BroadCast'
                        : user.name
                        ? user.name
                        : user.first_name
                        ? user.first_name
                        : '--'}
                    </h3>
                    {ReplyThread(quoted_message)}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="inputSendTextBox"
                    >
                      {(text || attachments) && (
                        <div className="inputSendText">
                          <div className="attachImagesFiles">
                            {attachments &&
                              attachments.map((image, index) => (
                                <>
                                  {image.type === 'file' ||
                                  image.type === 'media' ? (
                                    <Row>
                                      <Col>
                                        <div
                                          style={{
                                            padding: '0px 5px 0px 0px',
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <FileFilled
                                            style={{ fontSize: '30px' }}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                      </Col>
                                      <Col>
                                        <p
                                          style={{
                                            fontSize: '15px',
                                            fontWeight: 500,
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <a
                                            href={image.asset_url}
                                            alt={image.title}
                                          >
                                            {image.title}
                                          </a>
                                        </p>
                                      </Col>
                                    </Row>
                                  ) : image.type === 'image' ||
                                    image.type === 'image/jpeg' ? (
                                    <div
                                      className="list-group-item"
                                      key={index}
                                      // style={{ marginBottom: '2px' }}
                                    >
                                      <img
                                        src={image.image_url}
                                        alt={image.fallback}
                                        style={{
                                          cursor: 'pointer',
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleModalVisible(updateMessage);
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                </>
                              ))}
                          </div>
                          {handleViewMessageText()}
                        </div>
                      )}
                    </div>
                    {pinned && <PushpinFilled />}
                    <div
                      className="timestamp"
                      onClick={() => {
                        // eslint-disable-next-line no-unused-expressions
                        !users.includes(userDetails.id) && !is_broadcast
                          ? message.warning('Please Join Group')
                          : blockedList.includes(userDetails.id)
                          ? message.warning('You are blocked in this group')
                          : is_broadcast && userDetails.role !== 'admin'
                          ? null
                          : userDetails.role !== 'admin' &&
                            userDetails.id !== user.id &&
                            messageActionsData.length > 0
                          ? null
                          : find(messageActionsData, (o) => o.id === id)
                          ? handleUnSelectMessage()
                          : handleSelectMessage();
                      }}
                    >
                      <span
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        {moment(created_at).format('hh:mm A')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Dropdown>
        ) : type === 'deleted' && !_type ? (
          <div className={id ? id : ''} id={id ? id : ''}>
            <div className="centerViewMsgBox">
              <div className="msgViewTestContent">
                {userDetails.id === user.id ? (
                  ''
                ) : user.image ? (
                  <div className="msgViewAvatar">
                    <Avatar size={42} src={user.image} />
                  </div>
                ) : (
                  <div className="msgViewAvatar">
                    <Avatar
                      style={{
                        color: 'black',
                        backgroundColor: get(user, 'color')
                          ? get(user, 'color')
                          : color,
                        opacity: '1.2',
                        fontSize: 16,
                      }}
                      size={42}
                    >
                      <span>
                        {user.name
                          ? user.name.slice(0, 1).toUpperCase()
                          : user.first_name
                          ? user.first_name.slice(0, 1).toUpperCase()
                          : '-'}
                      </span>
                    </Avatar>
                  </div>
                )}
                <div className="msgViewNameText">
                  <div className="deleteMsgText">
                    <StopOutlined />
                    <span className="delteIconStop">
                      This message was deleted
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={id ? id : ''}
            id={id ? id : ''}
            style={{ cursor: 'pointer' }}
          >
            <div className="pinnedDateBox">
              <div className="pinnedDateBoxText" style={{ color: '#999' }}>
                <p style={{ color: '#ae9661' }}> {user.name} </p>
                &nbsp;pinned &nbsp;
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#999',
                  }}
                >
                  <span
                    onClick={(updateMessage) =>
                      handlePinSelectMessage(updateMessage)
                    }
                  >
                    {text && text.length <= 20
                      ? '<<' + text + '>>'
                      : text && text.length > 20
                      ? '<<' + text.slice(0, 21) + '...>>'
                      : _pinned_message_data.attachments !== null &&
                        _pinned_message_data.attachments[0].type === 'image'
                      ? '<<Photo>>'
                      : _pinned_message_data.attachments !== null &&
                        _pinned_message_data.attachments[0].type === 'file'
                      ? '<<File>>'
                      : ''}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);

export default MessageView;
