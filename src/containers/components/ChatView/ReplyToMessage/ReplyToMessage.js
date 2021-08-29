import React, { useEffect } from 'react';

import { CloseOutlined, FileFilled } from '@ant-design/icons';
import { get } from 'lodash';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import { editMessage } from '../../../../actions/channel';

// todo: need to change component name as we using it for both reply and edit now
const ReplyTo = ({ replyOption, messageActionsData, handleRemoveMessages }) => {
  const { messageToEdit } = useSelector(
    ({ Channels }) => ({
      messageToEdit: Channels.messageToEdit,
    }),

    shallowEqual,
  );

  const dispatch = useDispatch();
  const [data, setData] = React.useState({});

  useEffect(() => {
    let message;
    let heading;

    if (messageToEdit) {
      message = messageToEdit;
      heading = 'Edit message';
    } else if (replyOption && messageActionsData.length) {
      message = messageActionsData[0];
      heading = get(message, 'user.name');
    } else {
      setData({});
    }

    if (message) {
      let type = get(message, 'attachments[0].type');
      let messageText = get(message, 'text');

      setData({ message, type, heading, messageText });
    }
  }, [replyOption, messageActionsData, setData, messageToEdit]);

  const handleOnClose = async () => {
    if (replyOption) {
      handleRemoveMessages();
    } else {
      await dispatch(editMessage());
    }
  };

  const { message, type, heading, messageText } = data;

  return (
    <>
      {heading ? (
        <div className="replyInputBox">
          <div className="replyInputBoxText">
            <div className="replyInputBoxContent">
              <div style={{ paddingLeft: '10px' }}>
                {type === 'image' && (
                  <img
                    src={get(message, 'attachments[0].image_url')}
                    style={{
                      width: '70px',
                      height: '70px',
                      paddingRight: '10px',
                    }}
                    alt="message_image"
                  />
                )}
                {type === 'file' && (
                  <div style={{ padding: '0px 5px 0px 0px' }}>
                    <FileFilled style={{ fontSize: '50px' }} />
                  </div>
                )}
              </div>
              <span className="userNameText">{heading}</span>
              <br />
              {type === 'image' && (
                <span style={{ fontWeight: 500 }}>Photo</span>
              )}
              {type === 'file' && (
                <>
                  <br />
                  <span style={{ fontSize: '14px' }}>
                    {get(message, 'attachments[0].name')}
                  </span>
                </>
              )}
              <span className="subMsgText  replyMessage">{messageText}</span>
            </div>
            <div className="replyCloseBtn">
              <CloseOutlined
                onClick={handleOnClose}
                style={{ fontWeight: 'bold', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default React.memo(ReplyTo);
