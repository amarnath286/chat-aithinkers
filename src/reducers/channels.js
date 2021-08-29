import { get } from 'lodash';

import {
  GET_ALL_CHANNELS,
  GET_ALL_MUTED_CHANNELS,
  FILTER_BY_NAME,
  FILTER_BY_MESSAGE,
  FILTER_MESSAGE_IN_CHANNEL,
  SET_ACTIVE_CHANNEL,
  SET_SEARCH_CHANNEL,
  CLIENT_CONNECTION,
  MESSAGE_INPUT,
  MESSAGE_DRAFT,
  SET_MESSAGE,
  PREVIOUS_MESSAGES_PAGINATION,
  USER_EVENT_START,
  USER_EVENT_STOP,
  ATTACH_IMAGE,
  MESSAGE_ACTIONS,
  REMOVE_SELECTED_MESSAGES,
  DE_SELECTED_MESSAGES,
  SET_MODAL,
  ACTIVE_CHANNEL_MEMBERS,
  LEAVE_CHANNEL,
  MEMBER_INFO_MODAL,
  DELETE_PINNED_MESSAGE_MODAL,
  PINNED_MESSAGES_MODAL,
  CREATE_CHANNEL_FORM_MODAL,
  CREATE_CHANNEL_DETAILS,
  QUOTED_MESSAGE_ID,
  ADD_MESSAGE_CHANNEL_LOCAL,
  UPDATE_MESSAGE_CHANNEL_LOCAL,
  PINNED_MESSAGE,
  CLIENT_ERROR,
  SET_MESSAGE_TO_CHANNEL,
  RESET_CHANNEL_SEARCH,
  SEARCH_MESSAGE_IN_CHANNEL,
  PINNED_MESSAGES_BY_CHANNEL,
  PINNED_MESSAGE_MODAL,
  REPLY_MESSAGE_FLAG,
  EDIT_MESSAGE,
  IS_USER_BANNED,
  CHANNEL_MEMBERS,
} from '../constants/actionTypes';

const INIT_STATE = {
  clientConnectLoader: true,
  client: {},
  channels: [],
  mutedChannels: [],
  pinnedMessagesByChannel: [],
  users: [],
  userInfo: {
    name: 'rajSunki1992',
  },
  activeChannelId: '',
  message: {
    text: '',
    attachments: [],
    mentioned_users: [],
    quoted_message_id: '',
  },
  msgNotification: {},
  activeChannel: {
    messages: [],
    data: { id: '', name: undefined },
    state: {
      members: null,
    },
  },
  channelByMessages: [],
  activeChannelUsersList: [],
  activeChannelMembers: {},
  channelByMessages_v2: {},
  search: '',
  channelSearchMsg: {},
  pinnedMsg: {},
  pinnedMsgId: '',
  searchResults: [],
  filters: [],
  searchType: null,
  last_message_id: '',
  usersEvent: [],
  userDetails: [],
  messageActionsData: [],
  images: [],
  deSelectMessage: false,
  isModalVisible: false,
  MembersInfoModal: false,
  deletePinMessage: false,
  pinnedMessagesModal: false,
  createChannelFormModal: false,
  newChannelDetails: {
    name: '',
    members: [],
  },
  quoted_message_id: '',
  localChannelsUpdation: [],
  chatViewEnabled: false,
  clientError: false,
  errorMessage: '',
  replyFlag: false,
  banned_user: {},
  draftMessages: {},
};

const handleUpdateChannelLocal = (state, action) => {
  const { localChannelsUpdation } = state;
  const localChannels = { ...localChannelsUpdation };
  action.forEach((i) => {
    const { data, state } = i;
    localChannels[i.id] = {};
    localChannels[i.id].id = i.id;
    localChannels[i.id].name = data.name ? data.name : '';
    localChannels[i.id].broadcast = data.is_broadcast ? data.is_broadcast : '';
    localChannels[i.id].created_at = data.created_at ? data.created_at : '';
    localChannels[i.id].color = data.color ? data.color : '';
    localChannels[i.id].members = state.members ? state.members : '';
    localChannels[i.id].lastMessage = state.messages[state.messages.length - 1]
      ? state.messages[state.messages.length - 1]
      : {};
  });
  return localChannels;
};

// const handleSearch = ({ channels }, search) => {
//   let response = channels.filter(({ data }) => {
//     let name = data.name ? data.name : data.id;
//     return name.toLowerCase().indexOf(search) > -1;
//   });
//   return response;
// };

