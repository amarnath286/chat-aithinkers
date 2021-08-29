import React from 'react';

import { PictureOutlined } from '@ant-design/icons';
import { Avatar, Badge } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { RESET_CHANNEL_SEARCH } from '../../../../constants/actionTypes';
// import sound from '../../../../no-sound.png';
import { useTheme } from '../../../../ThemeContext';
import { getRandomColor } from '../../../../utils/utilityFunctions';
import './styles.scss';

const color = getRandomColor();

const ChannelInfoCard = ({
  channel,
  channelMembers,
  unreadCount,
  data,
  previewDate,
  created_date,
  previewUser,
  userDetails,
  messagePreview,
  messageType,
  activeChannelId,
  handleSetActiveChannel,
  handleShowSearchMessage,
  activeChannel,
  broadcast_channel,
  search,
  searchType,
  searchResults,
  mutedChannelsList,
  allChannelsUnreadCount,
  myMentionCount,
}) => {
  const dispatch = useDispatch();
  const { themeName } = useTheme();
  const defaultTheme = localStorage.getItem('theme') || 'light';
  const channelName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  const resetChannelSearch = () => {
    dispatch({
      type: RESET_CHANNEL_SEARCH,
    });
  };
  const onClick = (event) => {
    if (event) {
      if (search && search.length > 0) {
        const channel = {
          id: event.message.channel.id,
          name: event.message.channel.name,
        };
        handleSetActiveChannel(channel);
        handleShowSearchMessage(event, activeChannel);
      } else if (searchType === 'in-channel') {
        if (event.message) {
          handleShowSearchMessage(event);
        }
      } else {
        handleSetActiveChannel(event);
      }
    }
  };

  return (
    <>
      {searchType === 'in-channel' && searchResults ? (
        <div
          style={{
            cursor: 'pointer',
            backgroundColor:
              channel.id === activeChannelId && defaultTheme === 'dark'
                ? '#2B343D'
                : channel.id === activeChannelId && defaultTheme === 'light'
                ? '#F5F6F6'
                : '',
          }}
          onClick={() => onClick(channel)}
          className={
            searchType && (defaultTheme === 'dark' || themeName === 'dark')
              ? 'searchMessageList'
              : 'lightSearchMessageList'
          }
          hoverable="true"
        >
          <div className="chatListCardBox">
            <div className="chatListAvatar" onClick={() => onClick(channel)}>
              <Avatar
                style={{
                  backgroundColor: _.get(channel, 'color')
                    ? _.get(channel, 'color')
                    : color,
                }}
                size={48}
              >
                <span className="ant-avatar-string">
                  {previewUser ? previewUser.slice(0, 1).toUpperCase() : '--'}
                </span>
              </Avatar>
            </div>
            <div className="chatListDetails" onClick={() => onClick(channel)}>
              <div className="chatListUpper">
                <h4>{previewUser ? previewUser : '--'}</h4>
                {!messagePreview ? (
                  <span>
                    {moment().format('DD') === moment(created_date).format('DD')
                      ? moment(created_date).format('hh:mm A')
                      : moment(created_date).format('MM/DD/YY')}
                  </span>
                ) : (
                  <span>
                    {moment().format('DD') === moment(previewDate).format('DD')
                      ? moment(previewDate).format('hh:mm A')
                      : moment(previewDate).format('MM/DD/YY')}
                  </span>
                )}
              </div>
              <div className="chatListLower">
                {messageType === 'type' ? (
                  <div className="listLowerText">
                    {previewUser !== '' ? (
                      <span
                        style={{
                          fontSize: '13px',
                          // color: channel.id === activeChannelId ? 'white' : '#3a6d99',
                        }}
                      >
                        {previewUser !== userDetails.name
                          ? previewUser + ':'
                          : 'You:'}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '13px',
                          // color: channel.id === activeChannelId ? 'white' : '#3a6d99',
                        }}
                      >
                        {userDetails.role !== 'admin'
                          ? 'Admin created this group'
                          : 'You created this group'}
                      </span>
                    )}
                    <span
                      style={{
                        textAlign: 'center',
                        fontSize: '13px',
                        // color: channel.id === activeChannel.id ? 'white' : 'grey',
                        paddingLeft: '5px',
                      }}
                    >
                      {!messagePreview.length
                        ? ''
                        : messagePreview.slice(0, 6) + '...'}
                    </span>
                  </div>
                ) : (
                  <div className="listLowerText">
                    <span> This message was deleted </span>
                  </div>
                )}

                <div className="countChatList">
                  <Badge
                    count={unreadCount}
                    style={{ backgroundColor: '#52c41a' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : search && search.length > 0 ? (
        <div
          style={{
            cursor: 'pointer',
            backgroundColor:
              channel.id === activeChannelId &&
              (themeName === 'dark' || defaultTheme === 'dark')
                ? '#2B343D'
                : channel.id === activeChannelId &&
                  (themeName === 'light' || defaultTheme === 'light')
                ? '#F5F6F6'
                : '',
          }}
          onClick={() => onClick(channel)}
          className={
            search &&
            search.length > 0 &&
            (defaultTheme === 'dark' || themeName === 'dark')
              ? 'searchMessageList'
              : 'lightSearchMessageList'
          }
          hoverable="true"
        >
          <div className="chatListCardBox">
            <div className="chatListAvatar" onClick={() => onClick(channel)}>
              <Avatar
                style={{
                  backgroundColor: _.get(channel, 'color')
                    ? _.get(channel, 'color')
                    : color,
                }}
                size={48}
              >
                <span className="ant-avatar-string">
                  {channelName ? channelName.slice(0, 1).toUpperCase() : '--'}
                </span>
              </Avatar>
            </div>
            <div className="chatListDetails" onClick={() => onClick(channel)}>
              <div className="chatListUpper">
                <h4
                  style={
                    {
                      // color: channel.id === activeChannelId ? 'white' : 'black',
                    }
                  }
                >
                  {channelName ? channelName : '--'}
                </h4>
                {!(channelMembers || []).includes(userDetails.id) ? (
                  ''
                ) : (
                  <>
                    {!messagePreview ? (
                      <span>
                        {moment().format('DD') ===
                        moment(created_date).format('DD')
                          ? moment(created_date).format('hh:mm A')
                          : moment(created_date).format('MM/DD/YY')}
                      </span>
                    ) : (
                      <span>
                        {moment().format('DD') ===
                        moment(previewDate).format('DD')
                          ? moment(previewDate).format('hh:mm A')
                          : moment(previewDate).format('MM/DD/YY')}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="chatListLower">
                {!(channelMembers || []).includes(userDetails.id) ? (
                  <div className="listLowerText">
                    <span
                      style={{
                        textAlign: 'center',
                        fontSize: '13px',
                        // color: channel.id === activeChannel.id ? 'white' : 'grey',
                        paddingLeft: '5px',
                      }}
                    >
                      Join group to see the Conversation {}
                    </span>
                  </div>
                ) : (
                  <>
                    {messageType !== 'deleted' ? (
                      <div className="listLowerText">
                        {previewUser !== '' ? (
                          <span
                            style={{
                              fontSize: '13px',
                              // color: channel.id === activeChannelId ? 'white' : '#3a6d99',
                            }}
                          >
                            {previewUser !== userDetails.name
                              ? previewUser + ':'
                              : 'You:'}
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '13px',
                              // color: channel.id === activeChannelId ? 'white' : '#3a6d99',
                            }}
                          >
                            {userDetails.role !== 'admin'
                              ? 'Admin created this group'
                              : 'You created this group'}
                          </span>
                        )}
                        <span
                          style={{
                            textAlign: 'center',
                            fontSize: '13px',
                            // color: channel.id === activeChannel.id ? 'white' : 'grey',
                            paddingLeft: '5px',
                          }}
                        >
                          {!messagePreview.length ? (
                            ''
                          ) : messagePreview === 'Image' ? (
                            <p>
                              <PictureOutlined /> Photo {}
                            </p>
                          ) : messagePreview.length >= 25 ? (
                            messagePreview.slice(0, 20) + '...'
                          ) : (
                            messagePreview
                          )}
                        </span>
                      </div>
                    ) : (
                      <div className="listLowerText">
                        <span
                          style={{
                            textAlign: 'center',
                            fontSize: '13px',
                            // color: channel.id === activeChannel.id ? 'white' : 'grey',
                            paddingLeft: '5px',
                          }}
                        >
                          This message was deleted {}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {!(channelMembers || []).includes(userDetails.id) ? (
                  ''
                ) : (
                  <div className="countChatList">
                    {mutedChannelsList.includes(channel.id) ? (
                      <span className="muteListIcon">
                        <i className="fa fa-volume-off" aria-hidden="true"></i>
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </span>
                    ) : (
                      ''
                    )}
                    <Badge
                      count={unreadCount}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            cursor: 'pointer',
            backgroundColor:
              channel.id === activeChannelId && defaultTheme === 'dark'
                ? '#2B343D'
                : channel.id === activeChannelId && defaultTheme === 'light'
                ? '#F5F6F6'
                : '',
          }}
          onClick={() => onClick(channel)}
          className={search && search.length > 0 ? 'searchMessageList' : ''}
          hoverable="true"
        >
          <div className="chatListCardBox">
            <div className="chatListAvatar" onClick={() => onClick(channel)}>
              <Avatar
                style={{
                  backgroundColor: _.get(channel, 'color')
                    ? _.get(channel, 'color')
                    : color,
                }}
                size={48}
              >
                <span className="ant-avatar-string">
                  {channelName ? channelName.slice(0, 1).toUpperCase() : '--'}
                </span>
              </Avatar>
            </div>
            <div className="chatListDetails" onClick={() => onClick(channel)}>
              <div className="chatListUpper">
                <h4
                  style={
                    {
                      // color: channel.id === activeChannelId ? 'white' : 'black',
                    }
                  }
                >
                  {channelName ? channelName : '--'}
                </h4>
                {!(channelMembers || []).includes(userDetails.id) ? (
                  ''
                ) : (
                  <>
                    {!messagePreview ? (
                      <span>
                        {moment().format('DD') ===
                        moment(created_date).format('DD')
                          ? moment(created_date).format('hh:mm A')
                          : moment(created_date).format('MM/DD/YY')}
                      </span>
                    ) : (
                      <span>
                        {moment().format('DD') ===
                        moment(previewDate).format('DD')
                          ? moment(previewDate).format('hh:mm A')
                          : moment(previewDate).format('MM/DD/YY')}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="chatListLower">
                {!(channelMembers || []).includes(userDetails.id) ? (
                  <div className="listLowerText">
                    <span
                      style={{
                        textAlign: 'center',
                        fontSize: '13px',
                        paddingLeft: '5px',
                      }}
                    >
                      Join group to see the Conversation {}
                    </span>
                  </div>
                ) : (
                  <>
                    {messageType !== 'deleted' ? (
                      <div className="listLowerText">
                        {previewUser !== '' ? (
                          <span
                            style={{
                              fontSize: '13px',
                              // color: channel.id === activeChannelId ? 'white' : '#3a6d99',
                            }}
                          >
                            {previewUser !== userDetails.name
                              ? previewUser + ':'
                              : 'You:'}
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '13px',
                              // color: channel.id === activeChannelId ? 'white' : '#3a6d99',
                            }}
                          >
                            {userDetails.role !== 'admin'
                              ? 'Admin created this group'
                              : 'You created this group'}
                          </span>
                        )}
                        <span
                          style={{
                            textAlign: 'center',
                            fontSize: '13px',
                            // color: channel.id === activeChannel.id ? 'white' : 'grey',
                            paddingLeft: '5px',
                          }}
                        >
                          {!messagePreview.length ? (
                            ''
                          ) : messagePreview === 'Image' ? (
                            <p>
                              <PictureOutlined /> Photo {}
                            </p>
                          ) : messagePreview.length >= 25 ? (
                            messagePreview.slice(0, 20) + '...'
                          ) : (
                            messagePreview
                          )}
                        </span>
                      </div>
                    ) : (
                      <div className="listLowerText">
                        <span
                          style={{
                            textAlign: 'center',
                            fontSize: '13px',
                            // color: channel.id === activeChannel.id ? 'white' : 'grey',
                            paddingLeft: '5px',
                          }}
                        >
                          This message was deleted {}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {!(channelMembers || []).includes(userDetails.id) ? (
                  ''
                ) : (
                  <div className="countChatList">
                    {mutedChannelsList.includes(channel.id) ? (
                      <span className="muteListIcon">
                        <i className="fa fa-volume-off" aria-hidden="true"></i>
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </span>
                    ) : (
                      ''
                    )}
                    <Badge
                      count={myMentionCount ? '@' : 0}
                      style={{ backgroundColor: ' #1890ff' }}
                    />
                    <Badge
                      count={unreadCount}
                      style={{ backgroundColor: '#52c41a' }}
                    />
                  </div>
                )}
              </div>
            </div>
            {searchType === 'in-channel' && activeChannel.id === channel.id && (
              <div className="inchannel-search">
                <div onClick={resetChannelSearch}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={
                      channel.id !== activeChannelId ? '#6490b1' : 'white'
                    }
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChannelInfoCard;
