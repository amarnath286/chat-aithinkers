import React from 'react';

import {
  CheckCircleFilled,
  PushpinOutlined,
  EditOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { find } from 'lodash';
import moment from 'moment';
export const RightClickMenu = (
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
) => (
  <Menu className="menuList1">
    {blockedList.includes(userDetails.id) ? (
      ''
    ) : (
      <>
        {(is_broadcast && userDetails.role === 'admin') || !is_broadcast ? (
          <Menu.Item key="0" className="menuList">
            <p onClick={() => handleReplyOption(updateMessage)}>
              <i className="fa fa-reply" aria-hidden="true"></i>
              <span className="unpinText">Reply</span>
            </p>
          </Menu.Item>
        ) : null}

        {updateMessage && updateMessage.pinned === true
          ? userDetails.role === 'admin' && (
              <Menu.Item key="1" className="menuList">
                <p onClick={() => handleUnPinMessage(updateMessage)}>
                  <PushpinOutlined />
                  <span className="unpinText">Unpin</span>
                </p>
              </Menu.Item>
            )
          : ((is_broadcast && userDetails.role === 'admin') ||
              !is_broadcast) && (
              <Menu.Item key="1" className="menuList">
                <p onClick={() => handlePinMessage(updateMessage)}>
                  <PushpinOutlined />
                  <span className="unpinText">Pin</span>
                </p>
              </Menu.Item>
            )}

        {!users.includes(userDetails.id) &&
        !is_broadcast ? null : userDetails.id !== user.id &&
          is_broadcast ? null : userDetails.id !== user.id &&
          !is_broadcast ? null : (
          <Menu.Item key="2" className="menuList">
            <p onClick={handleEditMessage}>
              <EditOutlined />
              <span className="unpinText">Edit</span>
            </p>
          </Menu.Item>
        )}

        {userDetails.id === user.id || userDetails.role === 'admin' ? (
          <Menu.Item key="3" className="menuList">
            {find(messageActionsData, (o) => o.id === id) ? (
              <p onClick={() => handleUnSelectMessage()}>
                <CheckCircleFilled
                  size={25}
                  style={{
                    fontSize: '25px',
                    color: '#2FC058',
                    opacity: 1,
                  }}
                />
                <span className="unpinText">UnSelect</span>
              </p>
            ) : (
              <p onClick={() => handleSelectMessage(updateMessage)}>
                <CheckCircleOutlined />
                <span className="unpinText">Select</span>
              </p>
            )}
          </Menu.Item>
        ) : null}

        <Menu.Item key="4" className="menuList">
          <p onClick={() => handleCopyMessage(updateMessage)}>
            <i className="fa fa-copy" aria-hidden="true" />
            <span className="unpinText">Copy</span>
          </p>
        </Menu.Item>
        {userDetails.id === user.id || userDetails.role === 'admin' ? (
          <Menu.Item key="5" className="menuList">
            <p onClick={handleDeleteMessage}>
              <DeleteOutlined />
              <span className="unpinText">Delete</span>
            </p>
          </Menu.Item>
        ) : null}
      </>
    )}
  </Menu>
);

export const getDate = (DateField) => {
  let dateToShow = '';
  switch (true) {
    case DateField !== 'today' &&
      moment(DateField).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'):
      dateToShow = 'Today';
      break;
    case DateField !== 'today' &&
      moment(DateField).format('YYYY-MM-DD') ===
        moment().subtract(1, 'day').format('YYYY-MM-DD'):
      dateToShow = 'Yesterday';
      break;
    case DateField !== 'today' &&
      moment(DateField).format('YYYY-MM-DD') ===
        moment().subtract(2, 'day').format('YYYY-MM-DD'):
    case DateField !== 'today' &&
      moment(DateField).format('YYYY-MM-DD') ===
        moment().subtract(3, 'day').format('YYYY-MM-DD'):
    case DateField !== 'today' &&
      moment(DateField).format('YYYY-MM-DD') ===
        moment().subtract(4, 'day').format('YYYY-MM-DD'):
    case DateField !== 'today' &&
      moment(DateField).format('YYYY-MM-DD') ===
        moment().subtract(5, 'day').format('YYYY-MM-DD'):
    case DateField !== 'today' &&
      moment(DateField).format('YYYY-MM-DD') ===
        moment().subtract(6, 'day').format('YYYY-MM-DD'):
    case DateField !== 'today' &&
      moment(DateField).format('YYYY-MM-DD') ===
        moment().subtract(7, 'day').format('YYYY-MM-DD'):
      dateToShow = moment(DateField).format('dddd');
      break;
    case DateField === 'today':
      dateToShow = '';
      break;
    default:
      dateToShow = moment(DateField).format('DD MMM YYYY');
  }
  return dateToShow;
};

export const getFormattedDate = (date) => {
  let dateToShow = '';
  switch (true) {
    case moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'):
      dateToShow = 'Today';
      break;
    case moment(date).format('YYYY-MM-DD') ===
      moment().subtract(1, 'day').format('YYYY-MM-DD'):
      dateToShow = 'Yesterday';
      break;
    case moment(date).format('YYYY-MM-DD') ===
      moment().subtract(2, 'day').format('YYYY-MM-DD'):
    case moment(date).format('YYYY-MM-DD') ===
      moment().subtract(3, 'day').format('YYYY-MM-DD'):
    case moment(date).format('YYYY-MM-DD') ===
      moment().subtract(4, 'day').format('YYYY-MM-DD'):
    case moment(date).format('YYYY-MM-DD') ===
      moment().subtract(5, 'day').format('YYYY-MM-DD'):
    case moment(date).format('YYYY-MM-DD') ===
      moment().subtract(6, 'day').format('YYYY-MM-DD'):
    case moment(date).format('YYYY-MM-DD') ===
      moment().subtract(7, 'day').format('YYYY-MM-DD'):
      dateToShow = moment(date).format('dddd');
      break;
    default:
      dateToShow = moment(date).format('DD MMM YYYY');
  }
  return dateToShow;
};
