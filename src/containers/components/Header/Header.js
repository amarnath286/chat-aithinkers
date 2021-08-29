import React, { useCallback, useState } from 'react';

import { MenuOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Dropdown, Modal } from 'antd';
import { Menu } from 'antd';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import './styles.scss';
import {
  setMemberModalVisible,
  //  setCreateFormModal,
  deleteChannelByAdmin,
  muteChannelByUser,
  unmuteChannelByUser,
  getChannels,
  getMutedChannels,
  channelMembers,
  leaveChannelByUser,
  // updateChannelDetails,
  // getBannedusersByChannel,
} from '../../../actions/channel';
import { FILTER_MESSAGE_IN_CHANNEL } from '../../../constants/actionTypes';
import { useTheme } from '../../../ThemeContext';
import ChannelInfo from '../ChannelInfo';
import CreateChannelForm from '../CreateGroupForm';
import UserInfoModal from '../MembersInfo/MembersInfo';
import { HeaderMenu } from './Header.helper';
const { SubMenu } = Menu;

function handleClick(e) {}

const Header = () => {
  const {
    client,
    activeChannel,
    activeChannelId,
    userDetails,
    mutedChannels,
    activeChannelMembers,
  } = useSelector(
    ({ Channels }) => ({
      client: Channels.client,
      activeChannel: Channels.activeChannel,
      activeChannelId: Channels.activeChannelId,
      userDetails: Channels.userDetails,
      mutedChannels: Channels.mutedChannels,
      activeChannelMembers: Channels.activeChannelMembers,
    }),
    shallowEqual,
  );
  const { data, state } = activeChannel;
  const dispatch = useDispatch();
  //  const [open, setOpen] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [editChannel, setEditChannel] = useState(false);
  const [openChannelInfo, setOpenChannelInfo] = useState(false);
  const { setTheme } = useTheme();
  const defaultTheme = localStorage.getItem('theme') || 'light';

  const handleOpenModal = useCallback(() => {
    dispatch(setMemberModalVisible(true));
  }, [dispatch]);

  const membersList = (activeChannel) => {
    dispatch(channelMembers(activeChannel));
  };
  // const handleOpenChannelModal = useCallback(() => {
  //   dispatch(setCreateFormModal(true));
  // }, [dispatch]);

  const users = [];
  if (activeChannel.state.members) {
    Object.keys(activeChannel.state.members).map((d) =>
      users.push(activeChannel.state.members[d].user.id),
    );
  } else {
    Object.keys(activeChannelMembers).map((d) =>
      users.push(activeChannelMembers[d].members.user_id),
    );
  }
  const mutedChannelsList = [];
  Object.keys(mutedChannels).map((d) =>
    mutedChannelsList.push(mutedChannels[d].id),
  );

  const muteChannel = async () =>
    Modal.confirm({
      title: 'Mute',
      content: <p>Are you sure you want to Mute this Channel ?</p>,
      onOk: () => handleMuteUnMute(true),
    });

  const removeMuteChannel = async () =>
    Modal.confirm({
      title: 'UnMute',
      content: <p>Are you sure you want to UnMute this Channel ?</p>,
      onOk: () => handleMuteUnMute(false),
    });

  const handleMuteUnMute = async (mute) => {
    if (mute) {
      await dispatch(
        muteChannelByUser({
          channel: activeChannel,
          client,
        }),
      );
    } else {
      await dispatch(
        unmuteChannelByUser({
          channel: activeChannel,
          client,
        }),
      );
    }
    await dispatch(getMutedChannels(client));
  };

  const leaveChannel = async () =>
    Modal.confirm({
      title: 'Leaave',
      content: <p>Are you sure you want to Leave this Channel ?</p>,
      onOk: () => handleLeaveChannel(false),
    });
  const handleLeaveChannel = async () => {
    await dispatch(
      leaveChannelByUser({
        channel: activeChannel,
        user_id: userDetails.id,
      }),
    );
  };

  const deleteChannel = (activeChannel) =>
    Modal.confirm({
      title: 'Delete',
      content: <p>Are you sure you want to delete this Channel ?</p>,
      onOk: () => handleDelete(activeChannel),
    });

  const handleDelete = async (activeChannel) => {
    await dispatch(deleteChannelByAdmin(activeChannel));
    await dispatch(getChannels(client));
  };

  const handleEditChannel = (activeChannel) => {
    setEditChannel(true);
    setOpenCreateForm(true);
  };

  const handleChannelInfo = (activeChannel) => {
    setOpenChannelInfo(true);
  };

  // const updateChannel = (activeChannel) => {
  //    dispatch(updateChannelDetails(activeChannel));
  //   await dispatch(getChannels(client));
  // }

  const searchMessageInChannel = () => {
    dispatch({
      type: FILTER_MESSAGE_IN_CHANNEL,
    });
    const searchField = document.querySelector('.searchInputBoxList input');
    if (searchField.focus) {
      searchField.focus();
    }
  };

  // const onSwitchChange = (checked) => {};

  // const handleVisibleChange = (flag) => {
  //   setOpen(flag);
  // };
  const onThemeChange = (darkMode) => {
    setTheme(darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  };

  return (
    <>
      <div className="headerInner">
        <div className="headerLeftMenu">
          {userDetails.role === 'admin' ? (
            <Menu
              onClick={handleClick}
              className="ant-menu-root"
              mode="horizontal"
              theme="light"
              style={{
                width: '100%',
              }}
            >
              <SubMenu
                key={'thinksabio-menu'}
                icon={<MenuOutlined className="menu-outline" />}
                className="ant-menu-submenu11"
                title="Think Sabio"
                disabled={userDetails.role !== 'user' ? false : true}
              >
                {userDetails.role !== 'user' && (
                  <Menu.Item
                    key="1"
                    icon={<UsergroupAddOutlined />}
                    onClick={() => setOpenCreateForm(true)}
                    className="menuListOpition"
                  >
                    New group
                  </Menu.Item>
                )}
              </SubMenu>
            </Menu>
          ) : (
            <p>Think Sabio</p>
          )}
        </div>
        <div className="centerBox">
          <span>
            {data.name !== null
              ? data.name
              : data.name === null
              ? ''
              : 'Un-Named Channel'}
          </span>
          {userDetails.role !== 'admin' ? (
            <span style={{ fontSize: '13px' }}>
              {state.members !== null
                ? `${Object.keys(state.members).length} members`
                : null}
            </span>
          ) : (
            <span
              className="noChannelHeader"
              onClick={() => {
                handleOpenModal();
                membersList(activeChannel);
              }}
            >
              {state.members !== null
                ? `${Object.keys(state.members).length} members`
                : null}
            </span>
          )}
        </div>
        {users.includes(userDetails.id) && (
          <div className="searchHeader">
            <div className="chart-search-icon" onClick={searchMessageInChannel}>
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        )}
        <div className="headerMenuIcon">
          <div className="chatHeaderDrop">
            <Dropdown
              overlay={HeaderMenu(
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
              )}
              trigger={['click']}
              // onVisibleChange={handleVisibleChange}
              // visible={open}
              placement="bottomRight"
            >
              <p>
                <span className="iconCircle"></span>
                <span className="iconCircle"></span>
                <span className="iconCircle"></span>
              </p>
            </Dropdown>
          </div>
        </div>
      </div>
      <UserInfoModal />
      {openCreateForm && (
        <CreateChannelForm
          handleCancel={() => {
            setOpenCreateForm(false);
            setEditChannel(false);
          }}
          visible={openCreateForm}
          edit={editChannel}
          channelData={activeChannel}
        />
      )}
      {openChannelInfo && (
        <ChannelInfo
          handleCancel={() => {
            setOpenChannelInfo(false);
          }}
          visible={openChannelInfo}
          channelData={activeChannel}
        />
      )}
    </>
  );
};

export default Header;
