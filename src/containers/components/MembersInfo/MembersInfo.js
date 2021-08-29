import React, { useCallback, useState } from 'react';

import { StopOutlined } from '@ant-design/icons';
import { Avatar, Button } from 'antd';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import {
  setMemberModalVisible,
  banUserInallChannels,
  UnbanUserInallChannels,
} from '../../../actions/channel';
import InfoModal from '../../../components/Modal';
import { getRandomColor } from '../../../utils/utilityFunctions';

const MemberInfo = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { MembersInfoModal, userDetails, channels, activeChannelUsersList } =
    useSelector(
      ({ Channels }) => ({
        activeChannel: Channels.activeChannel,
        MembersInfoModal: Channels.MembersInfoModal,
        userDetails: Channels.userDetails,
        channels: Channels.channels,
        activeChannelUsersList: Channels.activeChannelUsersList,
      }),
      shallowEqual,
    );
  const members = [];
  if (activeChannelUsersList.length) {
    activeChannelUsersList.map((d) =>
      members.push({
        id: d.user_id,
        name: d.user.name,
        first_name: d.user.first_name,
        last_name: d.user.last_name,
        profile_pic: d.user.image,
        status: d.user.online,
        banned: d.banned,
      }),
    );
  }
  const handleModal = useCallback(() => {
    dispatch(setMemberModalVisible(false));
  }, [dispatch]);

  const handleBlockUser = async (id) => {
    setLoading(true);
    for (let i = 0; i < channels.length; i++) {
      dispatch(
        banUserInallChannels({
          channel: channels[i],
          user_id: id,
          admin_id: userDetails.id,
          is_banned: true,
        }),
      );
    }
    dispatch(setMemberModalVisible(false));
    setLoading(false);
  };

  const handleUnBlockUser = (id) => {
    setLoading(true);
    for (let i = 0; i < channels.length; i++) {
      dispatch(
        UnbanUserInallChannels({
          channel: channels[i],
          user_id: id,
        }),
      );
    }
    setLoading(false);
    dispatch(setMemberModalVisible(false));
  };

  return (
    <>
      <InfoModal
        title={'Members'}
        width={500}
        className="memberModelInfo createFormModel"
        isOpen={MembersInfoModal}
        onClose={() => handleModal()}
      >
        {members &&
          members.map((id, index) => {
            return (
              <div key={index}>
                <div className="memberInfoBox">
                  {id.profile_pic ? (
                    <div className="msgViewAvatar">
                      <Avatar size={42} src={id.profile_pic} />
                    </div>
                  ) : (
                    <div className="msgViewAvatar">
                      <Avatar
                        style={{
                          color: 'black',
                          backgroundColor: getRandomColor(),
                          opacity: '1.2',
                          fontSize: 16,
                        }}
                        size={42}
                      >
                        <span>
                          {id.name
                            ? id.name.slice(0, 1).toUpperCase()
                            : id.first_name
                            ? id.first_name.slice(0, 1).toUpperCase()
                            : '-'}
                        </span>
                      </Avatar>
                    </div>
                  )}
                  <div className="memberInfoText">
                    <h4>
                      {id.name
                        ? id.name
                        : id.first_name
                        ? id.first_name + ' ' + id.last_name
                        : id.id}
                    </h4>
                    <p>{id.status === true ? 'online' : 'offline'}</p>
                  </div>
                  {userDetails.role === 'admin' && id.id !== userDetails.id ? (
                    <>
                      {id.banned === true ? (
                        <div className="blockBox">
                          <Button
                            loading={loading}
                            className="createChannelBtn"
                            onClick={() => handleUnBlockUser(id.id)}
                          >
                            <StopOutlined /> Unblock
                          </Button>
                        </div>
                      ) : (
                        <div className="blockBox">
                          <Button
                            loading={loading}
                            className="createChannelBtn"
                            onClick={() => handleBlockUser(id.id)}
                          >
                            <StopOutlined /> Block
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            );
          })}
      </InfoModal>
    </>
  );
};

export default MemberInfo;
