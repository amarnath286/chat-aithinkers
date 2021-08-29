import { StreamChat } from 'stream-chat';

import {
  CLIENT_CONNECTION,
  GET_ALL_CHANNELS,
  GET_ALL_MUTED_CHANNELS,
  MESSAGE_INPUT,
  MESSAGE_DRAFT,
  SET_MESSAGE,
  SET_ACTIVE_CHANNEL,
  SET_SEARCH_CHANNEL,
  FILTER_BY_NAME,
  FILTER_BY_MESSAGE,
  PREVIOUS_MESSAGES_PAGINATION,
  USER_EVENT_START,
  USER_EVENT_STOP,
  // ATTACH_IMAGE,
  MESSAGE_ACTIONS,
  REMOVE_SELECTED_MESSAGES,
  // DE_SELECTED_MESSAGES,
  SET_MODAL,
  ACTIVE_CHANNEL_MEMBERS,
  LEAVE_CHANNEL,
  MEMBER_INFO_MODAL,
  CREATE_CHANNEL_FORM_MODAL,
  PINNED_MESSAGES_MODAL,
  DELETE_PINNED_MESSAGE_MODAL,
  CREATE_CHANNEL_DETAILS,
  QUOTED_MESSAGE_ID,
  MESSAGE_ADD_TO_CHANNEL,
  // MEMBER_ADD_TO_CHANNEL,
  ADD_MESSAGE_CHANNEL_LOCAL,
  UPDATE_MESSAGE_CHANNEL_LOCAL,
  PINNED_MESSAGE,
  CLIENT_ERROR,
  SET_MESSAGE_TO_CHANNEL,
  PINNED_MESSAGES_BY_CHANNEL,
  SEARCH_MESSAGE_IN_CHANNEL,
  PINNED_MESSAGE_MODAL,
  REPLY_MESSAGE_FLAG,
  IS_USER_BANNED,
  EDIT_MESSAGE,
  CHANNEL_MEMBERS,
} from '../constants/actionTypes';
//  import { getRandomColor } from '../utils/utilityFunctions';

const { REACT_APP_STREAM_CLIENT = 'mnk5yqra97q3' } = process.env;

const filters = { type: 'messaging' };
const sort = { last_message_at: -1 };

export const clientConnect = ({ username, token }) => {
  return async (dispatch) => {
    const client = StreamChat.getInstance(REACT_APP_STREAM_CLIENT, {
      timeout: 8000,
    });
    try {
      await client.connectUser(
        {
          id: username,
        },
        token,
      );
      dispatch({
        type: CLIENT_CONNECTION,
        payload: { client, userId: username, streamToken: token },
      });
    } catch (err) {
      console.log('err', err);
      dispatch({
        type: CLIENT_ERROR,
      });
    }
  };
};

export const clientDisConnect = () => {
  return async (dispatch) => {
    const client = StreamChat.getInstance(REACT_APP_STREAM_CLIENT, {
      timeout: 8000,
    });
    try {
      await client.disconnectUser();
    } catch (err) {
      console.log('err', err);
      dispatch({
        type: CLIENT_ERROR,
      });
    }
  };
};

export const getChannels = (client, offset) => {
  return async (dispatch) => {
    try {
      const response = await client.queryChannels(filters, sort, {
        watch: true,
        limit: 30,
        offset: offset,
      });
      dispatch({
        type: GET_ALL_CHANNELS,
        payload: response,
      });
    } catch (err) {
      console.log('Error: ', err);
    }
  };
};

export const getMutedChannels = (client) => {
  return async (dispatch) => {
    try {
      const response = await client.queryChannels({ muted: true });
      dispatch({
        type: GET_ALL_MUTED_CHANNELS,
        payload: response,
      });
    } catch (err) {
      console.log('Error: ', err);
    }
  };
};

export const setMessage = (value) => {
  return (dispatch) => {
    dispatch({
      type: SET_MESSAGE,
      payload: value,
    });
  };
};

export const setChannel = (channel, type) => {
  return (dispatch) => {
    dispatch({
      type: SET_ACTIVE_CHANNEL,
      payload: {
        channel,
        type,
      },
    });
  };
};

export const setSearchChannel = (channel) => {
  return (dispatch) => {
    dispatch({
      type: SET_SEARCH_CHANNEL,
      payload: channel,
    });
  };
};

export const markAsReadChannel = (channel) => {
  return async (dispatch) => {
    // const response =
    await channel.markRead(filters);
  };
};

export const sendMessage = ({ channel, message_new }) => {
  return async (dispatch) => {
    let { message } = await channel.sendMessage(message_new);
    dispatch({
      type: MESSAGE_INPUT,
      payload: message,
    });
  };
};

export const draftMessage = (channel, draft_message) => {
  // const channelId = channel.id;
  return async (dispatch) => {
    dispatch({
      type: MESSAGE_DRAFT,
      payload: {
        channel: channel,
        message: draft_message,
      },
    });
  };
};

