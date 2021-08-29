import React from 'react';

import {
  AudioMutedOutlined,
  AudioOutlined,
  EditOutlined,
  LogoutOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Menu, Switch } from 'antd';

export const HeaderMenu = (
  userDetails,
  activeChannel,
  users,
  defaultTheme,
  mutedChannelsList,
  activeChannelId,
  deleteChannel,
  handleEditChannel,
  muteChannel,
  removeMuteChannel,
  leaveChannel,
  onThemeChange,
  handleChannelInfo,
) => (
  <Menu className="dropdownRight">
    {userDetails.role !== 'user' && (
      <Menu.Item key="0" className="headerDropMenu">
        <p onClick={() => deleteChannel(activeChannel)}>
          {' '}
          <span>Delete Channel</span>
          <DeleteOutlined />
        </p>
      </Menu.Item>
    )}
    {userDetails.role !== 'user' && (
      <Menu.Item key="1" className="headerDropMenu">
        <p onClick={() => handleEditChannel()}>
          {' '}
          <span>Edit Channel</span>
          <EditOutlined />
        </p>
      </Menu.Item>
    )}
    {users.includes(userDetails.id) && (
      <Menu.Item key="2" className="headerDropMenu">
        {mutedChannelsList.includes(activeChannelId) ? (
          <p onClick={() => removeMuteChannel()}>
            <span>UnMute Channel</span>
            <AudioMutedOutlined />
          </p>
        ) : (
          <p onClick={() => muteChannel()}>
            <span>Mute Channel</span>
            <AudioOutlined />
          </p>
        )}
      </Menu.Item>
    )}
    {users.includes(userDetails.id) && (
      <Menu.Item key="3" className="headerDropMenu">
        <p onClick={() => leaveChannel()}>
          <span>Leave Group</span>
          <LogoutOutlined />
        </p>
      </Menu.Item>
    )}
    <Menu.Item key="4" className="headerDropMenu">
      <p onClick={() => handleChannelInfo()}>
        <span>Channel Info</span>
        <ExclamationCircleOutlined />
      </p>
    </Menu.Item>
    <Menu.Item key="5" className="switchBtnSection">
      <p> Dark mode</p>
      <Switch
        defaultChecked={defaultTheme === 'dark' ? true : false}
        onChange={onThemeChange}
      />
    </Menu.Item>
  </Menu>
);
