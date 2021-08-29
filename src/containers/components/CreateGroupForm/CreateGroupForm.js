import React, { useState } from 'react';

import { Button, Checkbox, Form, Input, Modal } from 'antd';
import { get } from 'lodash';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import {
  createChannel,
  updateChannel,
  getChannels,
} from '../../../actions/channel';
import { sendCreateChannelNotification } from '../../../graphql/message';
import { getRandomColor } from '../../../utils/utilityFunctions';
const { TextArea } = Input;

const CreateGroup = ({ handleCancel, visible, edit, channelData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { client, users, userDetails } = useSelector(
    ({ Channels }) => ({
      createChannelFormModal: Channels.createChannelFormModal,
      newChannelDetails: Channels.newChannelDetails,
      client: Channels.client,
      users: Channels.users,
      userDetails: Channels.userDetails,
    }),
    shallowEqual,
  );

  let channel_id = uuidv4();
  let color = getRandomColor();

  const dispatch = useDispatch();

  const admin_users = [];
  const allUsersList = users[Object.keys(users)[0]];
  // eslint-disable-next-line array-callback-return
  Object.keys(allUsersList).filter((d) => {
    if (allUsersList[d].role === 'admin') {
      admin_users.push(allUsersList[d].id);
    }
  });

  const onFinish = async (values) => {
    const { name, description, broadcast } = values;
    setLoading(true);
    if (!edit) {
      const newChannel = await dispatch(
        createChannel(
          client,
          { name: name, id: userDetails.id, description: description },
          admin_users,
          channel_id,
          color,
          broadcast,
        ),
      );
      await sendCreateChannelNotification({
        title: 'CHANNEL_CREATED',
        body: get(newChannel, 'channel.id', ''),
        createdAt: new Date(),
      });
    } else {
      await dispatch(
        updateChannel(
          client,
          {
            name: name,
            id: userDetails.id,
            description: description,
          },
          channelData.id,
        ),
      );
    }
    await dispatch(getChannels(client));
    setLoading(false);
    handleCancel();
  };
  const getInitialValues = () => {
    if (edit) {
      return {
        broadcast: get(channelData, 'data.is_broadcast', false),
        name: get(channelData, 'data.name', ''),
        description: get(channelData, 'data.data.description', ''),
      };
    } else {
      return {
        broadcast: false,
      };
    }
  };
  return (
    <Modal
      title={edit ? 'Edit Channel' : 'Create Channel'}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      bodyStyle={{ paddingTop: 0 }}
    >
      <Form
        name="create_channel"
        initialValues={getInitialValues()}
        onFinish={onFinish}
        labelCol={{ span: 24, padding: 0 }}
        wrapperCol={{ span: 24 }}
        form={form}
        // onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please Enter Channel Name',
            },
          ]}
        >
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: 'Description is required',
            },
          ]}
        >
          <TextArea
            rows={4}
            style={{ width: 560 }}
            placeholder="Channel Description"
          />
        </Form.Item>

        <Form.Item
          name="broadcast"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox disabled={edit}>Broadcast Type Channel</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            className="createChannelBtn"
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            {edit ? 'Edit' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateGroup;