export const sendPinMessage = ({ channel, message_new }) => {
  return async (dispatch) => {
    let { message } = await channel.sendMessage(message_new);
    dispatch({
      type: MESSAGE_INPUT,
      payload: message,
    });
  };
};

export const filterChannels = (value) => {
  return (dispatch) => {
    dispatch({
      type: FILTER_BY_NAME,
      payload: value,
    });
  };
};

export const filterChannelsByMessage = (searchString, client, channels) => {
  return async (dispatch) => {
    const search = await client.search(
      { attachments: { $exists: false } },
      { text: { $autocomplete: searchString } },
      { limit: 100, offset: 0 },
    );
    const filteredChannels = channels.filter(
      (v) => v.data.name && v.data.name.toLowerCase().includes(searchString),
    );
    dispatch({
      type: FILTER_BY_MESSAGE,
      payload: {
        search: searchString,
        searchResults: search.results.filter((v) => !v.message._type),
        channels: filteredChannels,
      },
    });
  };
};

export const searchMessageInChannel = (
  searchString,
  channel,
  client,
  channels,
) => {
  return async (dispatch) => {
    const search = await channel.search(searchString);
    dispatch({
      type: SEARCH_MESSAGE_IN_CHANNEL,
      payload: {
        results: search.results.filter((v) => !v.message._type),
      },
    });
  };
};

export const getMessagesByChannel = (channel, last_message_id) => {
  return async (dispatch) => {
    const payload = {
      messages: { limit: 300 },
    };
    if (last_message_id) {
      payload.messages.id_lt = last_message_id;
    }
    let response = await channel.query(payload);
    if (last_message_id) {
      dispatch({
        type: PREVIOUS_MESSAGES_PAGINATION,
        payload: response.messages,
      });
    } else {
      dispatch({
        type: SET_MESSAGE_TO_CHANNEL,
        payload: response.messages,
      });
    }
  };
};

export const userEvents = (data, type) => {
  return async (dispatch) => {
    dispatch({
      type: type === 'start' ? USER_EVENT_START : USER_EVENT_STOP,
      payload: data,
    });
  };
};

export const sendImage = (channel, files) => {
  return async (dispatch) => {
    let promises = files.map(async (i) => {
      let response = await channel.sendImage(i, i.name);
      let obj = {
        name: i.name,
        type: 'image/jpeg',
        thumb_url: response.file,
        asset_url: response.file,
      };
      let { message } = await channel.sendMessage({
        text: '',
        attachments: [obj],
      });
      return message;
    });
    const responses = await Promise.all(promises);
    dispatch({
      type: MESSAGE_INPUT,
      payload: responses.length > 1 ? responses : responses[0],
    });
  };
};

export const messageActions = (message) => {
  return (dispatch) => {
    dispatch({
      type: MESSAGE_ACTIONS,
      payload: message,
    });
  };
};

export const sendFile = (channel, files) => {
  return async (dispatch) => {
    let promises = files.map(async (file) => {
      let response = await channel.sendFile(file);
      let obj = {
        name: file.name,
        type: 'application/pdf',
        thumb_url: response.file,
        asset_url: response.file,
      };
      let { message } = await channel.sendMessage({
        text: '',
        attachments: [obj],
      });
      return message;
    });
    const responses = await Promise.all(promises);
    dispatch({
      type: MESSAGE_INPUT,
      payload: responses.length > 1 ? responses : responses[0],
    });
  };
};

export const removeSelectMessages = (message) => {
  return (dispatch) => {
    dispatch({
      type: REMOVE_SELECTED_MESSAGES,
      payload: message,
    });
  };
};

export const setIsModalVisible = (data, message) => {
  return (dispatch) => {
    dispatch({
      type: SET_MODAL,
      payload: { boolean: data, images: message.attachments },
    });
  };
};

export const getMembersByChannels = (channel) => {
  let sort = { created_at: -1 };

  return async (dispatch) => {
    //const response =
    await channel.queryMembers({}, sort);
  };
};

export const addMemberToChannel = ({ channel, user_id }) => {
  return async (dispatch) => {
    const response = await channel.addMembers([user_id]);
    //console.log('response', response);
    dispatch({
      type: ACTIVE_CHANNEL_MEMBERS,
      payload: response,
    });
  };
};

export const leaveChannelByUser = ({ channel, user_id }) => {
  return async (dispatch) => {
    const response = await channel.removeMembers([user_id]);
    // console.log('response', response);
    dispatch({
      type: LEAVE_CHANNEL,
      payload: response,
    });
  };
};

export const channelMembers = (channel) => {
  return async (dispatch) => {
    const response = await channel.queryMembers({});
    dispatch({
      type: CHANNEL_MEMBERS,
      payload: response.members,
    });
  };
};

export const banUserInallChannels = ({
  channel,
  user_id,
  admin_id,
  is_banned,
}) => {
  return async (dispatch) => {
    await channel.banUser(`${user_id}`, {
      banned_by_id: admin_id,
    });
    await channel.stopWatching();
    dispatch({
      type: IS_USER_BANNED,
      payload: {
        user_id: user_id,
        is_banned: is_banned,
      },
    });
  };
};