const handleFormat = (reduxState, action) => {
  const { channelByMessages, channels } = reduxState;
  const { id } = action;
  let filterChannel = channels.filter((i) => i.id === id);
  const { data, state } = filterChannel[0];
  let newState = channelByMessages.length ? [...channelByMessages] : [];
  let checkChannel = newState.filter((i) => i.id === data.id);
  if (checkChannel.length) {
    console.log('Empty Block');
  } else {
    newState.push({
      id: data.id,
      name: data.name ? data.name : '',
      messages: state.messages,
    });
  }
  return newState;
};

// const handleUpdateChannelWithMembers = (reduxState, action) => {
//   const { activeChannel, channelByMessages } = reduxState;
//   channelByMessages.forEach((i) => {
//     if (activeChannel.data.id === i.id) {
//       i.members = action;
//     } else {
//       i.members = [];
//     }
//   });
//   return channelByMessages;
// };

const updateChannelMessages = (state, action) => {
  const { channels, activeChannel } = state;
  const channelIdx = channels.findIndex((i) => i.id === activeChannel.id);
  channels[channelIdx].state.messages = [...action];
  return channels;
};

const setChannelByMessages = (state, action) => {
  state.channelByMessages.forEach((v, idx) => {
    if (v.id === state.activeChannel.id) {
      state.channelByMessages[idx].messages = [...action];
    }
  });
  return state.channelByMessages;
};

const removeMessageFromSelectedMessages = (state, payload) => {
  const messageToRemoveId = get(payload, 'id', '');
  return messageToRemoveId
    ? state.messageActionsData.filter((m) => m.id !== messageToRemoveId)
    : [];
};

const handleAddPreviousMessages = (reduxState, action, isReset) => {
  const { activeChannel } = reduxState;
  const { state } = activeChannel;
  if (!isReset) {
    const newMessages = [...action, ...state.messages];
    activeChannel.messages = newMessages;
  } else {
    const newMessages = [...action];
    activeChannel.messages = newMessages;
  }
  return activeChannel;
};

const setMessageId = (action, type) => {
  if (type === 0) {
    const { state } = action;
    let messageId =
      state.messages && state.messages[0] && state.messages[0].id
        ? state.messages[0].id
        : '';
    return messageId;
  } else {
    return action && action[0] ? action[0].id : '';
  }
};

const handleUserEvent = (state, action, type) => {
  const { usersEvent } = state;
  let captureEvents = [];
  if (type === 'start') {
    captureEvents = [
      ...usersEvent,
      {
        name: action.user.name,
        id: action.user.id,
      },
    ];
  } else if (type === 'stop') {
    captureEvents = [...usersEvent].filter((i) => i.id !== action.user.id);
  }
  return captureEvents;
};

// const handlePushUpdateMessages = (reduxState, action) => {
//   const { channelByMessages } = reduxState;
//   const oldMessages =
//     channelByMessages && channelByMessages[0] && channelByMessages[0].messages
//       ? channelByMessages[0].messages
//       : [];
//   if (action.length > 1) {
//     action.forEach((i) => {
//       oldMessages.push(i);
//     });
//   } else {
//     oldMessages.push(action);
//   }
//   channelByMessages.messages = oldMessages;
//   return channelByMessages;
// };

const handleMessageActions = (state, action) => {
  const { messageActionsData } = state;
  let responses = messageActionsData.filter((i) => i.id === action.payload.id);
  if (responses.length) {
    responses = messageActionsData.filter((i) => i.id !== action.payload.id);
  } else {
    responses = [...messageActionsData, action.payload];
  }
  return responses;
};

const handleLastUpdateMessage = (state, action) => {
  const { message, id } = action;
  const { localChannelsUpdation } = state;
  localChannelsUpdation[id].lastMessage = message;
  return localChannelsUpdation;
};

const handleUpdateMessagesToChannel = (reduxState, action) => {
  const { id, message } = action;
  const { channelByMessages } = reduxState;

  const activeChannel = channelByMessages.find((i) => i.id === id);
  if (activeChannel) {
    const messageIndex = activeChannel.messages.findIndex(
      (m) => m.id === message.id,
    );
    if (messageIndex) {
      activeChannel.messages[messageIndex] = message;
    } else {
      activeChannel.messages.push(message);
    }
  }
  return channelByMessages;
};

