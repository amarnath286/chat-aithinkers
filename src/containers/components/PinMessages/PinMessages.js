import React, { useCallback, Fragment, useRef, useEffect } from 'react';

import { PushpinOutlined, FileFilled } from '@ant-design/icons';
import { Menu, Button, Dropdown, Row, Col } from 'antd';
import { get, mapValues, groupBy } from 'lodash';
import moment from 'moment';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import {
  setPinnedMessagesModalVisible,
  getPinnedMessagesByChannel,
  pinnedMsgIdModal,
  unpinMessage,
  removeSelectMessages,
} from '../../../actions/channel';
import InfoModal from '../../../components/Modal';
import { getFormattedHTML } from '../../../utils/utilityFunctions';

const PinMessagesByChannel = (
  activeChannel,
  rollPinMessage,
  // handleModalVisible,
) => {
  const dispatch = useDispatch();
  const defaultTheme = localStorage.getItem('theme');
  const pinnedMessagesRef = useRef(null);
  const { client, activeChannelId, pinnedMessagesModal, userDetails } =
    useSelector(({ Channels }) => Channels, shallowEqual);
  const { state } = activeChannel.activeChannel;
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

  useEffect(() => {
    if (pinnedMessagesRef.current) {
      pinnedMessagesRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'end',
      });
      pinnedMessagesRef.current.style.backgroundColor =
        defaultTheme === 'light' ? '#D6D6D6' : '#2b343d';
    }
  }, [defaultTheme]);

  const handleClose = useCallback(() => {
    dispatch(setPinnedMessagesModalVisible(false));
  }, [dispatch]);

  const unpinMessages = async () => {
    for (let i = 0; i < pinnedMessages.length; i++) {
      await dispatch(
        unpinMessage({
          message: pinnedMessages[i],
          client,
        }),
      );
    }

    await dispatch(
      getPinnedMessagesByChannel({
        activeChannelId,
        client,
      }),
    );

    await dispatch(removeSelectMessages());
    handleClose();
  };
  const handlePinSelectMessage = (id) => {
    dispatch(pinnedMsgIdModal(id));
    dispatch(setPinnedMessagesModalVisible(false));
  };

  const handleUnPinMessage = async (id) => {
    await dispatch(
      unpinMessage({
        message: id,
        client,
      }),
    );
  };
  let messagesGroupedByDate = mapValues(
    groupBy(all_pinned_messages, (record) =>
      moment(record.pinned_at).format('LL'),
    ),
  );

  const renderMessages = (data) =>
    Object.keys(data).map((key, i) => (
      <Fragment key={key}>
        <p className="pinnedTimeDate">{key}</p>
        {data[key] &&
          data[key].map((id, index) => {
            return (
              <div
                key={index}
                ref={pinnedMessagesRef}
                style={{ padding: '10px' }}
              >
                {/* {id.pinned_at && (
                  <p className="pinnedTimeDate">
                    {moment(id.pinned_at).format('LL')}
                  </p>
                )} */}
                {userDetails.id === id.user_id ? (
                  <div
                    className="pinnedChatRight"
                    // onClick={() => handlePinSelectMessage(id.id)}
                  >
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item key="1">
                            <p onClick={() => handleUnPinMessage(id)}>
                              <PushpinOutlined />
                              <span className="unpinText">Unpin</span>
                            </p>
                          </Menu.Item>
                        </Menu>
                      }
                      trigger={['contextMenu']}
                      disabled={userDetails.role !== 'admin'}
                    >
                      <div className="pinnedChatTextBox">
                        <div
                          className="pinnedChatNameText"
                          onClick={() => handlePinSelectMessage(id.id)}
                        >
                          <h3
                            style={{
                              marginBottom: '0px',
                              fontWeight: '700',
                              // color: '#5682a3'
                            }}
                          >
                            {id.user}
                          </h3>
                          <div className="inputSendText">
                            <div className="attachImagesFiles">
                              {id.attachments &&
                                id.attachments.map((image, index) => (
                                  <div
                                    className="list-group-item"
                                    key={index}
                                    // style={{ marginBottom: '2px' }}
                                  >
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
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
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
                                      <img
                                        src={image.image_url}
                                        alt={image.fallback}
                                        style={{
                                          cursor: 'pointer',
                                        }}
                                        // onClick={(e) => {
                                        //   e.stopPropagation();
                                        //   handleModalVisible(updateMessage);
                                        // }}
                                      />
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                ))}
                            </div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: getFormattedHTML(id.html),
                              }}
                            />
                            {id.isEdited && (
                              <span
                                className="message-editor"
                                id={`message-editor-${id.id}`}
                              >
                                (edited){' '}
                              </span>
                            )}
                          </div>
                          <div className="timestamp">
                            <span
                              style={
                                {
                                  // color: '#b3b3b3',
                                  // fontWeight: 500
                                }
                              }
                            >
                              {moment(id.pinned_at).format('hh:mm A')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Dropdown>
                  </div>
                ) : (
                  <div
                    className="pinnedChatLeft"
                    // onClick={() => handlePinSelectMessage(id.id)}
                  >
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item key="1">
                            <p onClick={() => handleUnPinMessage(id)}>
                              <PushpinOutlined />
                              <span className="unpinText">Unpin</span>
                            </p>
                          </Menu.Item>
                        </Menu>
                      }
                      trigger={['contextMenu']}
                      disabled={userDetails.role !== 'admin'}
                    >
                      <div className="pinnedChatTextBox">
                        <div
                          className="pinnedChatNameText"
                          onClick={() => handlePinSelectMessage(id.id)}
                        >
                          <h3
                            style={{
                              marginBottom: '0px',
                              fontWeight: '700',
                              // color: '#5682a3'
                            }}
                          >
                            {id.user}
                          </h3>
                          <div className="inputSendText">
                            <div className="attachImagesFiles">
                              {id.attachments &&
                                id.attachments.map((image, index) => (
                                  <div
                                    className="list-group-item"
                                    key={index}
                                    // style={{ marginBottom: '2px' }}
                                  >
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
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
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
                                      <img
                                        src={image.image_url}
                                        alt={image.fallback}
                                        style={{
                                          cursor: 'pointer',
                                        }}
                                        // onClick={(e) => {
                                        //   e.stopPropagation();
                                        //   handleModalVisible(updateMessage);
                                        // }}
                                      />
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                ))}
                            </div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: getFormattedHTML(id.html),
                              }}
                            />
                            {id.isEdited && (
                              <span
                                className="message-editor"
                                id={`message-editor-${id.id}`}
                              >
                                (edited){' '}
                              </span>
                            )}
                          </div>
                          <div className="timestamp">
                            <span
                              style={
                                {
                                  // color: '#b3b3b3',
                                  // fontWeight: 500
                                }
                              }
                            >
                              {moment(id.pinned_at).format('hh:mm A')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Dropdown>
                  </div>
                )}
              </div>
            );
          })}
      </Fragment>
    ));

  return (
    <>
      <InfoModal
        title={'All Pinned Messages'}
        className="pinnedMessages createFormModel"
        isOpen={pinnedMessagesModal}
        onClose={() => handleClose()}
      >
        <div className="pinnedChatBox">
          {renderMessages(messagesGroupedByDate)}
        </div>
        {userDetails.role === 'admin' && (
          <div className="pinnedButtonBox">
            <Button type="primary" onClick={unpinMessages}>
              UnPin All
            </Button>
          </div>
        )}
      </InfoModal>
    </>
  );
};

export default PinMessagesByChannel;