export const UnbanUserInallChannels = ({ channel, user_id }) => {
  return async (dispatch) => {
    // const response =
    await channel.unbanUser(`${user_id}`);
    dispatch({
      type: IS_USER_BANNED,
      payload: {
        user_id: user_id,
        is_banned: false,
      },
    });
  };
};

export const getBannedusersByChannel = ({ client, activeChannelId }) => {
  return async (dispatch) => {
    //const response =
    await client.queryBannedUsers({
      channel_cid: activeChannelId,
    });
  };
};

export const muteChannelByUser = ({ client, channel }) => {
  return async (dispatch) => {
    //const response =
    await channel.mute();
  };
};

export const unmuteChannelByUser = ({ client, channel }) => {
  return async (dispatch) => {
    //const response =
    await channel.unmute();
    //const muted =
    await client.queryChannels({ muted: false });
  };
};

export const deleteChannelByAdmin = (channel) => {
  return async (dispatch) => {
    //const destroy =
    await channel.delete();
  };
};

// export const updateChannelDetails = (channel) => {
//   return async (dispatch) => {
//     const update = await channel.update(
//         {
//             name: "HeyChannel",
//             color: "#FFFBBF",
//             is_broadcast: false,
//         },
//     );
//   };
// };

export const setMemberModalVisible = (data) => {
  return (dispatch) => {
    dispatch({
      type: MEMBER_INFO_MODAL,
      payload: data,
    });
  };
};

export const setPinnedMessageDeleteModal = (data) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_PINNED_MESSAGE_MODAL,
      payload: data,
    });
  };
};

export const setPinnedMessagesModalVisible = (data) => {
  return (dispatch) => {
    dispatch({
      type: PINNED_MESSAGES_MODAL,
      payload: data,
    });
  };
};

export const setCreateFormModal = (data) => {
  return (dispatch) => {
    dispatch({
      type: CREATE_CHANNEL_FORM_MODAL,
      payload: data,
    });
  };
};

export const setChannelDetails = (data) => {
  return (dispatch) => {
    dispatch({
      type: CREATE_CHANNEL_DETAILS,
      payload: data,
    });
  };
};

export const createChannel = (
  client,
  data,
  admin_users,
  channel_id,
  color,
  is_broadcast,
) => {
  return async (dispatch) => {
    const { name, id, description } = data;
    const channel = client.channel('messaging', channel_id, {
      name,
      color,
      members: admin_users,
      is_broadcast: is_broadcast,
      created_by_id: id,
      data: { description },
    });
    let response = await channel.create();
    return response;
  };
};

export const updateChannel = (client, data, channel_id) => {
  return async (dispatch) => {
    const { name, description } = data;
    const channel = client.channel('messaging', channel_id);
    await channel.updatePartial({
      set: {
        name: name,
        // is_broadcast: is_broadcast,
        'data.description': description,
      },
    });
  };
};

export const addQuotedMessageId = (id) => {
  return (dispatch) => {
    dispatch({
      type: QUOTED_MESSAGE_ID,
      payload: id,
    });
  };
};

export const deleteMessageById = async (channel, id) => {
  let response = await channel.deleteMessage(id);
  return response;
};

export const pinMessage = ({ client, message }) => {
  return async (dispatch) => {
    const response = await client.pinMessage(message);
    dispatch({
      type: PINNED_MESSAGE,
      payload: response.message,
    });
  };
};

export const unpinMessage = ({ client, message }) => {
  return async (dispatch) => {
    //const response =
    await client.unpinMessage(message);
  };
};

export const getPinnedMessagesByChannel = ({ client, activeChannelId }) => {
  return async (dispatch) => {
    try {
      const response = await client
        .channel('messaging', activeChannelId)
        .query();
      dispatch({
        type: PINNED_MESSAGES_BY_CHANNEL,
        payload: response,
      });
    } catch (err) {
      console.log('Error: ', err);
    }
  };
};

export const addMessageViaWatch = (data) => {
  return (dispatch) => {
    dispatch({
      type: MESSAGE_ADD_TO_CHANNEL,
      payload: data,
    });
  };
};

export const addMessagetoChannelLocal = (data) => {
  return async (dispatch) => {
    dispatch({
      type: ADD_MESSAGE_CHANNEL_LOCAL,
      payload: data,
    });
  };
};

export const updateMessageToChannelLocal = (data) => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_MESSAGE_CHANNEL_LOCAL,
      payload: data,
    });
  };
};

export const pinnedMsgIdModal = (id) => {
  return (dispatch) => {
    dispatch({
      type: PINNED_MESSAGE_MODAL,
      payload: id,
    });
  };
};

export const replyMsgFlag = (boolean) => {
  return (dispatch) => {
    dispatch({
      type: REPLY_MESSAGE_FLAG,
      payload: boolean,
    });
  };
};

export const editMessage = (message) => {
  return (dispatch) => {
    dispatch({
      type: EDIT_MESSAGE,
      payload: message,
    });
  };
};