const handleUpdatePinnedMessagesToChannel = (reduxState, action) => {
  const { channelByMessages } = reduxState;
  let messages = channelByMessages;
  messages.map((u) => (u.id !== action.id ? u : action));
  let activeChannel = channelByMessages.filter((i) => i.id === action.id);
  if (activeChannel.length) {
    activeChannel[0].messages.push(action.message);
  }
  return channelByMessages;
};

// const handleGetUsers = (action) => {
//   let user = get(action, 'state');
//   let response = Object.values(user.users);
// };

const handleActiveChannel = (state, action) => {
  const { channels } = state;
  return channels.find((i) => i.id === action.id);
};

export default function Users(state = INIT_STATE, action) {
  switch (action.type) {
    case CLIENT_CONNECTION: {
      return {
        ...state,
        clientConnectLoader: false,
        client: action.payload.client,
        userDetails: get(action.payload.client, 'user'),
        users: get(action.payload.client, 'state'),
        user_id: action.payload.userId,
        token: action.payload.streamToken,
      };
    }

    case CLIENT_ERROR: {
      return {
        ...state,
        clientError: true,
        clientConnectLoader: false,
        errorMessage: action.payload,
      };
    }
    case GET_ALL_CHANNELS: {
      return {
        ...state,
        channels: [...state.channels, ...action.payload],
        localChannelsUpdation: handleUpdateChannelLocal(state, action.payload),
      };
    }
    case GET_ALL_MUTED_CHANNELS: {
      return {
        ...state,
        mutedChannels: action.payload,
      };
    }
    case PINNED_MESSAGES_BY_CHANNEL: {
      return {
        ...state,
        pinnedMessagesByChannel: action.payload,
      };
    }
    case SET_ACTIVE_CHANNEL: {
      if (action.payload.type === 'other') {
        return {
          ...state,
          activeChannel: handleActiveChannel(state, action.payload.channel),
          chatViewEnabled: true,
          channelByMessages: handleFormat(state, action.payload.channel),
          activeChannelId: action.payload.channel.id,
          messageToEdit: undefined,
        };
      }
      return {
        ...state,
        activeChannel: handleActiveChannel(state, action.payload.channel),
        chatViewEnabled: true,
        channelByMessages: handleFormat(state, action.payload.channel),
        activeChannelId: action.payload.channel.id,
        messageToEdit: undefined,
      };
    }
    case FILTER_BY_MESSAGE: {
      return {
        ...state,
        search: action.payload.search,
        filters: action.payload.channels,
        searchResults: action.payload.searchResults,
      };
    }
    case SET_SEARCH_CHANNEL: {
      return {
        ...state,
        channelSearchMsg: action.payload.message,
      };
    }
    case FILTER_MESSAGE_IN_CHANNEL: {
      return {
        ...state,
        filters: [state.activeChannel],
        searchType: 'in-channel',
      };
    }
    case RESET_CHANNEL_SEARCH: {
      return {
        ...state,
        filters: [],
        search: null,
        searchType: null,
        searchResults: [],
      };
    }
    case FILTER_BY_NAME: {
      if (state.searchType) {
        return { ...state };
      } else {
        return {
          ...state,
          search: action.payload,
          filters: [],
          searchResults: [],
        };
      }
    }
    case SEARCH_MESSAGE_IN_CHANNEL: {
      return {
        ...state,
        searchResults: action.payload.results,
        filters: [state.filters, action.payload.otherChannels],
      };
    }
    case REMOVE_SELECTED_MESSAGES: {
      return {
        ...state,
        messageActionsData: removeMessageFromSelectedMessages(
          state,
          action.payload,
        ),
      };
    }
    case DE_SELECTED_MESSAGES: {
      return {
        ...state,
        deSelectMessage: action.payload ? true : false,
      };
    }
    case REPLY_MESSAGE_FLAG: {
      return {
        ...state,
        replyFlag: action.payload,
      };
    }
    case SET_MESSAGE: {
      return {
        ...state,
        message: {
          ...state.message,
          text: action.payload,
        },
      };
    }
    case MESSAGE_INPUT: {
      return {
        ...state,
        message: {
          text: '',
          attachments: [],
          mentioned_users: [],
        },
      };
    }
    case MESSAGE_DRAFT: {
      return {
        ...state,
        draftMessages: {
          ...state.draftMessages,
          [action.payload.channel.id]: {
            ...action.payload.message,
          },
        },
      };
    }
    case SET_MESSAGE_TO_CHANNEL: {
      action.payload = action.payload.map((v) => ({
        ...v,
        created_at: new Date(v.created_at),
        updated_at: new Date(v.updated_at),
        user: {
          ...v.user,
          created_at: new Date(v.user.created_at),
          updated_at: new Date(v.user.updated_at),
        },
      }));
      return {
        ...state,
        channels: updateChannelMessages(state, action.payload),
        activeChannel: handleAddPreviousMessages(state, action.payload, true),
        channelByMessages: setChannelByMessages(state, action.payload),
        last_message_id: setMessageId(action.payload, 1),
        messageActionsData: [],
      };
    }
    case PREVIOUS_MESSAGES_PAGINATION: {
      return {
        ...state,
        activeChannel: handleAddPreviousMessages(state, action.payload),
        last_message_id: setMessageId(action.payload, 1),
      };
    }
    case USER_EVENT_START: {
      return {
        ...state,
        usersEvent: handleUserEvent(state, action.payload, 'start'),
      };
    }
    case USER_EVENT_STOP: {
      return {
        ...state,
        usersEvent: handleUserEvent(state, action.payload, 'stop'),
      };
    }
    case ATTACH_IMAGE: {
      return {
        ...state,
        message: {
          ...state.message,
          attachments: [action.payload],
        },
      };
    }
    case SET_MODAL: {
      return {
        ...state,
        isModalVisible: action.payload.boolean ? true : false,
        images: action.payload.boolean ? action.payload.images : [],
      };
    }
    case MESSAGE_ACTIONS: {
      return {
        ...state,
        messageActionsData: handleMessageActions(state, action),
      };
    }
    case IS_USER_BANNED: {
      return {
        ...state,
        banned_user: action.payload,
      };
    }
    case PINNED_MESSAGE: {
      return {
        ...state,
        pinnedMsg: handleUpdatePinnedMessagesToChannel(state, action.payload),
      };
    }

    case ACTIVE_CHANNEL_MEMBERS: {
      return {
        ...state,
        // channelByMessages: handleUpdateChannelWithMembers(
        //   state,
        //   action.payload
        // ),
        activeChannelMembers: action.payload,
      };
    }
    case LEAVE_CHANNEL: {
      return {
        ...state,
        // channelByMessages: handleUpdateChannelWithMembers(
        //   state,
        //   action.payload
        // ),
        activeChannelMembers: action.payload,
      };
    }
    case CHANNEL_MEMBERS: {
      return {
        ...state,
        activeChannelUsersList: action.payload,
      };
    }
    case MEMBER_INFO_MODAL: {
      return {
        ...state,
        MembersInfoModal: action.payload ? true : false,
      };
    }
    case DELETE_PINNED_MESSAGE_MODAL: {
      return {
        ...state,
        deletePinMessage: action.payload ? true : false,
      };
    }
    case PINNED_MESSAGE_MODAL: {
      return {
        ...state,
        pinnedMsgId: action.payload,
      };
    }
    case PINNED_MESSAGES_MODAL: {
      return {
        ...state,
        pinnedMessagesModal: action.payload ? true : false,
      };
    }
    case CREATE_CHANNEL_FORM_MODAL: {
      return {
        ...state,
        createChannelFormModal: action.payload ? true : false,
        newChannelDetails: {
          ...state.newChannelDetails,
          members: state.users,
          id: state.userDetails.id,
        },
      };
    }
    case CREATE_CHANNEL_DETAILS: {
      return {
        ...state,
        newChannelDetails: {
          ...state.newChannelDetails,
          name: action.payload,
        },
      };
    }
    case QUOTED_MESSAGE_ID: {
      return {
        ...state,
        quoted_message_id: action.payload,
      };
    }
    case ADD_MESSAGE_CHANNEL_LOCAL: {
      return {
        ...state,
        localChannelsUpdation: handleLastUpdateMessage(state, action.payload),
        channelByMessages: handleUpdateMessagesToChannel(state, action.payload),
        msgNotification: action.payload,
      };
    }
    case UPDATE_MESSAGE_CHANNEL_LOCAL: {
      return {
        ...state,
        channelByMessages: handleUpdateMessagesToChannel(state, action.payload),
      };
    }
    case EDIT_MESSAGE: {
      return {
        ...state,
        messageToEdit: action.payload,
      };
    }
    default:
      return state;
  }
}
