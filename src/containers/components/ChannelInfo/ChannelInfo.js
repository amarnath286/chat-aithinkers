import React from 'react';

import { Modal } from 'antd';
import { get } from 'lodash';

const ChannelInfo = ({ handleCancel, visible, channelData }) => {
  return (
    <Modal
      title={'Channel Info'}
      visible={visible}
      onCancel={handleCancel}
      className="channelInfoPopup"
      footer={null}
      // bodyStyle={{ paddingTop: 0 }}
    >
      <div className="channelInfoTextSection">
        <h4>
          <b>Name: </b> {get(channelData, 'data.name', '')}
        </h4>
        <p>
          <b>Info: </b>
          {get(channelData, 'data.data.description', '')}
        </p>
      </div>
    </Modal>
  );
};

export default ChannelInfo;
