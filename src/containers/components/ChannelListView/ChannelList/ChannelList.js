import React, { useEffect, useState, useRef } from 'react';

import { get, takeRight } from 'lodash';
import moment from 'moment';
import addNotification from 'react-push-notification';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import {
  setChannel,
  addMessagetoChannelLocal,
  // addMessageViaWatch,
  // markAsReadChannel,
  // getPinnedMessagesByChannel,
  setSearchChannel,
  getChannels,
  getMessagesByChannel,
  removeSelectMessages,
  addQuotedMessageId,
  replyMsgFlag,
  updateMessageToChannelLocal,
} from '../../../../actions/channel';
//  import { Spin } from 'antd';
import ChannelInfoCard from './ChannelListCard';
import './styles.scss';

const ChannelListView = () => {
  const dispatch = useDispatch();
  const listInnerRef = useRef(null);
  const [page, setPage] = useState(0);
  // const [loading, setLoading] = useState(false);

  const {
    client,
    channels,
    mutedChannels,
    activeChannelId,
    filters,
    search,
    searchType,
    searchResults,
    activeChannel,
    // userName,
    userDetails,
    localChannelsUpdation,
    msgNotification,
    messageActionsData,
  } = useSelector(
    ({ Channels }) => ({
      channels: Channels.channels,
      client: Channels.client,
      activeChannelId: Channels.activeChannelId,
      mutedChannels: Channels.mutedChannels,
      filters: Channels.filters,
      search: Channels.search,
      searchType: Channels.searchType,
      searchResults: Channels.searchResults,
      activeChannel: Channels.activeChannel,
      userName: Channels.userName,
      userDetails: Channels.userDetails,
      localChannelsUpdation: Channels.localChannelsUpdation,
      msgNotification: Channels.msgNotification,
      messageActionsData: Channels.messageActionsData,
    }),
    shallowEqual,
  );
  const channelName = channels.map((v) => v.data);
  const name = msgNotification.id
    ? channelName.find((x) => x.id === msgNotification.id).name
    : '';
  const mutedChannelsList = [];
  Object.keys(mutedChannels).map((d) =>
    mutedChannelsList.push(mutedChannels[d].id),
  );

  const filteredChannels =
    search && search.length > 0
      ? searchType === 'in-channel'
        ? filters[0]
        : filters
      : channels;
  const allChannelsUnreadCount = [];
  Object.keys(channels).map((d) =>
    allChannelsUnreadCount.push({
      id: channels[d].id,
      unreadCount:
        activeChannelId === channels[d].id ? 0 : channels[d].state.unreadCount,
    }),
  );

  if (searchType === 'in-channel' && Array.isArray(filters[0])) {
    Object.keys(filters[0]).map((d) =>
      allChannelsUnreadCount.push({
        id: channels[d].id,
        unreadCount: channels[d].state.unreadCount,
      }),
    );
  }
  searchResults.sort((a, b) => {
    return moment(b.message.created_at) - moment(a.message.created_at);
  });

  const users = [];
  if (activeChannel.cid) {
    const { state } = activeChannel;
    Object.keys(state.members).forEach((d) =>
      users.push(state.members[d].user_id),
    );
  }

  const handleSetActiveChannel = (channel, activeType) => {
    dispatch(setChannel(channel, activeType));
    dispatch(removeSelectMessages());
    dispatch(addQuotedMessageId(''));
    dispatch(replyMsgFlag(false));
    if (messageActionsData.length > 0) {
      messageActionsData.length = 0;
    }
  };

  const channelFilter = (channel) => {
    const unreadCountItem = allChannelsUnreadCount.find(
      (unreadCount) => unreadCount.id === channel.id,
    );

    channel.unreadCount = unreadCountItem ? unreadCountItem.unreadCount : null;
    if (search && search.length > 0) {
      if (filteredChannels.findIndex((v) => v.id === channel.id) >= 0) {
        return true;
      } else {
        return false;
      }
    } else if (searchType && searchType === 'in-channel') {
      if (activeChannel.id === channel.id) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  };

  const result = Object.values(localChannelsUpdation).filter(channelFilter);
  result.sort((a, b) => {
    return (
      new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
    );
  });

  const handleChannel = async (channel, idx) => {
    // await channel.watch();
    channel.on('message.new', (e) => {
      const { channel_id, message } = e;
      dispatch(addMessagetoChannelLocal({ id: channel_id, message }));
    });

    channel.on('message.updated', (e) => {
      const { channel_id, message } = e;
      dispatch(updateMessageToChannelLocal({ id: channel_id, message }));
    });

    channel.on('message.deleted', (e) => {
      const { channel_id, message } = e;
      dispatch(updateMessageToChannelLocal({ id: channel_id, message }));

      // fixme: @Kiran can we remove this?
      const element = document.getElementById(message.id);
      if (element) {
        element.style.display = 'block';
      }
    });
  };

  useEffect(() => {
    async function fetchData() {
      if (filteredChannels) {
        await Promise.all(filteredChannels.map(handleChannel));
      }
      if (searchType !== 'in-channel' && filteredChannels) {
        if (channels[0]) handleSetActiveChannel(channels[0]);
      }
      if (searchType === 'in-channel' && Array.isArray(filters[1])) {
        await Promise.all(filters[1].map(handleChannel));
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels, filteredChannels, filters, searchType]);

  const handleShowSearchMessage = async (message, channel) => {
    if (!searchType) {
      dispatch(getMessagesByChannel(channel));
      await dispatch(setSearchChannel(message));
    } else {
      dispatch(setSearchChannel(message));
    }
  };

  const handleShowNotificationMsg = (message) => {
    dispatch(setSearchChannel(message));
  };

  const openTab = (event) => {
    window.focus(window.location.origin);
    handleShowNotificationMsg(event.message);
    //handleSetActiveChannel(event.channel);  APP is breaking coz of this , need to  check logic
  };

  useEffect(() => {
    if (
      msgNotification &&
      !mutedChannelsList.includes(msgNotification.id) &&
      users.includes(userDetails.id)
    ) {
      const { message } = msgNotification;
      if (message && userDetails.id !== message.user.id) {
        addNotification({
          title: message.user.name + '@' + name,
          subtitle: name,
          message: message.text
            ? message.text
            : message.attachments &&
              message.attachments[0] &&
              message.attachments[0].type === 'image'
            ? 'Photo'
            : (message.attachments &&
                message.attachments[0] &&
                message.attachments[0].type === 'file') ||
              message.attachments[0].type === 'media'
            ? message.attachments[0].title
            : '',
          duration: 10000,
          onClick: () =>
            openTab({
              message: msgNotification.message,
              channel: { id: msgNotification.id, name: name },
            }),
          native: true,
          vibrate: true,
        });
      }
    } else {
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgNotification, mutedChannelsList, name, userDetails.id, users]);

  const loadMoreChannels = async (page) => {
    // setLoading(true);
    const newPage = page + 1;
    setPage(newPage);
    const offset = newPage * 10;
    await dispatch(getChannels(client, offset));
    // setLoading(false);
  };

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        loadMoreChannels(page);
        listInnerRef.current &&
          listInnerRef.current.scrollIntoView({
            behavior: 'auto',
            block: 'start',
          });
      }
    }
  };

  const amITaggedInUnreadMessages = (channelId, unreadCount) => {
    if (unreadCount) {
      const channel = channels.find((c) => c.id === channelId);
      const messages = channel?.state?.messages;
      const unnReadMessages = takeRight(messages, unreadCount);
      let amIMentionedCount = 0;
      unnReadMessages.forEach((m) => {
        m.mentioned_users.forEach((u) => {
          if (u.id === userDetails.id) {
            amIMentionedCount += 1;
          }
        });
      });
      return amIMentionedCount;
    } else return 0;
  };

  return (
    <>
      <div
        className="channel-list-view"
        onScroll={() => onScroll()}
        ref={listInnerRef}
        style={{ overflowY: 'overlay', maxHeight: '760px' }}
      >
        {search && search.length > 0
          ? searchResults &&
            searchResults.length > 0 && (
              <div className="other-channel-tab">
                <p>Channels</p>
              </div>
            )
          : ''}
        {filteredChannels &&
          result &&
          result
            .filter((c) => c.name)
            .map((channel) => {
              const {
                name,
                lastMessage,
                unreadCount,
                created_at,
                members,
                // broadcast,
              } = channel;
              const previewDate = lastMessage ? lastMessage.created_at : '';
              const type = get(lastMessage, 'attachments.0.type', '');
              const created_date = created_at ? created_at : '';
              const messagePreviewData =
                lastMessage && lastMessage.text
                  ? lastMessage.text
                  : lastMessage.attachments
                  ? type === 'image'
                    ? 'Image'
                    : type === 'file' || type === 'media'
                    ? get(lastMessage, 'attachments.0.title', '')
                    : ''
                  : '';
              const previewUser =
                lastMessage && lastMessage.user ? lastMessage.user.name : '';
              const messageType = lastMessage && lastMessage.type;
              const channelMembers = members ? Object.keys(members) : '';
              // const broadcast_channel = broadcast ? broadcast : '';
              // const messages = state.messages
              const noOfTimesIAmMentionedInUnreadMessages =
                amITaggedInUnreadMessages(channel.id, unreadCount);
              return (
                <ChannelInfoCard
                  activeChannelId={activeChannelId}
                  key={channel.id}
                  previewDate={previewDate}
                  created_date={created_date}
                  searchType={searchType}
                  messagePreview={messagePreviewData}
                  messageType={messageType}
                  previewUser={previewUser}
                  channel={channel}
                  data={{ name }}
                  handleSetActiveChannel={handleSetActiveChannel}
                  unreadCount={unreadCount}
                  activeChannel={activeChannel}
                  channelMembers={channelMembers}
                  userDetails={userDetails}
                  mutedChannelsList={mutedChannelsList}
                  allChannelsUnreadCount={allChannelsUnreadCount}
                  myMentionCount={noOfTimesIAmMentionedInUnreadMessages}
                />
              );
            })}
        {searchType === 'in-channel'
          ? search &&
            search.length > 0 && (
              <>
                {searchResults && searchResults.length > 0 ? (
                  <>
                    <div className="other-channel-tab">
                      <p>Messages</p>
                    </div>
                    <div className="searchMessageListBox">
                      {searchResults.map((channel) => {
                        const previewDate = channel.message.created_at;
                        const messagePreviewData = channel.message.text;
                        const previewUser = channel.message.user.name;
                        const name = channel.message.channel.name;
                        const messageType = channel.message.type;
                        return (
                          <ChannelInfoCard
                            activeChannelId={activeChannelId}
                            key={channel.message.id}
                            previewDate={previewDate}
                            searchType={searchType}
                            search={search}
                            messagePreview={messagePreviewData}
                            messageType={messageType}
                            previewUser={previewUser}
                            channel={channel}
                            data={{ name }}
                            handleSetActiveChannel={(activeChannel) =>
                              handleSetActiveChannel(activeChannel, 'other')
                            }
                            handleShowSearchMessage={(message) =>
                              handleShowSearchMessage(message)
                            }
                            activeChannel={activeChannel}
                            unreadCount={0}
                            userDetails={userDetails}
                            searchResults={searchResults}
                          />
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <span className="no-result">No message found1</span>
                )}
              </>
            )
          : search &&
            search.length > 0 && (
              <>
                {searchResults && searchResults.length > 0 ? (
                  <>
                    <div className="other-channel-tab">
                      <p>Messages</p>
                    </div>
                    <div className="searchMessageListBox">
                      {searchResults.map((channel) => {
                        const previewDate = channel.message.created_at;
                        const messagePreviewData = channel.message.text;
                        const previewUser = channel.message.user.name;
                        const name = channel.message.channel.name;
                        const messageType = channel.message.type;
                        return (
                          <ChannelInfoCard
                            activeChannelId={activeChannelId}
                            key={channel.message.id}
                            previewDate={previewDate}
                            searchType={searchType}
                            search={search}
                            messagePreview={messagePreviewData}
                            messageType={messageType}
                            previewUser={previewUser}
                            channel={channel}
                            data={{ name }}
                            handleSetActiveChannel={(selectedCh) =>
                              handleSetActiveChannel(selectedCh, 'other')
                            }
                            handleShowSearchMessage={(message, channel) =>
                              handleShowSearchMessage(message, channel)
                            }
                            activeChannel={activeChannel}
                            unreadCount={0}
                            userDetails={userDetails}
                          />
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <span className="no-result">No message found</span>
                )}
              </>
            )}
      </div>
    </>
  );
};
export default ChannelListView;
