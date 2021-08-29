import React from 'react';

import { Button } from 'antd';

const MessageOption = ({
  messages,
  userDetails,
  handleRemoveMessages,
  handleDeleteMessage,
}) => {
  return (
    <div className="deleteAndReplyBox">
      {userDetails.id === messages[0].user.id ||
      userDetails.role === 'admin' ? (
        <div>
          <Button onClick={handleDeleteMessage}>
            DELETE {messages.length}
          </Button>
        </div>
      ) : (
        ''
      )}

      <div className="cancelButton">
        <Button
          type="link"
          style={{ float: 'right' }}
          color={'primary'}
          onClick={() => handleRemoveMessages()}
        >
          CANCEL
        </Button>
      </div>
    </div>
  );
};

export default MessageOption;
