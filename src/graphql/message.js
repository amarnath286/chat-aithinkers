import { API, graphqlOperation } from 'aws-amplify';

import { chatCustomMessage } from './mutations';
import { getUserChatToken } from './queries';
import { chatCustomEvent } from './subscriptions';

export const getChatToken = async () =>
  API.graphql({
    query: getUserChatToken,
  }).then(({ data }) => data.getUserChatToken);

export const chatCustomEventSubscription = async (listnerMethod) =>
  API.graphql(graphqlOperation(chatCustomEvent)).subscribe({
    next: ({ provider, value }) => {
      listnerMethod(value);
    },
  });

export const sendCreateChannelNotification = async (payload) =>
  API.graphql({
    variables: { request: payload },
    query: chatCustomMessage,
  }).then(({ data }) => data.chatCustomMessage);
